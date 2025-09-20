import React, { useEffect, useState } from "react";
import { useRole } from "../context/RoleContext";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { fetchJson, ApiError } from "../lib/api";

type CoachPayload = {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  isActive?: boolean;
  applicationUserId?: string | null;
};

export default function EditCoach({
  coachId,
  onClose,
  title,
  readOnly,
  initialItem,
}: {
  coachId: number;
  onClose: () => void;
  title?: string;
  readOnly?: boolean;
  initialItem?: any;
}) {
  const { token } = useRole();
  const [coach, setCoach] = useState<CoachPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOne = async () => {
      setLoading(true);
      try {
        if (initialItem) {
          setCoach(initialItem);
          return;
        }
        if (coachId === 0) {
          setCoach({
            id: 0,
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            isActive: true,
            applicationUserId: null,
          });
          return;
        }
        const fetched = await fetchJson<any>(`/api/Coaches/${coachId}`);
        const data = fetched?.data ?? fetched;
        const coachObj = data?.coach ?? data;
        setCoach(coachObj);
      } catch (err: any) {
        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    };
    fetchOne();
  }, [coachId, token, initialItem]);

  const handleChange = (k: keyof CoachPayload, v: any) =>
    setCoach((c) => (c ? { ...c, [k]: v } : c));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coach) return;
    setSaving(true);
    setError(null);
    try {
      const payload: CoachPayload = {
        id: coach.id,
        firstName: coach.firstName,
        lastName: coach.lastName,
        email: coach.email,
        phoneNumber: coach.phoneNumber,
        isActive: coach.isActive,
        applicationUserId: coach.applicationUserId ?? null,
      };

      let res: Response;
      if (coach.id === 0) {
        const createPayload = { ...payload } as any;
        delete createPayload.id;
        await fetchJson(`/api/Coaches`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createPayload),
        });
        onClose();
      } else {
        await fetchJson(`/api/Coaches/${coach.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Save error");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box p={4}>
        <CircularProgress />
      </Box>
    );
  if (!coach) return <Box p={4}>No data</Box>;

  const derivedTitle = coach.id === 0 ? "Create Coach" : "Edit Coach";
  const effectiveTitle = title ?? derivedTitle;

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 1 }}>
      <form onSubmit={handleSubmit}>
        {!readOnly && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">{effectiveTitle}</Typography>
            {saving && <CircularProgress size={20} />}
          </Box>
        )}

        {error && (
          <Alert severity="error" className="mb-3">
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="First name"
              value={coach.firstName ?? ""}
              onChange={(e) => handleChange("firstName", e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              InputProps={{ readOnly: !!readOnly }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Last name"
              value={coach.lastName ?? ""}
              onChange={(e) => handleChange("lastName", e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              InputProps={{ readOnly: !!readOnly }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              value={coach.email ?? ""}
              onChange={(e) => handleChange("email", e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              InputProps={{ readOnly: !!readOnly }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Phone"
              value={coach.phoneNumber ?? ""}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              InputProps={{ readOnly: !!readOnly }}
            />
          </Grid>
        </Grid>

        {!readOnly && (
          <Box display="flex" justifyContent="flex-end" mt={3} gap={1}>
            <Button variant="outlined" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={saving}
            >
              {saving ? (
                <Box
                  component="span"
                  sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}
                >
                  <CircularProgress size={16} /> Saving...
                </Box>
              ) : (
                "Save"
              )}
            </Button>
          </Box>
        )}
      </form>
    </Paper>
  );
}
