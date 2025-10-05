import React from "react";
import {
  Alert,
  AlertTitle,
  Button,
  Box,
  Collapse,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";

interface ErrorAlertProps {
  error: string | Error | null;
  title?: string;
  severity?: "error" | "warning" | "info";
  onRetry?: () => void;
  retryLabel?: string;
  variant?: "filled" | "outlined" | "standard";
  showDetails?: boolean;
  fullWidth?: boolean;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  title,
  severity = "error",
  onRetry,
  retryLabel = "Try Again",
  variant = "standard",
  showDetails = false,
  fullWidth = true,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  if (!error) return null;

  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  const shouldShowExpandButton = showDetails && errorStack;

  const getDefaultTitle = () => {
    switch (severity) {
      case "warning":
        return "Warning";
      case "info":
        return "Information";
      default:
        return "Something went wrong";
    }
  };

  return (
    <Alert
      severity={severity}
      variant={variant}
      sx={{
        borderRadius: 2,
        width: fullWidth ? "100%" : "auto",
        "& .MuiAlert-message": {
          width: "100%",
        },
      }}
      action={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {shouldShowExpandButton && (
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{ color: "inherit" }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
          {onRetry && (
            <Button
              size="small"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
              color="inherit"
              variant="outlined"
              sx={{
                borderRadius: 1.5,
                textTransform: "none",
                fontWeight: 600,
                minWidth: "auto",
                px: 2,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              {retryLabel}
            </Button>
          )}
        </Box>
      }
    >
      {title && (
        <AlertTitle sx={{ fontWeight: 700, mb: 1 }}>{title}</AlertTitle>
      )}

      <Typography variant="body2" sx={{ mb: shouldShowExpandButton ? 1 : 0 }}>
        {title ? errorMessage : `${getDefaultTitle()}: ${errorMessage}`}
      </Typography>

      {shouldShowExpandButton && (
        <Collapse in={expanded}>
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 1,
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="caption"
              component="pre"
              sx={{
                fontFamily: "monospace",
                fontSize: "0.75rem",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                color: "text.secondary",
              }}
            >
              {errorStack}
            </Typography>
          </Box>
        </Collapse>
      )}
    </Alert>
  );
};
