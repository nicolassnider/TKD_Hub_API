import React from "react";
import GenericButton from "./GenericButton";

type TableActionButtonProps = {
  onClick: () => void;
  title: string;
  iconClass: string;
  disabled?: boolean;
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "ghost"
    | "link"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "outline";
  children?: React.ReactNode;
};

const TableActionButton: React.FC<TableActionButtonProps> = ({
  onClick,
  title,
  iconClass,
  disabled = false,
  variant = "primary",
  children,
}) => (
  <GenericButton
    type="button"
    variant={variant}
    title={title}
    onClick={onClick}
    disabled={disabled}
    aria-label={title}
    className="flex items-center justify-center px-3 py-2 min-h-0 h-8"
  >
    <i className={iconClass} aria-hidden="true"></i>
    {children && <span className="ml-1">{children}</span>}
  </GenericButton>
);

export default TableActionButton;
