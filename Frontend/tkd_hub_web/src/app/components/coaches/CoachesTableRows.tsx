import React from "react";

type Coach = {
  id: number;
  name: string;
  email: string;
};

type CoachesTableRowsProps = {
  coaches: Coach[];
  onEdit: (coachId: number) => void;
};

const CoachesTableRows: React.FC<CoachesTableRowsProps> = ({ coaches, onEdit }) => (
  <>
    {coaches.map((coach) => (
      <tr key={coach.id}>
        <td>{coach.id}</td>
        <td>{coach.name}</td>
        <td>{coach.email}</td>
        <td>
          <button
            className="btn btn-primary btn-sm"
            title="Details"
            onClick={() => onEdit(coach.id)}
          >
            <i className="bi bi-info-circle"></i>
          </button>

        </td>

      </tr>
    ))}
  </>
);

export default CoachesTableRows;
