import React from "react";
import { Alert, AlertTitle } from "@mui/material";

interface ErrorAlertProps {
  error: string | Error | null;
  title?: string;
  severity?: "error" | "warning";
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  title = "Error",
  severity = "error",
  onRetry,
  retryLabel = "Retry",
}) => {
  if (!error) return null;

  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    <Alert
      severity={severity}
      action={
        onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            {retryLabel}
          </button>
        )
      }
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {errorMessage}
    </Alert>
  );
};
