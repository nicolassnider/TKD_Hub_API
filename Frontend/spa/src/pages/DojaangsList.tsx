import ApiTable from "components/common/ApiTable";
import { useApiItems } from "../hooks/useApiItems";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useRole } from "../context/RoleContext";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import { fetchJson, ApiError } from "../lib/api";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
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
      <h2 className="page-title">Dojaangs</h2>
      <DojaangsTable />
    </div>
  );
}

function DojaangsTable() {
  const { items, loading, error, reload } = useApiItems("/api/Dojaangs");
  const { role, roleLoading } = useRole();
  // Default showInactive=true for admins, false for others. If roleLoading, default to false until resolved.
  const [showInactive, setShowInactive] = useState<boolean>(() => false);

  // when roleLoading finishes, if user is admin set showInactive default to true
  useEffect(() => {
    if (!roleLoading) {
      const isAdmin = Array.isArray(role) && role.includes("Admin");
      setShowInactive(isAdmin);
    }
  }, [roleLoading, role]);

  // Compute isAdmin for use in render and useMemo
  const isAdmin = Array.isArray(role) && role.includes("Admin");

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmRow, setConfirmRow] = useState<any | null>(null);
  const [deleteLoadingMap, setDeleteLoadingMap] = useState<
    Record<string | number, boolean>
  >({});
  const [reactivateLoadingMap, setReactivateLoadingMap] = useState<
    Record<string | number, boolean>
  >({});
  const [snack, setSnack] = useState<{
    open: boolean;
    severity?: "success" | "error";
    message?: string;
  }>({ open: false });
  const [selectedId, setSelectedId] = useState<string | number | null>(null);

  // normalize check for inactive values from API (boolean false or numeric 0)
  const isInactive = useCallback((it: any) => {
    return it?.isActive === false || it?.isActive === 0;
  }, []);

  const startDelete = (id: string | number) =>
    setDeleteLoadingMap((m) => ({ ...m, [id]: true }));
  const endDelete = (id: string | number) =>
    setDeleteLoadingMap((m) => {
      const n = { ...m };
      delete n[id];
      return n;
    });

  const startReactivate = (id: string | number) =>
    setReactivateLoadingMap((m) => ({ ...m, [id]: true }));
  const endReactivate = (id: string | number) =>
    setReactivateLoadingMap((m) => {
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
      setSnack({
        open: true,
        severity: "success",
        message: `Dojaang '${confirmRow.name}' deleted`,
      });
      reload();
    } catch (err: any) {
      setSnack({
        open: true,
        severity: "error",
        message: err instanceof ApiError ? err.message : String(err),
      });
    } finally {
      endDelete(id);
      setConfirmRow(null);
    }
  };

  const handleReactivateRow = async (row: any) => {
    const id = row?.id;
    if (!id) return;
    startReactivate(id);
    try {
      try {
        await fetchJson(`/api/Dojaangs/${id}/reactivate`, { method: "POST" });
      } catch (e: any) {
        if (e instanceof ApiError && e.status === 404) {
          await fetchJson(`/api/Dojaangs/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: true }),
          });
        } else {
          throw e;
        }
      }
      setSnack({
        open: true,
        severity: "success",
        message: `Dojaang '${row.name}' reactivated`,
      });
      reload();
    } catch (err: any) {
      setSnack({
        open: true,
        severity: "error",
        message: err instanceof ApiError ? err.message : String(err),
      });
    } finally {
      endReactivate(id);
    }
  };

  const cols = useMemo(
    () => [
      { key: "id", label: "ID", sortable: true },
      {
        key: "name",
        label: "Name",
        sortable: true,
        render: (r: any) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box component="span">{r.name}</Box>
            {isInactive(r) ? (
              <Chip label="INACTIVE" color="warning" size="small" />
            ) : null}
          </Box>
        ),
      },
      { key: "address", label: "Address" },
      {
        key: "actions",
        label: "Actions",
        render: (r: any) => (
          <div className="actions-cell">
            {isInactive(r) ? (
              <Tooltip title={isSmall ? "Reactivate" : "Reactivate dojaang"}>
                <Button
                  variant="text"
                  size="small"
                  color="success"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReactivateRow(r);
                  }}
                  startIcon={
                    reactivateLoadingMap[r.id] ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <RestoreIcon fontSize="small" />
                    )
                  }
                  disabled={!!reactivateLoadingMap[r.id]}
                >
                  {!isSmall ? "Reactivate" : null}
                </Button>
              </Tooltip>
            ) : (
              <>
                <Tooltip title={isSmall ? "Details" : "Details"}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dojaangs/${r.id}`);
                    }}
                    startIcon={<EditIcon fontSize="small" />}
                  >
                    {!isSmall ? "Details" : null}
                  </Button>
                </Tooltip>
                <Tooltip title={isSmall ? "Delete" : "Delete"}>
                  <Button
                    variant="text"
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRequestDelete(r);
                    }}
                    startIcon={
                      deleteLoadingMap[r.id] ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <DeleteIcon fontSize="small" />
                      )
                    }
                    disabled={!!deleteLoadingMap[r.id]}
                  >
                    {!isSmall ? "Delete" : null}
                  </Button>
                </Tooltip>
              </>
            )}
          </div>
        ),
      },
    ],
    [navigate, deleteLoadingMap, reactivateLoadingMap, isSmall],
  );
  // Filter rows based on showInactive and admin privilege. Non-admins must never see inactive rows.
  const visibleItems = useMemo(() => {
    if (!items) return items;
    if (isAdmin) {
      return showInactive
        ? items
        : items.filter((it: any) => it.isActive !== false);
    }
    // not admin: always hide inactive
    return items.filter((it: any) => !isInactive(it));
  }, [items, showInactive, isAdmin]);

  if (loading) return <div>Loading table</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div>
      <div className="mb-3 actions-row">
        <Button
          className="btn-margin"
          variant="outlined"
          size="small"
          onClick={() => reload()}
        >
          Refresh
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate(`/dojaangs/new`)}
        >
          Create dojaang
        </Button>
        {isAdmin && (
          <FormControlLabel
            control={
              <Switch
                checked={showInactive}
                onChange={(_, v) => setShowInactive(v)}
              />
            }
            label={isSmall ? "Inactive" : "Show inactive dojaangs"}
          />
        )}
      </div>
      <div className="table-container">
        <ApiTable
          rows={visibleItems}
          columns={cols}
          onRowSelect={(r) => setSelectedId(r.id ?? null)}
          selectedRowId={selectedId}
          defaultPageSize={10}
          pageSizeOptions={[10, 25, 50]}
        />
      </div>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Dojaang</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{confirmRow?.name}"? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={doDelete} startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
    </div>
  );
}
