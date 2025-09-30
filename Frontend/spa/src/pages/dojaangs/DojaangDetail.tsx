import React from "react";
import { Typography, Chip, Button } from "@mui/material";
import { GenericDetailPage } from "../../components/layout/GenericDetailPage";
import { DetailLayout } from "../../components/layout/DetailLayout";
import { fetchJson } from "../../lib/api";
import { Restore } from "@mui/icons-material";
import { tkdBrandColors, tkdStyling } from "../../styles/tkdBrandColors";
import { DojaangDto } from "../../types/api";

// TKD brand colors are now imported from the centralized theme file

export default function DojaangDetail() {
  const renderDojaangContent = (dojaang: DojaangDto) => {
    const fields = [
      {
        label: "Name",
        value: (
          <Typography
            variant="body1"
            sx={{ fontWeight: 500, color: tkdBrandColors.black.main }}
          >
            {dojaang.name}
          </Typography>
        ),
      },
      {
        label: "Address",
        value: (
          <Typography variant="body1">
            {dojaang.address || "Not provided"}
          </Typography>
        ),
      },
      {
        label: "Location",
        value: (
          <Typography variant="body1">
            {dojaang.location || "Not provided"}
          </Typography>
        ),
      },
      {
        label: "Phone",
        value: (
          <Typography variant="body1">
            {dojaang.phoneNumber || "Not provided"}
          </Typography>
        ),
      },
      {
        label: "Email",
        value: (
          <Typography variant="body1">
            {dojaang.email || "Not provided"}
          </Typography>
        ),
      },
      {
        label: "Head Coach",
        value: (
          <Typography
            variant="body1"
            sx={{
              fontWeight: dojaang.coachName ? 500 : 400,
              color: dojaang.coachName
                ? tkdBrandColors.red.main
                : "text.secondary",
            }}
          >
            {dojaang.coachName || "Not assigned"}
          </Typography>
        ),
      },
      {
        label: "Korean Name",
        value: (
          <Typography variant="body1">
            {dojaang.koreanName || "Not provided"}
          </Typography>
        ),
      },
      {
        label: "Korean Name (Phonetic)",
        value: (
          <Typography variant="body1">
            {dojaang.koreanNamePhonetic || "Not provided"}
          </Typography>
        ),
      },
      {
        label: "Status",
        value: (
          <Chip
            label={dojaang.isActive ? "Active" : "Inactive"}
            sx={{
              backgroundColor: dojaang.isActive
                ? tkdBrandColors.success.main
                : tkdBrandColors.neutral.main,
              color: "white",
              fontWeight: 600,
              "& .MuiChip-label": {
                px: 2,
              },
            }}
            size="small"
          />
        ),
      },
    ];

    return (
      <DetailLayout
        sections={[
          {
            title: "Dojaang Details",
            fields,
          },
        ]}
      />
    );
  };

  const customActions = (dojaang: DojaangDto) => (
    <>
      {!dojaang.isActive && (
        <Button
          variant="contained"
          startIcon={<Restore />}
          onClick={() => handleReactivate(dojaang)}
          sx={{
            textTransform: "none",
            backgroundColor: tkdBrandColors.blue.main,
            "&:hover": {
              backgroundColor: "#047857", // Darker green on hover
            },
          }}
        >
          Reactivate Dojaang
        </Button>
      )}
    </>
  );

  const handleReactivate = async (dojaang: DojaangDto) => {
    try {
      await fetchJson(`/api/Dojaangs/${dojaang.id}/reactivate`, {
        method: "POST",
      });
    } catch (e: any) {
      // Fallback: try patch/update isActive=true
      await fetchJson(`/api/Dojaangs/${dojaang.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: true }),
      });
    }
  };

  const handleDelete = async (dojaang: DojaangDto) => {
    await fetchJson(`/api/Dojaangs/${dojaang.id}`, {
      method: "DELETE",
    });
  };

  return (
    <GenericDetailPage
      title="DOJAANG DETAILS"
      apiEndpoint="/api/Dojaangs"
      backRoute="/dojaangs"
      editRoute="/dojaangs/edit/:id"
      renderContent={renderDojaangContent}
      customActions={customActions}
      onDelete={handleDelete}
    />
  );
}
