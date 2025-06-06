import React from "react";

type Promotion = {
  id: number;
  name: string;
  description?: string;
  date: string;
};

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
        <td colSpan={5} className="text-center text-muted py-3">
          No promotions found.
        </td>
      </tr>
    );
  }

  return (
    <>
      {promotions.map((promotion) => (
        <tr key={promotion.id}>
          <td>{promotion.id}</td>
          <td>{promotion.name}</td>
          <td>{promotion.description || ""}</td>
          <td>{promotion.date ? promotion.date.substring(0, 10) : ""}</td>
          <td>
            <button
              className="btn btn-sm btn-primary me-2"
              onClick={() => onEdit(promotion.id)}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onDelete(promotion.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </>
  );
};

export default PromotionTableRows;
