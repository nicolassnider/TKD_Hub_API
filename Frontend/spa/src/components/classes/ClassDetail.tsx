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
  TextField,
  Paper,
  Stack,
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

import { ClassForm } from "./ClassForm";
import { useClassContext } from "context/ClassContext";
import { DAYS_OF_WEEK } from "../../types/api";
import { StudentAssignment } from "components/students/StudentAssignment";
import { DeleteConfirmationDialog } from "components/forms/DeleteConfirmationDialog";

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
  }, [id]); // Remove function dependencies to prevent infinite loops

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

  const handleNavigateToStudentManagement = () => {
    if (currentClass) {
      navigate(`/classes/${currentClass.id}/students`);
    }
  };

  const handleNavigateToAttendance = () => {
    if (currentClass) {
      navigate(`/classes/${currentClass.id}/attendance`);
    }
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

  // Common dark theme TextField styling using school logo colors
  const darkTextFieldSx = {
    "& .MuiInputBase-input": {
      color: "var(--fg)",
    },
    "& .MuiOutlinedInput-root": {
      bgcolor: "var(--panel)",
      "& fieldset": {
        borderColor: "var(--border)",
      },
      "&:hover fieldset": {
        borderColor: "var(--border-accent)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "var(--primary)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "var(--fg-muted)",
    },
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
    <Box
      sx={{
        p: 1.5,
        maxWidth: 900,
        mx: "auto",
        bgcolor: "var(--bg)",
        minHeight: "100vh",
      }}
    >
      {/* Breadcrumbs */}
      <Breadcrumbs
        sx={{
          mb: 2,
          "& .MuiBreadcrumbs-separator": { color: "var(--fg-muted)" },
        }}
      >
        <Link
          href="/classes"
          onClick={(e) => {
            e.preventDefault();
            handleBack();
          }}
          sx={{
            cursor: "pointer",
            color: "var(--primary)",
            textDecoration: "none",
            "&:hover": { color: "var(--accent)" },
          }}
        >
          Classes
        </Link>
        <Typography sx={{ color: "var(--fg)" }}>{currentClass.name}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
        <IconButton
          onClick={handleBack}
          sx={{
            mt: -1,
            color: "var(--primary)",
            "&:hover": {
              bgcolor: "var(--primary-50)",
              color: "var(--primary-700)",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              color: "var(--fg)",
              fontWeight: 700,
            }}
            className="page-title"
          >
            {currentClass.name}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            <Chip
              label={`${Array.isArray(enrolledStudents) ? enrolledStudents.length : 0} students`}
              icon={<GroupsIcon />}
              sx={{
                bgcolor: "var(--primary-100)",
                color: "var(--primary)",
                fontWeight: 600,
                "& .MuiChip-icon": {
                  color: "var(--primary)",
                },
              }}
            />
            <Chip
              label={formatScheduleDisplay(currentClass.schedules || [])}
              variant="outlined"
              icon={<ScheduleIcon />}
              sx={{
                borderColor: "var(--accent)",
                color: "var(--accent)",
                "& .MuiChip-icon": {
                  color: "var(--accent)",
                },
              }}
            />
          </Box>

          {/* Action Buttons */}
          {permissions.canManageStudents && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                startIcon={<GroupsIcon />}
                onClick={handleNavigateToStudentManagement}
                size="small"
                className="auth-button"
                sx={{
                  background:
                    "linear-gradient(135deg, var(--primary), var(--primary-700))",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, var(--primary-600), var(--primary-900))",
                  },
                }}
              >
                Manage Students
              </Button>
              <Button
                variant="outlined"
                startIcon={<AssignmentIcon />}
                onClick={handleNavigateToAttendance}
                size="small"
                sx={{
                  borderColor: "var(--accent)",
                  color: "var(--accent)",
                  "&:hover": {
                    borderColor: "var(--accent-700)",
                    bgcolor: "var(--accent-50)",
                    color: "var(--accent-700)",
                  },
                }}
              >
                Take Attendance
              </Button>
            </Box>
          )}
        </Box>

        {(permissions.canEdit || permissions.canDelete) && (
          <IconButton
            onClick={handleMenuClick}
            sx={{
              color: "var(--fg-muted)",
              "&:hover": {
                bgcolor: "var(--surface-hover)",
                color: "var(--primary)",
              },
            }}
          >
            <MoreVertIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
        {/* Main Class Information */}
        <Box sx={{ flex: "2 1 65%", minWidth: "400px" }}>
          <Card
            elevation={2}
            sx={{
              borderRadius: "16px",
              bgcolor: "var(--panel-elevated)",
              border: "1px solid",
              borderColor: "var(--border)",
              boxShadow: "var(--shadow-lg)",
              color: "var(--fg)",
            }}
            className="auth-card"
          >
            <CardContent sx={{ p: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: "var(--primary)",
                  fontWeight: 700,
                  mb: 2,
                  fontSize: "1.5rem",
                }}
                className="page-title"
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <SchoolIcon sx={{ color: "var(--gold)" }} />
                  Class Information
                </Box>
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  bgcolor: "var(--panel)",
                  borderColor: "var(--border)",
                  boxShadow: "var(--shadow)",
                  borderRadius: "12px",
                }}
              >
                <Stack spacing={2}>
                  {/* Class Name Field */}
                  <TextField
                    label="Class Name"
                    value={currentClass.name}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <SchoolIcon sx={{ mr: 1, color: "var(--gold)" }} />
                      ),
                    }}
                    variant="outlined"
                    fullWidth
                    sx={{
                      "& .MuiInputBase-input": {
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        color: "var(--fg)",
                      },
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "var(--surface-elevated)",
                        "& fieldset": {
                          borderColor: "var(--border-accent)",
                        },
                        "&:hover fieldset": {
                          borderColor: "var(--primary)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "var(--primary)",
                        fontWeight: 600,
                      },
                    }}
                  />

                  <Grid container spacing={1.5}>
                    {/* Location Field */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Location"
                        value={
                          currentClass.dojaangName || "No location assigned"
                        }
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <HomeIcon sx={{ mr: 1, color: "primary.main" }} />
                          ),
                        }}
                        variant="outlined"
                        fullWidth
                        sx={{
                          ...darkTextFieldSx,
                          "& .MuiInputBase-input": {
                            ...darkTextFieldSx["& .MuiInputBase-input"],
                            fontWeight: 500,
                          },
                        }}
                      />
                    </Grid>

                    {/* Coach Field */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Coach"
                        value={currentClass.coachName || "No coach assigned"}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <PersonIcon
                              sx={{ mr: 1, color: "secondary.main" }}
                            />
                          ),
                        }}
                        variant="outlined"
                        fullWidth
                        sx={{
                          ...darkTextFieldSx,
                          "& .MuiInputBase-input": {
                            ...darkTextFieldSx["& .MuiInputBase-input"],
                            fontWeight: 500,
                          },
                        }}
                      />
                    </Grid>

                    {/* Student Count Field */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Enrolled Students"
                        value={`${Array.isArray(enrolledStudents) ? enrolledStudents.length : 0} students`}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <GroupsIcon sx={{ mr: 1, color: "success.main" }} />
                          ),
                        }}
                        variant="outlined"
                        fullWidth
                        sx={{
                          ...darkTextFieldSx,
                          "& .MuiInputBase-input": {
                            ...darkTextFieldSx["& .MuiInputBase-input"],
                            fontWeight: 500,
                            color: "success.main",
                          },
                        }}
                      />
                    </Grid>

                    {/* Class ID Field */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Class ID"
                        value={currentClass.id}
                        InputProps={{
                          readOnly: true,
                        }}
                        variant="outlined"
                        fullWidth
                        sx={{
                          ...darkTextFieldSx,
                          "& .MuiInputBase-input": {
                            ...darkTextFieldSx["& .MuiInputBase-input"],
                            fontWeight: 500,
                            color: "text.secondary",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </Paper>

              <Divider sx={{ my: 3 }} />

              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "var(--primary)", fontWeight: 600, mb: 2 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ScheduleIcon />
                  Class Schedule
                </Box>
              </Typography>

              {!Array.isArray(currentClass.schedules) ||
              currentClass.schedules.length === 0 ? (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    textAlign: "center",
                    bgcolor: "var(--panel)",
                    borderColor: "var(--border)",
                  }}
                >
                  <ScheduleIcon
                    sx={{ fontSize: 48, color: "var(--fg-subtle)", mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    No schedules configured
                  </Typography>
                </Paper>
              ) : (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: "var(--panel)",
                    borderColor: "var(--border)",
                  }}
                >
                  <Stack spacing={1.5}>
                    {Array.isArray(currentClass.schedules)
                      ? currentClass.schedules.map((schedule, index) => (
                          <Grid container spacing={1.5} key={index}>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                label={`Schedule ${index + 1} - Day`}
                                value={getDayName(schedule.day)}
                                InputProps={{
                                  readOnly: true,
                                  startAdornment: (
                                    <ScheduleIcon
                                      sx={{ mr: 1, color: "var(--primary)" }}
                                    />
                                  ),
                                }}
                                variant="outlined"
                                fullWidth
                                sx={{
                                  ...darkTextFieldSx,
                                  "& .MuiInputBase-input": {
                                    ...darkTextFieldSx["& .MuiInputBase-input"],
                                    fontWeight: 600,
                                    color: "primary.main",
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                label="Start Time"
                                value={formatTime(schedule.startTime)}
                                InputProps={{
                                  readOnly: true,
                                }}
                                variant="outlined"
                                fullWidth
                                sx={{
                                  ...darkTextFieldSx,
                                  "& .MuiInputBase-input": {
                                    ...darkTextFieldSx["& .MuiInputBase-input"],
                                    fontWeight: 500,
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                label="End Time"
                                value={formatTime(schedule.endTime)}
                                InputProps={{
                                  readOnly: true,
                                }}
                                variant="outlined"
                                fullWidth
                                sx={{
                                  ...darkTextFieldSx,
                                  "& .MuiInputBase-input": {
                                    ...darkTextFieldSx["& .MuiInputBase-input"],
                                    fontWeight: 500,
                                  },
                                }}
                              />
                            </Grid>
                          </Grid>
                        ))
                      : null}
                  </Stack>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Student List */}
        <Box sx={{ flex: "1 1 32%", minWidth: "280px" }}>
          <Card
            elevation={2}
            sx={{
              borderRadius: "16px",
              height: "fit-content",
              maxWidth: "100%",
              bgcolor: "var(--panel-elevated)",
              border: "1px solid",
              borderColor: "var(--border)",
              boxShadow: "var(--shadow-lg)",
              color: "var(--fg)",
              overflow: "hidden",
            }}
            className="auth-card"
          >
            <CardContent sx={{ p: 1.5 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1.5,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "var(--primary)",
                    fontWeight: 700,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <GroupsIcon sx={{ color: "var(--accent)" }} />
                    Students (
                    {Array.isArray(enrolledStudents)
                      ? enrolledStudents.length
                      : 0}
                    )
                  </Box>
                </Typography>
                {permissions.canManageStudents && (
                  <Button
                    size="small"
                    startIcon={<PersonAddIcon sx={{ color: "var(--gold)" }} />}
                    onClick={handleManageStudents}
                    sx={{
                      color: "var(--gold)",
                      borderColor: "var(--gold)",
                      "&:hover": {
                        bgcolor: "var(--gold-50)",
                        borderColor: "var(--gold-700)",
                      },
                    }}
                  >
                    Manage
                  </Button>
                )}
              </Box>

              {!Array.isArray(enrolledStudents) ||
              enrolledStudents.length === 0 ? (
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
                <List
                  sx={{
                    maxHeight: 400,
                    overflow: "auto",
                    width: "100%",
                    pr: 1,
                  }}
                >
                  {Array.isArray(enrolledStudents)
                    ? enrolledStudents.map((student) => (
                        <ListItem
                          key={student.id}
                          sx={{ px: 0, width: "100%", maxWidth: "100%" }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                background:
                                  "linear-gradient(135deg, var(--primary), var(--accent))",
                                color: "white",
                                fontWeight: 600,
                              }}
                            >
                              {getStudentInitials(
                                student.firstName,
                                student.lastName,
                              )}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={`${student.firstName} ${student.lastName}`}
                            sx={{
                              minWidth: 0,
                              "& .MuiListItemText-primary": {
                                wordBreak: "break-word",
                              },
                            }}
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
                                    sx={{
                                      mt: 0.5,
                                      borderColor: "var(--gold)",
                                      color: "var(--gold)",
                                      fontSize: "0.75rem",
                                    }}
                                  />
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                      ))
                    : null}
                </List>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

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
      <ClassForm
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
