"use client";

import { usePayment } from "@/app/context/PaymentContext";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import ProfileInfo from "./ProfileInfo";
import CoachClasses from "./CoachClasses";
import StudentAttendanceList from "../classes/StudentAttendanceList";
import { useClasses } from "@/app/context/ClassContext";
import { User } from "@/app/types/User";
import { StudentAttendance } from "@/app/types/StudentAttendance";
import { TrainingClass } from "@/app/types/TrainingClass";
import ProfilePaymentSection from "./ProfilePaymentSection";

type ProfilePageMainCardProps = {
  user: User;
};

export default function ProfilePageMainCard({
  user,
}: ProfilePageMainCardProps) {
  const { loading, getClassesByCoachId, getStudentAttendance } = useClasses();
  const {
    createPreference,
    loading: paymentLoading,
    error: paymentError,
  } = usePayment();

  // State hooks
  const [coachClasses, setCoachClasses] = useState<TrainingClass[]>([]);
  const fetchedCoachId = useRef<string | null>(null);
  const [attendance, setAttendance] = useState<StudentAttendance[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  // Payment iframe state
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  // Fetch coach classes
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

  // Payment DTO as expected by backend
  const paymentRequest = {
    amount: 100,
    description: "Membership Fee",
    payerEmail: "nicolas@gmail.com",
  };

  // Functions
  const handlePayment = async () => {
    try {
      // Initialize SignalR only when starting payment
      const { initializeSignalR, onPaymentReceived, stopSignalR } =
        await import("@/app/utils/signalrService");
      await initializeSignalR();
      onPaymentReceived((data: string | number) => {
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
    import("@/app/utils/signalrService").then(({ stopSignalR }) =>
      stopSignalR()
    );
  };

  return (
    <div className="w-full max-w-6xl bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-10 flex flex-col gap-10 mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4 self-center">My Profile</h2>
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
      {/* Payment section extracted to its own component */}
      <ProfilePaymentSection
        paymentLoading={paymentLoading}
        paymentError={paymentError}
        paymentUrl={paymentUrl}
        onPay={handlePayment}
        onCloseIframe={handleCloseIframe}
      />
    </div>
  );
}
