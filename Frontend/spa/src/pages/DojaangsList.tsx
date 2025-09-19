import ApiTable from "components/ApiTable";
import { useApiItems } from "components/useApiItems";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import React, { useMemo, useState } from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchJson, ApiError } from "../lib/api";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function DojaangsList() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dojaangs</h2>
      <DojaangsTable />
    </div>
  );
}

function DojaangsTable() {
  const { items, loading, error, reload } = useApiItems("/api/Dojaangs");
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmRow, setConfirmRow] = useState<any | null>(null);
  const [deleteLoadingMap, setDeleteLoadingMap] = useState<Record<string | number, boolean>>({});
  const [snack, setSnack] = useState<{ open: boolean; severity?: "success" | "error"; message?: string }>({ open: false });

  const startDelete = (id: string | number) =>
    setDeleteLoadingMap((m) => ({ ...m, [id]: true }));
  const endDelete = (id: string | number) =>
    setDeleteLoadingMap((m) => {
      const n = { ...m };
      delete n[id];
      return n;
    });

  const handleRequestDelete = (row: any) => {
    setConfirmRow(row);
    setConfirmOpen(true);
  };

  const doDelete = async () => {
    if (!confirmRow) return;
    const id = confirmRow.id;
    setConfirmOpen(false);
    startDelete(id);
    try {
      await fetchJson(`/api/Dojaangs/${id}`, { method: "DELETE" });
      setSnack({ open: true, severity: "success", message: `Dojaang '${confirmRow.name}' deleted` });
      reload();
    } catch (err) {
      setSnack({ open: true, severity: "error", message: err instanceof ApiError ? err.message : String(err) });
    } finally {
      endDelete(id);
      setConfirmRow(null);
    }
  };

  const cols = useMemo(() => [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "address", label: "Address" },
    {
      key: "actions",
      label: "Actions",
      render: (r: any) => (
        <div className="actions-cell">
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate(`/dojaangs/${r.id}`); }}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleRequestDelete(r); }} disabled={!!deleteLoadingMap[r.id]}>
            {deleteLoadingMap[r.id] ? <CircularProgress size={18} /> : <DeleteIcon fontSize="small" />}
          </IconButton>
        </div>
      ),
    },
  ], [navigate, deleteLoadingMap]);

  if (loading) return <div>Loading table</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div>
      <div className="mb-3 actions-row">
        <Button className="btn-margin" variant="outlined" size="small" onClick={() => reload()}>
          Refresh
        </Button>
        <Button variant="contained" size="small" onClick={() => navigate(`/dojaangs/new`)}>
          Create dojaang
        </Button>
      </div>
      <div className="table-container">
      <ApiTable
        rows={items}
        columns={cols}
        onRowClick={(r) => navigate(`/dojaangs/${r.id}`)}
        defaultPageSize={10}
        pageSizeOptions={[10, 25, 50]}
      />
      </div>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Dojaang</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{confirmRow?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={doDelete} startIcon={<DeleteIcon />}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ open: false })}>
        {snack.severity ? (
          <Alert severity={snack.severity} onClose={() => setSnack({ open: false })}>
            {snack.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </div>
  );
}
