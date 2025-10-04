import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../context/RoleContext";
import { Button, Chip, Tooltip, CircularProgress, Box } from "@mui/material";
import { Edit, Delete, Restore } from "@mui/icons-material";
import { fetchJson } from "../../lib/api";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { GenericListPage } from "components/layout/GenericListPage";

export default function DojaangsList() {
  const navigate = useNavigate();
  const { role } = useRole();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isAdmin = Array.isArray(role) && role.includes("Admin");

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

  const handleDelete = async (dojaang: any) => {
    try {
      await fetchJson(`/api/Dojaangs/${dojaang.id}`, {
        method: "DELETE",
      });
      // Reload will happen automatically via GenericListPage
      window.location.reload(); // Simple reload for now
    } catch (error) {
      console.error("Failed to delete dojaang:", error);
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
            color={dojaang.isActive ? "success" : "warning"}
            variant={dojaang.isActive ? "filled" : "outlined"}
            size="small"
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
                  variant="text"
                  size="small"
                  color="success"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReactivate(dojaang);
                  }}
                  startIcon={<Restore fontSize="small" />}
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
                        if (
                          window.confirm(
                            "Are you sure you want to delete this dojaang?",
                          )
                        ) {
                          handleDelete(dojaang);
                        }
                      }}
                      startIcon={<Delete fontSize="small" />}
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
    [navigate, isSmall, isAdmin],
  );

  const handleRowAction = (action: string, dojaang: any) => {
    if (action === "view") {
      navigate(`/dojaangs/${dojaang.id}`);
    }
  };

  return (
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
  );
}
