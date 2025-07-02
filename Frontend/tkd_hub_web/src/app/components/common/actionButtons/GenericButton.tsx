import React from "react";

type DaisyUIButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "ghost"
  | "link"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "outline"
  | "neultral"
  | "neutral-dark";

interface GenericButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: DaisyUIButtonVariant;
  children: React.ReactNode;
}

const GenericButton: React.FC<GenericButtonProps> = ({
  variant = "primary",
  children,
  className = "",
  ...props
}) => {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default GenericButton;
