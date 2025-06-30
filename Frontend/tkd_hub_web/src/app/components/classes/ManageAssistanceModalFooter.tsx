import React from "react";

type ManageAssistanceModalFooterProps = {
  onClose: () => void;
};

const ManageAssistanceModalFooter: React.FC<
  ManageAssistanceModalFooterProps
> = ({ onClose }) => (
  <div className="flex justify-end mt-4">
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      onClick={onClose}
    >
      Close
    </button>
  </div>
);

export default ManageAssistanceModalFooter;
