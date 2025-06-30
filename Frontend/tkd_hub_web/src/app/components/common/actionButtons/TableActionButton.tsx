import React from "react";

type TableActionButtonProps = {
  onClick: () => void;
  title: string;
  iconClass: string;
  disabled?: boolean;
  colorClass?: string; // e.g. bg-blue-600, bg-red-600, etc.
  children?: React.ReactNode;
};

const TableActionButton: React.FC<TableActionButtonProps> = ({
  onClick,
  title,
  iconClass,
  disabled = false,
  colorClass = "bg-blue-600",
  children,
}) => (
  <button
    type="button"
    className={`flex items-center justify-center px-3 py-2 rounded ${colorClass} text-white hover:opacity-90 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    }`}
    title={title}
    onClick={onClick}
    disabled={disabled}
    aria-label={title}
  >
    <i className={iconClass} aria-hidden="true"></i>
    {children && <span className="ml-1">{children}</span>}
  </button>
);

export default TableActionButton;
