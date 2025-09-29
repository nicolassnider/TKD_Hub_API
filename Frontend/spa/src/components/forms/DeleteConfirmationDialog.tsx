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

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entityName: string; // e.g., "Student", "Coach", "Dojaang"
  entityDescription?: string; // e.g., "John Doe", "Main Dojang"
  loading?: boolean;
  customMessage?: string;
}

export function DeleteConfirmationDialog({
  open,
  onClose,
  onConfirm,
  entityName,
  entityDescription,
  loading = false,
  customMessage,
}: DeleteConfirmationDialogProps) {
  const defaultMessage = entityDescription
    ? `Are you sure you want to delete ${entityName.toLowerCase()} "${entityDescription}"?`
    : `Are you sure you want to delete this ${entityName.toLowerCase()}?`;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Warning color="warning" />
        Delete {entityName}
      </DialogTitle>

      <DialogContent>
        <DialogContentText>{customMessage || defaultMessage}</DialogContentText>

        <Box sx={{ mt: 2, p: 2, bgcolor: "warning.light", borderRadius: 1 }}>
          <Typography variant="body2" color="warning.dark">
            <strong>Warning:</strong> This action cannot be undone. The{" "}
            {entityName.toLowerCase()} will be permanently removed from the
            system.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
