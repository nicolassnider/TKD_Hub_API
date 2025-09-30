import React from "react";
import { Typography, Chip, Button } from "@mui/material";
import { GenericDetailPage } from "../components/layout/GenericDetailPage";
import { DetailLayout } from "../components/layout/DetailLayout";
import { fetchJson } from "../lib/api";
import { Restore } from "@mui/icons-material";

type Dojaang = {
  id: number;
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  headCoach?: string;
  isActive?: boolean;
};

// TKD Logo-inspired colors (Traditional Taekwondo colors)
const tkdColors = {
  primary: "#DC2626", // Red - representing courage and determination
  secondary: "#2563EB", // Blue - representing perseverance and wisdom
  accent: "#1F2937", // Dark Gray/Black - representing maturity and honor
  success: "#059669", // Green - representing growth and harmony
  warning: "#F59E0B", // Gold/Yellow - representing excellence
  neutral: "#6B7280", // Gray - representing balance
};

export default function DojaangDetail() {
  const renderDojaangContent = (dojaang: Dojaang) => {
    const fields = [
      {
        label: "Name",
        value: (
          <Typography
            variant="body1"
            sx={{ fontWeight: 500, color: tkdColors.accent }}
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
        label: "City",
        value: (
          <Typography variant="body1">
            {dojaang.city || "Not provided"}
          </Typography>
        ),
      },
      {
        label: "Phone",
        value: (
          <Typography variant="body1">
            {dojaang.phone || "Not provided"}
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
              fontWeight: dojaang.headCoach ? 500 : 400,
              color: dojaang.headCoach ? tkdColors.primary : "text.secondary",
            }}
          >
            {dojaang.headCoach || "Not assigned"}
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
                ? tkdColors.success
                : tkdColors.neutral,
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

  const customActions = (dojaang: Dojaang) => (
    <>
      {!dojaang.isActive && (
        <Button
          variant="contained"
          startIcon={<Restore />}
          onClick={() => handleReactivate(dojaang)}
          sx={{
            textTransform: "none",
            backgroundColor: tkdColors.success,
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

  const handleReactivate = async (dojaang: Dojaang) => {
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

  const handleDelete = async (dojaang: Dojaang) => {
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
