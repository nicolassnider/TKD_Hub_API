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
  | "neutral"
  | "neutral-dark";

interface GenericButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: DaisyUIButtonVariant;
  children: React.ReactNode;
}

const variantClassMap: Record<DaisyUIButtonVariant, string> = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  accent: "btn btn-accent",
  ghost: "btn btn-ghost",
  link: "btn btn-link",
  info: "btn btn-info",
  success: "btn btn-success",
  warning: "btn btn-warning",
  error: "btn btn-error",
  outline: "btn btn-outline",
  neutral: "btn btn-neutral",
  "neutral-dark": "btn btn-neutral-dark",
};

const GenericButton: React.FC<GenericButtonProps> = ({
  variant = "primary",
  children,
  className = "",
  ...props
}) => {
  const variantClass = variantClassMap[variant] || variantClassMap.primary;
  return (
    <button className={`${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default GenericButton;
