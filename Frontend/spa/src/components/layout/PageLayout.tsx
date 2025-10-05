import React from "react";
import { Box, Typography, Container, Paper } from "@mui/material";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  subtitle?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  withContainer?: boolean;
  elevation?: number;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  children,
  actions,
  className = "",
  subtitle,
  maxWidth = "xl",
  withContainer = true,
  elevation = 0,
}) => {
  const content = (
    <Box 
      className={className} 
      sx={{ 
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 2, sm: 3, md: 4 },
        minHeight: "100%",
        backgroundColor: "background.default",
      }}
    >
      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: { xs: 3, sm: 4 },
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            className="page-title"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
              background: "linear-gradient(45deg, #ff6b35 30%, #2196f3 70%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: subtitle ? 0.5 : 0,
              letterSpacing: "-0.025em",
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: "0.875rem", sm: "1rem" },
                mt: 0.5,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {actions && (
          <Box 
            sx={{ 
              flexShrink: 0,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {actions}
          </Box>
        )}
      </Box>

      {/* Page Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0, // Allow content to shrink
        }}
      >
        {elevation > 0 ? (
          <Paper
            elevation={elevation}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {children}
          </Paper>
        ) : (
          children
        )}
      </Box>
    </Box>
  );

  if (withContainer) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
        <Container maxWidth={maxWidth} sx={{ px: 0 }}>
          {content}
        </Container>
      </Box>
    );
  }

  return content;
};
