import React from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import { Schedule as ScheduleIcon } from "@mui/icons-material";
import { TrainingClass, DAYS_OF_WEEK } from "../../types/api";

interface ClassScheduleProps {
  currentClass: TrainingClass;
}

export const ClassSchedule: React.FC<ClassScheduleProps> = ({
  currentClass,
}) => {
  const getDayName = (day: number) => {
    return DAYS_OF_WEEK.find((d) => d.value === day)?.label || "Unknown";
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Remove seconds if present
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

  return (
    <>
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
    </>
  );
};
