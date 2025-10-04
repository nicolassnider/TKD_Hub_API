import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Chip } from "@mui/material";
import { GenericListPage } from "../../components/layout/GenericListPage";

export default function EventsList() {
  const navigate = useNavigate();

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

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "NAME",
        sortable: true,
      },
      {
        key: "eventDate",
        label: "DATE",
        sortable: true,
        render: (event: any) => {
          const value = event.eventDate;
          return value ? new Date(value).toLocaleDateString() : "-";
        },
      },
      {
        key: "eventType",
        label: "TYPE",
        sortable: true,
        render: (event: any) => {
          const value = event.eventType;
          return (
            <Chip
              label={value}
              color={getEventTypeColor(value)}
              size="small"
              variant="outlined"
            />
          );
        },
      },
      {
        key: "location",
        label: "LOCATION",
        sortable: true,
      },
      {
        key: "isActive",
        label: "STATUS",
        render: (event: any) => {
          const value = event.isActive;
          return (
            <Chip
              label={value ? "Active" : "Inactive"}
              color={value ? "success" : "default"}
              size="small"
              variant={value ? "filled" : "outlined"}
            />
          );
        },
      },
    ],
    [],
  );

  const handleRowAction = (action: string, event: any) => {
    if (action === "view") {
      navigate(`/events/${event.id}`);
    }
  };

  return (
    <GenericListPage
      title="Events"
      apiEndpoint="/api/Events"
      columns={columns}
      createRoute="/events/new"
      serverSide={true}
      pageSize={10}
      onRowAction={handleRowAction}
    />
  );
}
