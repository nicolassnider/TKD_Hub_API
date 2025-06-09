import { Student } from "@/app/types/Student";
import { useRouter } from "next/navigation";
import React from "react";
import TableActionButton from "../common/actionButtons/TableActionButton";

type StudentTableRowsProps = {
  students: Student[];
  onEdit: (studentId: number) => void;
  onRequestDelete: (studentId: number) => void;
  onDetails?: (studentId: number) => void;
  onReactivate?: (studentId: number) => void;
  isActiveFilter?: boolean | null;
};

const StudentTableRows: React.FC<StudentTableRowsProps> = ({
  students,
  onEdit,
  onRequestDelete,
  onReactivate,
  isActiveFilter = null,
}) => {
  const router = useRouter();

  return (
    <>
      {students
        .filter(student =>
          isActiveFilter === null ? true : student.isActive === isActiveFilter
        )
        .map((student) => (
          <tr key={student.id ?? Math.random()}>
            <td className="px-4 py-2">{student.id}</td>
            <td className="px-4 py-2">
              {student.firstName && student.lastName
                ? `${student.firstName} ${student.lastName}`
                : student.firstName || student.lastName || "-"}
              {!student.isActive && (
                <span className="ml-2 inline-block px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-800 text-xs font-semibold align-middle">
                  Unactive
                </span>
              )}
            </td>
            <td className="px-4 py-2">{student.email}</td>
            <td className="px-4 py-2 align-middle">
              <div className="flex gap-2 items-center">
                <TableActionButton
                  onClick={() => typeof student.id === "number" && onEdit(student.id)}
                  title="Edit"
                  iconClass="bi bi-pencil-square"
                  colorClass="bg-blue-600 text-white hover:bg-blue-700"
                  disabled={typeof student.id !== "number"}
                />
                <TableActionButton
                  onClick={() =>
                    typeof student.id === "number" &&
                    router.push(`/services/promotionsAdmin?studentId=${student.id}`)
                  }
                  title="Manage Promotions"
                  iconClass="bi bi-award"
                  colorClass="bg-purple-600 text-white hover:bg-purple-700"
                  disabled={typeof student.id !== "number" || !student.isActive}
                />
                {student.isActive ? (
                  <TableActionButton
                    onClick={() => typeof student.id === "number" && onRequestDelete(student.id)}
                    title="Delete"
                    iconClass="bi bi-trash"
                    colorClass="bg-red-600 text-white hover:bg-red-700"
                    disabled={typeof student.id !== "number"}
                  />
                ) : (
                  onReactivate && (
                    <TableActionButton
                      onClick={() => typeof student.id === "number" && onReactivate(student.id)}
                      title="Reactivate"
                      iconClass="bi bi-arrow-repeat"
                      disabled={typeof student.id !== "number"}
                      colorClass="bg-green-600 text-white hover:bg-green-700"
                    />
                  )
                )}
              </div>
            </td>
          </tr>
        ))}
    </>
  );
};

export default StudentTableRows;
