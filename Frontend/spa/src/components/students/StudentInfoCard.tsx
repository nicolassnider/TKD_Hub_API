import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Box,
  Paper,
  TextField,
  Avatar,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import { fetchJson } from "../../lib/api";
import { UserDto } from "../../types/api";

// Local Student type for display (extends UserDto with computed fields)
type Student = UserDto & {
  fullName?: string; // computed from firstName + lastName
  currentRank?: string; // alias for currentRankName
  phone?: string; // alias for phoneNumber
};

interface StudentInfoCardProps {
  student: Student;
  className?: string;
  showHeader?: boolean;
}

export const StudentInfoCard: React.FC<StudentInfoCardProps> = ({
  student,
  className = "",
  showHeader = true,
}) => {
  // State for additional data
  const [rankName, setRankName] = useState<string>("");
  const [dojaangName, setDojaangName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Effect to fetch additional data when student changes
  useEffect(() => {
    const fetchAdditionalData = async () => {
      if (!student) return;

      setLoading(true);
      try {
        const promises = [];

        // Fetch rank name if currentRankId exists
        if (student.currentRankId) {
          promises.push(
            fetchJson(`/api/Ranks/${student.currentRankId}`)
              .then((rank: any) => setRankName(rank.data?.name || ""))
              .catch(() => setRankName("")),
          );
        }

        // Fetch dojaang name if dojaangId exists
        if (student.dojaangId) {
          promises.push(
            fetchJson(`/api/Dojaangs/${student.dojaangId}`)
              .then((dojaang: any) => setDojaangName(dojaang.data?.name || ""))
              .catch(() => setDojaangName("")),
          );
        }

        await Promise.all(promises);
      } catch (error) {
        console.error("Error fetching additional data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Reset names when student changes and fetch new data
    setRankName("");
    setDojaangName("");

    if (student && (student.currentRankId || student.dojaangId)) {
      fetchAdditionalData();
    }
  }, [student?.id, student?.currentRankId, student?.dojaangId]);

  // Dark theme TextField styling
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

  const getStudentInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const getGenderText = (gender: number) => {
    switch (gender) {
      case 0:
        return "Male";
      case 1:
        return "Female";
      default:
        return "Not specified";
    }
  };

  if (!student) {
    return null;
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1000,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      className={className}
    >
      {showHeader && (
        <>
          {/* Header with Avatar and Status */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 4,
              mb: 5,
              width: "100%",
              maxWidth: 900,
              justifyContent: "center",
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                background:
                  "linear-gradient(135deg, var(--primary), var(--accent))",
                color: "white",
                fontWeight: 700,
                fontSize: "2rem",
              }}
            >
              {getStudentInitials(
                student.firstName || "",
                student.lastName || "",
              )}
            </Avatar>

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
                {`${student.firstName || ""} ${student.lastName || ""}`.trim() ||
                  "Student"}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  flexWrap: "wrap",
                  mb: 3,
                }}
              >
                <Chip
                  label={student.isActive ? "Active" : "Inactive"}
                  icon={student.isActive ? <ActiveIcon /> : <InactiveIcon />}
                  sx={{
                    bgcolor: student.isActive
                      ? "var(--success-50)"
                      : "var(--error-50)",
                    color: student.isActive ? "var(--success)" : "var(--error)",
                    fontWeight: 600,
                    "& .MuiChip-icon": {
                      color: student.isActive
                        ? "var(--success)"
                        : "var(--error)",
                    },
                  }}
                />
                {rankName && (
                  <Chip
                    label={rankName}
                    icon={<BadgeIcon />}
                    variant="outlined"
                    sx={{
                      borderColor: "var(--gold)",
                      color: "var(--gold)",
                      "& .MuiChip-icon": {
                        color: "var(--gold)",
                      },
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </>
      )}

      {/* Student Information Card */}
      <Card
        elevation={2}
        sx={{
          borderRadius: "16px",
          bgcolor: "var(--panel-elevated)",
          border: "1px solid",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow-lg)",
          color: "var(--fg)",
          width: "100%",
          maxWidth: 900,
        }}
        className="auth-card"
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: "var(--primary)",
              fontWeight: 700,
              mb: 3,
              fontSize: "1.5rem",
            }}
            className="page-title"
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon sx={{ color: "var(--gold)" }} />
              Student Information
            </Box>
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              p: 4,
              bgcolor: "var(--panel)",
              borderColor: "var(--border)",
              boxShadow: "var(--shadow)",
              borderRadius: "12px",
            }}
          >
            <Grid container spacing={3.5}>
              {/* Full Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  value={`${student.firstName || ""} ${student.lastName || ""}`.trim()}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <PersonIcon sx={{ mr: 1, color: "var(--primary)" }} />
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
                    },
                    "& .MuiInputLabel-root": {
                      color: "var(--primary)",
                      fontWeight: 600,
                    },
                  }}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  value={student.email || "Not provided"}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <EmailIcon sx={{ mr: 1, color: "var(--accent)" }} />
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                  sx={darkTextFieldSx}
                />
              </Grid>

              {/* Phone */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  value={student.phoneNumber || "Not provided"}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <PhoneIcon sx={{ mr: 1, color: "var(--accent)" }} />
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                  sx={darkTextFieldSx}
                />
              </Grid>

              {/* Gender */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Gender"
                  value={getGenderText(student.gender ?? -1)}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <PersonIcon sx={{ mr: 1, color: "var(--gold)" }} />
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                  sx={darkTextFieldSx}
                />
              </Grid>

              {/* Date of Birth */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Birth"
                  value={
                    student.dateOfBirth
                      ? new Date(student.dateOfBirth).toLocaleDateString()
                      : "Not provided"
                  }
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <CalendarIcon sx={{ mr: 1, color: "var(--primary)" }} />
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                  sx={darkTextFieldSx}
                />
              </Grid>

              {/* Join Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Join Date"
                  value={
                    student.joinDate
                      ? new Date(student.joinDate).toLocaleDateString()
                      : "Not provided"
                  }
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <CalendarIcon sx={{ mr: 1, color: "var(--success)" }} />
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                  sx={{
                    ...darkTextFieldSx,
                    "& .MuiInputBase-input": {
                      ...darkTextFieldSx["& .MuiInputBase-input"],
                      color: "var(--success)",
                    },
                  }}
                />
              </Grid>

              {/* Dojaang */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Dojaang"
                  value={
                    dojaangName ||
                    `Dojaang ID: ${student.dojaangId || "Not assigned"}`
                  }
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <HomeIcon sx={{ mr: 1, color: "var(--gold)" }} />
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                  sx={darkTextFieldSx}
                />
              </Grid>

              {/* Current Rank */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Current Rank"
                  value={
                    rankName ||
                    `Rank ID: ${student.currentRankId || "Not assigned"}`
                  }
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <BadgeIcon sx={{ mr: 1, color: "var(--gold)" }} />
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                  sx={{
                    ...darkTextFieldSx,
                    "& .MuiInputBase-input": {
                      ...darkTextFieldSx["& .MuiInputBase-input"],
                      color: "var(--gold)",
                      fontWeight: 600,
                    },
                  }}
                />
              </Grid>

              {/* Roles */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Roles"
                  value={
                    Array.isArray(student.roles)
                      ? student.roles.join(", ")
                      : "No roles assigned"
                  }
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <BadgeIcon sx={{ mr: 1, color: "var(--primary)" }} />
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                  sx={{
                    ...darkTextFieldSx,
                    "& .MuiInputBase-input": {
                      ...darkTextFieldSx["& .MuiInputBase-input"],
                      color: "var(--primary)",
                      fontWeight: 500,
                    },
                  }}
                />
              </Grid>

              {/* Student ID */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Student ID"
                  value={student.id}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="outlined"
                  fullWidth
                  sx={{
                    ...darkTextFieldSx,
                    "& .MuiInputBase-input": {
                      ...darkTextFieldSx["& .MuiInputBase-input"],
                      color: "var(--fg-subtle)",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentInfoCard;
