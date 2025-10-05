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
    <Box 
      sx={{ 
        display: "flex", 
        gap: { xs: 1, sm: 1.5, md: 2 },
        alignItems: { xs: "stretch", sm: "center" },
        flexDirection: { xs: "column", sm: "row" },
        flexWrap: { sm: "wrap" },
        justifyContent: { xs: "stretch", sm: "flex-end" },
        width: { xs: "100%", sm: "auto" },
      }}
    >
      {/* Filters Section */}
      {(showInactiveFilter || customFilters) && (
        <Box 
          sx={{ 
            display: "flex",
            gap: { xs: 1, sm: 1.5 },
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: { sm: "wrap" },
            width: { xs: "100%", sm: "auto" },
            order: { xs: 2, sm: 1 },
          }}
        >
          {showInactiveFilter && (
            <FormControlLabel
              control={
                <Switch
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  size="small"
                  color="primary"
                />
              }
              label="Show Inactive"
              sx={{
                m: 0,
                "& .MuiFormControlLabel-label": {
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  fontWeight: 500,
                },
              }}
            />
          )}
          {customFilters}
        </Box>
      )}
      
      {/* Actions Section */}
      <Box 
        sx={{ 
          display: "flex", 
          gap: { xs: 1, sm: 1.5 }, 
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          width: { xs: "100%", sm: "auto" },
          order: { xs: 1, sm: 2 },
        }}
      >
        {customActions}
        {createRoute && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate(createRoute)}
            size="medium"
            sx={{ 
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 600,
              px: { xs: 2, sm: 3 },
              py: { xs: 1.5, sm: 1 },
              minHeight: { xs: 48, sm: "auto" },
              width: { xs: "100%", sm: "auto" },
              background: "linear-gradient(135deg, #ff6b35, #2196f3)",
              boxShadow: "0 4px 16px rgba(255, 107, 53, 0.3)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, #ff8a65, #42a5f5)",
                boxShadow: "0 8px 24px rgba(255, 107, 53, 0.4)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
              Add {title.slice(0, -1)}
            </Box>
            <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
              Add
            </Box>
          </Button>
        )}
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <PageLayout title={title} actions={actions}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "40vh",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <LoadingSpinner />
        </Box>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title={title} actions={actions}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "40vh",
            px: 2,
          }}
        >
          <ErrorAlert error={error} />
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={title} actions={actions}>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: { xs: 1, sm: 2 },
          overflow: "hidden",
          flex: 1,
        }}
      >
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
      </Box>
    </PageLayout>
  );
};
