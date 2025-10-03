import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Paper,
  Stack,
} from "@mui/material";
import {
  School as SchoolIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Groups as GroupsIcon,
} from "@mui/icons-material";
import { TrainingClass } from "../../types/api";
import { ClassSchedule } from "./ClassSchedule";

interface ClassInformationProps {
  currentClass: TrainingClass;
  enrolledStudentsCount: number;
}

export const ClassInformation: React.FC<ClassInformationProps> = ({
  currentClass,
  enrolledStudentsCount,
}) => {
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
                  value={currentClass.dojaangName || "No location assigned"}
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
                      <PersonIcon sx={{ mr: 1, color: "secondary.main" }} />
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
                  value={`${enrolledStudentsCount} students`}
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

        <ClassSchedule currentClass={currentClass} />
      </CardContent>
    </Card>
  );
};
