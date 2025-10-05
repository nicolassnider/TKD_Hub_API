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
import { DashboardWidget, DashboardRequest } from "../types/dashboard";

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
      const primaryRole = role[0];
      const request: DashboardRequest = {
        userRole: primaryRole,
      };
      loadDashboard(request);
    }
  }, [role, loadDashboard]);

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

    switch (widget.type.toLowerCase()) {
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
    // Enhanced responsive grid sizing based on widget position and type
    const width = widget.position.width;
    const type = widget.type.toLowerCase();

    // Metric widgets (KPIs) - smaller, fit more per row
    if (type === "metric") {
      return { xs: 12, sm: 6, md: 3, lg: 3 };
    }

    // Chart widgets - larger, need more space
    if (type === "chart") {
      if (width >= 8) return { xs: 12, md: 12, lg: 12 };
      if (width >= 6) return { xs: 12, md: 6, lg: 6 };
      return { xs: 12, sm: 12, md: 6, lg: 4 };
    }

    // List and table widgets - medium to large
    if (type === "list" || type === "table") {
      if (width >= 8) return { xs: 12, md: 8, lg: 8 };
      return { xs: 12, sm: 6, md: 6, lg: 4 };
    }

    // Default responsive behavior
    if (width <= 3) return { xs: 12, sm: 6, md: 3, lg: 3 };
    if (width <= 4) return { xs: 12, sm: 6, md: 4, lg: 4 };
    if (width <= 6) return { xs: 12, sm: 12, md: 6, lg: 6 };
    if (width <= 8) return { xs: 12, md: 8, lg: 8 };
    return { xs: 12 };
  };

  if (loading && !currentDashboard) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="body1" color="text.secondary">
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Alert
          severity="error"
          sx={{
            width: "100%",
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={handleRefreshDashboard}
          startIcon={<RefreshIcon />}
          size="large"
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.default",
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: { xs: 3, sm: 4 },
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 3 },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              gutterBottom
              sx={{
                fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
                background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {currentDashboard?.name || "Dashboard"}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
                maxWidth: { xs: "100%", md: "600px" },
              }}
            >
              {currentDashboard?.description ||
                `Welcome to your ${role[0]?.toLowerCase()} dashboard`}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
              justifyContent: { xs: "flex-start", sm: "flex-end" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {/* Date Range Button */}
            <Button
              variant="outlined"
              startIcon={<DateRangeIcon />}
              size="medium"
              onClick={() => {
                console.log("Date range picker clicked");
              }}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
                px: 2,
                py: 1,
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              Last 30 Days
            </Button>

            {/* Action Buttons Group */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <IconButton
                onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
                size="medium"
                sx={{
                  borderRadius: 1.5,
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                <FilterIcon />
              </IconButton>

              <IconButton
                onClick={handleRefreshDashboard}
                disabled={loading}
                size="medium"
                sx={{
                  borderRadius: 1.5,
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>

            {/* Add Widget Button */}
            {permissions.canEdit && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                size="medium"
                onClick={() => {
                  console.log("Add widget clicked");
                }}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  boxShadow: 2,
                  "&:hover": {
                    boxShadow: 4,
                  },
                }}
              >
                Add Widget
              </Button>
            )}
          </Box>
        </Box>

        {/* Active Filters Display */}
        {Object.keys(activeFilters).length > 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 2,
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                mb: 1.5,
              }}
            >
              Active Filters
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {Object.entries(activeFilters).map(([key, value]) => (
                <Chip
                  key={key}
                  label={`${key}: ${value}`}
                  onDelete={() => {
                    const newFilters = { ...activeFilters };
                    delete newFilters[key];
                    handleFilterChange(newFilters);
                  }}
                  size="medium"
                  color="primary"
                  variant="outlined"
                  sx={{
                    borderRadius: 1.5,
                    "& .MuiChip-deleteIcon": {
                      fontSize: "1.1rem",
                      "&:hover": {
                        color: "error.main",
                      },
                    },
                  }}
                />
              ))}
              <Button
                size="small"
                color="error"
                onClick={() => handleFilterChange({})}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  minWidth: "auto",
                  px: 1.5,
                }}
              >
                Clear all
              </Button>
            </Box>
          </Paper>
        )}

        {/* Dashboard Grid */}
        {!widgets || widgets.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 6, md: 8 },
              textAlign: "center",
              borderRadius: 3,
              bgcolor: "background.paper",
              border: 2,
              borderColor: "divider",
              borderStyle: "dashed",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                maxWidth: 400,
                mx: "auto",
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1,
                }}
              >
                <AddIcon sx={{ fontSize: 32, color: "white" }} />
              </Box>
              <Typography
                variant="h5"
                color="text.primary"
                gutterBottom
                fontWeight={600}
              >
                No widgets configured
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3, textAlign: "center" }}
              >
                Start building your dashboard by adding some widgets to track
                your key metrics.
              </Typography>
              {permissions.canEdit && (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    console.log("Add first widget clicked");
                  }}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Add Your First Widget
                </Button>
              )}
            </Box>
          </Paper>
        ) : (
          <Box sx={{ flexGrow: 1 }}>
            {/* Metrics Row - KPI widgets */}
            {widgets?.some(
              (widget) => widget.type.toLowerCase() === "metric",
            ) && (
              <Box sx={{ mb: { xs: 4, md: 6 } }}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      fontSize: { xs: "1.25rem", md: "1.5rem" },
                      mb: 0.5,
                    }}
                  >
                    Key Metrics
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
                  >
                    Track your most important performance indicators
                  </Typography>
                </Box>
                <Grid
                  container
                  spacing={{ xs: 2, sm: 3, md: 3 }}
                  sx={{
                    "& .MuiGrid-item": {
                      display: "flex",
                      flexDirection: "column",
                    },
                  }}
                >
                  {widgets
                    ?.filter((widget) => widget.type.toLowerCase() === "metric")
                    .map((widget) => (
                      <Grid
                        item
                        {...getGridSize(widget)}
                        key={widget.id}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            transition:
                              "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              "& .MuiCard-root": {
                                boxShadow: (theme) => theme.shadows[8],
                              },
                            },
                          }}
                        >
                          {renderWidget(widget)}
                        </Box>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            )}

            {/* Charts and Other Widgets Section */}
            {widgets?.some(
              (widget) => widget.type.toLowerCase() !== "metric",
            ) && (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      fontSize: { xs: "1.25rem", md: "1.5rem" },
                      mb: 0.5,
                    }}
                  >
                    Analytics & Reports
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
                  >
                    Detailed insights and visual analytics
                  </Typography>
                </Box>
                <Grid
                  container
                  spacing={{ xs: 2, sm: 3, md: 4 }}
                  sx={{
                    "& .MuiGrid-item": {
                      display: "flex",
                      flexDirection: "column",
                    },
                  }}
                >
                  {widgets
                    ?.filter((widget) => widget.type.toLowerCase() !== "metric")
                    .map((widget) => (
                      <Grid
                        item
                        {...getGridSize(widget)}
                        key={widget.id}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            transition:
                              "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              "& .MuiCard-root": {
                                boxShadow: (theme) => theme.shadows[8],
                              },
                            },
                          }}
                        >
                          {renderWidget(widget)}
                        </Box>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            )}
          </Box>
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
    </Box>
  );
};

export default Dashboard;
