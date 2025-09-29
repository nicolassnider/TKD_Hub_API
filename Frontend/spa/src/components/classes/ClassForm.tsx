import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useClassContext } from "../context/ClassContext";
import { useFormData } from "../hooks/useFormData";
import { CoachSelect, DojaangSelect } from "./FormFields";
import {
  CreateTrainingClassDto,
  UpdateTrainingClassDto,
  TrainingClass,
  CreateClassScheduleDto,
  DAYS_OF_WEEK,
  ScheduleConflict,
} from "../types/classes";

interface ClassFormProps {
  open: boolean;
  onClose: () => void;
  trainingClass?: TrainingClass | null;
  mode: "create" | "edit";
}

interface ScheduleFormData {
  day: number;
  startTime: string;
  endTime: string;
}

export const ClassForm: React.FC<ClassFormProps> = ({
  open,
  onClose,
  trainingClass,
  mode,
}) => {
  const { createClass, updateClass, loading, validateSchedule } =
    useClassContext();
  const { coaches, dojaangs } = useFormData();
  const [name, setName] = useState("");
  const [dojaangId, setDojaangId] = useState<number>(0);
  const [coachId, setCoachId] = useState<number>(0);
  const [schedules, setSchedules] = useState<ScheduleFormData[]>([]);
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);
  const [validating, setValidating] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (trainingClass && mode === "edit") {
      setName(trainingClass.name);
      setDojaangId(trainingClass.dojaangId);
      setCoachId(trainingClass.coachId);
      setSchedules(
        trainingClass.schedules.map((s) => ({
          day: s.day,
          startTime: s.startTime,
          endTime: s.endTime,
        })),
      );
    } else {
      // Reset for create mode
      setName("");
      setDojaangId(0);
      setCoachId(0);
      setSchedules([]);
    }
    setConflicts([]);
  }, [trainingClass, mode, open]);

  const handleClose = () => {
    setName("");
    setDojaangId(0);
    setCoachId(0);
    setSchedules([]);
    setConflicts([]);
    onClose();
  };

  const addSchedule = () => {
    setSchedules((prev) => [
      ...prev,
      {
        day: 1, // Monday default
        startTime: "19:00",
        endTime: "20:00",
      },
    ]);
  };

  const removeSchedule = (index: number) => {
    setSchedules((prev) => prev.filter((_, i) => i !== index));
    setConflicts([]);
  };

  const updateSchedule = (
    index: number,
    field: keyof ScheduleFormData,
    value: any,
  ) => {
    setSchedules((prev) =>
      prev.map((schedule, i) =>
        i === index ? { ...schedule, [field]: value } : schedule,
      ),
    );
    setConflicts([]); // Clear conflicts when schedule changes
  };

  const validateScheduleConflicts = async () => {
    if (schedules.length === 0 || !coachId) return;

    try {
      setValidating(true);
      const scheduleData = schedules.map((s) => ({
        day: s.day,
        startTime: s.startTime,
        endTime: s.endTime,
      }));

      const foundConflicts = await validateSchedule(
        scheduleData,
        coachId,
        mode === "edit" ? trainingClass?.id : undefined,
      );

      setConflicts(foundConflicts);
    } catch (error) {
      console.error("Error validating schedule:", error);
    } finally {
      setValidating(false);
    }
  };

  // Validate on coach or schedule change
  useEffect(() => {
    if (coachId && schedules.length > 0) {
      const debounce = setTimeout(validateScheduleConflicts, 500);
      return () => clearTimeout(debounce);
    }
  }, [coachId, schedules]);

  const handleSubmit = async () => {
    if (!name.trim() || !dojaangId || !coachId || schedules.length === 0) {
      alert("Please fill in all required fields and add at least one schedule");
      return;
    }

    if (conflicts.length > 0) {
      const confirmSubmit = window.confirm(
        "There are schedule conflicts. Do you want to continue anyway?",
      );
      if (!confirmSubmit) return;
    }

    try {
      const scheduleData: CreateClassScheduleDto[] = schedules.map((s) => ({
        day: s.day,
        startTime: s.startTime,
        endTime: s.endTime,
      }));

      if (mode === "create") {
        const createData: CreateTrainingClassDto = {
          name: name.trim(),
          dojaangId,
          coachId,
          schedules: scheduleData,
        };
        await createClass(createData);
      } else if (mode === "edit" && trainingClass) {
        const updateData: UpdateTrainingClassDto = {
          id: trainingClass.id,
          name: name.trim(),
          dojaangId,
          coachId,
          schedules: scheduleData,
        };
        await updateClass(trainingClass.id, updateData);
      }

      handleClose();
    } catch (error) {
      console.error("Error saving class:", error);
    }
  };

  const getDayName = (day: number) => {
    return DAYS_OF_WEEK.find((d) => d.value === day)?.label || "Unknown";
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Remove seconds if present
  };

  const isFormValid =
    name.trim() && dojaangId && coachId && schedules.length > 0;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: "70vh" },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ScheduleIcon />
          {mode === "create"
            ? "Create New Training Class"
            : "Edit Training Class"}
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 3, p: 3 }}
      >
        {/* Basic Information */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PersonIcon />
                Basic Information
              </Box>
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Class Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                  placeholder="e.g., Adult Classes, Kids Morning, Beginners"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DojaangSelect
                  dojaangs={dojaangs}
                  value={dojaangId}
                  onChange={setDojaangId}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <CoachSelect
                  coaches={coaches}
                  value={coachId}
                  onChange={setCoachId}
                  required
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Schedule Management */}
        <Card variant="outlined">
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
                  <ScheduleIcon />
                  Class Schedules
                </Box>
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addSchedule}
                size="small"
              >
                Add Schedule
              </Button>
            </Box>

            {schedules.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 3, color: "text.secondary" }}>
                <ScheduleIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                <Typography variant="body2">
                  No schedules added yet. Click "Add Schedule" to create one.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {schedules.map((schedule, index) => (
                  <Card
                    key={index}
                    variant="outlined"
                    sx={{ bgcolor: "grey.50" }}
                  >
                    <CardContent sx={{ pb: "16px !important" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Typography variant="subtitle2" color="primary">
                          Schedule {index + 1}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => removeSchedule(index)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>

                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Day of Week</InputLabel>
                            <Select
                              value={schedule.day}
                              label="Day of Week"
                              onChange={(e) =>
                                updateSchedule(index, "day", e.target.value)
                              }
                            >
                              {DAYS_OF_WEEK.map((day) => (
                                <MenuItem key={day.value} value={day.value}>
                                  {day.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <TextField
                            label="Start Time"
                            type="time"
                            value={schedule.startTime}
                            onChange={(e) =>
                              updateSchedule(index, "startTime", e.target.value)
                            }
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <TextField
                            label="End Time"
                            type="time"
                            value={schedule.endTime}
                            onChange={(e) =>
                              updateSchedule(index, "endTime", e.target.value)
                            }
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={2}>
                          <Chip
                            label={`${getDayName(schedule.day).substring(0, 3)} ${formatTime(schedule.startTime)}-${formatTime(schedule.endTime)}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Schedule Conflicts */}
        {validating && (
          <Alert severity="info">Validating schedule conflicts...</Alert>
        )}

        {conflicts.length > 0 && (
          <Alert severity="warning">
            <Typography variant="subtitle2" gutterBottom>
              Schedule Conflicts Detected:
            </Typography>
            {conflicts.map((conflict, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                • {conflict.conflictType.toUpperCase()}: {conflict.details}(
                {getDayName(conflict.day)} {conflict.timeRange})
              </Typography>
            ))}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !isFormValid}
        >
          {loading
            ? "Saving..."
            : mode === "create"
              ? "Create Class"
              : "Update Class"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
