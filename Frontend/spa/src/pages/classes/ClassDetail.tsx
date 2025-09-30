import React from "react";
import { Typography, Chip, Box } from "@mui/material";
import { GenericDetailPage } from "../../components/layout/GenericDetailPage";
import { DetailLayout } from "../../components/layout/DetailLayout";
import { fetchJson } from "../../lib/api";
import { tkdBrandColors, tkdStyling } from "../../styles/tkdBrandColors";
import { TrainingClassDto } from "../../types/api";

export default function ClassDetail() {
  const renderClassContent = (trainingClass: TrainingClassDto) => {
    const fields = [
      {
        label: "Class Name",
        value: (
          <Typography variant="body1" sx={tkdStyling.importantText}>
            {trainingClass.name}
          </Typography>
        ),
      },
      {
        label: "Schedule",
        value: trainingClass.schedule ? (
          <Chip
            label={trainingClass.schedule}
            sx={{
              backgroundColor: tkdBrandColors.blue.main,
              color: "white",
              fontWeight: 600,
              "& .MuiChip-label": { px: 2 },
            }}
            size="small"
          />
        ) : (
          <Typography variant="body1">Not specified</Typography>
        ),
      },
      {
        label: "Instructor",
        value: (
          <Typography
            variant="body1"
            sx={
              trainingClass.coachName ? tkdStyling.highlightedText : undefined
            }
          >
            {trainingClass.coachName || "Not assigned"}
          </Typography>
        ),
      },
      {
        label: "Dojaang",
        value: (
          <Typography variant="body1">
            {trainingClass.dojaangName || "Not specified"}
          </Typography>
        ),
      },
      {
        label: "Enrollment",
        value: (
          <Typography variant="body1">
            {trainingClass.enrolledStudentsCount || 0}
            {trainingClass.capacity && ` / ${trainingClass.capacity}`}
          </Typography>
        ),
      },
      {
        label: "Status",
        value: (
          <Chip label="Active" sx={tkdStyling.statusChip(true)} size="small" />
        ),
      },
    ];

    return (
      <DetailLayout
        sections={[
          {
            title: "Class Details",
            fields,
          },
        ]}
      />
    );
  };

  const handleDelete = async (trainingClass: TrainingClassDto) => {
    await fetchJson(`/api/Classes/${trainingClass.id}`, {
      method: "DELETE",
    });
  };

  return (
    <GenericDetailPage
      title="CLASS DETAILS"
      apiEndpoint="/api/Classes"
      backRoute="/classes"
      editRoute="/classes/edit/:id"
      renderContent={renderClassContent}
      onDelete={handleDelete}
    />
  );
}
