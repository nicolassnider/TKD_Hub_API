import React, { useEffect, useState } from "react";
import { fetchJson, ApiError } from "../../lib/api";
import { useRole } from "../../context/RoleContext";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

type Props = {
  apiPath: string; // e.g. /api/Students
  id: string | number | undefined;
  hideKeys?: string[];
};

export default function ApiDetail({ apiPath, id, hideKeys }: Props) {
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
  // If the API returned a wrapper like { dojaang: { ... } } or { coach: { ... } }
  // unwrap it for display so the details table shows the inner fields.
  // create a displayItem which may be an unwrapped inner object when the API
  // returns a single-key wrapper like { dojaang: { ... } }
  let displayItem: any = item;
  if (typeof item === "object" && !Array.isArray(item)) {
    const keys = Object.keys(item);
    if (keys.length === 1 && typeof (item as any)[keys[0]] === "object") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      displayItem = (item as any)[keys[0]] as any;
    }
  }
  const isIsoDate = (s: string) => {
    // crude ISO date detection
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(s);
  };

  const renderValue = (v: any) => {
    if (v === null || v === undefined) return <em>null</em>;
    if (typeof v === "boolean")
      return (
        <Chip
          label={String(v)}
          size="small"
          color={v ? "success" : "default"}
        />
      );
    if (typeof v === "number") return <span>{v}</span>;
    if (typeof v === "string") {
      if (isIsoDate(v)) {
        try {
          const d = new Date(v);
          return <span>{d.toLocaleString()}</span>;
        } catch {
          return <span>{v}</span>;
        }
      }
      return <span>{v}</span>;
    }
    if (Array.isArray(v)) {
      if (v.length === 0) return <span>[]</span>;
      // array of primitives
      if (v.every((x) => typeof x !== "object")) {
        return <span>{v.join(", ")}</span>;
      }
      // array of objects
      return (
        <List dense>
          {v.map((item: any, idx: number) => (
            <ListItem key={idx}>
              <Box sx={{ width: "100%" }}>
                {Object.entries(item).map(([k, val]) => (
                  <div key={k}>
                    <Typography component="div" sx={{ fontSize: 12 }}>
                      <strong>{k}:</strong> {String(val)}
                    </Typography>
                  </div>
                ))}
              </Box>
            </ListItem>
          ))}
        </List>
      );
    }
    // object
    return (
      <Box sx={{ bgcolor: "background.default", p: 1, borderRadius: 1 }}>
        {Object.entries(v).map(([k, val]) => (
          <Typography key={k} component="div" sx={{ fontSize: 13, mb: 0.5 }}>
            <strong>{k}:</strong>{" "}
            {typeof val === "object" ? JSON.stringify(val) : String(val)}
          </Typography>
        ))}
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Details
      </Typography>
      <Grid container spacing={1}>
        {Object.entries(displayItem)
          .filter(([k]) => !(hideKeys ?? []).includes(k))
          .map(([k, v]) => (
            <React.Fragment key={k}>
              <Grid item xs={12} sm={3} md={2} sx={{ pr: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {k}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={9} md={10}>
                {renderValue(v)}
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
            </React.Fragment>
          ))}
      </Grid>
    </Paper>
  );
}
