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
            variant="primary"
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
              variant="secondary"
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
              variant="error"
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
              variant="success"
            />
          )}
        </div>
      )}
      notFoundMessage="No coaches found."
    />
  );
};

export default CoachesTableRows;
