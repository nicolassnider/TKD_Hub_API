import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Chip,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import {
  CreateTrainingClassDto,
  TrainingClassDto,
  ClassScheduleDto,
  DayOfWeek,
} from "../types/api";
import { useFormData } from "../hooks/useFormData";
import { CoachSelect, DojaangSelect } from "./FormFields";

interface ClassFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (classData: CreateTrainingClassDto) => Promise<void>;
  initialData?: TrainingClassDto | null;
  title: string;
}

const dayNames = {
  [DayOfWeek.Sunday]: "Sunday",
  [DayOfWeek.Monday]: "Monday",
  [DayOfWeek.Tuesday]: "Tuesday",
  [DayOfWeek.Wednesday]: "Wednesday",
  [DayOfWeek.Thursday]: "Thursday",
  [DayOfWeek.Friday]: "Friday",
  [DayOfWeek.Saturday]: "Saturday",
};

export default function ClassForm({
  open,
  onClose,
  onSubmit,
  initialData,
  title,
}: ClassFormProps) {
  const [formData, setFormData] = useState<CreateTrainingClassDto>({
    name: "",
    dojaangId: 0,
    coachId: 0,
    schedules: [],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use the centralized form data hook - only fetch when dialog is open
  const { coaches, dojaangs } = useFormData({
    includeCoaches: open,
    includeDojaangs: open,
  });

  // Set initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        dojaangId: initialData.dojaangId,
        coachId: initialData.coachId || 0,
        schedules: initialData.schedules || [],
      });
    } else {
      setFormData({
        name: "",
        dojaangId: 0,
        coachId: 0,
        schedules: [],
      });
    }
    setErrors({});
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.dojaangId) {
      newErrors.dojaangId = "Dojaang is required";
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

  const addSchedule = () => {
    setFormData((prev) => ({
      ...prev,
      schedules: [
        ...(prev.schedules || []),
        {
          id: 0,
          day: DayOfWeek.Monday,
          startTime: "09:00",
          endTime: "10:00",
        },
      ],
    }));
  };

  const removeSchedule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      schedules: (prev.schedules || []).filter((_, i) => i !== index),
    }));
  };

  const updateSchedule = (
    index: number,
    field: keyof ClassScheduleDto,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      schedules: (prev.schedules || []).map((schedule, i) =>
        i === index ? { ...schedule, [field]: value } : schedule,
      ),
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Class Name"
                fullWidth
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DojaangSelect
                dojaangs={dojaangs}
                value={formData.dojaangId}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, dojaangId: value }))
                }
                error={errors.dojaangId}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CoachSelect
                coaches={coaches}
                value={formData.coachId || 0}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, coachId: value }))
                }
                label="Coach (Optional)"
                required={false}
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Typography variant="h6">Class Schedules</Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={addSchedule}
                  size="small"
                >
                  Add Schedule
                </Button>
              </Box>

              {(formData.schedules || []).map((schedule, index) => (
                <Box
                  key={index}
                  mb={2}
                  p={2}
                  border={1}
                  borderColor="grey.300"
                  borderRadius={1}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Day</InputLabel>
                        <Select
                          value={schedule.day}
                          onChange={(e) =>
                            updateSchedule(index, "day", e.target.value)
                          }
                          label="Day"
                        >
                          {Object.entries(dayNames).map(([value, label]) => (
                            <MenuItem key={value} value={Number(value)}>
                              {label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Start Time"
                        type="time"
                        fullWidth
                        size="small"
                        value={schedule.startTime}
                        onChange={(e) =>
                          updateSchedule(index, "startTime", e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="End Time"
                        type="time"
                        fullWidth
                        size="small"
                        value={schedule.endTime}
                        onChange={(e) =>
                          updateSchedule(index, "endTime", e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <IconButton
                        onClick={() => removeSchedule(index)}
                        color="error"
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}

              {(formData.schedules || []).length === 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  py={2}
                >
                  No schedules added yet. Click "Add Schedule" to add class
                  times.
                </Typography>
              )}
            </Grid>
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
