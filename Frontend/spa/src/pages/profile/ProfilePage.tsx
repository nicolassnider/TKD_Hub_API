import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  Tab,
  Tabs,
  Alert,
  Skeleton,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Class as ClassIcon,
  Payment as PaymentIcon,
  School as SchoolIcon,
  Groups as GroupsIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useProfile } from "../../context/ProfileContext";
import { useRole } from "../../context/RoleContext";

// We'll create these components in the next steps

import { CoachClassesSection } from "components/coaches/CoachClassesSection";
import { StudentClassSection } from "components/students/StudentClassSection";
import { PaymentSection } from "components/payments/PaymentSection";
import { TabPanelProps } from "../../types/api";

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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export const ProfilePage: React.FC = () => {
  const {
    profile,
    loading,
    error,
    profileStats,
    isCoach,
    isStudent,
    hasMultipleRoles,
    getDisplayName,
    getProfilePicture,
  } = useProfile();

  const { effectiveRole } = useRole();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Paid":
        return "success";
      case "Pending":
        return "warning";
      case "Overdue":
      case "Suspended":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Skeleton variant="circular" width={120} height={120} />
                <Skeleton
                  variant="text"
                  width={200}
                  height={32}
                  sx={{ mt: 2 }}
                />
                <Skeleton variant="text" width={150} height={24} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Skeleton variant="text" width={300} height={40} />
              <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Profile information not available</Alert>
      </Container>
    );
  }

  // Determine which tabs to show based on user roles
  const tabs = [];

  if (isCoach()) {
    tabs.push({ label: "My Classes", icon: <ClassIcon />, value: "coach" });
  }

  if (isStudent()) {
    tabs.push({ label: "My Class", icon: <SchoolIcon />, value: "student" });
    tabs.push({ label: "Payments", icon: <PaymentIcon />, value: "payments" });
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                src={getProfilePicture()}
                sx={{ width: 120, height: 120, mb: 2 }}
              >
                <PersonIcon sx={{ fontSize: 60 }} />
              </Avatar>

              <Typography
                variant="h5"
                component="h1"
                gutterBottom
                textAlign="center"
              >
                {getDisplayName()}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mb: 2,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {profile.roles.map((role) => (
                  <Chip
                    key={role}
                    label={role}
                    color={role === effectiveRole() ? "primary" : "default"}
                    size="small"
                  />
                ))}
              </Box>

              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Chip
                  label={profile.membershipStatus}
                  color={getStatusColor(profile.membershipStatus) as any}
                  size="small"
                />
              </Box>

              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditMode(true)}
                fullWidth
                sx={{ mt: 2 }}
              >
                Edit Profile
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Quick Stats */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>

              {profileStats && (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card variant="outlined" sx={{ textAlign: "center", p: 1 }}>
                      <Typography variant="h6" color="primary">
                        {profileStats.totalClasses}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {isCoach() ? "Classes Managed" : "Classes Enrolled"}
                      </Typography>
                    </Card>
                  </Grid>

                  {isCoach() && profileStats.totalStudents && (
                    <Grid item xs={6}>
                      <Card
                        variant="outlined"
                        sx={{ textAlign: "center", p: 1 }}
                      >
                        <Typography variant="h6" color="primary">
                          {profileStats.totalStudents}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total Students
                        </Typography>
                      </Card>
                    </Grid>
                  )}

                  {isStudent() && (
                    <Grid item xs={6}>
                      <Card
                        variant="outlined"
                        sx={{ textAlign: "center", p: 1 }}
                      >
                        <Typography variant="h6" color="primary">
                          {Math.round(profileStats.attendanceRate || 0)}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Attendance
                        </Typography>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              )}
            </Box>
          </Paper>

          {/* Contact Information */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body2">
                <strong>Email:</strong> {profile.email}
              </Typography>

              {profile.phoneNumber && (
                <Typography variant="body2">
                  <strong>Phone:</strong> {profile.phoneNumber}
                </Typography>
              )}

              {profile.dojaangName && (
                <Typography variant="body2">
                  <strong>Dojaang:</strong> {profile.dojaangName}
                </Typography>
              )}

              {profile.beltLevel && (
                <Typography variant="body2">
                  <strong>Belt Level:</strong> {profile.beltLevel}
                </Typography>
              )}

              <Typography variant="body2">
                <strong>Member Since:</strong>{" "}
                {formatDate(profile.membershipStartDate)}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: "fit-content" }}>
            {tabs.length > 0 && (
              <>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="profile tabs"
                  >
                    {tabs.map((tab, index) => (
                      <Tab
                        key={tab.value}
                        label={tab.label}
                        icon={tab.icon}
                        iconPosition="start"
                        id={`profile-tab-${index}`}
                        aria-controls={`profile-tabpanel-${index}`}
                      />
                    ))}
                  </Tabs>
                </Box>

                {/* Coach Classes Tab */}
                {isCoach() && (
                  <TabPanel
                    value={tabValue}
                    index={tabs.findIndex((t) => t.value === "coach")}
                  >
                    <CoachClassesSection />
                  </TabPanel>
                )}

                {/* Student Class Tab */}
                {isStudent() && (
                  <TabPanel
                    value={tabValue}
                    index={tabs.findIndex((t) => t.value === "student")}
                  >
                    <StudentClassSection />
                  </TabPanel>
                )}

                {/* Payments Tab */}
                {isStudent() && (
                  <TabPanel
                    value={tabValue}
                    index={tabs.findIndex((t) => t.value === "payments")}
                  >
                    <PaymentSection />
                  </TabPanel>
                )}
              </>
            )}

            {/* No Role-Specific Content */}
            {tabs.length === 0 && (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <PersonIcon
                  sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Welcome to Your Profile
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Complete your profile setup to access more features
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
