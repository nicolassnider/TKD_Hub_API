import React from "react";
import TableActionButton from "../common/actionButtons/TableActionButton";
import { Coach } from "@/app/types/Coach";
import router from "next/router";
import TableRows, { TableColumn } from "../common/tableRows/TableRows";

type CoachesTableRowsProps = {
  coaches: Coach[];
  onEdit: (coachId: number) => void;
  onRequestDelete: (coachId: number) => void;
  onReactivate?: (coachId: number) => void;
  isActiveFilter?: boolean | null;
};

const columns: TableColumn<Coach>[] = [
  {
    label: "ID",
    render: (coach) => coach.id,
  },
  {
    label: "Name",
    render: (coach) => (
      <>
        {coach.firstName} {coach.lastName}
        {!coach.isActive && (
          <span className="ml-2 inline-block px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-800 text-xs font-semibold align-middle">
            Unactive
          </span>
        )}
      </>
    ),
  },
  {
    label: "Email",
    render: (coach) => coach.email,
  },
];

const CoachesTableRows: React.FC<CoachesTableRowsProps> = ({
  coaches,
  onEdit,
  onRequestDelete,
  onReactivate,
  isActiveFilter = null,
}) => {
  const filteredCoaches = coaches.filter((coach) =>
    isActiveFilter === null ? true : coach.isActive === isActiveFilter
  );

  return (
    <TableRows
      data={filteredCoaches}
      columns={columns}
      actions={(coach) => (
        <div className="flex gap-2 items-center">
          <TableActionButton
            onClick={() => typeof coach.id === "number" && onEdit(coach.id)}
            title="Edit"
            iconClass="bi bi-pencil-square"
            disabled={typeof coach.id !== "number" || !coach.isActive}
            colorClass={
              typeof coach.id !== "number" || !coach.isActive
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }
          />
          {coach.isActive && (
            <TableActionButton
              onClick={() => {
                if (typeof coach.id === "number") {
                  router.push(`/coaches/${coach.id}/promotions`);
                }
              }}
              title="Promotions"
              iconClass="bi bi-award"
              disabled={typeof coach.id !== "number"}
              colorClass="bg-purple-600 text-white hover:bg-purple-700"
            />
          )}
          {coach.isActive && (
            <TableActionButton
              onClick={() =>
                typeof coach.id === "number" && onRequestDelete(coach.id)
              }
              title="Delete"
              iconClass="bi bi-trash"
              disabled={typeof coach.id !== "number"}
              colorClass="bg-red-600 text-white hover:bg-red-700"
            />
          )}
          {!coach.isActive && onReactivate && (
            <TableActionButton
              onClick={() =>
                typeof coach.id === "number" && onReactivate(coach.id)
              }
              title="Reactivate"
              iconClass="bi bi-arrow-repeat"
              disabled={typeof coach.id !== "number"}
              colorClass="bg-green-600 text-white hover:bg-green-700"
            />
          )}
        </div>
      )}
      notFoundMessage="No coaches found."
    />
  );
};

export default CoachesTableRows;
