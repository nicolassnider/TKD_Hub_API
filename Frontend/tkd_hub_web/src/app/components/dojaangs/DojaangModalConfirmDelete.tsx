import React from "react";


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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded shadow-lg p-6 w-full max-w-xs">
      <h3 className="text-lg font-semibold mb-4 text-center">Confirm Delete</h3>
      <p className="mb-6 text-center">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
);


export default DojaangModalConfirmDelete;