// Dashboard-related types and interfaces
export interface DashboardWidget {
  id: string;
  type:
    | "chart"
    | "metric"
    | "list"
    | "calendar"
    | "progress"
    | "table"
    | "card";
  title: string;
  description?: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  config: Record<string, any>;
  data?: any;
  loading?: boolean;
  error?: string | null;
}

export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  widgets: DashboardWidget[];
  isDefault?: boolean;
  userRole?: string;
}

export interface DashboardRequest {
  layoutId?: string;
  userRole?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: Record<string, any>;
  widgetIds?: string[];
}

export interface DashboardResponse {
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  metadata: {
    lastUpdated: string;
    totalUsers: number;
    totalClasses: number;
    totalStudents: number;
    [key: string]: any;
  };
}

// Widget-specific types
export interface ChartWidgetConfig {
  chartType: "line" | "bar" | "pie" | "doughnut" | "area";
  dataSource: string;
  xAxis?: string;
  yAxis?: string;
  series?: string[];
  colors?: string[];
}

export interface MetricWidgetConfig {
  metricType: "count" | "percentage" | "currency" | "duration";
  dataSource: string;
  aggregation: "sum" | "avg" | "count" | "min" | "max";
  comparison?: {
    enabled: boolean;
    period: "previous_period" | "previous_month" | "previous_year";
  };
  format?: {
    prefix?: string;
    suffix?: string;
    decimals?: number;
  };
}

export interface ListWidgetConfig {
  dataSource: string;
  itemTemplate: string;
  maxItems?: number;
  showViewAll?: boolean;
  linkPattern?: string;
}

export interface TableWidgetConfig {
  dataSource: string;
  columns: Array<{
    key: string;
    label: string;
    type: "text" | "number" | "date" | "badge" | "action";
    format?: string;
  }>;
  pagination?: boolean;
  sorting?: boolean;
  maxRows?: number;
}

// Dashboard permissions and roles
export interface DashboardPermissions {
  canView: boolean;
  canEdit: boolean;
  canCreate: boolean;
  canDelete: boolean;
  canShare: boolean;
  allowedWidgets: string[];
}

// Pre-built dashboard layouts for different roles
export type DashboardTemplates = {
  admin: DashboardLayout;
  coach: DashboardLayout;
  student: DashboardLayout;
  guest: DashboardLayout;
};

export interface DashboardContextType {
  // Current dashboard state
  currentDashboard: DashboardLayout | null;
  widgets: DashboardWidget[];
  loading: boolean;
  error: string | null;
  permissions: DashboardPermissions;

  // Dashboard actions
  loadDashboard: (request: DashboardRequest) => Promise<void>;
  refreshWidget: (widgetId: string) => Promise<void>;
  refreshDashboard: () => Promise<void>;
  updateWidgetPosition: (
    widgetId: string,
    position: DashboardWidget["position"],
  ) => void;
  addWidget: (widget: Omit<DashboardWidget, "id">) => Promise<void>;
  removeWidget: (widgetId: string) => Promise<void>;
  updateWidget: (
    widgetId: string,
    updates: Partial<DashboardWidget>,
  ) => Promise<void>;

  // Layout management
  saveDashboardLayout: (layout: Omit<DashboardLayout, "id">) => Promise<void>;
  loadDashboardTemplate: (role: keyof DashboardTemplates) => Promise<void>;

  // Data filtering
  updateFilters: (filters: Record<string, any>) => Promise<void>;
  updateDateRange: (dateRange: DashboardRequest["dateRange"]) => Promise<void>;
}
