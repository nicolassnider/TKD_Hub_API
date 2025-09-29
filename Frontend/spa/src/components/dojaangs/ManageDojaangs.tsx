import { useEffect, useState } from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useApiItems } from "hooks/useApiItems";
import { useRole } from "context/RoleContext";
import { ApiError, fetchJson } from "lib/api";

type Props = {
  coachId: string | number;
};

export default function ManageDojaangs({ coachId }: Props) {
  const {
    items: dojaangs,
    loading,
    error,
    reload,
  } = useApiItems("/api/Dojaangs");
  const [managed, setManaged] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { token } = useRole();

  const getAuthHeaders = (contentType?: string) => {
    let t: string | null | undefined = token;
    try {
      if (!t && typeof window !== "undefined") {
        t = localStorage.getItem("token");
      }
    } catch {
      // ignore localStorage errors
    }
    const headers: Record<string, string> = {};
    if (contentType) headers["Content-Type"] = contentType;
    if (t) headers["Authorization"] = `Bearer ${t}`;
    return headers;
  };
  useEffect(() => {
    if (!coachId) return;
    let mounted = true;
    (async () => {
      try {
        const storageKey = `manageDojaangs:${coachId}`;
        // try to restore cached selection first
        let cached: number[] | null = null;
        try {
          const raw =
            typeof window !== "undefined"
              ? localStorage.getItem(storageKey)
              : null;
          if (raw) cached = JSON.parse(raw);
        } catch {
          cached = null;
        }
        if (cached && Array.isArray(cached) && cached.length) {
          setManaged(cached.map((x) => Number(x)).filter(Boolean));
        }

        const headers = getAuthHeaders();
        const res = await fetchJson<any>(`/api/Coaches/${coachId}`, {
          headers,
        });
        if (!mounted) return;
        const c = res?.data ?? res;
        // coach may expose managed dojaangs as objects or as an array of ids
        let ids: number[] = [];
        if (Array.isArray(c?.managedDojaangIds)) {
          ids = c.managedDojaangIds.map((x: any) => Number(x));
        } else if (Array.isArray(c?.managedDojaangs)) {
          ids = c.managedDojaangs
            .map((d: any) => Number(d?.id))
            .filter(Boolean);
        }
        // if cached exists, merge server ids with cached so new options are not lost
        if (cached && Array.isArray(cached) && cached.length) {
          const merged = Array.from(
            new Set([...cached.map(Number).filter(Boolean), ...ids]),
          );
          setManaged(merged);
        } else {
          setManaged(ids);
        }
      } catch (e) {
        // ignore — coach detail already shown elsewhere
      }
    })();
    return () => {
      mounted = false;
    };
  }, [coachId, token]);

  const toggle = (id: number) => {
    setManaged((m) => {
      const next = m.includes(id) ? m.filter((x) => x !== id) : [...m, id];
      // persist current selection to localStorage so dialog preserves previous values
      try {
        if (typeof window !== "undefined") {
          const storageKey = `manageDojaangs:${coachId}`;
          localStorage.setItem(storageKey, JSON.stringify(next));
        }
      } catch {
        // ignore localStorage issues
      }
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const headers = getAuthHeaders("application/json");
      await fetchJson(`/api/Coaches/${coachId}/managed-dojaangs`, {
        method: "PUT",
        headers,
        body: JSON.stringify(managed),
      });
      // persist saved selection
      try {
        if (typeof window !== "undefined") {
          const storageKey = `manageDojaangs:${coachId}`;
          localStorage.setItem(storageKey, JSON.stringify(managed));
        }
      } catch {}
      reload();
      setOpen(false);
    } catch (e) {
      setSaveError(e instanceof ApiError ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };
  const handleOpen = () => {
    setSaveError(null);
    // ensure latest dojaangs and fresh managed ids from coach
    (async () => {
      try {
        const headers = getAuthHeaders();
        const res = await fetchJson<any>(`/api/Coaches/${coachId}`, {
          headers,
        });
        const c = res?.data ?? res;
        let ids: number[] = [];
        if (Array.isArray(c?.managedDojaangIds))
          ids = c.managedDojaangIds.map((x: any) => Number(x));
        else if (Array.isArray(c?.managedDojaangs))
          ids = c.managedDojaangs
            .map((d: any) => Number(d?.id))
            .filter(Boolean);
        // merge with any cached selection so previous user choices are not lost
        try {
          const storageKey = `manageDojaangs:${coachId}`;
          const raw =
            typeof window !== "undefined"
              ? localStorage.getItem(storageKey)
              : null;
          const cached = raw ? JSON.parse(raw) : null;
          if (cached && Array.isArray(cached) && cached.length) {
            const merged = Array.from(
              new Set([...cached.map(Number).filter(Boolean), ...ids]),
            );
            setManaged(merged);
          } else {
            setManaged(ids);
          }
        } catch {
          setManaged(ids);
        }
      } catch (e) {
        // ignore
      }
      reload();
      setOpen(true);
    })();
  };
  const handleClose = () => {
    setOpen(false);
    setSaveError(null);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Button variant="outlined" onClick={handleOpen} size="small">
        Manage dojaangs
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Typography variant="h6">Manage dojaangs</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {loading && <div>Loading dojaangs…</div>}
          {error && (
            <Alert severity="error">Error loading dojaangs: {error}</Alert>
          )}
          {saveError && <Alert severity="error">{saveError}</Alert>}
          <List>
            {dojaangs.map((d: any) => {
              const did = Number(d.id);
              return (
                <ListItem
                  key={d.id}
                  button
                  onClick={() => toggle(did)}
                  sx={{ py: 2 }}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={managed.includes(did)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">{d.name}</Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {d.address}
                      </Typography>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={save} variant="contained" disabled={saving}>
            {saving ? "Saving…" : "Save managed dojaangs"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
