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
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        backgroundColor: "#1e1e1e",
        border: "1px solid #404040",
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
        position: "relative",
        "&:hover": {
          borderColor: "#ff6b35",
          boxShadow: "0 8px 32px rgba(255, 107, 53, 0.15)",
          transform: "translateY(-4px)",
          "& .widget-glow": {
            opacity: 1,
          },
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(90deg, #ff6b35 0%, #2196f3 100%)",
          opacity: 0.8,
        },
      }}
    >
      <CardHeader
        title={
          <Typography
            variant="subtitle1"
            component="h3"
            fontWeight={600}
            sx={{ color: "text.primary" }}
          >
            {widget.title}
          </Typography>
        }
        subheader={
          widget.description && (
            <Typography variant="caption" color="text.secondary">
              {widget.description}
            </Typography>
          )
        }
        action={
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {onRefresh && (
              <IconButton
                size="small"
                onClick={onRefresh}
                disabled={widget.loading}
                sx={{
                  opacity: 0.6,
                  "&:hover": { opacity: 1 },
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              size="small"
              sx={{
                opacity: 0.6,
                "&:hover": { opacity: 1 },
              }}
            >
              <MoreIcon fontSize="small" />
            </IconButton>
          </Box>
        }
        sx={{
          pb: 0.5,
          px: 2,
          pt: 1.5,
          "& .MuiCardHeader-content": {
            overflow: "hidden",
          },
        }}
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 3,
          px: 2,
          minHeight: 140,
          position: "relative",
          background:
            "linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(33, 150, 243, 0.05) 100%)",
        }}
      >
        {/* Background Glow Effect */}
        <Box
          className="widget-glow"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at center, rgba(255, 107, 53, 0.1) 0%, transparent 70%)",
            opacity: 0,
            transition: "opacity 0.3s ease-in-out",
          }}
        />

        {/* Main Value with enhanced styling */}
        <Typography
          variant="h2"
          component="div"
          fontWeight={800}
          sx={{
            fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
            background: "linear-gradient(45deg, #ff6b35 30%, #2196f3 70%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            mb: 1,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            position: "relative",
            zIndex: 1,
          }}
        >
          {data.unit === "$" ? "$" : ""}
          {formatValue(value)}
          {data.unit && data.unit !== "$" ? data.unit : ""}
        </Typography>

        {/* Subtitle */}
        {data.subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: previousValue ? 1 : 0,
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            {data.subtitle}
          </Typography>
        )}

        {/* Comparison indicator */}
        {previousValue > 0 && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={0.5}
            sx={{
              px: 1.5,
              py: 0.75,
              borderRadius: 1.5,
              position: "relative",
              zIndex: 1,
              backgroundColor: isFlat
                ? "rgba(158, 158, 158, 0.15)"
                : isPositive
                  ? "rgba(76, 175, 80, 0.15)"
                  : "rgba(244, 67, 54, 0.15)",
              border: `1px solid ${
                isFlat ? "#757575" : isPositive ? "#4caf50" : "#f44336"
              }`,
            }}
          >
            {isFlat ? (
              <FlatIcon sx={{ fontSize: 16, color: "#bdbdbd" }} />
            ) : isPositive ? (
              <TrendingUp sx={{ fontSize: 16, color: "#66bb6a" }} />
            ) : (
              <TrendingDown sx={{ fontSize: 16, color: "#ef5350" }} />
            )}
            <Typography
              variant="caption"
              sx={{
                color: isFlat ? "#bdbdbd" : isPositive ? "#66bb6a" : "#ef5350",
                fontWeight: 700,
                fontSize: "0.75rem",
              }}
            >
              {isFlat
                ? "No change"
                : `${isPositive ? "+" : ""}${change.toFixed(1)}%`}
            </Typography>
          </Box>
        )}

        {/* Target progress indicator */}
        {data.target && (
          <Box sx={{ mt: 2, width: "100%", maxWidth: 200 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 0.5,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {Math.round((value / data.target) * 100)}%
              </Typography>
            </Box>
            <Box
              sx={{
                width: "100%",
                height: 4,
                backgroundColor: "grey.200",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${Math.min((value / data.target) * 100, 100)}%`,
                  height: "100%",
                  backgroundColor: `${widget.config.color || "primary"}.main`,
                  borderRadius: 2,
                  transition: "width 0.5s ease",
                }}
              />
            </Box>
          </Box>
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
