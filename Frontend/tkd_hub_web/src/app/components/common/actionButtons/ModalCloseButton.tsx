import React from "react";
import GenericButton from "./GenericButton";

type ModalCloseButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

const ModalCloseButton: React.FC<ModalCloseButtonProps> = ({
  onClick,
  disabled,
}) => (
  <GenericButton
    type="button"
    variant="warning"
    className="absolute top-3 right-3 text-2xl font-bold min-h-0 h-8 w-8 p-0"
    aria-label="Close"
    onClick={onClick}
    disabled={disabled}
  >
    &times;
  </GenericButton>
);

export default ModalCloseButton;
