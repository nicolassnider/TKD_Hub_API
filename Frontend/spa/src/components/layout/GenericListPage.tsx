import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../context/RoleContext";
import { usePaginatedItems } from "../../hooks/usePaginatedItem";

import { Button, Switch, FormControlLabel, Box } from "@mui/material";
import { Add } from "@mui/icons-material";
import { PageLayout } from "./PageLayout";
import { LoadingSpinner } from "components/common/LoadingSpinner";
import { ErrorAlert } from "components/common/ErrorAlert";
import { PaginatedTable } from "components/common/PaginatedTable";

interface GenericListPageProps {
  title: string;
  apiEndpoint: string;
  columns: any[];
  createRoute?: string;
  showInactiveFilter?: boolean;
  customActions?: React.ReactNode;
  customFilters?: React.ReactNode;
  onRowAction?: (action: string, item: any) => void;
  transformData?: (items: any[]) => any[];
  serverSide?: boolean; // Enable server-side pagination
  pageSize?: number; // Default page size for server-side pagination
}

export const GenericListPage: React.FC<GenericListPageProps> = ({
  title,
  apiEndpoint,
  columns,
  createRoute,
  showInactiveFilter = false,
  customActions,
  customFilters,
  onRowAction,
  transformData,
  serverSide = true, // Default to server-side pagination for better performance
  pageSize = 10,
}) => {
  const navigate = useNavigate();
  const { role, roleLoading } = useRole();
  const {
    items,
    loading,
    error,
    pagination,
    reload,
    setPage,
    setPageSize,
    setFilters,
  } = usePaginatedItems(apiEndpoint, {
    pageSize: serverSide ? pageSize : 1000, // Use large page size for client-side
  });
  const [showInactive, setShowInactive] = useState(false);

  // Set default showInactive based on admin role
  useEffect(() => {
    if (!roleLoading && showInactiveFilter) {
      const isAdmin = Array.isArray(role) && role.includes("Admin");
      setShowInactive(isAdmin);
    }
  }, [roleLoading, role, showInactiveFilter]);

  const isAdmin = Array.isArray(role) && role.includes("Admin");

  // Update filters when showInactive changes
  React.useEffect(() => {
    if (showInactiveFilter) {
      setFilters({ includeInactive: showInactive });
    }
  }, [showInactive, showInactiveFilter, setFilters]);

  // Filter items based on showInactive (for client-side filtering if needed)
  const filteredItems = React.useMemo(() => {
    let filtered = items;

    // Only do client-side filtering if server-side is disabled
    if (!serverSide && showInactiveFilter && !showInactive) {
      filtered = items.filter((item: any) => item.isActive !== false);
    }

    return transformData ? transformData(filtered) : filtered;
  }, [items, showInactive, showInactiveFilter, transformData, serverSide]);

  const actions = (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      {showInactiveFilter && (
        <FormControlLabel
          control={
            <Switch
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
            />
          }
          label="Show Inactive"
        />
      )}
      {customFilters}
      {createRoute && (
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate(createRoute)}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          ADD {title.slice(0, -1).toUpperCase()}{" "}
          {/* Remove 's' from plural title */}
        </Button>
      )}
      {customActions}
    </Box>
  );

  if (loading) {
    return (
      <PageLayout title={title} actions={actions}>
        <LoadingSpinner />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title={title} actions={actions}>
        <ErrorAlert error={error} />
      </PageLayout>
    );
  }

  return (
    <PageLayout title={title} actions={actions}>
      <PaginatedTable
        columns={columns}
        rows={filteredItems}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        serverSide={serverSide}
        onRowClick={
          onRowAction ? (item: any) => onRowAction("view", item) : undefined
        }
        pageSizeOptions={[5, 10, 25, 50]}
      />
    </PageLayout>
  );
};
