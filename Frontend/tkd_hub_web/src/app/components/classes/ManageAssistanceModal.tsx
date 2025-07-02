import { Student } from "@/app/types/Student";
import React, { useEffect, useState } from "react";
import { useClasses } from "@/app/context/ClassContext";
import { ClassSchedule } from "@/app/types/ClassSchedule";
import { daysOfWeek } from "@/app/const/daysOfWeek";
import ManageAssistanceModalHeader from "./ManageAssistanceModalHeader";
import CenteredModalContainer from "./CenteredModalContainer";
import StudentList from "./StudentList";
import ManageAssistanceModalFooter from "./ManageAssistanceModalFooter";
import ManageAssistanceModalContainer from "./ManageAssistanceModalContainer";

type ManageAssistanceModalProps = {
  open: boolean;
  classId: number | null;
  onClose: () => void;
};

const ManageAssistanceModal: React.FC<ManageAssistanceModalProps> = ({
  open,
  classId,
  onClose,
}) => {
  const { getStudentsByClass, getClassById, addStudentAttendance } =
    useClasses();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastClassInfo, setLastClassInfo] = useState<string | null>(null);

  const [attendanceMarking, setAttendanceMarking] = useState<{
    [studentId: number]: boolean;
  }>({});
  const [attendanceError, setAttendanceError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || classId === null) return;

    setLoading(true);
    setError(null);

    // Fetch students
    getStudentsByClass(classId)
      .then((data) => setStudents(data))
      .catch((err) => setError(err.message || "Failed to fetch students"))
      .finally(() => setLoading(false));

    // Fetch class and calculate last class date
    getClassById(classId)
      .then((classData) => {
        if (
          !classData ||
          !classData.schedules ||
          classData.schedules.length === 0
        ) {
          setLastClassInfo("No schedule");
          return;
        }
        const today = new Date();
        let lastDate: Date | null = null;
        let lastSchedule: ClassSchedule | null = null;

        classData.schedules.forEach((schedule: ClassSchedule) => {
          const scheduleDay =
            typeof schedule.day === "number" ? schedule.day : 0;
          const todayDay = today.getDay();
          let diff = todayDay - scheduleDay;
          if (diff < 0) diff += 7;
          const classDate = new Date(today);
          classDate.setDate(today.getDate() - diff);

          const [hours, minutes] = schedule.startTime.split(":").map(Number);
          classDate.setHours(hours, minutes, 0, 0);

          if (!lastDate || classDate > lastDate) {
            lastDate = classDate;
            lastSchedule = schedule;
          }
        });

        if (lastDate !== null && lastSchedule) {
          lastSchedule = lastSchedule as ClassSchedule;
          const dayLabel =
            daysOfWeek.find(
              (d) => Number(d.value) === Number(lastSchedule!.day)
            )?.label ?? "Unknown";
          setLastClassInfo(
            `${(lastDate as Date).toLocaleDateString()} (${dayLabel}, ${
              lastSchedule.startTime
            })`
          );
        } else {
          setLastClassInfo("No recent class");
        }
      })
      .catch(() => setLastClassInfo("No schedule"));
  }, [open, classId, getStudentsByClass, getClassById]);

  const handleMarkAttendance = async (studentClassId: number) => {
    setAttendanceMarking((prev) => ({ ...prev, [studentClassId]: true }));
    setAttendanceError(null);
    try {
      await addStudentAttendance(studentClassId, {
        attendedAt: new Date().toISOString(),
        status: 1,
        notes: "",
      });
    } catch {
      setAttendanceError("Failed to mark attendance.");
    } finally {
      setAttendanceMarking((prev) => ({ ...prev, [studentClassId]: false }));
    }
  };

  if (!open || classId === null) return null;

  return (
    <>
      <CenteredModalContainer>
        <ManageAssistanceModalContainer>
          <div className="bg-neutral-900 text-neutral-100 rounded-lg">
            <ManageAssistanceModalHeader
              classId={classId}
              lastClassInfo={lastClassInfo}
            />
            <StudentList
              students={students}
              loading={loading}
              error={error}
              attendanceMarking={attendanceMarking}
              onMarkAttendance={handleMarkAttendance}
              attendanceError={attendanceError}
            />
            <ManageAssistanceModalFooter onClose={onClose} />
          </div>
        </ManageAssistanceModalContainer>
      </CenteredModalContainer>
    </>
  );
};

export default ManageAssistanceModal;
