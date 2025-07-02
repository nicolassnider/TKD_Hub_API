import React from "react";
import GenericButton from "../common/actionButtons/GenericButton";

type CoachModalConfirmDeleteProps = {
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const CoachModalConfirmDelete: React.FC<CoachModalConfirmDeleteProps> = ({
  loading,
  onCancel,
  onConfirm,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded shadow-lg p-6 w-full max-w-xs">
      <h3 className="text-lg font-semibold mb-4 text-center">Confirm Delete</h3>
      <p className="mb-6 text-center">
        Are you sure you want to delete this coach?
      </p>
      <div className="flex justify-end gap-2">
        <GenericButton
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </GenericButton>
        <GenericButton
          type="button"
          variant="error"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </GenericButton>
      </div>
    </div>
  </div>
);

export default CoachModalConfirmDelete;
