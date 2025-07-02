"use client";

import { useAuth } from "@/app/context/AuthContext";
import { usePayment } from "@/app/context/PaymentContext";
import { StudentAttendance } from "@/app/types/StudentAttendance";
import { TrainingClass } from "@/app/types/TrainingClass";
import {
  initializeSignalR,
  onPaymentReceived,
  stopSignalR,
} from "@/app/utils/signalrService";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import ProfileInfo from "./ProfileInfo";
import CoachClasses from "./CoachClasses";
import StudentAttendanceList from "../classes/StudentAttendanceList";
import PaymentIframeModal from "../payment/PaymentIframeModal";
import { useClasses } from "@/app/context/ClassContext";
import GenericButton from "../common/actionButtons/GenericButton";
export default function ProfilePageContent() {
  // 1. Context hooks
  const { user, loading: authLoading } = useAuth();
  const { loading, getClassesByCoachId, getStudentAttendance } = useClasses();
  const {
    createPreference,
    loading: paymentLoading,
    error: paymentError,
  } = usePayment();

  // 2. State hooks
  const [coachClasses, setCoachClasses] = useState<TrainingClass[]>([]);
  const fetchedCoachId = useRef<string | null>(null);
  const [attendance, setAttendance] = useState<StudentAttendance[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  // Payment iframe state
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  // 3. Effect to fetch coach classes only when user.id or roles change and only once per coach id
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

  // Fetch attendance for students
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

  // 5. Payment DTO as expected by backend
  const paymentRequest = {
    amount: 100,
    description: "Membership Fee",
    payerEmail: "nicolas@gmail.com",
  };

  // 6. Functions
  const handlePayment = async () => {
    try {
      // Initialize SignalR only when starting payment
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

  // 7. Render
  if (authLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center">Not logged in.</div>;
  }

  return (
    <div className="flex justify-center items-center my-10">
      <div className="w-full max-w-6xl bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-10 flex flex-col gap-10 mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 self-center">My Profile</h2>
        <ProfileInfo user={user} />
        {user.roles?.includes("Coach") && (
          <CoachClasses loading={loading} coachClasses={coachClasses} />
        )}
        {/* Student Attendance */}
        {user.roles?.includes("Student") && (
          <StudentAttendanceList
            attendance={attendance}
            loading={attendanceLoading}
          />
        )}
        {/* Payment Button Example */}
        <GenericButton
          type="button"
          variant="primary"
          onClick={handlePayment}
          disabled={paymentLoading}
          className="mt-4 px-6 py-2"
        >
          {paymentLoading ? "Processing..." : "Pay Membership"}
        </GenericButton>
        {paymentError && (
          <div className="text-red-500 mt-2">{paymentError}</div>
        )}

        {/* Payment Iframe Modal */}
        {paymentUrl && (
          <PaymentIframeModal
            paymentUrl={paymentUrl}
            onClose={handleCloseIframe}
          />
        )}
      </div>
    </div>
  );
}
