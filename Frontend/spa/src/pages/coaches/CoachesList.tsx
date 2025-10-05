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

export default function CoachesList() {
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

  const handleReactivate = async (coach: any) => {
    try {
      await fetchJson(`/api/Users/${coach.id}/reactivate`, {
        method: "POST",
      });
      // Reload will happen automatically via GenericListPage
      window.location.reload(); // Simple reload for now
    } catch (error) {
      console.error("Failed to reactivate coach:", error);
    }
  };

  const handleDeactivate = async (coach: any) => {
    try {
      await fetchJson(`/api/Users/${coach.id}`, {
        method: "DELETE",
      });
      // Reload will happen automatically via GenericListPage
      window.location.reload(); // Simple reload for now
    } catch (error) {
      console.error("Failed to deactivate coach:", error);
    }
  };

  const columns = useMemo(
    () => [
      { key: "firstName", label: "FIRST NAME", sortable: true },
      { key: "lastName", label: "LAST NAME", sortable: true },
      {
        key: "isActive",
        label: "STATUS",
        render: (coach: any) => (
          <Chip
            label={coach.isActive ? "Active" : "Inactive"}
            variant="outlined"
            size="small"
            sx={{
              borderColor: coach.isActive ? "#4caf50" : "#ff9800",
              color: coach.isActive ? "#4caf50" : "#ff9800",
              backgroundColor: coach.isActive
                ? "rgba(76, 175, 80, 0.08)"
                : "rgba(255, 152, 0, 0.08)",
              "&:hover": {
                backgroundColor: coach.isActive
                  ? "rgba(76, 175, 80, 0.12)"
                  : "rgba(255, 152, 0, 0.12)",
              },
            }}
          />
        ),
      },
      { key: "email", label: "EMAIL", sortable: true },
      { key: "phoneNumber", label: "PHONE" },
      {
        key: "actions",
        label: "ACTIONS",
        render: (coach: any) => (
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
            {!coach.isActive ? (
              <Tooltip title="Reactivate Coach">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReactivate(coach);
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
                      navigate(`/coaches/${coach.id}`);
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
                  <Tooltip title="Deactivate Coach">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmationModal({
                          open: true,
                          title: "Deactivate Coach",
                          message: `Are you sure you want to deactivate ${coach.firstName} ${coach.lastName}? This action will disable their access to the system.`,
                          onConfirm: () => {
                            handleDeactivate(coach);
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

  const handleRowAction = (action: string, coach: any) => {
    if (action === "view") {
      navigate(`/coaches/${coach.id}`);
    }
  };

  return (
    <>
      <GenericListPage
        title="Coaches"
        apiEndpoint="/api/Coaches"
        columns={columns}
        createRoute="/coaches/new"
        showInactiveFilter={true}
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
