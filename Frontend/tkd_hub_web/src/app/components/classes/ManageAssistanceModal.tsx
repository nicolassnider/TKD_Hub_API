import { Student } from "@/app/types/Student";
import React, { useEffect, useState } from "react";
import { useClasses } from "@/app/context/ClassContext";
import { ClassSchedule } from "@/app/types/ClassSchedule";
import { daysOfWeek } from "@/app/const/daysOfWeek";

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
    const { getStudentsByClass, getClassById, addStudentAttendance } = useClasses();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastClassInfo, setLastClassInfo] = useState<string | null>(null);

    const [attendanceMarking, setAttendanceMarking] = useState<{ [studentId: number]: boolean }>({});
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
                if (!classData || !classData.schedules || classData.schedules.length === 0) {
                    setLastClassInfo("No schedule");
                    return;
                }
                const today = new Date();
                let lastDate: Date | null = null;
                let lastSchedule: ClassSchedule | null = null;

                classData.schedules.forEach((schedule: ClassSchedule) => {
                    const scheduleDay = typeof schedule.day === "number" ? schedule.day : 0;
                    const todayDay = today.getDay();
                    let diff = todayDay - scheduleDay;
                    if (diff < 0) diff += 7;
                    const classDate = new Date(today);
                    classDate.setDate(today.getDate() - diff);

                    const [hours, minutes] = schedule.startTime.split(":").map(Number);
                    classDate.setHours(hours, minutes, 0, 0);

                    if (!lastDate || classDate > lastDate) {
                        lastDate = classDate;
                        lastSchedule = schedule; // lastSchedule is of type ClassSchedule
                    }
                });

                if (lastDate !== null && lastSchedule) { // Check if lastSchedule is truthy

                    lastSchedule = lastSchedule as ClassSchedule; // Type assertion to ensure TypeScript knows it's a ClassSchedule
                    const dayLabel =
                        daysOfWeek.find(d => Number(d.value) === Number(lastSchedule!.day))?.label ?? "Unknown";

                    // Use type assertion to ensure TypeScript knows lastDate is a Date
                    setLastClassInfo(
                        `${(lastDate as Date).toLocaleDateString()} (${dayLabel}, ${lastSchedule.startTime})`
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
            // Example: Mark as attended now, status 1, empty notes
            await addStudentAttendance(studentClassId, {
                attendedAt: new Date().toISOString(),
                status: 1,
                notes: "",
            });
            // Optionally, show a toast or update UI
        } catch {
            setAttendanceError("Failed to mark attendance.");
        } finally {
            setAttendanceMarking((prev) => ({ ...prev, [studentClassId]: false }));
        }
    };

    if (!open || classId === null) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-full w-full sm:w-[400px] max-h-[90vh] flex flex-col gap-4 overflow-y-auto relative">
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-semibold mb-2">Manage Assistance</h2>
                    <p className="text-sm text-gray-600">Class ID: {classId}</p>
                    <div>
                        <strong>Last Class:</strong>{" "}
                        {lastClassInfo ?? <span className="text-gray-400">Loading...</span>}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="font-semibold mb-2">Students</h3>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p className="text-red-600">{error}</p>
                    ) : students.length === 0 ? (
                        <p>No students in this class.</p>
                    ) : (
                        <ul className="list-disc pl-5 flex flex-col gap-1">
                            {students.map((student) =>
                                student.id != null ? (
                                    <li key={student.id} className="text-sm flex flex-row items-center gap-2">
                                        <span>{student.firstName} {student.lastName}</span>
                                        <button
                                            className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                                            disabled={attendanceMarking[student.id]}
                                            onClick={() => handleMarkAttendance(student.id!)}
                                        >
                                            {attendanceMarking[student.id] ? "Marking..." : "Mark Attendance"}
                                        </button>
                                    </li>
                                ) : null
                            )}
                        </ul>
                    )}
                    {attendanceError && (
                        <p className="text-red-600">{attendanceError}</p>
                    )}
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageAssistanceModal;
