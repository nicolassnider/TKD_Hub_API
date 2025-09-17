import { DaisyUIButtonVariant } from "@/app/types/DaisyUIButtonVariant";
import React from "react";

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
  // Quita w-full de baseClass
  const baseClass =
    "flex items-center justify-center gap-1 text-xs xs:text-sm sm:text-base px-2 py-1 sm:px-4 sm:py-2 break-words";

  return (
    <button className={`${variantClass} ${baseClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default GenericButton;
