import React from "react";
import { Paper, Typography, Grid, Divider, Box } from "@mui/material";

interface DetailField {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
}

interface DetailSectionProps {
  title: string;
  fields: DetailField[];
}

export const DetailSection: React.FC<DetailSectionProps> = ({
  title,
  fields,
}) => (
  <Paper sx={{ p: 3, mb: 2 }}>
    <Typography
      variant="h6"
      gutterBottom
      sx={{ mb: 3, textTransform: "uppercase", fontWeight: 600 }}
    >
      {title}
    </Typography>
    <Grid container spacing={3}>
      {fields.map((field, index) => (
        <Grid item xs={12} md={field.fullWidth ? 12 : 6} key={index}>
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
            {field.label}
          </Typography>
          <Box sx={{ mb: 2 }}>{field.value}</Box>
          {index < fields.length - 1 && <Divider sx={{ my: 2 }} />}
        </Grid>
      ))}
    </Grid>
  </Paper>
);

interface DetailLayoutProps {
  sections: DetailSectionProps[];
  children?: React.ReactNode;
}

export const DetailLayout: React.FC<DetailLayoutProps> = ({
  sections,
  children,
}) => (
  <>
    {sections.map((section, index) => (
      <DetailSection key={index} {...section} />
    ))}
    {children}
  </>
);
