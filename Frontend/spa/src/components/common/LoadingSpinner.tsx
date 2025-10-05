import React from "react";
import { Box, CircularProgress, Typography, Fade } from "@mui/material";

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  variant?: "inline" | "centered" | "overlay";
  color?: "primary" | "secondary" | "inherit";
  thickness?: number;
  showMessage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  size = 40,
  variant = "centered",
  color = "primary",
  thickness = 4,
  showMessage = true,
}) => {
  if (variant === "overlay") {
    return (
      <Fade in timeout={300}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(2px)",
            zIndex: 1000,
            gap: 2,
          }}
        >
          <CircularProgress size={size} color={color} thickness={thickness} />
          {showMessage && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Fade>
    );
  }

  if (variant === "centered") {
    return (
      <Fade in timeout={300}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: { xs: 200, sm: 300 },
            gap: 2,
            p: 3,
          }}
        >
          <CircularProgress size={size} color={color} thickness={thickness} />
          {showMessage && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Fade>
    );
  }

  // Inline variant
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        py: 1,
      }}
    >
      <CircularProgress size={size} color={color} thickness={thickness} />
      {showMessage && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};
