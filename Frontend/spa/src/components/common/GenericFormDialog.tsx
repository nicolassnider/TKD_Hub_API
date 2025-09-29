import React, { ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { LoadingSpinner } from "./LoadingSpinner";

interface GenericFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void | Promise<void>;
  title: string;
  children: ReactNode;
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  disabled?: boolean;
}

export const GenericFormDialog: React.FC<GenericFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  children,
  loading = false,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  maxWidth = "sm",
  fullWidth = true,
  disabled = false,
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {title}
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {loading ? (
            <Box sx={{ py: 4 }}>
              <LoadingSpinner
                variant="centered"
                message="Loading form data..."
              />
            </Box>
          ) : (
            children
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || disabled}
          >
            {loading ? "Saving..." : submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
