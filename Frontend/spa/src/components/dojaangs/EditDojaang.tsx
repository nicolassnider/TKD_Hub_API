import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useRole } from "../../context/RoleContext";
import { fetchJson } from "../../lib/api";
import CoachSelector from "../coaches/CoachSelector";

type DojaangPayload = {
  id: number;
  name: string;
  address?: string;
  location?: string;
  phoneNumber?: string;
  email?: string;
  koreanName?: string;
  koreanNamePhonetic?: string;
  coachId?: number | null;
};

export default function EditDojaang({
  dojaangId,
  onClose,
  title,
  readOnly,
  initialItem,
}: {
  dojaangId: number;
  onClose: () => void;
  title?: string;
  readOnly?: boolean;
  initialItem?: any;
}) {
  const { token } = useRole();
  const [dojaang, setDojaang] = useState<DojaangPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOne = async () => {
      setLoading(true);
      try {
        if (initialItem) {
          setDojaang(initialItem);
          return;
        }
        if (dojaangId === 0) {
          setDojaang({
            id: 0,
            name: "",
            address: "",
            location: "",
            phoneNumber: "",
            email: "",
            koreanName: "",
            koreanNamePhonetic: "",
            coachId: null,
          });
          return;
        }

        const fetched = await fetchJson<any>(`/api/Dojaangs/${dojaangId}`);
        const data = fetched?.data ?? fetched;
        setDojaang(data);
      } catch (err: any) {
        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    };
    fetchOne();
  }, [dojaangId, token, initialItem]);

  const handleChange = (k: keyof DojaangPayload, v: any) =>
    setDojaang((d) => (d ? { ...d, [k]: v } : d));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dojaang) return;
    setSaving(true);
    setError(null);
    try {
      const payload: DojaangPayload = {
        id: dojaang.id,
        name: dojaang.name,
        address: dojaang.address,
        location: dojaang.location,
        phoneNumber: dojaang.phoneNumber,
        email: dojaang.email,
        koreanName: dojaang.koreanName,
        koreanNamePhonetic: dojaang.koreanNamePhonetic,
        coachId: dojaang.coachId ?? null,
      };
      if (dojaang.id === 0) {
        const createPayload = { ...payload } as any;
        delete (createPayload as any).id;
        await fetchJson(`/api/Dojaangs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createPayload),
        });
        onClose();
      } else {
        await fetchJson(`/api/Dojaangs/${dojaang.id}`, {
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
  if (!dojaang) return <Box p={4}>No data</Box>;

  const derivedTitle = dojaang.id === 0 ? "Create Dojaang" : "Edit Dojaang";
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
              label="Name"
              value={dojaang.name}
              onChange={(e) => handleChange("name", e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              InputProps={{ readOnly: !!readOnly }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Korean Name"
              value={dojaang.koreanName ?? ""}
              onChange={(e) => handleChange("koreanName", e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              InputProps={{ readOnly: !!readOnly }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Korean Name (Phonetic)"
              value={dojaang.koreanNamePhonetic ?? ""}
              onChange={(e) =>
                handleChange("koreanNamePhonetic", e.target.value)
              }
              fullWidth
              size="small"
              variant="outlined"
              InputProps={{ readOnly: !!readOnly }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Address"
              value={dojaang.address ?? ""}
              onChange={(e) => handleChange("address", e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              InputProps={{ readOnly: !!readOnly }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Phone"
              value={dojaang.phoneNumber ?? ""}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              InputProps={{ readOnly: !!readOnly }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              value={dojaang.email ?? ""}
              onChange={(e) => handleChange("email", e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              InputProps={{ readOnly: !!readOnly }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CoachSelector
              value={dojaang.coachId ?? null}
              onChange={(id) => handleChange("coachId", id)}
              label="Assigned Coach"
              readOnly={!!readOnly}
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
