import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../context/RoleContext";
import { Button, Chip, Tooltip, CircularProgress, Box } from "@mui/material";
import { Edit, Delete, Restore } from "@mui/icons-material";
import { fetchJson } from "../lib/api";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { GenericListPage } from "components/layout/GenericListPage";

export default function CoachesList() {
  const navigate = useNavigate();
  const { role } = useRole();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isAdmin = Array.isArray(role) && role.includes("Admin");

  const handleReactivate = async (coach: any) => {
    try {
      await fetchJson(`/api/Coaches/${coach.id}/reactivate`, {
        method: "POST",
      });
      // Reload will happen automatically via GenericListPage
      window.location.reload(); // Simple reload for now
    } catch (error) {
      console.error("Failed to reactivate coach:", error);
    }
  };

  const handleDelete = async (coach: any) => {
    try {
      await fetchJson(`/api/Coaches/${coach.id}`, {
        method: "DELETE",
      });
      // Reload will happen automatically via GenericListPage
      window.location.reload(); // Simple reload for now
    } catch (error) {
      console.error("Failed to delete coach:", error);
    }
  };

  const columns = useMemo(
    () => [
      { key: "firstName", label: "First Name", sortable: true },
      { key: "lastName", label: "Last Name", sortable: true },
      {
        key: "isActive",
        label: "Status",
        render: (coach: any) => (
          <Chip
            label={coach.isActive ? "Active" : "Inactive"}
            color={coach.isActive ? "success" : "default"}
            size="small"
          />
        ),
      },
      { key: "email", label: "Email", sortable: true },
      { key: "phoneNumber", label: "Phone" },
      {
        key: "actions",
        label: "Actions",
        render: (coach: any) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            {!coach.isActive ? (
              <Tooltip title="Reactivate coach">
                <Button
                  variant="text"
                  size="small"
                  color="success"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReactivate(coach);
                  }}
                  startIcon={<Restore fontSize="small" />}
                >
                  {!isSmall ? "Reactivate" : null}
                </Button>
              </Tooltip>
            ) : (
              <>
                <Tooltip title="View details">
                  <Button
                    variant="text"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/coaches/${coach.id}`);
                    }}
                    startIcon={<Edit fontSize="small" />}
                  >
                    {!isSmall ? "Details" : null}
                  </Button>
                </Tooltip>
                {isAdmin && (
                  <Tooltip title="Delete coach">
                    <Button
                      variant="text"
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          window.confirm(
                            "Are you sure you want to delete this coach?",
                          )
                        ) {
                          handleDelete(coach);
                        }
                      }}
                      startIcon={<Delete fontSize="small" />}
                    >
                      {!isSmall ? "Delete" : null}
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
    <GenericListPage
      title="Coaches"
      apiEndpoint="/api/Coaches"
      columns={columns}
      createRoute="/coaches/new"
      showInactiveFilter={true}
      onRowAction={handleRowAction}
    />
  );
}
