import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { Warning } from "@mui/icons-material";

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  severity?: "warning" | "error" | "info";
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  severity = "warning",
}) => {
  const getSeverityColor = () => {
    switch (severity) {
      case "error":
        return "#f44336";
      case "warning":
        return "#ff9800";
      case "info":
        return "#2196f3";
      default:
        return "#ff9800";
    }
  };

  const getSeverityBackground = () => {
    switch (severity) {
      case "error":
        return "rgba(244, 67, 54, 0.1)";
      case "warning":
        return "rgba(255, 152, 0, 0.1)";
      case "info":
        return "rgba(33, 150, 243, 0.1)";
      default:
        return "rgba(255, 152, 0, 0.1)";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: getSeverityBackground(),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Warning sx={{ color: getSeverityColor(), fontSize: 24 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: 600,
            }}
          >
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <DialogContentText
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "1rem",
            lineHeight: 1.5,
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            borderColor: "rgba(255, 255, 255, 0.3)",
            color: "rgba(255, 255, 255, 0.8)",
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            "&:hover": {
              borderColor: "rgba(255, 255, 255, 0.5)",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            background: `linear-gradient(45deg, ${getSeverityColor()}, ${getSeverityColor()}dd)`,
            color: "white",
            textTransform: "none",
            borderRadius: 2,
            px: 3,
            boxShadow: `0 4px 12px ${getSeverityColor()}40`,
            "&:hover": {
              background: `linear-gradient(45deg, ${getSeverityColor()}dd, ${getSeverityColor()}bb)`,
              boxShadow: `0 6px 16px ${getSeverityColor()}50`,
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
