import React from "react";
import { Button, Chip } from "@mui/material";
import { Add } from "@mui/icons-material";
import { PageLayout } from "../../components/layout/PageLayout";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { ErrorAlert } from "../../components/common/ErrorAlert";
import { EmptyState } from "../../components/common/EmptyState";
import ApiTable from "../../components/common/ApiTable";
import { useApiItems } from "../../hooks/useApiItems";

export default function EventsList() {
  const { items: events, loading, error, reload } = useApiItems("/api/Events");

  const getEventTypeColor = (type: string) => {
    const colors: Record<
      string,
      | "default"
      | "primary"
      | "secondary"
      | "error"
      | "info"
      | "success"
      | "warning"
    > = {
      Tournament: "error",
      Seminar: "info",
      "Training Camp": "warning",
      Grading: "success",
      Social: "secondary",
      Other: "default",
    };
    return colors[type] || "default";
  };

  const columns = [
    {
      key: "name",
      label: "NAME",
      sortable: true,
    },
    {
      key: "eventDate",
      label: "DATE",
      sortable: true,
      render: (value: string) =>
        value ? new Date(value).toLocaleDateString() : "-",
    },
    {
      key: "eventType",
      label: "TYPE",
      sortable: true,
      render: (value: string) => (
        <Chip
          label={value}
          color={getEventTypeColor(value)}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      key: "location",
      label: "LOCATION",
      sortable: true,
    },
    {
      key: "isActive",
      label: "STATUS",
      render: (value: boolean) => (
        <Chip
          label={value ? "Active" : "Inactive"}
          color={value ? "success" : "default"}
          size="small"
          variant={value ? "filled" : "outlined"}
        />
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner message="Loading events..." />;
  }

  if (error) {
    return <ErrorAlert error={error} onRetry={reload} />;
  }

  return (
    <PageLayout
      title="EVENTS"
      actions={[
        <Button
          key="create"
          variant="contained"
          startIcon={<Add />}
          sx={{ textTransform: "none" }}
        >
          Create Event
        </Button>,
      ]}
    >
      {events.length === 0 ? (
        <EmptyState
          title="No Events Found"
          description="Events will appear here once they are created"
          actionLabel="Create Event"
          onAction={() => {
            // Navigate to create event
            console.log("Navigate to create event");
          }}
        />
      ) : (
        <ApiTable rows={events} columns={columns} />
      )}
    </PageLayout>
  );
}
