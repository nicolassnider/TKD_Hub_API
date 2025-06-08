import { Coach } from "@/app/types/Coach";
import React from "react";

type CoachesTableRowsProps = {
  coaches: Coach[];
  onEdit: (coachId: number) => void;
  onRequestDelete: (coachId: number) => void;
  onReactivate?: (coachId: number) => void; // Added prop
  isActiveFilter?: boolean | null; // null or undefined = show all
};

const CoachesTableRows: React.FC<CoachesTableRowsProps> = ({
  coaches,
  onEdit,
  onRequestDelete,
  onReactivate,
  isActiveFilter = null,
}) => (
  <>
    {coaches
      .filter(coach =>
        isActiveFilter === null ? true : coach.isActive === isActiveFilter
      )
      .map((coach) => (
        <tr key={coach.id ?? Math.random()}>
          <td className="px-4 py-2">{coach.id}</td>
          <td className="px-4 py-2">
            {coach.firstName} {coach.lastName}
            {!coach.isActive && (
              <span className="ml-2 inline-block px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-800 text-xs font-semibold align-middle">
                Unactive
              </span>
            )}
          </td>
          <td className="px-4 py-2">{coach.email}</td>
          <td className="px-4 py-2 align-middle">
            <div className="flex gap-2 items-center">
              <button
                className={`flex items-center justify-center px-2 py-1 rounded transition
    ${typeof coach.id !== "number" || !coach.isActive
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"}
  `}
                title="Edit"
                onClick={() => typeof coach.id === "number" && onEdit(coach.id)}
                disabled={typeof coach.id !== "number" || !coach.isActive}
              >
                <i className="bi bi-pencil-square"></i>
              </button>
              {coach.isActive && (
                <button
                  className="flex items-center justify-center px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
                  title="Delete"
                  onClick={() => typeof coach.id === "number" && onRequestDelete(coach.id)}
                  disabled={typeof coach.id !== "number"}
                >
                  <i className="bi bi-trash"></i>
                </button>
              )}
              {!coach.isActive && onReactivate && (
                <button
                  className="flex items-center justify-center px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition"
                  title="Reactivate"
                  onClick={() => typeof coach.id === "number" && onReactivate(coach.id)}
                  disabled={typeof coach.id !== "number"}
                >
                  <i className="bi bi-arrow-repeat"></i>
                </button>
              )}
            </div>
          </td>
        </tr>
      ))}
  </>
);

export default CoachesTableRows;
