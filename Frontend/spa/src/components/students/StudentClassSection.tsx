import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  LinearProgress,
} from "@mui/material";
import {
  School as SchoolIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Payment as PaymentIcon,
  Groups as GroupsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../context/ProfileContext";
import { DAYS_OF_WEEK } from "../../types/classes";

export const StudentClassSection: React.FC = () => {
  const navigate = useNavigate();
  const { enrolledClass, nextPayment, profile, profileStats, loading, error } =
    useProfile();

  const formatScheduleDisplay = (schedules: any[]) => {
    if (!schedules || schedules.length === 0) return "No schedule set";

    return schedules
      .map((schedule) => {
        const day =
          DAYS_OF_WEEK.find((d) => d.value === schedule.day)?.label ||
          "Unknown";
        const startTime = schedule.startTime.substring(0, 5);
        const endTime = schedule.endTime.substring(0, 5);
        return `${day} ${startTime}-${endTime}`;
      })
      .join(", ");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "success";
      case "Pending":
        return "warning";
      case "Overdue":
        return "error";
      default:
        return "default";
    }
  };

  const getNextScheduleTime = () => {
    if (!enrolledClass?.schedules || enrolledClass.schedules.length === 0)
      return null;

    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTime = now.toTimeString().substring(0, 5);

    // Find next occurrence of any class schedule
    for (let i = 0; i < 7; i++) {
      const targetDay = (currentDay + i) % 7;
      const schedule = enrolledClass.schedules.find((s) => {
        const scheduleDay = s.day === 7 ? 0 : s.day; // Convert to JS day system
        return (
          scheduleDay === targetDay && (i > 0 || s.startTime > currentTime)
        );
      });

      if (schedule) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + i);
        return {
          date: nextDate.toLocaleDateString(),
          time: schedule.startTime.substring(0, 5),
          day:
            DAYS_OF_WEEK.find((d) => d.value === schedule.day)?.label ||
            "Unknown",
        };
      }
    }

    return null;
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!enrolledClass) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <SchoolIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Not Enrolled in Any Class
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          You're not currently enrolled in any training class. Contact your
          instructor or admin to get enrolled.
        </Typography>
        <Button variant="outlined" onClick={() => navigate("/classes")}>
          Browse Classes
        </Button>
      </Box>
    );
  }

  const nextSchedule = getNextScheduleTime();
  const studentProfile = profile && "paymentStatus" in profile ? profile : null;

  return (
    <Box sx={{ p: 3 }}>
      {/* Class Overview Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                {enrolledClass.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your current training class
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => navigate(`/classes/${enrolledClass.id}`)}
            >
              View Details
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <ScheduleIcon color="action" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Schedule
                  </Typography>
                  <Typography variant="body1">
                    {formatScheduleDisplay(enrolledClass.schedules)}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <PersonIcon color="action" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Instructor
                  </Typography>
                  <Typography variant="body1">
                    {enrolledClass.coachName || "Not assigned"}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <HomeIcon color="action" />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body1">
                    {enrolledClass.dojaangName || "Not specified"}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              {/* Next Class */}
              {nextSchedule && (
                <Card variant="outlined" sx={{ mb: 2, bgcolor: "primary.50" }}>
                  <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <CalendarIcon color="primary" />
                      <Typography variant="subtitle2" color="primary">
                        Next Class
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {nextSchedule.day}, {nextSchedule.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      at {nextSchedule.time}
                    </Typography>
                  </CardContent>
                </Card>
              )}

              {/* Payment Status */}
              {studentProfile && (
                <Card
                  variant="outlined"
                  sx={{ bgcolor: nextPayment ? "warning.50" : "success.50" }}
                >
                  <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <PaymentIcon
                        color={nextPayment ? "warning" : "success"}
                      />
                      <Typography
                        variant="subtitle2"
                        color={nextPayment ? "warning.main" : "success.main"}
                      >
                        Payment Status
                      </Typography>
                    </Box>
                    <Chip
                      label={studentProfile.paymentStatus}
                      color={
                        getPaymentStatusColor(
                          studentProfile.paymentStatus,
                        ) as any
                      }
                      size="small"
                    />
                    {nextPayment && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Next payment due: {formatDate(nextPayment.dueDate)}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Statistics */}
      {profileStats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <TrendingUpIcon
                  sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                />
                <Typography variant="h4" color="primary">
                  {Math.round(profileStats.attendanceRate || 0)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Attendance Rate
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={profileStats.attendanceRate || 0}
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <GroupsIcon sx={{ fontSize: 40, color: "info.main", mb: 1 }} />
                <Typography variant="h4" color="info.main">
                  {enrolledClass.enrolledStudents?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Classmates
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Classmates */}
      {enrolledClass.enrolledStudents &&
        enrolledClass.enrolledStudents.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <GroupsIcon />
                  Your Classmates
                </Box>
              </Typography>

              <List>
                {enrolledClass.enrolledStudents
                  .slice(0, 5)
                  .map((student, index) => (
                    <React.Fragment key={student.id}>
                      {index > 0 && <Divider />}
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "primary.main" }}>
                            {student.firstName.charAt(0)}
                            {student.lastName.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${student.firstName} ${student.lastName}`}
                          secondary={
                            student.dojaangName && `From ${student.dojaangName}`
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}

                {enrolledClass.enrolledStudents.length > 5 && (
                  <ListItem sx={{ px: 0, textAlign: "center" }}>
                    <ListItemText>
                      <Typography variant="body2" color="text.secondary">
                        And {enrolledClass.enrolledStudents.length - 5} more
                        students...
                      </Typography>
                    </ListItemText>
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        )}

      {/* Quick Actions */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CalendarIcon />}
                onClick={() => navigate(`/classes/${enrolledClass.id}`)}
              >
                View Schedule
              </Button>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<PaymentIcon />}
                onClick={() => navigate("/profile?tab=payments")}
              >
                Payments
              </Button>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<TrendingUpIcon />}
                disabled
              >
                Progress (Soon)
              </Button>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<PersonIcon />}
                disabled
              >
                Contact Coach
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
