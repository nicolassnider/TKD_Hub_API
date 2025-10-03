import React, { useState, useEffect } from "react";
import { PageLayout } from "../layout/PageLayout";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ErrorAlert } from "../common/ErrorAlert";
import { EmptyState } from "../common/EmptyState";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import { fetchJson } from "../../lib/api";
import { toast } from "react-toastify";
import { EventType, EventFormData, EventManagementDto } from "../../types/api";

const initialFormData: EventFormData = {
  title: "",
  description: "",
  eventDate: "",
  location: "",
  eventType: EventType.Tournament.toString(),
  maxParticipants: "",
  registrationDeadline: "",
  price: "",
  isActive: true,
};

const eventTypes = [
  { label: "General", value: EventType.General },
  { label: "Tournament", value: EventType.Tournament },
  { label: "Seminar", value: EventType.Seminar },
  { label: "Testing", value: EventType.Testing },
  { label: "Other", value: EventType.Other },
];

export default function EventsManagement() {
  const [events, setEvents] = useState<EventManagementDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventManagementDto | null>(
    null,
  );
  const [formData, setFormData] = useState<EventFormData>(initialFormData);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = (await fetchJson("/api/Events")) as EventManagementDto[];
      setEvents(data);
    } catch (error) {
      setError("Failed to load events");
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (event?: EventManagementDto) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        eventDate: event.eventDate.split("T")[0],
        location: event.location,
        eventType: event.eventType,
        maxParticipants: event.maxParticipants || "",
        registrationDeadline: event.registrationDeadline?.split("T")[0] || "",
        price: event.price || "",
        isActive: event.isActive,
      });
    } else {
      setEditingEvent(null);
      setFormData(initialFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEvent(null);
    setFormData(initialFormData);
  };

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const eventData = {
        ...formData,
        maxParticipants:
          formData.maxParticipants === ""
            ? null
            : Number(formData.maxParticipants),
        price: formData.price === "" ? null : Number(formData.price),
        registrationDeadline: formData.registrationDeadline || null,
      };

      if (editingEvent) {
        await fetchJson(`/api/Events/${editingEvent.id}`, {
          method: "PUT",
          body: JSON.stringify(eventData),
        });
        toast.success("Event updated successfully");
      } else {
        await fetchJson("/api/Events", {
          method: "POST",
          body: JSON.stringify(eventData),
        });
        toast.success("Event created successfully");
      }

      handleCloseDialog();
      loadEvents();
    } catch (error) {
      toast.error(
        editingEvent ? "Failed to update event" : "Failed to create event",
      );
      console.error("Error saving event:", error);
    }
  };

  const handleDelete = async (eventId: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await fetchJson(`/api/Events/${eventId}`, { method: "DELETE" });
      toast.success("Event deleted successfully");
      loadEvents();
    } catch (error) {
      toast.error("Failed to delete event");
      console.error("Error deleting event:", error);
    }
  };

  const getEventTypeColor = (type: string | number) => {
    const colors: Record<
      number,
      | "default"
      | "primary"
      | "secondary"
      | "error"
      | "info"
      | "success"
      | "warning"
    > = {
      [EventType.General]: "primary",
      [EventType.Tournament]: "error",
      [EventType.Seminar]: "info",
      [EventType.Testing]: "success",
      [EventType.Other]: "default",
    };
    const enumValue = typeof type === "string" ? parseInt(type) : type;
    return colors[enumValue] || "default";
  };

  const getEventTypeLabel = (type: string | number) => {
    const enumValue = typeof type === "string" ? parseInt(type) : type;
    const typeObj = eventTypes.find((t) => t.value === enumValue);
    return typeObj ? typeObj.label : "Unknown";
  };

  if (loading) {
    return <LoadingSpinner message="Loading events..." />;
  }

  if (error) {
    return <ErrorAlert error={error} onRetry={loadEvents} />;
  }

  return (
    <PageLayout
      title="EVENTS MANAGEMENT"
      actions={[
        <Button
          key="create"
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ textTransform: "none" }}
        >
          Create Event
        </Button>,
      ]}
    >
      {events.length === 0 ? (
        <EmptyState
          title="No Events Found"
          description="Get started by creating your first event"
          actionLabel="Create Event"
          onAction={() => handleOpenDialog()}
        />
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
          <Table
            sx={{
              "& .MuiTableRow-hover:hover": { backgroundColor: "action.hover" },
            }}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.50" }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  TITLE
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  DATE
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  TYPE
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  LOCATION
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  PARTICIPANTS
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  PRICE
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  STATUS
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                  }}
                >
                  ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{event.title}</TableCell>
                  <TableCell>
                    {new Date(event.eventDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getEventTypeLabel(event.eventType)}
                      color={getEventTypeColor(event.eventType)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>
                    {event.currentParticipants}
                    {event.maxParticipants && `/${event.maxParticipants}`}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={event.price ? `$${event.price}` : "Free"}
                      color={event.price ? "primary" : "success"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={event.isActive ? "Active" : "Inactive"}
                      color={event.isActive ? "success" : "default"}
                      size="small"
                      variant={event.isActive ? "filled" : "outlined"}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Edit Event">
                        <IconButton
                          onClick={() => handleOpenDialog(event)}
                          size="small"
                          sx={{
                            color: "primary.main",
                            "&:hover": { backgroundColor: "primary.50" },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Event">
                        <IconButton
                          onClick={() => handleDelete(event.id)}
                          size="small"
                          sx={{
                            color: "error.main",
                            "&:hover": { backgroundColor: "error.50" },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingEvent ? "Edit Event" : "Create New Event"}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Event Date"
              type="date"
              value={formData.eventDate}
              onChange={(e) => handleInputChange("eventDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
            />
            <TextField
              label="Location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              required
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={formData.eventType}
                onChange={(e) => handleInputChange("eventType", e.target.value)}
              >
                {eventTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value.toString()}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Max Participants"
              type="number"
              value={formData.maxParticipants}
              onChange={(e) =>
                handleInputChange("maxParticipants", e.target.value)
              }
              fullWidth
            />
            <TextField
              label="Registration Deadline"
              type="date"
              value={formData.registrationDeadline}
              onChange={(e) =>
                handleInputChange("registrationDeadline", e.target.value)
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.isActive ? "true" : "false"}
                onChange={(e) =>
                  handleInputChange("isActive", e.target.value === "true")
                }
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingEvent ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
}
