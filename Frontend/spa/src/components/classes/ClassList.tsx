import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Fab,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  Skeleton,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Groups as GroupsIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { ClassForm } from "./ClassForm";
import { useClassContext } from "../../context/ClassContext";
import { DAYS_OF_WEEK, TrainingClass } from "../../types/classes";
import { DeleteConfirmationDialog } from "components/forms/DeleteConfirmationDialog";

export const ClassList: React.FC = () => {
  const navigate = useNavigate();
  const { classes, loading, error, fetchClasses, deleteClass, getPermissions } =
    useClassContext();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedClass, setSelectedClass] = useState<TrainingClass | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<TrainingClass | null>(
    null,
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuClass, setMenuClass] = useState<TrainingClass | null>(null);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const permissions = getPermissions();

  const handleCreateClass = () => {
    setSelectedClass(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleEditClass = (trainingClass: TrainingClass) => {
    setSelectedClass(trainingClass);
    setFormMode("edit");
    setFormOpen(true);
    handleCloseMenu();
  };

  const handleDeleteClick = (trainingClass: TrainingClass) => {
    setClassToDelete(trainingClass);
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  const handleDeleteConfirm = async () => {
    if (classToDelete) {
      await deleteClass(classToDelete.id);
      setDeleteDialogOpen(false);
      setClassToDelete(null);
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    trainingClass: TrainingClass,
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuClass(trainingClass);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuClass(null);
  };

  const handleViewClass = (trainingClass: TrainingClass) => {
    navigate(`/classes/${trainingClass.id}`);
  };

  const handleManageStudents = (trainingClass: TrainingClass) => {
    navigate(`/classes/${trainingClass.id}/students`);
    handleCloseMenu();
  };

  const getDayName = (day: number, short: boolean = true) => {
    const dayInfo = DAYS_OF_WEEK.find((d) => d.value === day);
    return dayInfo ? (short ? dayInfo.short : dayInfo.label) : "Unknown";
  };

  const getScheduleChips = (schedules: any[]) => {
    if (!schedules || schedules.length === 0) {
      return <Chip label="No schedules" size="small" variant="outlined" />;
    }

    return schedules.map((schedule, index) => (
      <Chip
        key={index}
        label={`${getDayName(schedule.day)} ${schedule.startTime.substring(0, 5)}-${schedule.endTime.substring(0, 5)}`}
        size="small"
        color="primary"
        variant="outlined"
        sx={{ mr: 0.5, mb: 0.5 }}
      />
    ));
  };

  const canEditClass = (trainingClass: TrainingClass) => {
    const classPermissions = getPermissions(trainingClass);
    return classPermissions.canEdit;
  };

  const canDeleteClass = (trainingClass: TrainingClass) => {
    const classPermissions = getPermissions(trainingClass);
    return classPermissions.canDelete;
  };

  const canManageStudents = (trainingClass: TrainingClass) => {
    const classPermissions = getPermissions(trainingClass);
    return classPermissions.canManageStudents;
  };

  if (loading && classes.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Training Classes
        </Typography>
        <Grid container spacing={3}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton
                    variant="text"
                    width="40%"
                    height={20}
                    sx={{ mt: 1 }}
                  />
                  <Skeleton variant="rectangular" height={60} sx={{ mt: 2 }} />
                  <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <Skeleton variant="rectangular" width={80} height={24} />
                    <Skeleton variant="rectangular" width={60} height={24} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, pb: 10 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Training Classes</Typography>
        {permissions.canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClass}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            New Class
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {classes.length === 0 && !loading ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <SchoolIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No training classes yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Classes are where students learn and practice. Each class has a
              schedule, a coach, and a location.
            </Typography>
            {permissions.canCreate && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateClass}
                sx={{ mt: 2 }}
              >
                Create First Class
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {classes.map((trainingClass) => (
            <Grid item xs={12} md={6} lg={4} key={trainingClass.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 3,
                  },
                }}
                onClick={() => handleViewClass(trainingClass)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{ flexGrow: 1, mr: 1 }}
                    >
                      {trainingClass.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuClick(e, trainingClass);
                      }}
                      sx={{ ml: 1 }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  {/* Class Info */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <HomeIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {trainingClass.dojaangName || "No location assigned"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {trainingClass.coachName || "No coach assigned"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <GroupsIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {trainingClass.studentCount || 0} students
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Schedules */}
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <ScheduleIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight="medium"
                      >
                        Schedule
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                      {getScheduleChips(trainingClass.schedules)}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Floating Action Button for mobile */}
      {permissions.canCreate && (
        <Fab
          color="primary"
          aria-label="add class"
          onClick={handleCreateClass}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            display: { xs: "flex", sm: "none" },
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => menuClass && handleViewClass(menuClass)}>
          <SchoolIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        {menuClass && canManageStudents(menuClass) && (
          <MenuItem
            onClick={() => menuClass && handleManageStudents(menuClass)}
          >
            <GroupsIcon sx={{ mr: 1 }} />
            Manage Students
          </MenuItem>
        )}
        {menuClass && canEditClass(menuClass) && (
          <MenuItem onClick={() => menuClass && handleEditClass(menuClass)}>
            <EditIcon sx={{ mr: 1 }} />
            Edit Class
          </MenuItem>
        )}
        {menuClass && canDeleteClass(menuClass) && (
          <MenuItem onClick={() => menuClass && handleDeleteClick(menuClass)}>
            <DeleteIcon sx={{ mr: 1 }} />
            Delete Class
          </MenuItem>
        )}
      </Menu>

      {/* Class Form Dialog */}
      <ClassForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        trainingClass={selectedClass}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        entityName="training class"
        entityDescription={classToDelete?.name || ""}
      />
    </Box>
  );
};
