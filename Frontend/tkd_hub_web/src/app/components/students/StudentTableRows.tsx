import React from "react";

type Student = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  gender?: number;
  dojaangId?: number | null;
  currentRankId?: number | null;
  joinDate?: string;
};

type StudentTableRowsProps = {
  students: Student[];
  onDetails: (id: number) => void;
  loading?: boolean;
  renderOptions?: (student: Student) => React.ReactNode;
};

const StudentTableRows: React.FC<StudentTableRowsProps> = ({
  students,
  onDetails,
  loading,
  renderOptions,
}) => (
  <>
    {loading ? (
      <tr>
        <td colSpan={4} className="text-center text-muted">
          Loading...
        </td>
      </tr>
    ) : students.length === 0 ? (
      <tr>
        <td colSpan={4} className="text-center text-muted">
          No students found.
        </td>
      </tr>
    ) : (
      students.map(student => (
        <tr key={student.id}>
          <td>{student.id}</td>
          <td>{student.firstName} {student.lastName}</td>
          <td>{student.email}</td>
          <td>
            <button
              className="btn btn-sm btn-info"
              onClick={() => onDetails(student.id)}
            >
              Details
            </button>
            {renderOptions && renderOptions(student)}
          </td>
        </tr>
      ))
    )}
  </>
);

export default StudentTableRows;
