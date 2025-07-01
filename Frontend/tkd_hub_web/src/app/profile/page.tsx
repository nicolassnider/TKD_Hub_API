"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useClasses } from "../context/ClassContext";
import ProfileInfo from "../components/profiles/ProfileInfo";
import CoachClasses from "../components/profiles/CoachClasses";
import type { TrainingClass } from "../types/TrainingClass";
import { usePayment } from "../context/PaymentContext";
import {
  initializeSignalR,
  onPaymentReceived,
  stopSignalR,
} from "../utils/signalrService";
import toast from "react-hot-toast";
import StudentAttendanceList from "../components/classes/StudentAttendanceList";
import { StudentAttendance } from "../types/StudentAttendance";
import ProfileHeader from "../components/profiles/ProfileHeader";
import ProfilePaymentSection from "../components/profiles/ProfilePaymentSection";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { loading, getClassesByCoachId, getStudentAttendance } = useClasses();
  const {
    createPreference,
    loading: paymentLoading,
    error: paymentError,
  } = usePayment();

  const [coachClasses, setCoachClasses] = useState<TrainingClass[]>([]);
  const fetchedCoachId = useRef<string | null>(null);
  const [attendance, setAttendance] = useState<StudentAttendance[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  useEffect(() => {
    if (
      user?.roles?.includes("Coach") &&
      user.id &&
      fetchedCoachId.current !== String(user.id)
    ) {
      fetchedCoachId.current = String(user.id);
      getClassesByCoachId(user.id).then(setCoachClasses);
    } else if (!user?.roles?.includes("Coach")) {
      setCoachClasses([]);
      fetchedCoachId.current = null;
    }
  }, [user?.id, user?.roles, getClassesByCoachId]);

  useEffect(() => {
    if (user?.roles?.includes("Student") && user.id) {
      setAttendanceLoading(true);
      getStudentAttendance(user.id)
        .then(setAttendance)
        .finally(() => setAttendanceLoading(false));
    } else {
      setAttendance([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.roles]);

  const paymentRequest = {
    amount: 100,
    description: "Membership Fee",
    payerEmail: "nicolas@gmail.com",
  };

  const handlePayment = async () => {
    try {
      await initializeSignalR();
      onPaymentReceived((data) => {
        setPaymentUrl(null);
        toast.success("Payment received! ID: " + data);
        stopSignalR();
      });

      const result = await createPreference(paymentRequest);
      if (result && result.init_point) {
        setPaymentUrl(result.init_point);
      } else if (result && result.sandbox_init_point) {
        setPaymentUrl(result.sandbox_init_point);
      } else if (result && result.paymentUrl) {
        setPaymentUrl(result.paymentUrl);
      } else {
        alert("Payment URL not received from server.");
      }
    } catch {
      // Error is handled by context
    }
  };

  const handleCloseIframe = () => {
    setPaymentUrl(null);
    stopSignalR();
  };

  if (authLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center">Not logged in.</div>;
  }

  return (
    <div className="flex justify-center items-center my-10">
      <div className="w-full max-w-6xl bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-10 flex flex-col gap-10 mx-auto text-center">
        <ProfileHeader />
        <ProfileInfo user={user} />
        {user.roles?.includes("Coach") && (
          <CoachClasses loading={loading} coachClasses={coachClasses} />
        )}
        {user.roles?.includes("Student") && (
          <StudentAttendanceList
            attendance={attendance}
            loading={attendanceLoading}
          />
        )}
        <ProfilePaymentSection
          paymentLoading={paymentLoading}
          paymentError={paymentError}
          paymentUrl={paymentUrl}
          onPay={handlePayment}
          onCloseIframe={handleCloseIframe}
        />
      </div>
    </div>
  );
}
