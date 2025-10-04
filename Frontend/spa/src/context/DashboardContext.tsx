import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRole } from "./RoleContext";
import {
  DashboardLayout,
  DashboardWidget,
  DashboardRequest,
  DashboardResponse,
  DashboardPermissions,
  DashboardContextType,
  DashboardTemplates,
} from "../types/dashboard";
import { fetchJson, ApiError } from "../lib/api";

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
}) => {
  const [currentDashboard, setCurrentDashboard] =
    useState<DashboardLayout | null>(null);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<DashboardPermissions>({
    canView: true,
    canEdit: false,
    canCreate: false,
    canDelete: false,
    canShare: false,
    allowedWidgets: [],
  });

  const { token, role, hasRole } = useRole();

  const getAuthHeaders = useCallback(
    () => ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    [token],
  );

  const handleApiError = useCallback((error: any) => {
    console.error("Dashboard API Error:", error);
    if (error instanceof ApiError) {
      setError(error.message);
    } else {
      setError("An unexpected error occurred");
    }
  }, []);

  // Load dashboard data based on request parameters
  const loadDashboard = useCallback(
    async (request: DashboardRequest): Promise<void> => {
      if (!token) return;

      try {
        setLoading(true);
        setError(null);

        // Build query parameters
        const params = new URLSearchParams();
        if (request.layoutId) params.append("layoutId", request.layoutId);
        if (request.userRole) params.append("userRole", request.userRole);
        if (request.dateRange) {
          params.append("startDate", request.dateRange.start);
          params.append("endDate", request.dateRange.end);
        }
        if (request.filters) {
          params.append("filters", JSON.stringify(request.filters));
        }
        if (request.widgetIds) {
          params.append("widgetIds", request.widgetIds.join(","));
        }

        const response = (await fetchJson(
          `/api/Dashboards?${params.toString()}`,
          {
            headers: getAuthHeaders(),
          },
        )) as DashboardResponse;

        setCurrentDashboard(response.layout);
        setWidgets(response.widgets || []);

        // Set permissions based on user role
        setPermissions({
          canView: true,
          canEdit: hasRole("Admin") || hasRole("Coach"),
          canCreate: hasRole("Admin"),
          canDelete: hasRole("Admin"),
          canShare: hasRole("Admin") || hasRole("Coach"),
          allowedWidgets: getAllowedWidgets(role),
        });
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    },
    [token, getAuthHeaders, handleApiError, hasRole, role],
  );

  // Refresh a specific widget's data
  const refreshWidget = useCallback(
    async (widgetId: string): Promise<void> => {
      if (!token || !currentDashboard) return;

      try {
        const response = (await fetchJson(
          `/api/Dashboards/widgets/${widgetId}/data`,
          {
            method: "POST",
            headers: getAuthHeaders(),
          },
        )) as DashboardWidget;

        setWidgets((prev) =>
          (prev || []).map((widget) =>
            widget.id === widgetId ? { ...widget, ...response } : widget,
          ),
        );
      } catch (error) {
        handleApiError(error);
      }
    },
    [token, currentDashboard, getAuthHeaders, handleApiError],
  );

  // Refresh entire dashboard
  const refreshDashboard = useCallback(async (): Promise<void> => {
    if (!currentDashboard) return;

    const request: DashboardRequest = {
      layoutId: currentDashboard.id,
      userRole: role[0], // Use primary role
    };

    await loadDashboard(request);
  }, [currentDashboard, role, loadDashboard]);

  // Update widget position (for drag & drop)
  const updateWidgetPosition = useCallback(
    (widgetId: string, position: DashboardWidget["position"]) => {
      setWidgets((prev) =>
        (prev || []).map((widget) =>
          widget.id === widgetId ? { ...widget, position } : widget,
        ),
      );

      // Optionally persist to backend
      if (permissions.canEdit) {
        fetchJson(`/api/Dashboards/widgets/${widgetId}/position`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ position }),
        }).catch(handleApiError);
      }
    },
    [permissions.canEdit, getAuthHeaders, handleApiError],
  );

  // Add new widget
  const addWidget = useCallback(
    async (widget: Omit<DashboardWidget, "id">): Promise<void> => {
      if (!token || !permissions.canEdit) return;

      try {
        const response = (await fetchJson("/api/Dashboards/widgets", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            ...widget,
            dashboardId: currentDashboard?.id,
          }),
        })) as DashboardWidget;

        setWidgets((prev) => [...prev, response]);
      } catch (error) {
        handleApiError(error);
      }
    },
    [
      token,
      permissions.canEdit,
      currentDashboard,
      getAuthHeaders,
      handleApiError,
    ],
  );

  // Remove widget
  const removeWidget = useCallback(
    async (widgetId: string): Promise<void> => {
      if (!token || !permissions.canDelete) return;

      try {
        await fetchJson(`/api/Dashboards/widgets/${widgetId}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });

        setWidgets((prev) => prev.filter((widget) => widget.id !== widgetId));
      } catch (error) {
        handleApiError(error);
      }
    },
    [token, permissions.canDelete, getAuthHeaders, handleApiError],
  );

  // Update widget configuration
  const updateWidget = useCallback(
    async (
      widgetId: string,
      updates: Partial<DashboardWidget>,
    ): Promise<void> => {
      if (!token || !permissions.canEdit) return;

      try {
        const response = (await fetchJson(
          `/api/Dashboards/widgets/${widgetId}`,
          {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify(updates),
          },
        )) as DashboardWidget;

        setWidgets((prev) =>
          (prev || []).map((widget) =>
            widget.id === widgetId ? { ...widget, ...response } : widget,
          ),
        );
      } catch (error) {
        handleApiError(error);
      }
    },
    [token, permissions.canEdit, getAuthHeaders, handleApiError],
  );

  // Save dashboard layout
  const saveDashboardLayout = useCallback(
    async (layout: Omit<DashboardLayout, "id">): Promise<void> => {
      if (!token || !permissions.canCreate) return;

      try {
        const response = (await fetchJson("/api/Dashboards/layouts", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(layout),
        })) as DashboardLayout;

        setCurrentDashboard(response);
      } catch (error) {
        handleApiError(error);
      }
    },
    [token, permissions.canCreate, getAuthHeaders, handleApiError],
  );

  // Load pre-built template for specific role
  const loadDashboardTemplate = useCallback(
    async (roleKey: keyof DashboardTemplates): Promise<void> => {
      if (!token) return;

      try {
        setLoading(true);
        setError(null);

        const response = (await fetchJson(
          `/api/Dashboards/default/${roleKey}`,
          {
            headers: getAuthHeaders(),
          },
        )) as DashboardResponse;

        setCurrentDashboard(response.layout);
        setWidgets(response.widgets || []);

        // Set permissions based on user role
        setPermissions({
          canView: true,
          canEdit: hasRole("Admin") || hasRole("Coach"),
          canCreate: hasRole("Admin"),
          canDelete: hasRole("Admin"),
          canShare: hasRole("Admin") || hasRole("Coach"),
          allowedWidgets: [],
        });
      } catch (err) {
        console.error("Failed to load dashboard template:", err);
        setError(
          err instanceof ApiError
            ? err.message
            : "Failed to load dashboard template",
        );
      } finally {
        setLoading(false);
      }
    },
    [token, hasRole, getAuthHeaders],
  );

  // Update filters
  const updateFilters = useCallback(
    async (filters: Record<string, any>): Promise<void> => {
      if (!currentDashboard) return;

      const request: DashboardRequest = {
        layoutId: currentDashboard.id,
        filters,
      };

      await loadDashboard(request);
    },
    [currentDashboard, loadDashboard],
  );

  // Update date range
  const updateDateRange = useCallback(
    async (dateRange: DashboardRequest["dateRange"]): Promise<void> => {
      if (!currentDashboard) return;

      const request: DashboardRequest = {
        layoutId: currentDashboard.id,
        dateRange,
      };

      await loadDashboard(request);
    },
    [currentDashboard, loadDashboard],
  );

  // Helper function to get allowed widgets based on role
  const getAllowedWidgets = (userRole: string[]): string[] => {
    const primaryRole = userRole[0];

    switch (primaryRole) {
      case "Admin":
        return ["all"]; // Admins can use all widget types
      case "Coach":
        return [
          "chart",
          "metric",
          "list",
          "calendar",
          "progress",
          "table",
          "card",
        ];
      case "Student":
        return ["metric", "list", "calendar", "progress", "card"];
      default:
        return ["metric", "card"];
    }
  };

  const contextValue: DashboardContextType = {
    // State
    currentDashboard,
    widgets,
    loading,
    error,
    permissions,

    // Actions
    loadDashboard,
    refreshWidget,
    refreshDashboard,
    updateWidgetPosition,
    addWidget,
    removeWidget,
    updateWidget,
    saveDashboardLayout,
    loadDashboardTemplate,
    updateFilters,
    updateDateRange,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};
