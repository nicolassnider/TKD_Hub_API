import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Fab,
  Backdrop,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  RestartAlt as ReactivateIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { fetchJson, ApiError } from "../../lib/api";
import { DojaangInfoCard } from "../../components/dojaangs/DojaangInfoCard";
import { DojaangDto } from "../../types/api";

export default function DojaangDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<DojaangDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [reactivating, setReactivating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [snack, setSnack] = useState<{
    open: boolean;
    severity?: "success" | "error";
    message?: string;
  }>({ open: false });

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetchJson<any>(`/api/Dojaangs/${id}`);
        if (!mounted) return;
        // unwrap possible wrapper
        const d = res?.data ?? res;
        setItem(d as DojaangDto);
      } catch (e) {
        if (!mounted) return;
        setSnack({
          open: true,
          severity: "error",
          message: e instanceof ApiError ? e.message : String(e),
        });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleReactivate = async () => {
    if (!id) return;
    setReactivating(true);
    try {
      try {
        await fetchJson(`/api/Dojaangs/${id}/reactivate`, {
          method: "POST",
        });
      } catch (e: any) {
        // Fallback behaviors
        if (e instanceof ApiError && (e.status === 404 || e.status === 405)) {
          try {
            await fetchJson(`/api/Dojaangs/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ isActive: true }),
            });
          } catch (inner) {
            throw inner;
          }
        } else {
          throw e;
        }
      }

      setSnack({
        open: true,
        severity: "success",
        message: "Dojaang reactivated successfully",
      });
      // refresh detail
      const refreshed = await fetchJson<any>(`/api/Dojaangs/${id}`);
      setItem((refreshed?.data ?? refreshed) as DojaangDto);
    } catch (e: any) {
      setSnack({
        open: true,
        severity: "error",
        message: e instanceof ApiError ? e.message : String(e),
      });
    } finally {
      setReactivating(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !item) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
    );

    if (!confirmDelete) return;

    setDeleting(true);
    try {
      await fetchJson(`/api/Dojaangs/${id}`, {
        method: "DELETE",
      });

      setSnack({
        open: true,
        severity: "success",
        message: "Dojaang deleted successfully",
      });

      // Navigate back to dojaangs list after a short delay
      setTimeout(() => {
        navigate("/dojaangs");
      }, 1000);
    } catch (e: any) {
      setSnack({
        open: true,
        severity: "error",
        message: e instanceof ApiError ? e.message : String(e),
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={48} sx={{ color: "var(--primary)" }} />
        <Alert
          severity="info"
          sx={{ bgcolor: "var(--panel)", color: "var(--fg)" }}
        >
          Loading dojaang details...
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1400,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
        minHeight: "100vh",
        bgcolor: "var(--background)",
      }}
    >
      {/* Navigation Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dojaangs")}
          sx={{
            borderColor: "var(--border)",
            color: "var(--fg)",
            "&:hover": {
              borderColor: "var(--primary)",
              bgcolor: "var(--surface)",
            },
          }}
        >
          Back to Dojaangs
        </Button>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {item && item.isActive === false && (
            <Button
              variant="contained"
              startIcon={
                reactivating ? (
                  <CircularProgress size={16} />
                ) : (
                  <ReactivateIcon />
                )
              }
              onClick={handleReactivate}
              disabled={reactivating}
              sx={{
                bgcolor: "var(--success)",
                "&:hover": {
                  bgcolor: "var(--success-dark)",
                },
              }}
            >
              {reactivating ? "Reactivating..." : "Reactivate Dojaang"}
            </Button>
          )}

          {item && (
            <Button
              variant="outlined"
              startIcon={
                deleting ? <CircularProgress size={16} /> : <DeleteIcon />
              }
              onClick={handleDelete}
              disabled={deleting}
              sx={{
                borderColor: "var(--error)",
                color: "var(--error)",
                "&:hover": {
                  borderColor: "var(--error-dark)",
                  bgcolor: "var(--error-50)",
                },
              }}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          )}
        </Box>
      </Box>

      {/* Dojaang Detail Content */}
      {item ? (
        <DojaangInfoCard dojaang={item} />
      ) : !loading ? (
        <Box
          sx={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Alert
            severity="error"
            sx={{ bgcolor: "var(--panel)", color: "var(--fg)" }}
          >
            Dojaang not found or failed to load
          </Alert>
        </Box>
      ) : null}

      {/* Floating Action Button for Edit/View Toggle */}
      {item && (
        <Fab
          color="primary"
          aria-label="edit dojaang"
          onClick={() => {
            // Direct navigation to edit page
            navigate(`/dojaangs/${id}/edit`);
          }}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            bgcolor: "var(--primary)",
            "&:hover": {
              bgcolor: "var(--primary-dark)",
            },
            zIndex: 1000,
          }}
        >
          <EditIcon />
        </Fab>
      )}

      {/* Loading Backdrop */}
      {(reactivating || deleting) && (
        <Backdrop
          sx={{
            color: "var(--primary)",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            bgcolor: "rgba(0, 0, 0, 0.7)",
          }}
          open={reactivating || deleting}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress color="inherit" size={64} />
            <Alert
              severity="info"
              sx={{
                bgcolor: "var(--panel)",
                color: "var(--fg)",
              }}
            >
              {reactivating ? "Reactivating dojaang..." : "Deleting dojaang..."}
            </Alert>
          </Box>
        </Backdrop>
      )}

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        {snack.severity ? (
          <Alert
            severity={snack.severity}
            onClose={() => setSnack({ open: false })}
            sx={{
              bgcolor:
                snack.severity === "success"
                  ? "var(--success-50)"
                  : "var(--error-50)",
              color:
                snack.severity === "success"
                  ? "var(--success)"
                  : "var(--error)",
              "& .MuiAlert-icon": {
                color:
                  snack.severity === "success"
                    ? "var(--success)"
                    : "var(--error)",
              },
            }}
          >
            {snack.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
