import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import EditDojaang from "./EditDojaang";
import { useRole } from "../../context/RoleContext";
import { fetchJson, ApiError } from "../../lib/api";
import { DojaangDto } from "../../types/api";
import { tkdBrandColors } from "../../styles/tkdBrandColors";

export default function DojaangAdmin() {
  const { token, role } = useRole();
  const [dojaangs, setDojaangs] = useState<DojaangDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dojaangToDelete, setDojaangToDelete] = useState<DojaangDto | null>(
    null,
  );

  // fetchList is used in multiple places (initial load, refresh, after modal close)
  const fetchList = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const body = await fetchJson<DojaangDto[] | { data: DojaangDto[] }>(
        "/api/Dojaangs",
      );
      const list = Array.isArray(body) ? body : (body?.data ?? []);
      setDojaangs(list);
    } catch (err: any) {
      setError(
        err instanceof ApiError ? err.message : err.message || "Unknown error",
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleDeleteClick = (dojaang: DojaangDto) => {
    setDojaangToDelete(dojaang);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!dojaangToDelete || !token) return;

    setDeleteId(dojaangToDelete.id);
    try {
      await fetchJson(`/api/Dojaangs/${dojaangToDelete.id}`, {
        method: "DELETE",
      });
      setDojaangs((s) => s.filter((d) => d.id !== dojaangToDelete.id));
      setDeleteDialogOpen(false);
      setDojaangToDelete(null);
    } catch (err: any) {
      const message =
        err instanceof ApiError ? err.message : err.message || "Delete error";
      setError(message);
    } finally {
      setDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDojaangToDelete(null);
  };

  const isAdmin = Array.isArray(role) && role.includes("Admin");

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: tkdBrandColors.black.main, fontWeight: "bold" }}
        >
          Dojaangs Management
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => fetchList()}
            disabled={loading}
            sx={{ textTransform: "none" }}
          >
            Refresh
          </Button>
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setEditId(0)}
              sx={{
                backgroundColor: tkdBrandColors.red.main,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: tkdBrandColors.red.dark,
                },
              }}
            >
              Add Dojaang
            </Button>
          )}
        </Box>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: tkdBrandColors.neutral.light }}>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Location</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Phone</strong>
              </TableCell>
              <TableCell>
                <strong>Coach</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dojaangs.map((dojaang) => (
              <TableRow key={dojaang.id} hover>
                <TableCell>{dojaang.id}</TableCell>
                <TableCell
                  sx={{ color: tkdBrandColors.black.main, fontWeight: 500 }}
                >
                  {dojaang.name}
                </TableCell>
                <TableCell>{dojaang.location}</TableCell>
                <TableCell>{dojaang.email || "-"}</TableCell>
                <TableCell>{dojaang.phoneNumber || "-"}</TableCell>
                <TableCell sx={{ color: tkdBrandColors.red.main }}>
                  {dojaang.coachName || "-"}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    title="View Details"
                    onClick={() => setEditId(dojaang.id)}
                    color="primary"
                    size="small"
                  >
                    <DescriptionIcon />
                  </IconButton>
                  {isAdmin && (
                    <IconButton
                      title="Delete"
                      onClick={() => handleDeleteClick(dojaang)}
                      color="error"
                      size="small"
                      disabled={deleteId === dojaang.id}
                    >
                      {deleteId === dojaang.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {editId !== null && (
        <EditDojaang
          dojaangId={editId}
          onClose={() => {
            setEditId(null);
            fetchList();
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle
          id="delete-dialog-title"
          sx={{ color: tkdBrandColors.red.main }}
        >
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the dojaang "{dojaangToDelete?.name}
            "? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteId !== null}
            sx={{ textTransform: "none" }}
          >
            {deleteId !== null ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
