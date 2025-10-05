import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../context/RoleContext";
import { Button, Chip, Tooltip, CircularProgress, Box } from "@mui/material";
import { Edit, Delete, Restore } from "@mui/icons-material";
import { fetchJson } from "../../lib/api";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { GenericListPage } from "components/layout/GenericListPage";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";

export default function DojaangsList() {
  const navigate = useNavigate();
  const { role } = useRole();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isAdmin = Array.isArray(role) && role.includes("Admin");

  const [confirmationModal, setConfirmationModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ open: false, title: "", message: "", onConfirm: () => {} });

  const handleReactivate = async (dojaang: any) => {
    try {
      await fetchJson(`/api/Dojaangs/${dojaang.id}/reactivate`, {
        method: "POST",
      });
      // Reload will happen automatically via GenericListPage
      window.location.reload(); // Simple reload for now
    } catch (error) {
      console.error("Failed to reactivate dojaang:", error);
    }
  };

  const handleDeactivate = async (dojaang: any) => {
    try {
      await fetchJson(`/api/Dojaangs/${dojaang.id}`, {
        method: "DELETE",
      });
      // Reload will happen automatically via GenericListPage
      window.location.reload(); // Simple reload for now
    } catch (error) {
      console.error("Failed to deactivate dojaang:", error);
    }
  };

  const columns = useMemo(
    () => [
      { key: "name", label: "NAME", sortable: true },
      { key: "address", label: "ADDRESS", sortable: true },
      { key: "phoneNumber", label: "PHONE" },
      {
        key: "isActive",
        label: "STATUS",
        render: (dojaang: any) => (
          <Chip
            label={dojaang.isActive ? "Active" : "Inactive"}
            variant="outlined"
            size="small"
            sx={{
              borderColor: dojaang.isActive ? "#4caf50" : "#ff9800",
              color: dojaang.isActive ? "#4caf50" : "#ff9800",
              backgroundColor: dojaang.isActive
                ? "rgba(76, 175, 80, 0.08)"
                : "rgba(255, 152, 0, 0.08)",
              "&:hover": {
                backgroundColor: dojaang.isActive
                  ? "rgba(76, 175, 80, 0.12)"
                  : "rgba(255, 152, 0, 0.12)",
              },
            }}
          />
        ),
      },
      {
        key: "actions",
        label: "ACTIONS",
        render: (dojaang: any) => (
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
            {!dojaang.isActive ? (
              <Tooltip title="Reactivate Dojaang">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReactivate(dojaang);
                  }}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    borderColor: "#4caf50",
                    color: "#4caf50",
                    minWidth: 40,
                    width: 40,
                    height: 36,
                    padding: 0,
                    "&:hover": {
                      borderColor: "#ff6b35",
                      color: "#ff6b35",
                      backgroundColor: "rgba(255, 107, 53, 0.08)",
                    },
                  }}
                >
                  <Restore fontSize="small" />
                </Button>
              </Tooltip>
            ) : (
              <>
                <Tooltip title="View Details">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dojaangs/${dojaang.id}`);
                    }}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      borderColor: "#2196f3",
                      color: "#2196f3",
                      minWidth: 40,
                      width: 40,
                      height: 36,
                      padding: 0,
                      "&:hover": {
                        borderColor: "#ff6b35",
                        color: "#ff6b35",
                        backgroundColor: "rgba(255, 107, 53, 0.08)",
                      },
                    }}
                  >
                    <Edit fontSize="small" />
                  </Button>
                </Tooltip>
                {isAdmin && (
                  <Tooltip title="Deactivate Dojaang">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmationModal({
                          open: true,
                          title: "Deactivate Dojaang",
                          message: `Are you sure you want to deactivate "${dojaang.name}"? This will disable this training location from the system.`,
                          onConfirm: () => {
                            handleDeactivate(dojaang);
                            setConfirmationModal((prev) => ({
                              ...prev,
                              open: false,
                            }));
                          },
                        });
                      }}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        borderColor: "#f44336",
                        color: "#f44336",
                        minWidth: 40,
                        width: 40,
                        height: 36,
                        padding: 0,
                        "&:hover": {
                          borderColor: "#ff6b35",
                          color: "#ff6b35",
                          backgroundColor: "rgba(255, 107, 53, 0.08)",
                        },
                      }}
                    >
                      <Delete fontSize="small" />
                    </Button>
                  </Tooltip>
                )}
              </>
            )}
          </Box>
        ),
      },
    ],
    [navigate, isSmall, isAdmin],
  );

  const handleRowAction = (action: string, dojaang: any) => {
    if (action === "view") {
      navigate(`/dojaangs/${dojaang.id}`);
    }
  };

  return (
    <>
      <GenericListPage
        title="Dojaangs"
        apiEndpoint="/api/Dojaangs"
        columns={columns}
        createRoute="/dojaangs/new"
        showInactiveFilter={true}
        serverSide={true}
        pageSize={10}
        onRowAction={handleRowAction}
      />

      <ConfirmationModal
        open={confirmationModal.open}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText="Deactivate"
        cancelText="Cancel"
        severity="error"
        onConfirm={confirmationModal.onConfirm}
        onCancel={() =>
          setConfirmationModal((prev) => ({ ...prev, open: false }))
        }
      />
    </>
  );
}
