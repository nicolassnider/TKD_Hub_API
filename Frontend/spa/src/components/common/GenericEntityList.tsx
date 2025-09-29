import React, { ReactNode } from "react";
import { Box, Grid, Card, CardContent, Skeleton } from "@mui/material";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorAlert } from "./ErrorAlert";
import { EmptyState } from "./EmptyState";
import { EntityAction, EntityActions } from "components/layout/EntityActions";
import { EntityListHeader } from "components/layout";

interface GenericEntityListProps<T> {
  // Data
  items: T[];
  loading: boolean;
  error: string | null;

  // Header props
  title: string;
  onAdd?: () => void;
  addButtonText?: string;
  showInactiveFilter?: boolean;
  showInactive?: boolean;
  onShowInactiveChange?: (value: boolean) => void;
  totalCount?: number;
  activeCount?: number;

  // Item rendering
  renderItem: (item: T, index: number) => ReactNode;
  getItemActions?: (item: T) => EntityAction[];
  getItemKey: (item: T) => string | number;

  // Layout
  gridProps?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };

  // Empty state
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;

  // Loading skeleton count
  skeletonCount?: number;

  // Refresh
  onRefresh?: () => void;
}

export function GenericEntityList<T>({
  items,
  loading,
  error,
  title,
  onAdd,
  addButtonText,
  showInactiveFilter,
  showInactive,
  onShowInactiveChange,
  totalCount,
  activeCount,
  renderItem,
  getItemActions,
  getItemKey,
  gridProps = { xs: 12, md: 6, lg: 4 },
  emptyTitle = `No ${title.toLowerCase()} found`,
  emptyDescription,
  emptyActionLabel,
  skeletonCount = 6,
  onRefresh,
}: GenericEntityListProps<T>) {
  // Loading state (first time)
  if (loading && items.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <EntityListHeader
          title={title}
          onAdd={onAdd}
          addButtonText={addButtonText}
          showInactiveFilter={showInactiveFilter}
          showInactive={showInactive}
          onShowInactiveChange={onShowInactiveChange}
          totalCount={totalCount}
          activeCount={activeCount}
        />
        <Grid container spacing={3}>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <Grid item {...gridProps} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton
                    variant="text"
                    width="40%"
                    height={20}
                    sx={{ mt: 1 }}
                  />
                  <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
                  <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <Skeleton variant="rectangular" width={60} height={20} />
                    <Skeleton variant="rectangular" width={80} height={20} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, pb: 10 }}>
      <EntityListHeader
        title={title}
        onAdd={onAdd}
        addButtonText={addButtonText}
        showInactiveFilter={showInactiveFilter}
        showInactive={showInactive}
        onShowInactiveChange={onShowInactiveChange}
        totalCount={totalCount}
        activeCount={activeCount}
      />

      {/* Error state */}
      {error && (
        <ErrorAlert error={error} onRetry={onRefresh} retryLabel="Retry" />
      )}

      {/* Loading overlay */}
      {loading && items.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <LoadingSpinner message="Refreshing..." />
        </Box>
      )}

      {/* Empty state */}
      {!loading && !error && items.length === 0 && (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={emptyActionLabel || addButtonText}
          onAction={onAdd}
        />
      )}

      {/* Items grid */}
      {items.length > 0 && (
        <Grid container spacing={3}>
          {items.map((item, index) => (
            <Grid item {...gridProps} key={getItemKey(item)}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1, position: "relative" }}>
                  {/* Actions menu */}
                  {getItemActions && (
                    <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                      <EntityActions actions={getItemActions(item)} />
                    </Box>
                  )}

                  {renderItem(item, index)}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
