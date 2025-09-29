import React from "react";
import { fetchJson } from "../lib/api";
import { TextField, Grid } from "@mui/material";
import { GenericFormPage } from "components/layout/GenericFormPage";

export default function CreateCoachNew() {
  const initialData = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    isActive: true,
  };

  const handleSubmit = async (data: any) => {
    await fetchJson("/api/Coaches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const validate = (data: any) => {
    const errors: Record<string, string> = {};

    if (!data.firstName?.trim()) {
      errors.firstName = "First name is required";
    }

    if (!data.lastName?.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!data.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Please enter a valid email address";
    }

    return errors;
  };

  const renderForm = (
    data: any,
    onChange: (data: any) => void,
    errors: any,
  ) => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="First Name"
          value={data.firstName || ""}
          onChange={(e) => onChange({ ...data, firstName: e.target.value })}
          error={!!errors.firstName}
          helperText={errors.firstName}
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Last Name"
          value={data.lastName || ""}
          onChange={(e) => onChange({ ...data, lastName: e.target.value })}
          error={!!errors.lastName}
          helperText={errors.lastName}
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={data.email || ""}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          error={!!errors.email}
          helperText={errors.email}
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Phone Number"
          value={data.phoneNumber || ""}
          onChange={(e) => onChange({ ...data, phoneNumber: e.target.value })}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
        />
      </Grid>
    </Grid>
  );

  return (
    <GenericFormPage
      title="Create Coach"
      apiEndpoint="/api/Coaches"
      backRoute="/coaches"
      renderForm={renderForm}
      initialData={initialData}
      onSubmit={handleSubmit}
      validate={validate}
    />
  );
}
