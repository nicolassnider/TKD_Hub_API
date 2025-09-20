import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  Skeleton,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Groups as GroupsIcon,
  School as SchoolIcon,
  PersonAdd as PersonAddIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useClassContext } from "../context/ClassContext";
import { EnhancedClassForm } from "./EnhancedClassForm";
import { StudentAssignment } from "./StudentAssignment";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { TrainingClass, DAYS_OF_WEEK } from "../types/classes";

export const ClassDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentClass,
    enrolledStudents,
    loading,
    error,
    fetchClass,
    fetchStudentsForClass,
    deleteClass,
    getPermissions,
    formatScheduleDisplay,
  } = useClassContext();

  const [formOpen, setFormOpen] = useState(false);
  const [studentAssignmentOpen, setStudentAssignmentOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (id) {
      const classId = parseInt(id, 10);
      fetchClass(classId);
      fetchStudentsForClass(classId);
    }
  }, [id, fetchClass, fetchStudentsForClass]);

  const handleBack = () => {
    navigate("/classes");
  };

  const handleEdit = () => {
    setFormOpen(true);
    handleCloseMenu();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  const handleDeleteConfirm = async () => {
    if (currentClass) {
      await deleteClass(currentClass.id);
      setDeleteDialogOpen(false);
      navigate("/classes");
    }
  };

  const handleManageStudents = () => {
    setStudentAssignmentOpen(true);
    handleCloseMenu();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const getDayName = (day: number) => {
    return DAYS_OF_WEEK.find((d) => d.value === day)?.label || "Unknown";
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Remove seconds if present
  };

  const getStudentInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
        <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" height={48} sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to Classes
        </Button>
      </Box>
    );
  }

  if (!currentClass) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Training class not found
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to Classes
        </Button>
      </Box>
    );
  }

  const permissions = getPermissions(currentClass);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="/classes"
          onClick={(e) => {
            e.preventDefault();
            handleBack();
          }}
          sx={{ cursor: "pointer" }}
        >
          Classes
        </Link>
        <Typography color="text.primary">{currentClass.name}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mt: -1 }}>
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {currentClass.name}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={`${enrolledStudents.length} students`}
              color="primary"
              icon={<GroupsIcon />}
            />
            <Chip
              label={formatScheduleDisplay(currentClass.schedules)}
              variant="outlined"
              icon={<ScheduleIcon />}
            />
          </Box>
        </Box>

        {(permissions.canEdit ||
          permissions.canDelete ||
          permissions.canManageStudents) && (
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Main Class Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SchoolIcon />
                  Class Information
                </Box>
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <HomeIcon color="action" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body1">
                        {currentClass.dojaangName || "No location assigned"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <PersonIcon color="action" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Coach
                      </Typography>
                      <Typography variant="body1">
                        {currentClass.coachName || "No coach assigned"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ScheduleIcon />
                  Class Schedule
                </Box>
              </Typography>

              {currentClass.schedules.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No schedules configured
                </Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {currentClass.schedules.map((schedule, index) => (
                    <Card
                      key={index}
                      variant="outlined"
                      sx={{ bgcolor: "grey.50" }}
                    >
                      <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Chip
                            label={getDayName(schedule.day)}
                            color="primary"
                            size="small"
                          />
                          <Typography variant="body1">
                            {formatTime(schedule.startTime)} -{" "}
                            {formatTime(schedule.endTime)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Student List */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <GroupsIcon />
                    Students ({enrolledStudents.length})
                  </Box>
                </Typography>
                {permissions.canManageStudents && (
                  <Button
                    size="small"
                    startIcon={<PersonAddIcon />}
                    onClick={handleManageStudents}
                  >
                    Manage
                  </Button>
                )}
              </Box>

              {enrolledStudents.length === 0 ? (
                <Box
                  sx={{ textAlign: "center", py: 3, color: "text.secondary" }}
                >
                  <GroupsIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                  <Typography variant="body2">
                    No students enrolled yet
                  </Typography>
                  {permissions.canManageStudents && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<PersonAddIcon />}
                      onClick={handleManageStudents}
                      sx={{ mt: 1 }}
                    >
                      Add Students
                    </Button>
                  )}
                </Box>
              ) : (
                <List sx={{ maxHeight: 400, overflow: "auto" }}>
                  {enrolledStudents.map((student) => (
                    <ListItem key={student.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          {getStudentInitials(
                            student.firstName,
                            student.lastName,
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${student.firstName} ${student.lastName}`}
                        secondary={
                          <Box>
                            {student.email && (
                              <Typography variant="caption" display="block">
                                {student.email}
                              </Typography>
                            )}
                            {student.dojaangName && (
                              <Chip
                                label={student.dojaangName}
                                size="small"
                                variant="outlined"
                                sx={{ mt: 0.5 }}
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {permissions.canManageStudents && (
          <MenuItem onClick={handleManageStudents}>
            <GroupsIcon sx={{ mr: 1 }} />
            Manage Students
          </MenuItem>
        )}
        {permissions.canEdit && (
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 1 }} />
            Edit Class
          </MenuItem>
        )}
        {permissions.canDelete && (
          <MenuItem onClick={handleDeleteClick}>
            <DeleteIcon sx={{ mr: 1 }} />
            Delete Class
          </MenuItem>
        )}
      </Menu>

      {/* Class Form Dialog */}
      <EnhancedClassForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        trainingClass={currentClass}
        mode="edit"
      />

      {/* Student Assignment Dialog */}
      <StudentAssignment
        open={studentAssignmentOpen}
        onClose={() => setStudentAssignmentOpen(false)}
        classId={currentClass.id}
        className={currentClass.name}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        entityName="training class"
        entityDescription={currentClass.name}
      />
    </Box>
  );
};
