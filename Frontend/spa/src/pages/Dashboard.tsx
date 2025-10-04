import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  Paper,
  FormControl,
  Select,
  InputLabel,
  Chip,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  DateRange as DateRangeIcon,
  MoreVert as MoreIcon,
} from "@mui/icons-material";
import { useRole } from "../context/RoleContext";
import { useDashboard } from "../context/DashboardContext";
import {
  MetricWidget,
  ChartWidget,
  ListWidget,
  ProgressWidget,
  CardWidget,
} from "../components/dashboard/DashboardWidgets";
import { DashboardWidget } from "../types/dashboard";

const Dashboard: React.FC = () => {
  const { role, hasRole } = useRole();
  const {
    currentDashboard,
    widgets,
    loading,
    error,
    permissions,
    loadDashboard,
    refreshDashboard,
    loadDashboardTemplate,
    updateFilters,
    updateDateRange,
  } = useDashboard();

  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [selectedDateRange, setSelectedDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    // Load appropriate dashboard based on user role
    if (role.length > 0) {
      const primaryRole = role[0].toLowerCase();
      if (primaryRole === "admin") {
        loadDashboardTemplate("admin");
      } else if (primaryRole === "coach") {
        loadDashboardTemplate("coach");
      } else if (primaryRole === "student") {
        loadDashboardTemplate("student");
      } else {
        loadDashboardTemplate("guest");
      }
    }
  }, [role, loadDashboardTemplate]);

  const handleRefreshDashboard = () => {
    refreshDashboard();
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setSelectedDateRange({ start, end });
    if (start && end) {
      updateDateRange({
        start: start.toISOString(),
        end: end.toISOString(),
      });
    }
  };

  const handleFilterChange = (filters: Record<string, any>) => {
    setActiveFilters(filters);
    updateFilters(filters);
  };

  const renderWidget = (widget: DashboardWidget) => {
    const props = { widget, key: widget.id };

    switch (widget.type) {
      case "metric":
        return <MetricWidget {...props} />;
      case "chart":
        return <ChartWidget {...props} />;
      case "list":
        return <ListWidget {...props} />;
      case "progress":
        return <ProgressWidget {...props} />;
      case "card":
        return <CardWidget {...props} />;
      case "table":
        // Table widget implementation would go here
        return <CardWidget {...props} />;
      case "calendar":
        // Calendar widget implementation would go here
        return <CardWidget {...props} />;
      default:
        return <CardWidget {...props} />;
    }
  };

  const getGridSize = (widget: DashboardWidget) => {
    // Convert widget position to MUI Grid sizing
    const width = widget.position.width;
    if (width <= 4) return { xs: 12, sm: 6, md: 4 };
    if (width <= 6) return { xs: 12, sm: 6, md: 6 };
    if (width <= 8) return { xs: 12, md: 8 };
    return { xs: 12 };
  };

  if (loading && !currentDashboard) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={handleRefreshDashboard}
          startIcon={<RefreshIcon />}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            {currentDashboard?.name || "Dashboard"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {currentDashboard?.description ||
              `Welcome to your ${role[0]?.toLowerCase()} dashboard`}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
          {/* Date Range - Simple implementation for now */}
          <Button
            variant="outlined"
            startIcon={<DateRangeIcon />}
            size="small"
            onClick={() => {
              // TODO: Implement date range picker
              console.log("Date range picker clicked");
            }}
          >
            Date Range
          </Button>

          {/* Filter Button */}
          <IconButton
            onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
            size="small"
          >
            <FilterIcon />
          </IconButton>

          {/* Refresh Button */}
          <IconButton
            onClick={handleRefreshDashboard}
            disabled={loading}
            size="small"
          >
            <RefreshIcon />
          </IconButton>

          {/* Add Widget Button (for users with edit permissions) */}
          {permissions.canEdit && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              size="small"
              onClick={() => {
                // TODO: Implement add widget dialog
                console.log("Add widget clicked");
              }}
            >
              Add Widget
            </Button>
          )}
        </Box>
      </Box>

      {/* Active Filters Display */}
      {Object.keys(activeFilters).length > 0 && (
        <Box mb={3}>
          <Typography variant="subtitle2" gutterBottom>
            Active Filters:
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {Object.entries(activeFilters).map(([key, value]) => (
              <Chip
                key={key}
                label={`${key}: ${value}`}
                onDelete={() => {
                  const newFilters = { ...activeFilters };
                  delete newFilters[key];
                  handleFilterChange(newFilters);
                }}
                size="small"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Dashboard Grid */}
      {widgets.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            bgcolor: "grey.50",
            border: "2px dashed",
            borderColor: "grey.300",
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No widgets configured
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Start building your dashboard by adding some widgets
          </Typography>
          {permissions.canEdit && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                // TODO: Implement add widget dialog
                console.log("Add first widget clicked");
              }}
            >
              Add Your First Widget
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {widgets.map((widget) => (
            <Grid item {...getGridSize(widget)} key={widget.id}>
              {renderWidget(widget)}
            </Grid>
          ))}
        </Grid>
      )}

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
      >
        <MenuItem onClick={() => setFilterMenuAnchor(null)}>
          <Typography variant="body2">Filter options will be here</Typography>
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default Dashboard;
