import React, { ReactNode } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Breadcrumbs,
  Link,
  Skeleton,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorAlert } from "./ErrorAlert";
import { EntityAction, EntityActions } from "components/layout/EntityActions";

interface GenericEntityDetailProps<T> {
  // Data
  entity: T | null;
  loading: boolean;
  error: string | null;

  // Navigation
  backUrl: string;
  backLabel?: string;

  // Header
  title: string;
  subtitle?: string;

  // Breadcrumbs
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;

  // Actions
  actions?: EntityAction[];

  // Content
  children: ReactNode;

  // Loading skeleton
  showSkeleton?: boolean;

  // Refresh
  onRefresh?: () => void;
}

export function GenericEntityDetail<T>({
  entity,
  loading,
  error,
  backUrl,
  backLabel = "Back",
  title,
  subtitle,
  breadcrumbs,
  actions,
  children,
  showSkeleton = true,
  onRefresh,
}: GenericEntityDetailProps<T>) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(backUrl);
  };

  // Loading state
  if (loading && !entity && showSkeleton) {
    return (
      <Box sx={{ p: 3 }}>
        {/* Header skeleton */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" width="30%" height={32} />
            <Skeleton variant="text" width="50%" height={20} />
          </Box>
        </Box>

        {/* Content skeleton */}
        <Paper sx={{ p: 3 }}>
          <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="80%" height={20} />
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
        <IconButton onClick={handleBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs sx={{ mb: 1 }}>
              {breadcrumbs.map((crumb, index) => (
                <Link
                  key={index}
                  color="inherit"
                  href={crumb.href}
                  onClick={crumb.href ? undefined : (e) => e.preventDefault()}
                  sx={{ cursor: crumb.href ? "pointer" : "default" }}
                >
                  {crumb.label}
                </Link>
              ))}
            </Breadcrumbs>
          )}

          <Typography variant="h4" component="h1">
            {title}
          </Typography>

          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Actions */}
        {actions && actions.length > 0 && <EntityActions actions={actions} />}
      </Box>

      {/* Loading overlay */}
      {loading && entity && (
        <Box sx={{ mb: 2 }}>
          <LoadingSpinner message="Loading..." />
        </Box>
      )}

      {/* Error state */}
      {error && (
        <Box sx={{ mb: 2 }}>
          <ErrorAlert error={error} onRetry={onRefresh} retryLabel="Retry" />
        </Box>
      )}

      {/* Entity not found */}
      {!loading && !error && !entity && (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            {title} not found
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
            The requested {title.toLowerCase()} could not be found.
          </Typography>
        </Paper>
      )}

      {/* Content */}
      {entity && children}
    </Box>
  );
}
