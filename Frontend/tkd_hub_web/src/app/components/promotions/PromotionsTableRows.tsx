import { Promotion } from "@/app/types/Promotion";
import React from "react";

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
            <button
              className="mr-2 px-2 py-1 text-primary"
              title="Edit"
              onClick={() => onEdit(promotion.id)}
            >
              <i className="bi bi-pencil-square"></i>
            </button>
            <button
              className="px-2 py-1 text-danger"
              title="Delete"
              onClick={() => onDelete(promotion.id)}
            >
              <i className="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      ))}
    </>
  );
};

export default PromotionTableRows;
