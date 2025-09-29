import React from "react";
import { fetchJson } from "../lib/api";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Box,
} from "@mui/material";
import { Restore } from "@mui/icons-material";
import { GenericDetailPage } from "components/layout/GenericDetailPage";

export default function CoachDetailNew() {
  const handleDelete = async (coach: any) => {
    await fetchJson(`/api/Coaches/${coach.id}`, {
      method: "DELETE",
    });
  };

  const handleReactivate = async (coach: any) => {
    try {
      // Try user-level reactivation first
      const userId =
        coach?.applicationUserId ?? coach?.userId ?? coach?.applicationUser?.id;
      if (userId) {
        await fetchJson(`/api/Users/${userId}/reactivate`, {
          method: "POST",
        });
      } else {
        // Fallback to coach endpoint
        await fetchJson(`/api/Coaches/${coach.id}/reactivate`, {
          method: "POST",
        });
      }
    } catch (error) {
      // Try PATCH as final fallback
      await fetchJson(`/api/Coaches/${coach.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: true }),
      });
    }
  };

  const renderContent = (coach: any) => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {coach.firstName} {coach.lastName}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Chip
                label={coach.isActive ? "Active" : "Inactive"}
                color={coach.isActive ? "success" : "default"}
                sx={{ mr: 1 }}
              />
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{coach.email || "N/A"}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1">
                  {coach.phoneNumber || "N/A"}
                </Typography>
              </Grid>

              {coach.dojaangName && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Dojaang
                  </Typography>
                  <Typography variant="body1">{coach.dojaangName}</Typography>
                </Grid>
              )}

              {coach.bio && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Bio
                  </Typography>
                  <Typography variant="body1">{coach.bio}</Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const customActions = (coach: any) => (
    <>
      {!coach.isActive && (
        <Button
          variant="contained"
          color="success"
          startIcon={<Restore />}
          onClick={() => handleReactivate(coach)}
        >
          Reactivate
        </Button>
      )}
    </>
  );

  const transformData = (data: any) => {
    // Handle API response structure
    return data?.coach ?? data?.data?.coach ?? data;
  };

  return (
    <GenericDetailPage
      title="Coach Details"
      apiEndpoint="/api/Coaches"
      backRoute="/coaches"
      editRoute="/coaches/:id/edit"
      renderContent={renderContent}
      customActions={customActions}
      onDelete={handleDelete}
      transformData={transformData}
    />
  );
}
