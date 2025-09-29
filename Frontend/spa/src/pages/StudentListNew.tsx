import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Chip, Tooltip, Box } from "@mui/material";
import { Visibility, Delete, EmojiEvents } from "@mui/icons-material";
import { fetchJson } from "../lib/api";
import { GenericListPage } from "components/layout/GenericListPage";

export default function StudentsListNew() {
  const navigate = useNavigate();

  const handleDelete = async (student: any) => {
    try {
      await fetchJson(`/api/Students/${student.id}`, {
        method: "DELETE",
      });
      window.location.reload(); // Simple reload for now
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  const handlePromote = (student: any) => {
    // This would open a promotion dialog in the full implementation
    console.log("Promote student:", student);
  };

  const columns = useMemo(
    () => [
      { key: "firstName", label: "First Name", sortable: true },
      { key: "lastName", label: "Last Name", sortable: true },
      {
        key: "currentRank",
        label: "Current Rank",
        render: (student: any) => (
          <Chip
            label={student.currentRank || "No Rank"}
            color={student.currentRank ? "primary" : "default"}
            size="small"
          />
        ),
      },
      {
        key: "isActive",
        label: "Status",
        render: (student: any) => (
          <Chip
            label={student.isActive ? "Active" : "Inactive"}
            color={student.isActive ? "success" : "default"}
            size="small"
          />
        ),
      },
      { key: "email", label: "Email", sortable: true },
      { key: "phoneNumber", label: "Phone" },
      {
        key: "actions",
        label: "Actions",
        render: (student: any) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="View details">
              <Button
                variant="text"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/students/${student.id}`);
                }}
                startIcon={<Visibility fontSize="small" />}
              >
                View
              </Button>
            </Tooltip>
            <Tooltip title="Promote student">
              <Button
                variant="text"
                size="small"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePromote(student);
                }}
                startIcon={<EmojiEvents fontSize="small" />}
              >
                Promote
              </Button>
            </Tooltip>
            <Tooltip title="Delete student">
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
              >
                Delete
              </Button>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [navigate],
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
      showInactiveFilter={true}
      onRowAction={handleRowAction}
    />
  );
}
