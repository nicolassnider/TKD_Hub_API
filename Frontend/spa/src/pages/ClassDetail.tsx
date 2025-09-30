import React from "react";
import { Typography, Chip, Box } from "@mui/material";
import { GenericDetailPage } from "../components/layout/GenericDetailPage";
import { DetailLayout } from "../components/layout/DetailLayout";
import { fetchJson } from "../lib/api";
import { tkdBrandColors, tkdStyling } from "../styles/tkdBrandColors";

type TrainingClass = {
  id: number;
  className: string;
  schedule?: string;
  instructor?: string;
  dojaangName?: string;
  maxStudents?: number;
  currentEnrollment?: number;
  isActive?: boolean;
};

export default function ClassDetail() {
  const renderClassContent = (trainingClass: TrainingClass) => {
    const fields = [
      {
        label: "Class Name",
        value: (
          <Typography variant="body1" sx={tkdStyling.importantText}>
            {trainingClass.className}
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
              trainingClass.instructor ? tkdStyling.highlightedText : undefined
            }
          >
            {trainingClass.instructor || "Not assigned"}
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
            {trainingClass.currentEnrollment || 0}
            {trainingClass.maxStudents && ` / ${trainingClass.maxStudents}`}
          </Typography>
        ),
      },
      {
        label: "Status",
        value: (
          <Chip
            label={trainingClass.isActive ? "Active" : "Inactive"}
            sx={tkdStyling.statusChip(trainingClass.isActive ?? false)}
            size="small"
          />
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

  const handleDelete = async (trainingClass: TrainingClass) => {
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
