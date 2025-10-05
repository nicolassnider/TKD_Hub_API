import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Box,
  Autocomplete,
} from "@mui/material";
import { CreatePromotionDto, PromotionDto } from "types/api";
import { UserDto } from "../../types/api";
import { useFormData } from "../../hooks/useFormData";


// Type alias for this component
type Student = UserDto;
import {
  CoachSelect,
  DojaangSelect,
  RankSelect,
} from "components/forms/FormFields";


interface PromotionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (promotionData: CreatePromotionDto) => Promise<void>;
  initialData?: PromotionDto | null;
  title: string;
  preselectedStudentId?: number;
}


export default function PromotionForm({
  open,
  onClose,
  onSubmit,
  initialData,
  title,
  preselectedStudentId,
}: PromotionFormProps) {
  const [formData, setFormData] = useState<CreatePromotionDto>({
    studentId: 0,
    rankId: 0,
    promotionDate: new Date().toISOString().split("T")[0],
    coachId: 0,
    notes: "",
    dojaangId: 0,
  });


  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [hasProcessedPreselection, setHasProcessedPreselection] =
    useState(false);


  // Use the centralized form data hook - only fetch when dialog is open
  const { students, coaches, dojaangs, ranks } = useFormData({
    includeStudents: open,
    includeCoaches: open,
    includeDojaangs: open,
    includeRanks: open,
  });


  // Set initial data when editing
  useEffect(() => {
    if (!open) return; // Don't reset if dialog is closed


    if (initialData) {
      setFormData({
        studentId: initialData.studentId,
        rankId: initialData.rankId,
        promotionDate: initialData.promotionDate.split("T")[0], // Convert to date input format
        coachId: initialData.coachId,
        notes: initialData.notes || "",
        dojaangId: initialData.dojaangId,
      });
      setHasProcessedPreselection(true);
    } else {
      setFormData({
        studentId: preselectedStudentId || 0,
        rankId: 0,
        promotionDate: new Date().toISOString().split("T")[0],
        coachId: 0,
        notes: "",
        dojaangId: 0,
      });
      setSelectedStudent(null);
      setHasProcessedPreselection(false);
    }
    setErrors({});
  }, [initialData, open, preselectedStudentId]);


  // Set selected student when students are loaded and we have initialData
  useEffect(() => {
    if (initialData && students && students.length > 0 && !selectedStudent) {
      const student = students.find((s) => s.id === initialData.studentId);
      setSelectedStudent(student || null);
    }
  }, [initialData, students, selectedStudent]);


  // Handle preselected student and auto-suggest next rank
  useEffect(() => {
    if (
      open &&
      preselectedStudentId &&
      students &&
      students.length > 0 &&
      ranks &&
      ranks.length > 0 &&
      !initialData &&
      !hasProcessedPreselection
    ) {
      const student = students.find((s) => s.id === preselectedStudentId);
      if (student) {
        setSelectedStudent(student);
        setFormData((prev) => ({
          ...prev,
          studentId: student.id,
        }));


        // Auto-suggest next rank if student has a current rank
        if (student.currentRankId) {
          const currentRank = ranks.find(
            (rank) => rank.id === student.currentRankId,
          );
          if (currentRank) {
            // Find the next rank (assuming ranks are ordered by level/order)
            const sortedRanks = ranks
              .filter((rank) => rank.order !== undefined)
              .sort(
                (firstRank, secondRank) =>
                  (firstRank.order || 0) - (secondRank.order || 0),
              );


            const currentRankIndex = sortedRanks.findIndex(
              (rank) => rank.id === student.currentRankId,
            );
            const nextRank = sortedRanks[currentRankIndex + 1];


            if (nextRank) {
              setFormData((prev) => ({
                ...prev,
                rankId: nextRank.id,
              }));
            }
          }
        }
        setHasProcessedPreselection(true);
      }
    }
  }, [
    open,
    preselectedStudentId,
    students,
    ranks,
    initialData,
    hasProcessedPreselection,
  ]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.studentId) {
      newErrors.studentId = "Student is required";
    }
    if (!formData.rankId) {
      newErrors.rankId = "Rank is required";
    }
    if (!formData.coachId) {
      newErrors.coachId = "Coach is required";
    }
    if (!formData.dojaangId) {
      newErrors.dojaangId = "Dojaang is required";
    }
    if (!formData.promotionDate) {
      newErrors.promotionDate = "Promotion date is required";
    }


    setErrors(newErrors);


    if (Object.keys(newErrors).length > 0) {
      return;
    }


    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleStudentChange = (student: Student | null) => {
    setSelectedStudent(student);
    setFormData((prev) => ({
      ...prev,
      studentId: student?.id || 0,
      dojaangId: 0, // Reset dojaang when student changes
    }));
  };


  // Get available ranks (higher than current rank)
  const getAvailableRanks = () => {
    if (!ranks || !selectedStudent?.currentRankId) return ranks || [];


    const currentRank = ranks.find(
      (rank) => rank.id === selectedStudent.currentRankId,
    );
    if (!currentRank || currentRank.order === undefined) return ranks;


    const currentRankOrder = currentRank.order;
    return ranks.filter(
      (rank) => rank.order !== undefined && rank.order > currentRankOrder,
    );
  };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                options={students || []}
                getOptionLabel={(student) =>
                  `${student.firstName} ${student.lastName}${student.currentRankName ? ` (${student.currentRankName})` : ""}`
                }
                value={selectedStudent}
                onChange={(_, newValue) => handleStudentChange(newValue)}
                disabled={!!preselectedStudentId && !initialData}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      preselectedStudentId && !initialData
                        ? "Student (Selected)"
                        : "Student"
                    }
                    error={!!errors.studentId}
                    helperText={errors.studentId}
                    required
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
                      {student.currentRankName && (
                        <Typography variant="body2" color="primary">
                          Current Rank: {student.currentRankName}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              />
            </Grid>


            <Grid item xs={12} md={6}>
              <RankSelect
                ranks={ranks || []}
                availableRanks={getAvailableRanks()}
                value={formData.rankId}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, rankId: value }))
                }
                error={errors.rankId}
                label="New Rank"
                required
              />
            </Grid>


            <Grid item xs={12} md={6}>
              <TextField
                label="Promotion Date"
                type="date"
                fullWidth
                value={formData.promotionDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    promotionDate: e.target.value,
                  }))
                }
                error={!!errors.promotionDate}
                helperText={errors.promotionDate}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>


            <Grid item xs={12} md={6}>
              <CoachSelect
                coaches={coaches || []}
                value={formData.coachId}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, coachId: value }))
                }
                error={errors.coachId}
                label="Promoting Coach"
                required
              />
            </Grid>


            <Grid item xs={12} md={6}>
              <DojaangSelect
                dojaangs={dojaangs || []}
                value={formData.dojaangId}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, dojaangId: value }))
                }
                error={errors.dojaangId}
                required
              />
            </Grid>


            <Grid item xs={12}>
              <TextField
                label="Notes (Optional)"
                fullWidth
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Add any notes about this promotion..."
              />
            </Grid>


            {selectedStudent && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    border: 1,
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Student Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Current Rank:</strong>{" "}
                    {selectedStudent.currentRankName || "No rank assigned"}
                  </Typography>
                  {selectedStudent.email && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Email:</strong> {selectedStudent.email}
                    </Typography>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>


        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving..." : initialData ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}