import React from "react";

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
    <button
      type="button"
      className="flex items-center justify-center px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 transition duration-200 ease-in-out"
      onClick={onCancel}
      disabled={loading}
    >
      <i className="bi bi-x-lg md:hidden text-lg"></i>
      <span className="hidden md:inline">Cancel</span>
    </button>
    <button
      type="submit"
      className={`flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200 ease-in-out ${
        loading || disabled ? "bg-gray-400 cursor-not-allowed" : ""
      }`}
      disabled={loading || disabled}
    >
      <i className="bi bi-check-lg md:hidden text-lg"></i>
      <span className="hidden md:inline">{onSubmitLabel}</span>
    </button>
  </div>
);

export default FormActionButtons;
