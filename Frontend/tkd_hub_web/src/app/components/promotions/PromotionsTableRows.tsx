import { Promotion } from "@/app/types/Promotion";
import React from "react";
import TableActionButton from "../common/actionButtons/TableActionButton";

type PromotionTableRowsProps = {
  promotions: Promotion[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

const PromotionTableRows: React.FC<PromotionTableRowsProps> = ({
  promotions,
  onEdit,
  onDelete,
}) => {
  if (!promotions.length) {
    return (
      <tr>
        <td colSpan={6} className="text-center text-gray-500 py-3">
          No promotions found.
        </td>
      </tr>
    );
  }

  return (
    <>
      {promotions.map((promotion) => (
        <tr key={promotion.id} className="border-b">
          <td className="px-4 py-2">{promotion.studentName}</td>
          <td className="px-4 py-2">{promotion.rankName}</td>
          <td className="px-4 py-2">
            {promotion.promotionDate
              ? new Date(promotion.promotionDate).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })
              : ""}
          </td>
          <td className="px-4 py-2">
            <div className="flex gap-2">
              <TableActionButton
                onClick={() => onEdit(promotion.id)}
                title="Edit"
                iconClass="bi bi-pencil-square"
                colorClass="bg-blue-600 text-white hover:bg-blue-700"
              />
              <TableActionButton
                onClick={() => onDelete(promotion.id)}
                title="Delete"
                iconClass="bi bi-trash"
                colorClass="bg-red-600 text-white hover:bg-red-700"
              />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default PromotionTableRows;
