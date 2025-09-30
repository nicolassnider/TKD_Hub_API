import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../context/RoleContext";
import { useApiItems } from "../../hooks/useApiItems";
import {
  Button,
  Switch,
  FormControlLabel,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import { Add, Edit, Delete, Restore } from "@mui/icons-material";
import { fetchJson, ApiError } from "../../lib/api";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PageLayout } from "../../components/layout/PageLayout";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { ErrorAlert } from "../../components/common/ErrorAlert";
import { EmptyState } from "../../components/common/EmptyState";
import ApiTable from "components/common/ApiTable";

export default function DojaangsList() {
  return <DojaangsTable />;
}

function DojaangsTable() {
  const { items, loading, error, reload } = useApiItems("/api/Dojaangs");
  const { role, roleLoading } = useRole();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [showInactive, setShowInactive] = useState<boolean>(false);
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

  // Set default showInactive based on admin role
  useEffect(() => {
    if (!roleLoading) {
      const isAdmin = Array.isArray(role) && role.includes("Admin");
      setShowInactive(isAdmin);
    }
  }, [roleLoading, role]);

  const isAdmin = Array.isArray(role) && role.includes("Admin");

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
        label: "NAME",
        sortable: true,
        render: (dojaang: any) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box component="span">{dojaang.name}</Box>
          </Box>
        ),
      },
      { key: "address", label: "ADDRESS" },
      {
        key: "isActive",
        label: "STATUS",
        render: (dojaang: any) => (
          <Chip
            label={isInactive(dojaang) ? "Inactive" : "Active"}
            color={isInactive(dojaang) ? "warning" : "success"}
            variant={isInactive(dojaang) ? "outlined" : "filled"}
            size="small"
          />
        ),
      },
      {
        key: "actions",
        label: "ACTIONS",
        render: (dojaang: any) => (
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
            {isInactive(dojaang) ? (
              <Tooltip title="Reactivate Dojaang">
                <Button
                  variant="text"
                  size="small"
                  color="success"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReactivateRow(dojaang);
                  }}
                  startIcon={
                    reactivateLoadingMap[dojaang.id] ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <Restore fontSize="small" />
                    )
                  }
                  disabled={!!reactivateLoadingMap[dojaang.id]}
                  sx={{ textTransform: "none", borderRadius: 2 }}
                >
                  {!isSmall ? "Reactivate" : null}
                </Button>
              </Tooltip>
            ) : (
              <>
                <Tooltip title="View Details">
                  <Button
                    variant="text"
                    size="small"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dojaangs/${dojaang.id}`);
                    }}
                    startIcon={<Edit fontSize="small" />}
                    sx={{ textTransform: "none", borderRadius: 2 }}
                  >
                    {!isSmall ? "DETAILS" : null}
                  </Button>
                </Tooltip>
                {isAdmin && (
                  <Tooltip title="Delete Dojaang">
                    <Button
                      variant="text"
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequestDelete(dojaang);
                      }}
                      startIcon={
                        deleteLoadingMap[dojaang.id] ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          <Delete fontSize="small" />
                        )
                      }
                      disabled={!!deleteLoadingMap[dojaang.id]}
                      sx={{ textTransform: "none", borderRadius: 2 }}
                    >
                      {!isSmall ? "DELETE" : null}
                    </Button>
                  </Tooltip>
                )}
              </>
            )}
          </Box>
        ),
      },
    ],
    [navigate, deleteLoadingMap, reactivateLoadingMap, isSmall, isAdmin],
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

  const pageActions = (
    <Box
      sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}
    >
      <Button
        variant="outlined"
        size="small"
        onClick={() => reload()}
        sx={{ textTransform: "none", borderRadius: 2 }}
      >
        REFRESH
      </Button>
      <Button
        variant="contained"
        size="small"
        onClick={() => navigate(`/dojaangs/new`)}
        startIcon={<Add />}
        sx={{ textTransform: "none", borderRadius: 2 }}
      >
        CREATE DOJAANG
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
    </Box>
  );

  if (loading) {
    return (
      <PageLayout title="Dojaangs" actions={pageActions}>
        <LoadingSpinner />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Dojaangs" actions={pageActions}>
        <ErrorAlert error={error} onRetry={() => reload()} />
      </PageLayout>
    );
  }

  if (!visibleItems || visibleItems.length === 0) {
    return (
      <PageLayout title="Dojaangs" actions={pageActions}>
        <EmptyState
          title="No Dojaangs Found"
          description={
            showInactive
              ? "No dojaangs available."
              : "No active dojaangs available."
          }
          actionLabel="Create First Dojaang"
          onAction={() => navigate("/dojaangs/new")}
        />
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout title="Dojaangs" actions={pageActions}>
        <ApiTable
          rows={visibleItems}
          columns={cols}
          onRowSelect={(r) => setSelectedId(r.id ?? null)}
          selectedRowId={selectedId}
          defaultPageSize={10}
          pageSizeOptions={[10, 25, 50]}
        />
      </PageLayout>

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
          <Button color="error" onClick={doDelete} startIcon={<Delete />}>
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
    </>
  );
}
