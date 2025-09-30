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
  Visibility as VisibilityIcon,
  RestartAlt as ReactivateIcon,
} from "@mui/icons-material";
import { fetchJson, ApiError } from "../../lib/api";
import { CoachInfoCard } from "../../components/coaches/CoachInfoCard";
import EditCoach from "../../components/coaches/EditCoach";
import ManageDojaangs from "../../components/dojaangs/ManageDojaangs";

export default function CoachDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [reactivating, setReactivating] = useState(false);
  const [snack, setSnack] = useState<{
    open: boolean;
    severity?: "success" | "error";
    message?: string;
  }>({ open: false });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetchJson<any>(`/api/Coaches/${id}`);
        if (!mounted) return;
        // unwrap possible wrapper
        const d = res?.data ?? res;
        // some APIs return { data: { coach: {...}, managedDojaangs: [...] } }
        setItem(d?.coach ?? d);
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
      // prefer user-level reactivation when available
      try {
        // attempt to derive user id from item fields
        const userId =
          item?.applicationUserId ?? item?.userId ?? item?.applicationUser?.id;
        if (userId) {
          await fetchJson(`/api/Users/${userId}/reactivate`, {
            method: "POST",
          });
        } else {
          // fallback to coach endpoint
          await fetchJson(`/api/Coaches/${id}/reactivate`, { method: "POST" });
        }
      } catch (e: any) {
        // fallback behaviors
        if (e instanceof ApiError && (e.status === 404 || e.status === 405)) {
          try {
            await fetchJson(`/api/Coaches/${id}`, {
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
        message: "Coach reactivated",
      });
      // refresh detail
      const refreshed = await fetchJson<any>(`/api/Coaches/${id}`);
      setItem(
        (refreshed?.data ?? refreshed)?.coach ?? refreshed?.data ?? refreshed,
      );
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
          Loading coach details...
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
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/coaches")}
          sx={{
            borderColor: "var(--border)",
            color: "var(--fg)",
            "&:hover": {
              borderColor: "var(--primary)",
              bgcolor: "var(--surface)",
            },
          }}
        >
          Back to Coaches
        </Button>

        {item && item.isActive === false && (
          <Button
            variant="contained"
            startIcon={
              reactivating ? <CircularProgress size={16} /> : <ReactivateIcon />
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
            {reactivating ? "Reactivating..." : "Reactivate Coach"}
          </Button>
        )}
      </Box>

      {/* Coach Detail Content */}
      {!editing && item ? <CoachInfoCard coach={item} /> : null}

      {/* Edit Mode */}
      {editing && item ? (
        <Box sx={{ maxWidth: 1000, mx: "auto" }}>
          <EditCoach
            coachId={Number(id)}
            initialItem={item}
            readOnly={false}
            onClose={async () => {
              setEditing(false);
              try {
                const refreshed = await fetchJson<any>(`/api/Coaches/${id}`);
                const d = refreshed?.data ?? refreshed;
                setItem(d?.coach ?? d);
              } catch (e) {
                // ignore here
              }
            }}
            title={
              item
                ? `Edit ${item.firstName ?? ""} ${item.lastName ?? ""}`.trim()
                : "Edit Coach"
            }
          />
        </Box>
      ) : null}

      {/* Managed Dojaangs Section */}
      {id && item && (
        <Box sx={{ mt: 6, maxWidth: 1000, mx: "auto" }}>
          <ManageDojaangs coachId={id} />
        </Box>
      )}

      {/* Floating Action Button for Edit/View Toggle */}
      {item && (
        <Fab
          color="primary"
          aria-label={editing ? "view mode" : "edit mode"}
          onClick={() => setEditing(!editing)}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            bgcolor: editing ? "var(--accent)" : "var(--primary)",
            "&:hover": {
              bgcolor: editing ? "var(--accent-dark)" : "var(--primary-dark)",
            },
            zIndex: 1000,
          }}
        >
          {editing ? <VisibilityIcon /> : <EditIcon />}
        </Fab>
      )}

      {/* Loading Backdrop for Edit Mode */}
      {editing && loading && (
        <Backdrop
          sx={{
            color: "var(--primary)",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            bgcolor: "rgba(0, 0, 0, 0.7)",
          }}
          open={loading}
        >
          <CircularProgress color="inherit" size={64} />
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
