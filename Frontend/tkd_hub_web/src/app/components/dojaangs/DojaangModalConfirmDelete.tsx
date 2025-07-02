import React from "react";
import GenericButton from "../common/actionButtons/GenericButton";

type DojaangModalConfirmDeleteProps = {
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  message?: string;
};

const DojaangModalConfirmDelete: React.FC<DojaangModalConfirmDeleteProps> = ({
  loading,
  onCancel,
  onConfirm,
  message = "Are you sure you want to delete this dojaang?",
}) => (
  <dialog open className="modal modal-open">
    <div className="modal-box">
      <h3 className="font-bold text-lg">Confirm Delete</h3>
      <p className="py-4">{message}</p>
      <div className="modal-action">
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
  </dialog>
);

export default DojaangModalConfirmDelete;
