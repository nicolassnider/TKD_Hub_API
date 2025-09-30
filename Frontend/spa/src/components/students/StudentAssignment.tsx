import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Skeleton,
  TextField,
  InputAdornment,
  Grid,
  Divider,
  Avatar,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  PersonAdd as PersonAddIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useClassContext } from "../../context/ClassContext";
import { StudentForAssignment } from "../../types/api";

interface StudentAssignmentProps {
  open: boolean;
  onClose: () => void;
  classId: number;
  className: string;
}

export const StudentAssignment: React.FC<StudentAssignmentProps> = ({
  open,
  onClose,
  classId,
  className,
}) => {
  const {
    enrolledStudents,
    availableStudents,
    loading,
    error,
    fetchStudentsForClass,
    fetchAvailableStudents,
    assignStudentToClass,
    removeStudentFromClass,
  } = useClassContext();

  const [searchEnrolled, setSearchEnrolled] = useState("");
  const [searchAvailable, setSearchAvailable] = useState("");
  const [assigningStudent, setAssigningStudent] = useState<number | null>(null);
  const [removingStudent, setRemovingStudent] = useState<number | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (open && classId && !hasInitialized.current) {
      hasInitialized.current = true;
      fetchStudentsForClass(classId);
      fetchAvailableStudents(classId);
    } else if (!open) {
      hasInitialized.current = false;
    }
  }, [open, classId]); // Remove function dependencies to prevent excessive re-renders

  const handleAssignStudent = async (studentId: number) => {
    try {
      setAssigningStudent(studentId);
      await assignStudentToClass(studentId, classId);
    } catch (error) {
      console.error("Error assigning student:", error);
    } finally {
      setAssigningStudent(null);
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    try {
      setRemovingStudent(studentId);
      await removeStudentFromClass(studentId, classId);
    } catch (error) {
      console.error("Error removing student:", error);
    } finally {
      setRemovingStudent(null);
    }
  };

  const filterStudents = (
    students: StudentForAssignment[],
    searchTerm: string,
  ) => {
    if (!Array.isArray(students)) return [];
    if (!searchTerm) return students;

    const term = searchTerm.toLowerCase();
    return students.filter(
      (student) =>
        student.firstName.toLowerCase().includes(term) ||
        student.lastName.toLowerCase().includes(term) ||
        student.email?.toLowerCase().includes(term) ||
        student.dojaangName?.toLowerCase().includes(term) ||
        (student.dojaangId && student.dojaangId.toString().includes(term)),
    );
  };

  const filteredEnrolledStudents = filterStudents(
    enrolledStudents,
    searchEnrolled,
  );
  const filteredAvailableStudents = filterStudents(
    availableStudents,
    searchAvailable,
  );

  const getStudentInitials = (student: StudentForAssignment) => {
    return `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`;
  };

  const formatEnrollmentDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  // Dark theme styles
  const darkTextFieldSx = {
    "& .MuiInputBase-input": {
      color: "var(--fg)",
    },
    "& .MuiOutlinedInput-root": {
      bgcolor: "var(--surface)",
      "& fieldset": {
        borderColor: "var(--border)",
      },
      "&:hover fieldset": {
        borderColor: "var(--primary)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "var(--primary)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "var(--fg-muted)",
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: "85vh",
          bgcolor: "var(--panel-elevated)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "var(--panel)",
          color: "var(--fg)",
          borderBottom: "1px solid var(--border)",
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <PersonAddIcon sx={{ color: "var(--gold)", fontSize: "1.75rem" }} />
          <Typography
            variant="h6"
            sx={{
              color: "var(--fg)",
              fontWeight: 700,
              fontSize: "1.25rem",
            }}
          >
            Manage Students - {className}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: "var(--fg-muted)",
            "&:hover": {
              bgcolor: "var(--surface-hover)",
              color: "var(--fg)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          bgcolor: "var(--panel-elevated)",
          color: "var(--fg)",
          p: 3,
        }}
      >
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              bgcolor: "var(--error-50)",
              color: "var(--error)",
              borderColor: "var(--error)",
              "& .MuiAlert-icon": {
                color: "var(--error)",
              },
            }}
          >
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Available Students */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                bgcolor: "var(--panel)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                boxShadow: "var(--shadow)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
                  <PersonAddIcon sx={{ color: "var(--primary)", fontSize: "1.5rem" }} />
                  <Typography
                    variant="h6"
                    sx={{
                      color: "var(--primary)",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                    }}
                  >
                    Available Students ({filteredAvailableStudents.length})
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  placeholder="Search available students..."
                  value={searchAvailable}
                  onChange={(e) => setSearchAvailable(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "var(--fg-muted)" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ ...darkTextFieldSx, mb: 3 }}
                />

                <Paper
                  sx={{
                    flex: 1,
                    bgcolor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  {loading ? (
                    <Box sx={{ p: 2 }}>
                      {[...Array(3)].map((_, i) => (
                        <Skeleton
                          key={i}
                          variant="rounded"
                          height={60}
                          sx={{ mb: 1, bgcolor: "var(--surface-elevated)" }}
                        />
                      ))}
                    </Box>
                  ) : filteredAvailableStudents.length === 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "200px",
                        color: "var(--fg-muted)",
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                      <Typography variant="body2">
                        {searchAvailable ? "No students match your search" : "No available students"}
                      </Typography>
                    </Box>
                  ) : (
                    <List sx={{ flexGrow: 1, overflow: "auto", p: 1 }}>
                      {filteredAvailableStudents.map((student) => (
                        <ListItem
                          key={`available-${student.id}`}
                          sx={{
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            mb: 1,
                            bgcolor: "var(--panel)",
                            "&:hover": {
                              bgcolor: "var(--surface-hover)",
                            },
                          }}
                        >
                          <Avatar
                            sx={{
                              mr: 2,
                              bgcolor: "var(--primary)",
                              color: "white",
                              fontWeight: 600,
                            }}
                          >
                            {getStudentInitials(student)}
                          </Avatar>
                          <ListItemText
                            primary={
                              <Typography
                                sx={{
                                  color: "var(--fg)",
                                  fontWeight: 600,
                                }}
                              >
                                {`${student.firstName} ${student.lastName}`}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ mt: 0.5 }}>
                                {student.email && (
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "var(--fg-muted)", mb: 0.5 }}
                                  >
                                    📧 {student.email}
                                  </Typography>
                                )}
                                {(student.dojaangName || student.dojaangId) && (
                                  <Chip
                                    label={student.dojaangName || `Dojaang ${student.dojaangId}`}
                                    size="small"
                                    sx={{
                                      bgcolor: "var(--accent-100)",
                                      color: "var(--accent)",
                                      fontSize: "0.75rem",
                                    }}
                                  />
                                )}
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              onClick={() => handleAssignStudent(student.id)}
                              disabled={assigningStudent === student.id}
                              sx={{
                                bgcolor: "var(--primary-100)",
                                color: "var(--primary)",
                                "&:hover": {
                                  bgcolor: "var(--primary)",
                                  color: "white",
                                },
                                "&:disabled": {
                                  bgcolor: "var(--surface)",
                                  color: "var(--fg-muted)",
                                },
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </CardContent>
            </Card>
          </Grid>

          {/* Enrolled Students */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                bgcolor: "var(--panel)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                boxShadow: "var(--shadow)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
                <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
                  <CheckCircleIcon sx={{ color: "var(--success)", fontSize: "1.5rem" }} />
                  <Typography
                    variant="h6"
                    sx={{
                      color: "var(--success)",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                    }}
                  >
                    Enrolled Students ({filteredEnrolledStudents.length})
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  placeholder="Search enrolled students..."
                  value={searchEnrolled}
                  onChange={(e) => setSearchEnrolled(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "var(--fg-muted)" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ ...darkTextFieldSx, mb: 3 }}
                />

                <Paper
                  sx={{
                    flex: 1,
                    bgcolor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  {loading ? (
                    <Box sx={{ p: 2 }}>
                      {[...Array(3)].map((_, i) => (
                        <Skeleton
                          key={i}
                          variant="rounded"
                          height={60}
                          sx={{ mb: 1, bgcolor: "var(--surface-elevated)" }}
                        />
                      ))}
                    </Box>
                  ) : filteredEnrolledStudents.length === 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "200px",
                        color: "var(--fg-muted)",
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                      <Typography variant="body2">
                        {searchEnrolled ? "No students match your search" : "No enrolled students"}
                      </Typography>
                    </Box>
                  ) : (
                    <List sx={{ flexGrow: 1, overflow: "auto", p: 1 }}>
                      {filteredEnrolledStudents.map((student) => (
                        <ListItem
                          key={`enrolled-${student.id}`}
                          sx={{
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            mb: 1,
                            bgcolor: "var(--panel)",
                            "&:hover": {
                              bgcolor: "var(--surface-hover)",
                            },
                          }}
                        >
                          <Avatar
                            sx={{
                              mr: 2,
                              bgcolor: "var(--success)",
                              color: "white",
                              fontWeight: 600,
                            }}
                          >
                            {getStudentInitials(student)}
                          </Avatar>
                          <ListItemText
                            primary={
                              <Typography
                                sx={{
                                  color: "var(--fg)",
                                  fontWeight: 600,
                                }}
                              >
                                {`${student.firstName} ${student.lastName}`}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ mt: 0.5 }}>
                                {student.email && (
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "var(--fg-muted)", mb: 0.5 }}
                                  >
                                    📧 {student.email}
                                  </Typography>
                                )}
                                {(student.dojaangName || student.dojaangId) && (
                                  <Chip
                                    label={student.dojaangName || `Dojaang ${student.dojaangId}`}
                                    size="small"
                                    sx={{
                                      bgcolor: "var(--gold-100)",
                                      color: "var(--gold)",
                                      fontSize: "0.75rem",
                                    }}
                                  />
                                )}
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              onClick={() => handleRemoveStudent(student.id)}
                              disabled={removingStudent === student.id}
                              sx={{
                                bgcolor: "var(--error-50)",
                                color: "var(--error)",
                                "&:hover": {
                                  bgcolor: "var(--error)",
                                  color: "white",
                                },
                                "&:disabled": {
                                  bgcolor: "var(--surface)",
                                  color: "var(--fg-muted)",
                                },
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          bgcolor: "var(--panel)",
          borderTop: "1px solid var(--border)",
          p: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "var(--border)",
            color: "var(--fg)",
            "&:hover": {
              borderColor: "var(--primary)",
              bgcolor: "var(--surface)",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentAssignment;
