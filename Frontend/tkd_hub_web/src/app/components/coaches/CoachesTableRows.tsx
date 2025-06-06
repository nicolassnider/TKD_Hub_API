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
    {coaches.map((coach, idx) => (
      <tr
        key={coach.id}
        className="bg-white hover:bg-blue-50 transition-colors border-b last:border-b-0"
      >
        <td className="px-4 py-2">{coach.id}</td>
        <td className="px-4 py-2">{coach.name}</td>
        <td className="px-4 py-2">{coach.email}</td>
        <td className="px-4 py-2">
          <button
            className="flex items-center justify-center px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            title="Details"
            onClick={() => onEdit(coach.id)}
          >
            <i className="bi bi-info-circle"></i>
          </button>
        </td>
        {/* Add Managed Dojaangs cell if needed */}
      </tr>
    ))}
  </>
);

export default CoachesTableRows;
