import React, { useEffect, useState } from "react";
import { fetchJson, ApiError } from "../lib/api";
import { useRole } from "../context/RoleContext";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

type Props = {
  apiPath: string; // e.g. /api/Students
  id: string | number | undefined;
};

export default function ApiDetail({ apiPath, id }: Props) {
  const { token, roleLoading } = useRole();
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    if (roleLoading) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      setItem(null);
      try {
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const res = await fetchJson<any>(`${apiPath}/${id}`, { headers });
        if (!mounted) return;
        setItem(res?.data ?? res);
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof ApiError ? e.message : String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [apiPath, id, token, roleLoading]);

  if (loading)
    return (
      <div className="flex items-center gap-2">
        <CircularProgress size={20} /> Loading…
      </div>
    );
  if (error) return <Alert severity="error">Error: {error}</Alert>;
  if (!item) return <Alert severity="info">Not found.</Alert>;

  return (
    <Paper className="p-4">
      <Typography variant="h6" gutterBottom>
        Details
      </Typography>
      <div>
        {Object.entries(item).map(([k, v]) => (
          <div key={k} className="mb-2">
            <strong className="mr-2">{k}:</strong>
            <span>
              {typeof v === "object" ? JSON.stringify(v, null, 2) : String(v)}
            </span>
          </div>
        ))}
      </div>
    </Paper>
  );
}
