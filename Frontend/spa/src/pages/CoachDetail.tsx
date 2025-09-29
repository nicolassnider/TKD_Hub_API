import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Box, CircularProgress, Snackbar, Alert } from "@mui/material";
import { fetchJson, ApiError } from "../lib/api";
import ApiDetail from "../components/common/ApiDetail";
import EditCoach from "../components/coaches/EditCoach";
import ManageDojaangs from "../components/ManageDojaangs";

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

  return (
    <Box>
      <Box mb={2} display="flex" gap={1} alignItems="center">
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate("/coaches")}
        >
           Back to Coaches
        </Button>
        {loading && <CircularProgress size={18} />}
        {item && item.isActive === false ? (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleReactivate}
            disabled={reactivating}
          >
            {reactivating ? <CircularProgress size={16} /> : "Reactivate coach"}
          </Button>
        ) : null}
      </Box>

      {item ? (
        <Box
          mb={2}
          display="flex"
          alignItems="center"
          gap={1}
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              component="h2"
              sx={{ m: 0, fontSize: 20 }}
            >{`${item.firstName ?? ""} ${item.lastName ?? ""}`}</Box>
            {item.isActive === false ? (
              <Box>
                <Alert
                  severity="warning"
                  sx={{ py: 0.4, px: 1, display: "inline-block" }}
                >
                  INACTIVE
                </Alert>
              </Box>
            ) : null}
          </Box>
          <Box>
            {!editing ? (
              <Button
                variant="outlined"
                size="small"
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
            ) : (
              <Button
                variant="outlined"
                size="small"
                onClick={() => setEditing(false)}
              >
                Viewing
              </Button>
            )}
          </Box>
        </Box>
      ) : null}

      <Box sx={{ pt: 2 }}>
        <Box sx={{ maxWidth: 1000, mx: "auto" }}>
          <EditCoach
            coachId={Number(id)}
            initialItem={item}
            readOnly={!editing}
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
                ? `${item.firstName ?? ""} ${item.lastName ?? ""}`
                : undefined
            }
          />
        </Box>
      </Box>

      {id && (
        <Box mt={2}>
          <ManageDojaangs coachId={id} />
        </Box>
      )}

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ open: false })}
      >
        {snack.severity ? (
          <Alert
            severity={snack.severity}
            onClose={() => setSnack({ open: false })}
          >
            {snack.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
