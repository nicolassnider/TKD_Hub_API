import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Lock } from "@mui/icons-material";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        gap: 3,
      }}
    >
      <Lock sx={{ fontSize: 64, color: "var(--fg-muted)" }} />

      <Typography variant="h4" sx={{ fontWeight: 700, color: "var(--fg)" }}>
        Access Denied
      </Typography>

      <Typography
        variant="body1"
        sx={{ color: "var(--fg-muted)", maxWidth: 400 }}
      >
        You don't have permission to access this page. Please contact your
        administrator if you believe this is an error.
      </Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{
            borderColor: "var(--border)",
            color: "var(--fg)",
            "&:hover": {
              borderColor: "var(--primary)",
              backgroundColor: "var(--surface-hover)",
            },
          }}
        >
          Go Back
        </Button>

        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            backgroundColor: "var(--primary)",
            "&:hover": {
              backgroundColor: "var(--primary-600)",
            },
          }}
        >
          Go Home
        </Button>
      </Box>
    </Box>
  );
}
