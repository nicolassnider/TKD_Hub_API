import React from "react";

type ModalCloseButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

const ModalCloseButton: React.FC<ModalCloseButtonProps> = ({ onClick, disabled }) => (
  <button
    type="button"
    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
    aria-label="Close"
    onClick={onClick}
    disabled={disabled}
  >
    &times;
  </button>
);

export default ModalCloseButton;
