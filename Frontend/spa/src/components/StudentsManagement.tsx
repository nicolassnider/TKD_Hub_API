import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { Edit, Delete, Add, Visibility } from "@mui/icons-material";
import { fetchJson } from "../lib/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Student, StudentFormData, Rank, Dojaang } from "../types";

const initialFormData: StudentFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  emergencyContact: "",
  emergencyPhone: "",
  currentRankId: "",
  dojaangId: "",
  isActive: true,
  joinDate: new Date().toISOString().split("T")[0],
  parentName: "",
  parentEmail: "",
  parentPhone: "",
  medicalNotes: "",
};

export default function StudentsManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [dojaangs, setDojaangs] = useState<Dojaang[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [studentsData, ranksData, dojaangsData] = await Promise.all([
        fetchJson("/api/students") as Promise<Student[]>,
        fetchJson("/api/ranks") as Promise<Rank[]>,
        fetchJson("/api/dojaangs") as Promise<Dojaang[]>,
      ]);

      setStudents(studentsData);
      setRanks(ranksData);
      setDojaangs(dojaangsData);
    } catch (error) {
      toast.error("Failed to load data");
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phoneNumber: student.phoneNumber || "",
        dateOfBirth: student.dateOfBirth.split("T")[0],
        emergencyContact: student.emergencyContact,
        emergencyPhone: student.emergencyPhone,
        currentRankId: student.currentRankId,
        dojaangId: student.dojaangId,
        isActive: student.isActive,
        joinDate: student.joinDate.split("T")[0],
        parentName: student.parentName || "",
        parentEmail: student.parentEmail || "",
        parentPhone: student.parentPhone || "",
        medicalNotes: student.medicalNotes || "",
      });
    } else {
      setEditingStudent(null);
      setFormData(initialFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingStudent(null);
    setFormData(initialFormData);
  };

  const handleInputChange = (field: keyof StudentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const studentData = {
        ...formData,
        currentRankId: Number(formData.currentRankId),
        dojaangId: Number(formData.dojaangId),
        phoneNumber: formData.phoneNumber || null,
        parentName: formData.parentName || null,
        parentEmail: formData.parentEmail || null,
        parentPhone: formData.parentPhone || null,
        medicalNotes: formData.medicalNotes || null,
      };

      if (editingStudent) {
        await fetchJson(`/api/students/${editingStudent.id}`, {
          method: "PUT",
          body: JSON.stringify(studentData),
        });
        toast.success("Student updated successfully");
      } else {
        await fetchJson("/api/students", {
          method: "POST",
          body: JSON.stringify(studentData),
        });
        toast.success("Student created successfully");
      }

      handleCloseDialog();
      loadData();
    } catch (error) {
      toast.error(
        editingStudent
          ? "Failed to update student"
          : "Failed to create student",
      );
      console.error("Error saving student:", error);
    }
  };

  const handleDelete = async (studentId: number) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      await fetchJson(`/api/students/${studentId}`, { method: "DELETE" });
      toast.success("Student deleted successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to delete student");
      console.error("Error deleting student:", error);
    }
  };

  const handleViewStudent = (studentId: number) => {
    navigate(`/students/${studentId}`);
  };

  if (loading) {
    return <Typography>Loading students...</Typography>;
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Students Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Create Student
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rank</TableCell>
              <TableCell>Dojaang</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {student.firstName} {student.lastName}
                  </Typography>
                  {student.phoneNumber && (
                    <Typography variant="caption" color="text.secondary">
                      {student.phoneNumber}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  <Chip
                    label={student.currentRankName}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{student.dojaangName}</TableCell>
                <TableCell>
                  {new Date(student.joinDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={student.isActive ? "Active" : "Inactive"}
                    color={student.isActive ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewStudent(student.id)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDialog(student)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(student.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingStudent ? "Edit Student" : "Create New Student"}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <Box display="flex" gap={2}>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
                fullWidth
              />
            </Box>

            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              fullWidth
            />

            <Box display="flex" gap={2}>
              <TextField
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                fullWidth
              />
              <TextField
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
            </Box>

            <Box display="flex" gap={2}>
              <TextField
                label="Emergency Contact"
                value={formData.emergencyContact}
                onChange={(e) =>
                  handleInputChange("emergencyContact", e.target.value)
                }
                required
                fullWidth
              />
              <TextField
                label="Emergency Phone"
                value={formData.emergencyPhone}
                onChange={(e) =>
                  handleInputChange("emergencyPhone", e.target.value)
                }
                required
                fullWidth
              />
            </Box>

            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel>Current Rank</InputLabel>
                <Select
                  value={formData.currentRankId}
                  onChange={(e) =>
                    handleInputChange("currentRankId", e.target.value)
                  }
                  required
                >
                  {ranks.map((rank) => (
                    <MenuItem key={rank.id} value={rank.id}>
                      {rank.name} ({rank.koreanName})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Dojaang</InputLabel>
                <Select
                  value={formData.dojaangId}
                  onChange={(e) =>
                    handleInputChange("dojaangId", e.target.value)
                  }
                  required
                >
                  {dojaangs.map((dojaang) => (
                    <MenuItem key={dojaang.id} value={dojaang.id}>
                      {dojaang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Typography variant="h6" mt={2}>
              Parent/Guardian Information
            </Typography>

            <Box display="flex" gap={2}>
              <TextField
                label="Parent/Guardian Name"
                value={formData.parentName}
                onChange={(e) =>
                  handleInputChange("parentName", e.target.value)
                }
                fullWidth
              />
              <TextField
                label="Parent/Guardian Email"
                type="email"
                value={formData.parentEmail}
                onChange={(e) =>
                  handleInputChange("parentEmail", e.target.value)
                }
                fullWidth
              />
            </Box>

            <TextField
              label="Parent/Guardian Phone"
              value={formData.parentPhone}
              onChange={(e) => handleInputChange("parentPhone", e.target.value)}
              fullWidth
            />

            <TextField
              label="Medical Notes"
              value={formData.medicalNotes}
              onChange={(e) =>
                handleInputChange("medicalNotes", e.target.value)
              }
              multiline
              rows={3}
              fullWidth
            />

            <Box display="flex" gap={2}>
              <TextField
                label="Join Date"
                type="date"
                value={formData.joinDate}
                onChange={(e) => handleInputChange("joinDate", e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.isActive ? "true" : "false"}
                  onChange={(e) =>
                    handleInputChange("isActive", e.target.value === "true")
                  }
                >
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingStudent ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
