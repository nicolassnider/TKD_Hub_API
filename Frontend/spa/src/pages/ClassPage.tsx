import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Tab, Tabs, Fade, Alert } from "@mui/material";
import {
  Add as AddIcon,
  Class as ClassIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useClassContext } from "../context/ClassContext";
import { useRole } from "../context/RoleContext";
import { ClassList } from "../components/classes/ClassList";
import { EnhancedClassForm } from "../components/EnhancedClassForm";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...other
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`class-tabpanel-${index}`}
      aria-labelledby={`class-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={value === index} timeout={300}>
          <Box sx={{ py: 3 }}>{children}</Box>
        </Fade>
      )}
    </div>
  );
};

export const ClassPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { effectiveRole } = useRole();
  const { classes, loading, error, fetchClasses } = useClassContext();

  const [tabValue, setTabValue] = useState(0);
  const [formOpen, setFormOpen] = useState(false);

  // Extract tab from URL or default to 0
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");

    switch (tab) {
      case "list":
        setTabValue(0);
        break;
      case "schedule":
        setTabValue(1);
        break;
      default:
        setTabValue(0);
    }
  }, [location.search]);

  // Fetch classes on component mount
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);

    // Update URL without causing navigation
    const searchParams = new URLSearchParams(location.search);
    switch (newValue) {
      case 0:
        searchParams.set("tab", "list");
        break;
      case 1:
        searchParams.set("tab", "schedule");
        break;
      default:
        searchParams.delete("tab");
    }

    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

  const handleCreateClass = () => {
    setFormOpen(true);
  };

  const canCreateClass =
    effectiveRole() === "Admin" || effectiveRole() === "Teacher";

  // Schedule view helper (for future implementation)
  const ScheduleView: React.FC = () => {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <ScheduleIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Schedule View Coming Soon
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Calendar view of all class schedules will be available here
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <ClassIcon sx={{ fontSize: 32, color: "primary.main" }} />
          <Box>
            <Typography variant="h4" component="h1">
              Training Classes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage classes, schedules, and student assignments
            </Typography>
          </Box>
        </Box>
        {canCreateClass && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClass}
          >
            New Class
          </Button>
        )}
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 0 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="class management tabs"
        >
          <Tab
            label="Classes"
            icon={<ClassIcon />}
            iconPosition="start"
            id="class-tab-0"
            aria-controls="class-tabpanel-0"
          />
          <Tab
            label="Schedule View"
            icon={<ScheduleIcon />}
            iconPosition="start"
            id="class-tab-1"
            aria-controls="class-tabpanel-1"
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <ClassList />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <ScheduleView />
      </TabPanel>

      {/* Create Class Form */}
      <EnhancedClassForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        mode="create"
      />
    </Box>
  );
};
