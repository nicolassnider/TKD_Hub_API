import React from "react";
import GenericButton from "./GenericButton";

type FormActionButtonsProps = {
  onCancel: () => void;
  onSubmitLabel?: string;
  loading?: boolean;
  disabled?: boolean;
};

const FormActionButtons: React.FC<FormActionButtonsProps> = ({
  onCancel,
  onSubmitLabel = "Submit",
  loading = false,
  disabled = false,
}) => (
  <div className="flex justify-between items-center mt-4">
    <GenericButton
      type="button"
      variant="secondary"
      onClick={onCancel}
      disabled={loading}
    >
      <span className="md:hidden text-lg">✖</span>
      <span className="hidden md:inline">Cancel</span>
    </GenericButton>
    <GenericButton
      type="submit"
      variant="primary"
      disabled={loading || disabled}
    >
      {loading ? (
        <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2 align-middle"></span>
      ) : (
        <span className="md:hidden text-lg">✔</span>
      )}
      <span className="hidden md:inline">{onSubmitLabel}</span>
    </GenericButton>
  </div>
);

export default FormActionButtons;
