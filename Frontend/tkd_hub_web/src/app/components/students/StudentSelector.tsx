import React from "react";

type Student = {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
};

type StudentSelectorProps = {
  students: Student[];
  value: number | null;
  onChange: (id: number | null) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
};

const StudentSelector: React.FC<StudentSelectorProps> = ({
  students,
  value,
  onChange,
  disabled = false,
  label = "Student",
  id = "student-selector",
}) => (
  <div>
    <label htmlFor={id} className="form-label">{label}</label>
    <select
      id={id}
      className="form-control"
      value={value ?? ""}
      onChange={e => onChange(e.target.value ? Number(e.target.value) : null)}
      disabled={disabled}
    >
      <option value="">Select a student</option>
      {students.map(student => (
        <option key={student.id} value={student.id}>
          {student.firstName} {student.lastName} {student.email ? `(${student.email})` : ""}
        </option>
      ))}
    </select>
  </div>
);

export default StudentSelector;
