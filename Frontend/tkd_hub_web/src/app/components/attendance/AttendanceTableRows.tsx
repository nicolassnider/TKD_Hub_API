import React from "react";
import { StudentAttendance } from "@/app/types/StudentAttendance";
import TableRows, {
  TableColumn,
} from "@/app/components/common/tableRows/TableRows";
import TableActionButton from "../common/actionButtons/TableActionButton";

type ClassData = {
  id: number;
  name?: string;
  [key: string]: unknown;
};

type AttendanceTableRowsProps = {
  attendanceHistory: StudentAttendance[];
  classMap: Record<number, ClassData>;
  onEdit?: (attendanceId: number) => void;
  onDelete?: (attendanceId: number) => void;
};

const columns: (
  classMap: Record<number, ClassData>
) => TableColumn<StudentAttendance>[] = (classMap) => [
  {
    label: "Class ID",
    render: (item) => item.trainingClassId,
  },
  {
    label: "Class Name",
    render: (item) =>
      classMap[item.trainingClassId]?.name ? (
        classMap[item.trainingClassId].name
      ) : (
        <span className="italic text-neutral-400">Loading...</span>
      ),
  },
  {
    label: "Date",
    render: (item) =>
      item.date && item.date !== "0001-01-01" ? (
        new Date(item.date).toLocaleDateString()
      ) : (
        <span className="italic text-neutral-400">N/A</span>
      ),
  },
  {
    label: "Status",
    render: (item) =>
      typeof item.attended === "boolean" ? (
        item.attended ? (
          "Present"
        ) : (
          "Absent"
        )
      ) : (
        <span className="italic text-neutral-400">N/A</span>
      ),
  },
];

const AttendanceTableRows: React.FC<AttendanceTableRowsProps> = ({
  attendanceHistory,
  classMap,
  onEdit,
  onDelete,
}) => {
  return (
    <TableRows
      data={attendanceHistory}
      columns={columns(classMap)}
      actions={(item) => (
        <div className="flex gap-2 items-center">
          {!onEdit && (
            <TableActionButton
              onClick={() => typeof item.id === "number" && onEdit(item.id)}
              title="Edit"
              iconClass="bi bi-pencil-square"
              disabled={typeof item.id !== "number"}
              variant="primary"
            />
          )}
          {onDelete && (
            <TableActionButton
              onClick={() => typeof item.id === "number" && onDelete(item.id)}
              title="Delete"
              iconClass="bi bi-trash"
              disabled={typeof item.id !== "number"}
              variant="error"
            />
          )}
        </div>
      )}
      colSpan={6}
      notFoundMessage="No attendance records found."
    />
  );
};

export default AttendanceTableRows;
