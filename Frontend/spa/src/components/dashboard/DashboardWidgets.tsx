import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  MoreVert as MoreIcon,
  TrendingUp,
  TrendingDown,
  Remove as FlatIcon,
} from "@mui/icons-material";
import { DashboardWidget } from "../../types/dashboard";
import { useDashboard } from "../../context/DashboardContext";

interface BaseWidgetProps {
  widget: DashboardWidget;
  onRefresh?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
}

export const BaseWidget: React.FC<
  BaseWidgetProps & { children: React.ReactNode }
> = ({ widget, children, onRefresh, onEdit, onRemove }) => {
  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" component="h3" fontWeight={600}>
            {widget.title}
          </Typography>
        }
        subheader={widget.description}
        action={
          <Box>
            {onRefresh && (
              <IconButton
                size="small"
                onClick={onRefresh}
                disabled={widget.loading}
              >
                <RefreshIcon />
              </IconButton>
            )}
            <IconButton size="small">
              <MoreIcon />
            </IconButton>
          </Box>
        }
        sx={{ pb: 1 }}
      />
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", pt: 0 }}
      >
        {widget.loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={120}
          >
            <CircularProgress size={40} />
          </Box>
        ) : widget.error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {widget.error}
          </Alert>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

// Metric Widget - Shows KPI numbers with trend indicators
export const MetricWidget: React.FC<{ widget: DashboardWidget }> = ({
  widget,
}) => {
  const { refreshWidget } = useDashboard();

  const handleRefresh = () => refreshWidget(widget.id);

  const data = widget.data || {};
  const value = data.value || 0;
  const previousValue = data.previousValue || 0;
  const change =
    previousValue !== 0 ? ((value - previousValue) / previousValue) * 100 : 0;
  const isPositive = change >= 0;
  const isFlat = Math.abs(change) < 1;

  const formatValue = (val: number) => {
    const config = widget.config;
    const prefix = config.format?.prefix || "";
    const suffix = config.format?.suffix || "";
    const decimals = config.format?.decimals || 0;

    return `${prefix}${val.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;
  };

  return (
    <BaseWidget widget={widget} onRefresh={handleRefresh}>
      <Box textAlign="center" py={2}>
        <Typography
          variant="h3"
          component="div"
          fontWeight={700}
          sx={{ color: "primary.main", mb: 1 }}
        >
          {formatValue(value)}
        </Typography>

        {widget.config.comparison?.enabled && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={0.5}
          >
            {isFlat ? (
              <FlatIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            ) : isPositive ? (
              <TrendingUp sx={{ fontSize: 16, color: "success.main" }} />
            ) : (
              <TrendingDown sx={{ fontSize: 16, color: "error.main" }} />
            )}
            <Typography
              variant="body2"
              sx={{
                color: isFlat
                  ? "text.secondary"
                  : isPositive
                    ? "success.main"
                    : "error.main",
                fontWeight: 600,
              }}
            >
              {isFlat ? "No change" : `${Math.abs(change).toFixed(1)}%`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              vs {widget.config.comparison.period.replace("_", " ")}
            </Typography>
          </Box>
        )}

        {data.subtitle && (
          <Typography variant="body2" color="text.secondary" mt={1}>
            {data.subtitle}
          </Typography>
        )}
      </Box>
    </BaseWidget>
  );
};

// Chart Widget - Will integrate with charting library
export const ChartWidget: React.FC<{ widget: DashboardWidget }> = ({
  widget,
}) => {
  const { refreshWidget } = useDashboard();

  const handleRefresh = () => refreshWidget(widget.id);

  return (
    <BaseWidget widget={widget} onRefresh={handleRefresh}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight={200}
        bgcolor="grey.50"
        borderRadius={1}
      >
        <Typography color="text.secondary">
          Chart visualization will be implemented here
        </Typography>
      </Box>
    </BaseWidget>
  );
};

// List Widget - Shows a list of items
export const ListWidget: React.FC<{ widget: DashboardWidget }> = ({
  widget,
}) => {
  const { refreshWidget } = useDashboard();

  const handleRefresh = () => refreshWidget(widget.id);

  const items = widget.data?.items || [];
  const maxItems = widget.config.maxItems || 5;
  const displayItems = items.slice(0, maxItems);

  return (
    <BaseWidget widget={widget} onRefresh={handleRefresh}>
      <Box>
        {displayItems.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={3}>
            No items to display
          </Typography>
        ) : (
          displayItems.map((item: any, index: number) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              py={1}
              borderBottom={
                index < displayItems.length - 1 ? "1px solid" : "none"
              }
              borderColor="divider"
            >
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {item.title || item.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.subtitle || item.description}
                </Typography>
              </Box>
              {item.value && (
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="primary.main"
                >
                  {item.value}
                </Typography>
              )}
            </Box>
          ))
        )}

        {widget.config.showViewAll && items.length > maxItems && (
          <Box textAlign="center" mt={2}>
            <Typography
              variant="body2"
              color="primary.main"
              sx={{
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              View all {items.length} items
            </Typography>
          </Box>
        )}
      </Box>
    </BaseWidget>
  );
};

// Progress Widget - Shows progress bars or circular progress
export const ProgressWidget: React.FC<{ widget: DashboardWidget }> = ({
  widget,
}) => {
  const { refreshWidget } = useDashboard();

  const handleRefresh = () => refreshWidget(widget.id);

  const data = widget.data || {};
  const progress = Math.min(Math.max(data.progress || 0, 0), 100);
  const target = data.target || 100;
  const current = data.current || 0;

  return (
    <BaseWidget widget={widget} onRefresh={handleRefresh}>
      <Box textAlign="center" py={2}>
        <Box position="relative" display="inline-flex" mb={2}>
          <CircularProgress
            variant="determinate"
            value={progress}
            size={120}
            thickness={6}
            sx={{
              color:
                progress >= 80
                  ? "success.main"
                  : progress >= 50
                    ? "warning.main"
                    : "error.main",
            }}
          />
          <Box
            position="absolute"
            top={0}
            left={0}
            bottom={0}
            right={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Typography variant="h6" fontWeight={700}>
              {progress.toFixed(0)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Complete
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {current} of {target} {data.unit || ""}
        </Typography>

        {data.timeRemaining && (
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mt={1}
          >
            {data.timeRemaining} remaining
          </Typography>
        )}
      </Box>
    </BaseWidget>
  );
};

// Card Widget - Generic information card
export const CardWidget: React.FC<{ widget: DashboardWidget }> = ({
  widget,
}) => {
  const { refreshWidget } = useDashboard();

  const handleRefresh = () => refreshWidget(widget.id);

  const data = widget.data || {};

  return (
    <BaseWidget widget={widget} onRefresh={handleRefresh}>
      <Box py={1}>
        {data.content ? (
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {data.content}
          </Typography>
        ) : (
          <Typography color="text.secondary" textAlign="center" py={3}>
            No content available
          </Typography>
        )}

        {data.actions && (
          <Box mt={2} display="flex" gap={1} flexWrap="wrap">
            {data.actions.map((action: any, index: number) => (
              <Typography
                key={index}
                variant="body2"
                color="primary.main"
                sx={{
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {action.label}
              </Typography>
            ))}
          </Box>
        )}
      </Box>
    </BaseWidget>
  );
};
