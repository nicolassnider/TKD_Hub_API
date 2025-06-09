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
    <div className="flex justify-center gap-2 mt-4">
        <button
            type="button"
            className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 flex items-center justify-center"
            onClick={onCancel}
            disabled={loading}
        >
            <i className="bi bi-x-lg md:hidden text-lg"></i>
            <span className="hidden md:inline">Cancel</span>
        </button>
        <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={loading || disabled}
        >
            <i className="bi bi-check-lg md:hidden text-lg"></i>
            <span className="hidden md:inline">{onSubmitLabel}</span>
        </button>
    </div>
);

export default FormActionButtons;
