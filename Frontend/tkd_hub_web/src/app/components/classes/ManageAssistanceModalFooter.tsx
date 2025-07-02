import React from "react";
import GenericButton from "../common/actionButtons/GenericButton";

type ManageAssistanceModalFooterProps = {
  onClose: () => void;
};

const ManageAssistanceModalFooter: React.FC<
  ManageAssistanceModalFooterProps
> = ({ onClose }) => (
  <div className="flex justify-end mt-4">
    <GenericButton type="button" variant="primary" onClick={onClose}>
      Close
    </GenericButton>
  </div>
);

export default ManageAssistanceModalFooter;
