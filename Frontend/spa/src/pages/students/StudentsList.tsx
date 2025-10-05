import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../context/RoleContext";
import { Button, Chip, Tooltip, CircularProgress, Box } from "@mui/material";
import { Edit, Delete, EmojiEvents, Restore } from "@mui/icons-material";
import { fetchJson } from "../../lib/api";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { GenericListPage } from "components/layout/GenericListPage";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";

export default function StudentsList() {
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

  const handleReactivate = async (student: any) => {
    try {
      await fetchJson(`/api/Users/${student.id}/reactivate`, {
        method: "POST",
      });
      // Reload will happen automatically via GenericListPage
      window.location.reload(); // Simple reload for now
    } catch (error) {
      console.error("Failed to reactivate student:", error);
    }
  };

  const handleDeactivate = async (student: any) => {
    try {
      await fetchJson(`/api/Users/${student.id}`, {
        method: "DELETE",
      });
      // Reload will happen automatically via GenericListPage
      window.location.reload(); // Simple reload for now
    } catch (error) {
      console.error("Failed to deactivate student:", error);
    }
  };

  const columns = useMemo(
    () => [
      { key: "firstName", label: "FIRST NAME", sortable: true },
      { key: "lastName", label: "LAST NAME", sortable: true },
      {
        key: "isActive",
        label: "STATUS",
        render: (student: any) => (
          <Chip
            label={student.isActive ? "Active" : "Inactive"}
            size="small"
            sx={{
              fontWeight: 600,
              "& .MuiChip-label": {
                fontSize: "0.75rem",
              },
              ...(student.isActive
                ? {
                    backgroundColor: "rgba(76, 175, 80, 0.2)",
                    color: "#81c784",
                    border: "1px solid #4caf50",
                  }
                : {
                    backgroundColor: "rgba(255, 193, 7, 0.2)",
                    color: "#ffb74d",
                    border: "1px solid #ff9800",
                  }),
            }}
          />
        ),
      },
      { key: "email", label: "EMAIL", sortable: true },
      { key: "phoneNumber", label: "PHONE" },
      {
        key: "actions",
        label: "ACTIONS",
        render: (student: any) => (
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
            {!student.isActive ? (
              <Tooltip title="Reactivate Student">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReactivate(student);
                  }}
                  sx={{
                    textTransform: "none",
                    borderRadius: 1.5,
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
                      navigate(`/students/${student.id}`);
                    }}
                    sx={{
                      textTransform: "none",
                      borderRadius: 1.5,
                      borderColor: "#2196f3",
                      color: "#64b5f6",
                      minWidth: 40,
                      width: 40,
                      height: 36,
                      padding: 0,
                      "&:hover": {
                        borderColor: "#1976d2",
                        backgroundColor: "rgba(33, 150, 243, 0.08)",
                      },
                    }}
                  >
                    <Edit fontSize="small" />
                  </Button>
                </Tooltip>
                <Tooltip title="Promote Student">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/students/${student.id}/promote`);
                    }}
                    sx={{
                      textTransform: "none",
                      borderRadius: 1.5,
                      borderColor: "#ff9800",
                      color: "#ffb74d",
                      minWidth: 40,
                      width: 40,
                      height: 36,
                      padding: 0,
                      "&:hover": {
                        borderColor: "#f57c00",
                        backgroundColor: "rgba(255, 152, 0, 0.08)",
                      },
                    }}
                  >
                    <EmojiEvents fontSize="small" />
                  </Button>
                </Tooltip>
                {isAdmin && (
                  <Tooltip title="Deactivate Student">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmationModal({
                          open: true,
                          title: "Deactivate Student",
                          message: `Are you sure you want to deactivate ${student.firstName} ${student.lastName}? This action will disable their access to the system.`,
                          onConfirm: () => {
                            handleDeactivate(student);
                            setConfirmationModal((prev) => ({
                              ...prev,
                              open: false,
                            }));
                          },
                        });
                      }}
                      sx={{
                        textTransform: "none",
                        borderRadius: 1.5,
                        borderColor: "#f44336",
                        color: "#ef5350",
                        minWidth: 40,
                        width: 40,
                        height: 36,
                        padding: 0,
                        "&:hover": {
                          borderColor: "#d32f2f",
                          backgroundColor: "rgba(244, 67, 54, 0.08)",
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

  const handleRowAction = (action: string, student: any) => {
    if (action === "view") {
      navigate(`/students/${student.id}`);
    }
  };

  return (
    <>
      <GenericListPage
        title="Students"
        apiEndpoint="/api/Students"
        columns={columns}
        createRoute="/students/new"
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
