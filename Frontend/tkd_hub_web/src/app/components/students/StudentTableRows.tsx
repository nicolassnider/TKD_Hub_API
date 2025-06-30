import { Student } from "@/app/types/Student";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import TableActionButton from "../common/actionButtons/TableActionButton";
import AddStudentToClass from "../classes/AddStudentToClass";
import { useUsers } from "@/app/context/UserContext";
import toast from "react-hot-toast";
import TableRows, { TableColumn } from "../common/tableRows/TableRows";

type StudentTableRowsProps = {
  students: Student[];
  onEdit: (studentId: number) => void;
  isActiveFilter?: boolean | null;
  onDeleted?: () => void;
  onReactivated?: () => void;
};

const columns: TableColumn<Student>[] = [
  {
    label: "ID",
    render: (student) => student.id,
  },
  {
    label: "Name",
    render: (student) =>
      student.firstName && student.lastName
        ? `${student.firstName} ${student.lastName}`
        : student.firstName || student.lastName || "-",
  },
  {
    label: "Email",
    render: (student) => student.email,
  },
];

const StudentTableRows: React.FC<StudentTableRowsProps> = ({
  students = [],
  onEdit,
  isActiveFilter = null,
  onDeleted,
  onReactivated,
}) => {
  const router = useRouter();
  const { deleteUser, reactivateUser, fetchUsers } = useUsers();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );

  const handleDeleteStudent = async (studentId: number) => {
    const ok = await deleteUser(studentId);
    if (ok) {
      toast.success("Student deleted!");
      if (onDeleted) {
        onDeleted();
      } else {
        fetchUsers();
      }
    } else {
      toast.error("Failed to delete student.");
    }
  };

  const handleReactivateStudent = async (studentId: number) => {
    const ok = await reactivateUser(studentId);
    if (ok) {
      toast.success("Student reactivated!");
      if (onReactivated) {
        onReactivated();
      } else {
        fetchUsers();
      }
    } else {
      toast.error("Failed to reactivate student.");
    }
  };

  const filteredStudents = Array.isArray(students)
    ? students.filter((student) =>
        isActiveFilter === null ? true : student.isActive === isActiveFilter
      )
    : [];

  return (
    <>
      <TableRows
        data={filteredStudents}
        columns={[
          ...columns.slice(0, 2),
          {
            ...columns[1],
            render: (student) => (
              <>
                {student.firstName && student.lastName
                  ? `${student.firstName} ${student.lastName}`
                  : student.firstName || student.lastName || "-"}
                {!student.isActive && (
                  <span className="ml-2 inline-block px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-800 text-xs font-semibold align-middle">
                    Unactive
                  </span>
                )}
              </>
            ),
          },
          columns[2],
        ]}
        actions={(student) => (
          <div className="flex gap-2 items-center">
            <TableActionButton
              onClick={() => {
                if (typeof student.id === "number") {
                  onEdit(student.id);
                }
              }}
              title="Edit"
              iconClass="bi bi-pencil-square"
              colorClass="bg-blue-600 text-white hover:bg-blue-700"
              disabled={typeof student.id !== "number" || !student.isActive}
            />
            <TableActionButton
              onClick={() => {
                setSelectedStudentId(student.id ?? null);
                setModalOpen(true);
              }}
              title="Add to Class"
              iconClass="bi bi-plus-circle"
              colorClass="bg-green-600 text-white hover:bg-green-700"
              disabled={typeof student.id !== "number" || !student.isActive}
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
            <TableActionButton
              onClick={() =>
                typeof student.id === "number" &&
                router.push(`/services/attendanceAdmin/${student.id}`)
              }
              title="Attendance Admin"
              iconClass="bi bi-calendar-check"
              colorClass="bg-indigo-600 text-white hover:bg-indigo-700"
              disabled={typeof student.id !== "number"}
            />
            {student.isActive ? (
              <TableActionButton
                onClick={() =>
                  typeof student.id === "number" &&
                  handleDeleteStudent(student.id)
                }
                title="Delete"
                iconClass="bi bi-trash"
                colorClass="bg-red-600 text-white hover:bg-red-700"
                disabled={typeof student.id !== "number"}
              />
            ) : (
              <TableActionButton
                onClick={() =>
                  typeof student.id === "number" &&
                  handleReactivateStudent(student.id)
                }
                title="Reactivate"
                iconClass="bi bi-arrow-repeat"
                disabled={typeof student.id !== "number"}
                colorClass="bg-green-600 text-white hover:bg-green-700"
              />
            )}
          </div>
        )}
        notFoundMessage="No students found."
      />
      {modalOpen && selectedStudentId !== null && (
        <AddStudentToClass
          classId={0}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          defaultStudentId={selectedStudentId}
        />
      )}
    </>
  );
};

export default StudentTableRows;
