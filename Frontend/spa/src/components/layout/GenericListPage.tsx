import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../context/RoleContext";
import { useApiItems } from "../../hooks/useApiItems";

import { Button, Switch, FormControlLabel, Box } from "@mui/material";
import { Add } from "@mui/icons-material";
import { PageLayout } from "./PageLayout";
import { LoadingSpinner } from "components/common/LoadingSpinner";
import { ErrorAlert } from "components/common/ErrorAlert";
import ApiTable from "components/common/ApiTable";

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
}) => {
  const navigate = useNavigate();
  const { role, roleLoading } = useRole();
  const { items, loading, error, reload } = useApiItems(apiEndpoint);
  const [showInactive, setShowInactive] = useState(false);

  // Set default showInactive based on admin role
  useEffect(() => {
    if (!roleLoading && showInactiveFilter) {
      const isAdmin = Array.isArray(role) && role.includes("Admin");
      setShowInactive(isAdmin);
    }
  }, [roleLoading, role, showInactiveFilter]);

  const isAdmin = Array.isArray(role) && role.includes("Admin");

  // Filter items based on showInactive
  const filteredItems = React.useMemo(() => {
    let filtered = items;

    if (showInactiveFilter && !showInactive) {
      filtered = items.filter((item: any) => item.isActive !== false);
    }

    return transformData ? transformData(filtered) : filtered;
  }, [items, showInactive, showInactiveFilter, transformData]);

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
      <ApiTable
        columns={columns}
        rows={filteredItems}
        onRowClick={
          onRowAction ? (item: any) => onRowAction("view", item) : undefined
        }
      />
    </PageLayout>
  );
};
