import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Chip, Tooltip, Button } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { GenericListPage } from "../../components/layout/GenericListPage";

export default function ClassesList() {
  const navigate = useNavigate();

  const weekday = (n: number) => {
    const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return names[n] ?? String(n);
  };

  const columns = useMemo(
    () => [
      { key: "id", label: "ID", sortable: true },
      { key: "name", label: "NAME", sortable: true },
      {
        key: "dojaangName",
        label: "DOJAANG",
        render: (classItem: any) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {classItem.dojaangName ?? "-"}
          </Box>
        ),
      },
      {
        key: "coachName",
        label: "COACH",
        render: (classItem: any) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {classItem.coachName ?? "-"}
          </Box>
        ),
      },
      {
        key: "schedules",
        label: "SCHEDULES",
        render: (classItem: any) => {
          if (!classItem.schedules || !Array.isArray(classItem.schedules))
            return "-";

          const scheduleText = classItem.schedules
            .map((s: any) => {
              const day = typeof s.day === "number" ? weekday(s.day) : s.day;
              const start = s.startTime ?? "";
              const end = s.endTime ? `-${s.endTime}` : "";
              return `${day} ${start}${end}`.trim();
            })
            .join(", ");

          return (
            <Chip
              label={scheduleText}
              variant="outlined"
              size="small"
              sx={{
                maxWidth: "200px",
                borderColor: "#ff6b35",
                color: "#ff6b35",
                "&:hover": {
                  backgroundColor: "rgba(255, 107, 53, 0.08)",
                },
              }}
            />
          );
        },
      },
      {
        key: "actions",
        label: "ACTIONS",
        render: (classItem: any) => (
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
            <Tooltip title="View Details">
              <Button
                variant="outlined"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/classes/${classItem.id}`);
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
                <Visibility fontSize="small" />
              </Button>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [navigate],
  );

  const handleRowAction = (action: string, classItem: any) => {
    if (action === "view") {
      navigate(`/classes/${classItem.id}`);
    }
  };

  return (
    <GenericListPage
      title="Classes"
      apiEndpoint="/api/Classes"
      columns={columns}
      createRoute="/classes/new"
      serverSide={true}
      pageSize={10}
      onRowAction={handleRowAction}
    />
  );
}
