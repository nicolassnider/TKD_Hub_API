import TableActionButton from "../common/actionButtons/TableActionButton";
import { Promotion } from "@/app/types/Promotion";
import TableRows, { TableColumn } from "../common/tableRows/TableRows";

const columns: TableColumn<Promotion>[] = [
  { label: "Student", render: (p) => p.studentName },
  { label: "Rank", render: (p) => p.rankName },
  {
    label: "Promotion Date",
    render: (p) =>
      p.promotionDate
        ? new Date(p.promotionDate).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })
        : "",
  },
];

export default function PromotionsTableRows({
  promotions,
  onEdit,
  onDelete,
}: {
  promotions: Promotion[];
  onEdit: (promotion: Promotion) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <TableRows
      data={promotions}
      columns={columns}
      actions={(promotion) => (
        <div className="flex gap-2">
          <TableActionButton
            onClick={() => onEdit(promotion)}
            title="Edit"
            iconClass="bi bi-pencil-square"
            variant="primary"
          />
          <TableActionButton
            onClick={() => onDelete(promotion.id)}
            title="Delete"
            iconClass="bi bi-trash"
            variant="error"
          />
        </div>
      )}
      notFoundMessage="No promotions found."
    />
  );
}
