import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  Autocomplete,
  Divider,
} from "@mui/material";
import { Add, Delete, Search, ArrowBack } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { TrainingClassDto, UserDto } from "../types/api";


interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  dojaangName?: string;
}


export default function ClassStudentManagement() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [classData, setClassData] = useState<TrainingClassDto | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<Student[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedStudentToAdd, setSelectedStudentToAdd] =
    useState<Student | null>(null);
  const [removing, setRemoving] = useState<number | null>(null);


  useEffect(() => {
    if (classId) {
      loadData();
    }
  }, [classId]);


  const loadData = async () => {
    try {
      setLoading(true);
      const [classRes, enrolledRes, allStudentsRes] = await Promise.all([
        fetch(`/api/Classes/${classId}`),
        fetch(`/api/classes/${classId}/students`),
        fetch("/api/Students"),
      ]);


      if (classRes.ok) {
        const classData = await classRes.json();
        setClassData(classData);
      }


      if (enrolledRes.ok) {
        const enrolled = await enrolledRes.json();
        setEnrolledStudents(enrolled);
      }


      if (allStudentsRes.ok) {
        const allStudents = await allStudentsRes.json();
        setAllStudents(allStudents);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load class data");
    } finally {
      setLoading(false);
    }
  };


  const getAvailableStudents = () => {
    const enrolledIds = enrolledStudents.map((s) => s.id);
    return allStudents.filter((student) => !enrolledIds.includes(student.id));
  };


  const handleAddStudent = async () => {
    if (!selectedStudentToAdd || !classId) return;


    try {
      const response = await fetch(
        `/api/Students/${selectedStudentToAdd.id}/trainingclasses/${classId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );


      if (!response.ok) {
        throw new Error("Failed to add student to class");
      }


      await loadData();
      setAddDialogOpen(false);
      setSelectedStudentToAdd(null);
    } catch (error) {
      console.error("Error adding student:", error);
      setError("Failed to add student to class");
    }
  };


  const handleRemoveStudent = async (studentId: number) => {
    if (!classId) return;


    try {
      setRemoving(studentId);


      // Note: The backend doesn't seem to have a DELETE endpoint for removing students
      // You might need to add this endpoint or find the correct one
      const response = await fetch(
        `/api/Students/${studentId}/trainingclasses/${classId}`,
        {
          method: "DELETE",
        },
      );


      if (!response.ok) {
        throw new Error("Failed to remove student from class");
      }


      await loadData();
    } catch (error) {
      console.error("Error removing student:", error);
      setError("Failed to remove student from class");
    } finally {
      setRemoving(null);
    }
  };


  const formatSchedules = (schedules: any[]) => {
    if (!schedules || schedules.length === 0) return "No schedules";


    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return schedules
      .map((s) => {
        const day = typeof s.day === "number" ? dayNames[s.day] : s.day;
        return `${day} ${s.startTime}-${s.endTime}`;
      })
      .join(", ");
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!classData) return <div>Class not found</div>;


  const availableStudents = getAvailableStudents();


  return (
    <div>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate("/classes")} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <h2 className="page-title">Manage Students - {classData.name}</h2>
      </Box>


      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Class Information
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Dojaang:</strong>{" "}
                {classData.dojaangName || "Not assigned"}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Coach:</strong> {classData.coachName || "Not assigned"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Schedules:</strong>{" "}
                {formatSchedules(classData.schedules)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6">
                  Enrolled Students ({enrolledStudents.length})
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setAddDialogOpen(true)}
                  disabled={availableStudents.length === 0}
                >
                  Add Student
                </Button>
              </Box>


              {enrolledStudents.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  py={3}
                >
                  No students enrolled in this class yet.
                </Typography>
              ) : (
                <List>
                  {enrolledStudents.map((student, index) => (
                    <React.Fragment key={student.id}>
                      <ListItem>
                        <ListItemText
                          primary={`${student.firstName} ${student.lastName}`}
                          secondary={
                            <Box>
                              {student.email && <div>{student.email}</div>}
                              {student.dojaangName && (
                                <Chip
                                  label={student.dojaangName}
                                  size="small"
                                  sx={{ mt: 0.5 }}
                                />
                              )}
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveStudent(student.id)}
                            disabled={removing === student.id}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < enrolledStudents.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>


      {/* Add Student Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Student to Class</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={availableStudents}
            getOptionLabel={(student) =>
              `${student.firstName} ${student.lastName}`
            }
            value={selectedStudentToAdd}
            onChange={(_, newValue) => setSelectedStudentToAdd(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Student"
                placeholder="Search students..."
                fullWidth
                margin="normal"
              />
            )}
            renderOption={(props, student) => (
              <Box component="li" {...props}>
                <Box>
                  <Typography variant="body1">
                    {student.firstName} {student.lastName}
                  </Typography>
                  {student.email && (
                    <Typography variant="body2" color="text.secondary">
                      {student.email}
                    </Typography>
                  )}
                  {student.dojaangName && (
                    <Chip
                      label={student.dojaangName}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  )}
                </Box>
              </Box>
            )}
          />


          {availableStudents.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              py={2}
            >
              All students are already enrolled in this class.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddStudent}
            variant="contained"
            disabled={!selectedStudentToAdd}
          >
            Add Student
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
