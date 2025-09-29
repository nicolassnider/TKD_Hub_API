import React from "react";
import { Box, Typography } from "@mui/material";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  children,
  actions,
  className = "",
}) => {
  return (
    <Box className={className} sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" className="page-title">
          {title}
        </Typography>
        {actions && <Box>{actions}</Box>}
      </Box>
      {children}
    </Box>
  );
};
