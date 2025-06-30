import React from "react";

type ModalCloseButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

const ModalCloseButton: React.FC<ModalCloseButtonProps> = ({
  onClick,
  disabled,
}) => (
  <button
    type="button"
    className={`absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-150 ease-in-out ${
      disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
    }`}
    aria-label="Close"
    onClick={onClick}
    disabled={disabled}
  >
    &times;
  </button>
);

export default ModalCloseButton;
