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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider,
} from "@mui/material";
import { ArrowBack, Add, History, Save } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import {
  TrainingClassDto,
  AttendanceHistoryDto,
  AttendanceStatus,
  Student,
  StudentClassRelation,
  AttendanceRecord,
  attendanceStatusOptions,
} from "../../types/api";

export default function ClassAttendanceManagement() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [classData, setClassData] = useState<TrainingClassDto | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [attendanceHistory, setAttendanceHistory] = useState<
    AttendanceHistoryDto[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedStudentHistory, setSelectedStudentHistory] = useState<
    AttendanceHistoryDto[]
  >([]);
  const [selectedStudentName, setSelectedStudentName] = useState<string>("");

  useEffect(() => {
    if (classId) {
      loadData();
    }
  }, [classId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [classRes, studentsRes] = await Promise.all([
        fetch(`/api/Classes/${classId}`),
        fetch(`/api/classes/${classId}/students`),
      ]);

      if (classRes.ok) {
        const classData = await classRes.json();
        setClassData(classData);
      }

      if (studentsRes.ok) {
        const students = await studentsRes.json();
        setEnrolledStudents(students);

        // Initialize attendance records for current date
        const records: AttendanceRecord[] = students.map(
          (student: Student) => ({
            studentClassId: 0, // This would need to be fetched from a student-class relation endpoint
            studentId: student.id,
            studentName: `${student.firstName} ${student.lastName}`,
            status: AttendanceStatus.Present,
            notes: "",
          }),
        );
        setAttendanceRecords(records);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load class data");
    } finally {
      setLoading(false);
    }
  };

  const updateAttendanceStatus = (
    studentId: number,
    status: AttendanceStatus,
  ) => {
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.studentId === studentId ? { ...record, status } : record,
      ),
    );
  };

  const updateAttendanceNotes = (studentId: number, notes: string) => {
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.studentId === studentId ? { ...record, notes } : record,
      ),
    );
  };

  const saveAttendance = async () => {
    try {
      setSaving(true);

      // Save attendance for each student
      const promises = attendanceRecords.map(async (record) => {
        const response = await fetch(
          `/api/Classes/student-class/${record.studentClassId}/attendance`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              attendedAt: new Date(selectedDate).toISOString(),
              status: record.status.toString(),
              notes: record.notes || null,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to save attendance for ${record.studentName}`,
          );
        }
      });

      await Promise.all(promises);

      // Show success message or refresh data
      console.log("Attendance saved successfully");
    } catch (error) {
      console.error("Error saving attendance:", error);
      setError("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const viewStudentHistory = async (student: Student) => {
    try {
      // Note: This endpoint might need the student-class relationship ID
      const response = await fetch(
        `/api/Classes/student/${student.id}/attendance`,
      );

      if (response.ok) {
        const history = await response.json();
        setSelectedStudentHistory(history);
        setSelectedStudentName(`${student.firstName} ${student.lastName}`);
        setHistoryDialogOpen(true);
      }
    } catch (error) {
      console.error("Error loading student history:", error);
    }
  };

  const getStatusChipProps = (status: AttendanceStatus) => {
    const option = attendanceStatusOptions.find((opt) => opt.value === status);
    return {
      label: option?.label || "Unknown",
      color: (option?.color || "default") as
        | "success"
        | "error"
        | "warning"
        | "info"
        | "default"
        | "primary"
        | "secondary",
    };
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

  return (
    <div>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate("/classes")} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <h2 className="page-title">Attendance - {classData.name}</h2>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
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
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Schedules:</strong>{" "}
                {formatSchedules(classData.schedules)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Students:</strong> {enrolledStudents.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography variant="h6">Take Attendance</Typography>
                <Box display="flex" gap={2} alignItems="center">
                  <TextField
                    label="Date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={saveAttendance}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Attendance"}
                  </Button>
                </Box>
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
                  {attendanceRecords.map((record, index) => {
                    const student = enrolledStudents.find(
                      (s) => s.id === record.studentId,
                    );
                    if (!student) return null;

                    return (
                      <React.Fragment key={record.studentId}>
                        <ListItem>
                          <ListItemText
                            primary={record.studentName}
                            secondary={student.email}
                          />
                          <ListItemSecondaryAction>
                            <Box display="flex" alignItems="center" gap={2}>
                              <FormControl size="small" sx={{ minWidth: 120 }}>
                                <Select
                                  value={record.status}
                                  onChange={(e) =>
                                    updateAttendanceStatus(
                                      record.studentId,
                                      e.target.value as AttendanceStatus,
                                    )
                                  }
                                >
                                  {attendanceStatusOptions.map((option) => (
                                    <MenuItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>

                              <TextField
                                placeholder="Notes"
                                size="small"
                                value={record.notes}
                                onChange={(e) =>
                                  updateAttendanceNotes(
                                    record.studentId,
                                    e.target.value,
                                  )
                                }
                                sx={{ width: 120 }}
                              />

                              <IconButton
                                size="small"
                                onClick={() => viewStudentHistory(student)}
                                title="View history"
                              >
                                <History />
                              </IconButton>
                            </Box>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < attendanceRecords.length - 1 && <Divider />}
                      </React.Fragment>
                    );
                  })}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Attendance History Dialog */}
      <Dialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Attendance History - {selectedStudentName}</DialogTitle>
        <DialogContent>
          {selectedStudentHistory.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              py={3}
            >
              No attendance history found for this student.
            </Typography>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedStudentHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {record.attendedAt
                          ? new Date(record.attendedAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          {...getStatusChipProps(
                            record.status as unknown as AttendanceStatus,
                          )}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{record.notes || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
