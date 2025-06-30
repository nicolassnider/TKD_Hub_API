import React from "react";
import { Student } from "@/app/types/Student";

type StudentListProps = {
  students: Student[];
  loading: boolean;
  error: string | null;
  attendanceMarking: { [studentId: number]: boolean };
  onMarkAttendance: (studentId: number) => void;
  attendanceError: string | null;
};

const StudentList: React.FC<StudentListProps> = ({
  students,
  loading,
  error,
  attendanceMarking,
  onMarkAttendance,
  attendanceError,
}) => (
  <div className="flex flex-col gap-2">
    <h3 className="font-semibold mb-2">Students</h3>
    {loading ? (
      <p className="text-gray-500">Loading...</p>
    ) : error ? (
      <p className="text-red-600">{error}</p>
    ) : students.length === 0 ? (
      <p>No students in this class.</p>
    ) : (
      <ul className="list-disc pl-5 flex flex-col gap-1">
        {students.map((student) =>
          student.id != null ? (
            <li
              key={student.id}
              className="text-sm flex flex-row items-center gap-2"
            >
              <span>
                {student.firstName} {student.lastName}
              </span>
              <button
                className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                disabled={attendanceMarking[student.id]}
                onClick={() => onMarkAttendance(student.id!)}
              >
                {attendanceMarking[student.id]
                  ? "Marking..."
                  : "Mark Attendance"}
              </button>
            </li>
          ) : null
        )}
      </ul>
    )}
    {attendanceError && <p className="text-red-600">{attendanceError}</p>}
  </div>
);

export default StudentList;
