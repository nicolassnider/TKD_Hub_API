import { Promotion } from "@/app/types/Promotion";
import React from "react";
import EditPromotion from "./EditPromotions";

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
            <button
              type="button"
              className="text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
              onClick={onCancelDelete}
              disabled={loading}
            >
              &times;
            </button>
          </div>
          <div className="px-4 sm:px-6 py-4">
            <p className="mb-4">
              Are you sure you want to delete this promotion?
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                type="button"
                className="w-full sm:w-auto px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                onClick={onCancelDelete}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="w-full sm:w-auto px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={onDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
);

export default PromotionsAdminModals;
