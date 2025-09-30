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

export default function DojaangDetail() {
  const renderDojaangContent = (dojaang: Dojaang) => {
    const fields = [
      {
        label: "Name",
        value: <Typography variant="body1">{dojaang.name}</Typography>,
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
          <Typography variant="body1">
            {dojaang.headCoach || "Not assigned"}
          </Typography>
        ),
      },
      {
        label: "Status",
        value: (
          <Chip
            label={dojaang.isActive ? "Active" : "Inactive"}
            color={dojaang.isActive ? "success" : "default"}
            size="small"
            variant={dojaang.isActive ? "filled" : "outlined"}
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
          color="success"
          startIcon={<Restore />}
          onClick={() => handleReactivate(dojaang)}
          sx={{ textTransform: "none" }}
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
