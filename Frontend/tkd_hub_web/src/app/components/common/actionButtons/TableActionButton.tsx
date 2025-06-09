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
    className={`flex items-center justify-center px-2 py-1 rounded ${colorClass} text-white hover:opacity-90 transition ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    title={title}
    onClick={onClick}
    disabled={disabled}
    aria-label={title}
  >
    <i className={iconClass}></i>
    {children}
  </button>
);

export default TableActionButton;
