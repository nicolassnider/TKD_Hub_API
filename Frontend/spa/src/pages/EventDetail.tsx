import React from "react";
import { Paper, Typography, Grid, Divider, Chip, Box } from "@mui/material";
import { GenericDetailPage } from "../components/layout/GenericDetailPage";
import { fetchJson } from "../lib/api";
import {
  tkdBrandColors,
  eventTypeColors,
  tkdStyling,
} from "../styles/tkdBrandColors";

type Event = {
  id: number;
  title: string;
  description?: string;
  eventDate?: string;
  eventType?: string;
  location?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  price?: number;
  isActive?: boolean;
};

export default function EventDetail() {
  const getEventTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      Tournament: eventTypeColors.tournament,
      Competition: eventTypeColors.competition,
      Seminar: eventTypeColors.seminar,
      "Training Camp": eventTypeColors.training,
      Grading: eventTypeColors.grading,
      Social: eventTypeColors.social,
      Other: tkdBrandColors.neutral.main,
    };
    return colorMap[type] || tkdBrandColors.neutral.main;
  };

  const renderEventContent = (event: Event) => (
    <Paper sx={{ p: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ mb: 3, textTransform: "uppercase", fontWeight: 600 }}
      >
        Event Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              mb: 1,
              textTransform: "uppercase",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
            }}
          >
            Title
          </Typography>
          <Typography
            variant="body1"
            sx={{ ...tkdStyling.importantText, mb: 2 }}
          >
            {event.title}
          </Typography>
          <Divider sx={{ my: 2 }} />
        </Grid>

        {event.description && (
          <Grid item xs={12}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 1,
                textTransform: "uppercase",
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
              }}
            >
              Description
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {event.description}
            </Typography>
            <Divider sx={{ my: 2 }} />
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              mb: 1,
              textTransform: "uppercase",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
            }}
          >
            Event Date
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {event.eventDate
              ? new Date(event.eventDate).toLocaleDateString()
              : "Not specified"}
          </Typography>
          <Divider sx={{ my: 2 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              mb: 1,
              textTransform: "uppercase",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
            }}
          >
            Event Type
          </Typography>
          <Box sx={{ mb: 2 }}>
            {event.eventType ? (
              <Chip
                label={event.eventType}
                sx={{
                  backgroundColor: getEventTypeColor(event.eventType),
                  color: "white",
                  fontWeight: 600,
                  "& .MuiChip-label": { px: 2 },
                }}
                size="small"
              />
            ) : (
              <Typography variant="body1">Not specified</Typography>
            )}
          </Box>
          <Divider sx={{ my: 2 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              mb: 1,
              textTransform: "uppercase",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
            }}
          >
            Location
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {event.location || "Not specified"}
          </Typography>
          <Divider sx={{ my: 2 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              mb: 1,
              textTransform: "uppercase",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
            }}
          >
            Participants
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {event.currentParticipants || 0}
            {event.maxParticipants && ` / ${event.maxParticipants}`}
          </Typography>
          <Divider sx={{ my: 2 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              mb: 1,
              textTransform: "uppercase",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
            }}
          >
            Price
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Chip
              label={event.price ? `$${event.price}` : "Free"}
              sx={{
                backgroundColor: event.price
                  ? tkdBrandColors.gold.main
                  : tkdBrandColors.success.main,
                color: "white",
                fontWeight: 600,
                "& .MuiChip-label": { px: 2 },
              }}
              size="small"
            />
          </Box>
          <Divider sx={{ my: 2 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              mb: 1,
              textTransform: "uppercase",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
            }}
          >
            Status
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Chip
              label={event.isActive ? "Active" : "Inactive"}
              sx={tkdStyling.statusChip(event.isActive ?? false)}
              size="small"
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  const handleDelete = async (event: Event) => {
    await fetchJson(`/api/Events/${event.id}`, {
      method: "DELETE",
    });
  };

  return (
    <GenericDetailPage
      title="EVENT DETAILS"
      apiEndpoint="/api/Events"
      backRoute="/events"
      editRoute="/events/edit/:id"
      renderContent={renderEventContent}
      onDelete={handleDelete}
    />
  );
}
