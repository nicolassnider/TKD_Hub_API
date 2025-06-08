import { Student } from "@/app/types/Student";
import React from "react";

type StudentTableRowsProps = {
  students: Student[];
  onEdit: (studentId: number) => void;
  onRequestDelete: (studentId: number) => void;
  onDetails?: (studentId: number) => void; // <-- Add this line
};

const StudentTableRows: React.FC<StudentTableRowsProps> = ({
  students,
  onEdit,
  onRequestDelete,
}) => (
  <>
    {students.map((student) => (
      <tr key={student.id ?? Math.random()}>
        <td className="px-4 py-2">{student.id}</td>
        <td className="px-4 py-2">
          {student.firstName && student.lastName
            ? `${student.firstName} ${student.lastName}`
            : student.firstName || student.lastName || "-"}
        </td>
        <td className="px-4 py-2">{student.email}</td>
        <td className="px-4 py-2 align-middle">
          <div className="flex gap-2 items-center">
            <button
              className="flex items-center justify-center px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              title="Edit"
              onClick={() => typeof student.id === "number" && onEdit(student.id)}
              disabled={typeof student.id !== "number"}
            >
              <i className="bi bi-pencil-square"></i>
            </button>
            <button
              className="flex items-center justify-center px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
              title="Delete"
              onClick={() => typeof student.id === "number" && onRequestDelete(student.id)}
              disabled={typeof student.id !== "number"}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    ))}
  </>
);

export default StudentTableRows;
