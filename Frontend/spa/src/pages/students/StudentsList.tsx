import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../context/RoleContext";
import { Button, Chip, Tooltip, CircularProgress, Box } from "@mui/material";
import { Edit, Delete, EmojiEvents } from "@mui/icons-material";
import { fetchJson } from "../../lib/api";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { GenericListPage } from "components/layout/GenericListPage";

export default function StudentsList() {
  const navigate = useNavigate();
  const { role } = useRole();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isAdmin = Array.isArray(role) && role.includes("Admin");

  const handleDelete = async (student: any) => {
    try {
      await fetchJson(`/api/Students/${student.id}`, {
        method: "DELETE",
      });
      // Reload will happen automatically via GenericListPage
      window.location.reload(); // Simple reload for now
    } catch (error) {
      console.error("Failed to delete student:", error);
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
            color={student.isActive ? "success" : "warning"}
            variant={student.isActive ? "filled" : "outlined"}
            size="small"
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
            <Tooltip title="View Details">
              <Button
                variant="text"
                size="small"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/students/${student.id}`);
                }}
                startIcon={<Edit fontSize="small" />}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                {!isSmall ? "DETAILS" : null}
              </Button>
            </Tooltip>
            <Tooltip title="Promote Student">
              <Button
                variant="text"
                size="small"
                color="warning"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/students/${student.id}/promote`);
                }}
                startIcon={<EmojiEvents fontSize="small" />}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                {!isSmall ? "PROMOTE" : null}
              </Button>
            </Tooltip>
            {isAdmin && (
              <Tooltip title="Delete Student">
                <Button
                  variant="text"
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      window.confirm(
                        "Are you sure you want to delete this student?",
                      )
                    ) {
                      handleDelete(student);
                    }
                  }}
                  startIcon={<Delete fontSize="small" />}
                  sx={{ textTransform: "none", borderRadius: 2 }}
                >
                  {!isSmall ? "DELETE" : null}
                </Button>
              </Tooltip>
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
    <GenericListPage
      title="Students"
      apiEndpoint="/api/Students"
      columns={columns}
      createRoute="/students/new"
      serverSide={true}
      pageSize={10}
      onRowAction={handleRowAction}
    />
  );
}
