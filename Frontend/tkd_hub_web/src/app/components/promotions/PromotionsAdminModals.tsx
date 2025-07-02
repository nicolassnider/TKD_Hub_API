import { Promotion } from "@/app/types/Promotion";
import React from "react";
import EditPromotion from "./EditPromotions";
import GenericButton from "../common/actionButtons/GenericButton";

type Props = {
  showCreate: boolean;
  editingPromotion: Promotion | null;
  deleteId: number | null;
  loading: boolean;
  studentIdFilter?: number;
  onCreateClose: (refresh?: boolean) => void;
  onEditClose: () => void;
  onDelete: () => void;
  onCancelDelete: () => void;
};

const PromotionsAdminModals: React.FC<Props> = ({
  showCreate,
  editingPromotion,
  deleteId,
  loading,
  studentIdFilter,
  onCreateClose,
  onEditClose,
  onDelete,
  onCancelDelete,
}) => (
  <>
    {showCreate && (
      <EditPromotion
        onClose={onCreateClose}
        studentId={
          typeof studentIdFilter === "number" ? studentIdFilter : undefined
        }
      />
    )}
    {editingPromotion && (
      <EditPromotion promotion={editingPromotion} onClose={onEditClose} />
    )}
    {deleteId !== null && (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
          <div className="flex justify-between items-center border-b px-4 sm:px-6 py-4">
            <h3 className="text-lg font-semibold">Confirm Delete</h3>
            <GenericButton
              type="button"
              variant="secondary"
              className="text-2xl font-bold"
              aria-label="Close"
              onClick={onCancelDelete}
              disabled={loading}
            >
              &times;
            </GenericButton>
          </div>
          <div className="px-4 sm:px-6 py-4">
            <p className="mb-4">
              Are you sure you want to delete this promotion?
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <GenericButton
                type="button"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={onCancelDelete}
                disabled={loading}
              >
                Cancel
              </GenericButton>
              <GenericButton
                type="button"
                variant="error"
                className="w-full sm:w-auto"
                onClick={onDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </GenericButton>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
);

export default PromotionsAdminModals;
