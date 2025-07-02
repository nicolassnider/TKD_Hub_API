import React from "react";
import GenericButton from "../common/actionButtons/GenericButton";

const MobileMenuButton: React.FC<{ isOpen: boolean; toggle: () => void }> = ({
  isOpen,
  toggle,
}) => (
  <GenericButton
    onClick={toggle}
    variant={isOpen ? "error" : "primary"} // You can choose any variant you prefer
    className="text-gray-300 hover:text-white focus:outline-none transition duration-300"
    aria-label={isOpen ? "Close menu" : "Open menu"}
  >
    <svg
      className="h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      {isOpen ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16M4 12h16m-7 6h7"
        />
      )}
    </svg>
  </GenericButton>
);

export default MobileMenuButton;
