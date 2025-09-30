import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApiItems } from "../hooks/useApiItems";
import { Button, Box, Chip, Tooltip } from "@mui/material";
import { Add, Visibility } from "@mui/icons-material";
import { TrainingClassDto } from "types/api";
import { PageLayout } from "../components/layout/PageLayout";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorAlert } from "../components/common/ErrorAlert";
import { EmptyState } from "../components/common/EmptyState";
import ApiTable from "components/common/ApiTable";

export default function ClassesList() {
  return <ClassesTable />;
}

function ClassesTable() {
  const navigate = useNavigate();
  const {
    items: rows,
    loading,
    error,
    reload,
  } = useApiItems<TrainingClassDto>("/api/Classes");

  const weekday = (n: number) => {
    const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return names[n] ?? String(n);
  };

  const cols = useMemo(
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
              sx={{ maxWidth: "200px" }}
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
                variant="text"
                size="small"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/classes/${classItem.id}`);
                }}
                startIcon={<Visibility fontSize="small" />}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                DETAILS
              </Button>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [navigate],
  );

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
        onClick={() => navigate("/classes/new")}
        startIcon={<Add />}
        sx={{ textTransform: "none", borderRadius: 2 }}
      >
        ADD CLASS
      </Button>
    </Box>
  );

  if (loading) {
    return (
      <PageLayout title="Classes" actions={pageActions}>
        <LoadingSpinner />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Classes" actions={pageActions}>
        <ErrorAlert error={error} onRetry={() => reload()} />
      </PageLayout>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <PageLayout title="Classes" actions={pageActions}>
        <EmptyState
          title="No Classes Found"
          description="Create your first training class to get started."
          actionLabel="Create First Class"
          onAction={() => navigate("/classes/new")}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Classes" actions={pageActions}>
      <ApiTable
        rows={rows}
        columns={cols}
        onRowClick={(r) => navigate(`/classes/${r.id}`)}
        defaultPageSize={5}
        pageSizeOptions={[5, 10, 25]}
      />
    </PageLayout>
  );
}
