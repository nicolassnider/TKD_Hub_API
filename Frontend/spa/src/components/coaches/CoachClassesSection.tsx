import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Class as ClassIcon,
  Groups as GroupsIcon,
  Schedule as ScheduleIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../context/ProfileContext";
import { TrainingClass, DAYS_OF_WEEK } from "../../types/classes";

export const CoachClassesSection: React.FC = () => {
  const navigate = useNavigate();
  const { managedClasses, loading, error, markAttendance } = useProfile();

  const [selectedClass, setSelectedClass] = useState<TrainingClass | null>(
    null,
  );
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [attendanceNotes, setAttendanceNotes] = useState("");

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    trainingClass: TrainingClass,
  ) => {
    event.stopPropagation();
    setSelectedClass(trainingClass);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedClass(null);
  };

  const handleViewClass = () => {
    if (selectedClass) {
      navigate(`/classes/${selectedClass.id}`);
    }
    handleMenuClose();
  };

  const handleMarkAttendance = () => {
    setAttendanceDialogOpen(true);
    handleMenuClose();
  };

  const handleManageStudents = () => {
    if (selectedClass) {
      navigate(`/classes/${selectedClass.id}?tab=students`);
    }
    handleMenuClose();
  };

  const handleAttendanceSubmit = async (
    studentId: number,
    present: boolean,
  ) => {
    if (!selectedClass) return;

    const success = await markAttendance(
      selectedClass.id,
      studentId,
      present,
      attendanceNotes,
    );
    if (success) {
      setAttendanceDialogOpen(false);
      setAttendanceNotes("");
    }
  };

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

  const getUpcomingClasses = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTime = today.toTimeString().substring(0, 5);

    return managedClasses
      .filter((cls) => {
        return cls.schedules?.some((schedule) => {
          // Convert our day system (1-7) to JS day system (0-6)
          const scheduleDay = schedule.day === 7 ? 0 : schedule.day;
          return (
            scheduleDay >= currentDay &&
            (scheduleDay > currentDay || schedule.startTime > currentTime)
          );
        });
      })
      .slice(0, 3);
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (managedClasses.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <ClassIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Classes Assigned
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          You haven't been assigned to teach any classes yet.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => navigate("/classes")}
        >
          Browse All Classes
        </Button>
      </Box>
    );
  }

  const upcomingClasses = getUpcomingClasses();

  return (
    <Box sx={{ p: 3 }}>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <ClassIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h4" color="primary">
                {managedClasses.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Classes Managed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <GroupsIcon sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
              <Typography variant="h4" color="success.main">
                {managedClasses.reduce(
                  (total, cls) => total + (cls.enrolledStudents?.length || 0),
                  0,
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Students
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <CalendarIcon
                sx={{ fontSize: 40, color: "warning.main", mb: 1 }}
              />
              <Typography variant="h4" color="warning.main">
                {upcomingClasses.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upcoming Classes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Upcoming Classes */}
      {upcomingClasses.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarIcon />
                Upcoming Classes
              </Box>
            </Typography>

            <Grid container spacing={2}>
              {upcomingClasses.map((cls) => (
                <Grid item xs={12} md={4} key={cls.id}>
                  <Card
                    variant="outlined"
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/classes/${cls.id}`)}
                  >
                    <CardContent sx={{ pb: 2, "&:last-child": { pb: 2 } }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {cls.name}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <ScheduleIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {formatScheduleDisplay(cls.schedules)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <GroupsIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {cls.enrolledStudents?.length || 0} students
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* All Managed Classes */}
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ClassIcon />
                All My Classes
              </Box>
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => navigate("/classes?tab=list")}
            >
              View All Classes
            </Button>
          </Box>

          <Grid container spacing={3}>
            {managedClasses.map((cls) => (
              <Grid item xs={12} md={6} key={cls.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" component="h3">
                        {cls.name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, cls)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <ScheduleIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {formatScheduleDisplay(cls.schedules)}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <GroupsIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {cls.enrolledStudents?.length || 0} students enrolled
                        </Typography>
                      </Box>

                      {cls.dojaangName && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            📍 {cls.dojaangName}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/classes/${cls.id}`)}
                      >
                        View Details
                      </Button>
                      <Button
                        size="small"
                        variant="text"
                        startIcon={<AssignmentIcon />}
                        onClick={() => setSelectedClass(cls)}
                      >
                        Attendance
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewClass}>
          <ClassIcon sx={{ mr: 1 }} />
          View Class Details
        </MenuItem>
        <MenuItem onClick={handleManageStudents}>
          <GroupsIcon sx={{ mr: 1 }} />
          Manage Students
        </MenuItem>
        <MenuItem onClick={handleMarkAttendance}>
          <AssignmentIcon sx={{ mr: 1 }} />
          Mark Attendance
        </MenuItem>
      </Menu>

      {/* Attendance Dialog */}
      <Dialog
        open={attendanceDialogOpen}
        onClose={() => setAttendanceDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Mark Attendance - {selectedClass?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select students who attended today's class
          </Typography>

          {selectedClass?.enrolledStudents &&
          selectedClass.enrolledStudents.length > 0 ? (
            <List>
              {selectedClass.enrolledStudents.map((student: any) => (
                <ListItem key={student.id} divider>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${student.firstName} ${student.lastName}`}
                    secondary={student.email}
                  />
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      onClick={() => handleAttendanceSubmit(student.id, true)}
                    >
                      Present
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleAttendanceSubmit(student.id, false)}
                    >
                      Absent
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ py: 4 }}
            >
              No students enrolled in this class
            </Typography>
          )}

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notes (optional)"
            value={attendanceNotes}
            onChange={(e) => setAttendanceNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAttendanceDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
