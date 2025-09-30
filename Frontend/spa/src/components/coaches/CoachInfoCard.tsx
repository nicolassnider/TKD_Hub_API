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
  School as SchoolIcon,
} from "@mui/icons-material";
import { fetchJson } from "../../lib/api";
import { CoachDto, Gender } from "../../types/api";

interface CoachInfoCardProps {
  coach: CoachDto;
  className?: string;
  showHeader?: boolean;
}

export const CoachInfoCard: React.FC<CoachInfoCardProps> = ({
  coach,
  className = "",
  showHeader = true,
}) => {
  // State for additional data
  const [rankName, setRankName] = useState<string>("");
  const [dojaangName, setDojaangName] = useState<string>("");
  const [managedDojaangs, setManagedDojaangs] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Effect to fetch additional data when coach changes
  useEffect(() => {
    const fetchAdditionalData = async () => {
      if (!coach) return;

      setLoading(true);
      try {
        const promises = [];

        // Fetch rank name if rankId exists
        if (coach.rankId) {
          promises.push(
            fetchJson(`/api/Ranks/${coach.rankId}`)
              .then((rank: any) => setRankName(rank.data?.name || ""))
              .catch(() => setRankName("")),
          );
        }

        // Fetch dojaang name if dojaangId exists
        if (coach.dojaangId) {
          promises.push(
            fetchJson(`/api/Dojaangs/${coach.dojaangId}`)
              .then((dojaang: any) => setDojaangName(dojaang.data?.name || ""))
              .catch(() => setDojaangName("")),
          );
        }

        // Fetch managed dojaangs if managedDojaangIds exist
        if (coach.managedDojaangIds && coach.managedDojaangIds.length > 0) {
          const dojaangPromises = coach.managedDojaangIds.map((id) =>
            fetchJson(`/api/Dojaangs/${id}`)
              .then((dojaang: any) => dojaang.data?.name || `Dojaang ${id}`)
              .catch(() => `Dojaang ${id}`),
          );
          promises.push(
            Promise.all(dojaangPromises).then((names) =>
              setManagedDojaangs(names),
            ),
          );
        }

        await Promise.all(promises);
      } catch (error) {
        console.error("Error fetching additional data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Reset names when coach changes and fetch new data
    setRankName("");
    setDojaangName("");
    setManagedDojaangs([]);

    if (
      coach &&
      (coach.rankId || coach.dojaangId || coach.managedDojaangIds?.length)
    ) {
      fetchAdditionalData();
    }
  }, [coach?.id, coach?.rankId, coach.dojaangId, coach.managedDojaangIds]);

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

  const getCoachInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`;
  };

  const getGenderText = (gender: Gender | null | undefined) => {
    switch (gender) {
      case Gender.MALE:
        return "Male";
      case Gender.FEMALE:
        return "Female";
      case Gender.OTHER:
        return "Other";
      default:
        return "Not specified";
    }
  };

  if (!coach) {
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
              {getCoachInitials(coach.firstName, coach.lastName)}
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
                {`${coach.firstName} ${coach.lastName}`.trim() || "Coach"}
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
                  label={coach.isActive ? "Active" : "Inactive"}
                  icon={coach.isActive ? <ActiveIcon /> : <InactiveIcon />}
                  sx={{
                    bgcolor: coach.isActive
                      ? "var(--success-50)"
                      : "var(--error-50)",
                    color: coach.isActive ? "var(--success)" : "var(--error)",
                    fontWeight: 600,
                    "& .MuiChip-icon": {
                      color: coach.isActive ? "var(--success)" : "var(--error)",
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
                {managedDojaangs.length > 0 && (
                  <Chip
                    label={`Manages ${managedDojaangs.length} Dojaang${managedDojaangs.length > 1 ? "s" : ""}`}
                    icon={<SchoolIcon />}
                    variant="outlined"
                    sx={{
                      borderColor: "var(--accent)",
                      color: "var(--accent)",
                      "& .MuiChip-icon": {
                        color: "var(--accent)",
                      },
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </>
      )}

      {/* Coach Information Card */}
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
              Coach Information
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
                  value={`${coach.firstName} ${coach.lastName}`.trim()}
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
                  value={coach.email}
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
                  value={coach.phoneNumber}
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
              {coach.gender !== undefined && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Gender"
                    value={getGenderText(coach.gender)}
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
              )}

              {/* Date of Birth */}
              {coach.dateOfBirth && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Date of Birth"
                    value={
                      coach.dateOfBirth
                        ? new Date(coach.dateOfBirth).toLocaleDateString()
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
              )}

              {/* Join Date */}
              {coach.joinDate && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Join Date"
                    value={
                      coach.joinDate
                        ? new Date(coach.joinDate).toLocaleDateString()
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
              )}

              {/* Primary Dojaang */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Primary Dojaang"
                  value={
                    coach.dojaangName ||
                    dojaangName ||
                    (coach.dojaangId
                      ? `Dojaang ID: ${coach.dojaangId}`
                      : "Not assigned")
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
                    rankName || `Rank ID: ${coach.rankId || "Not assigned"}`
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

              {/* Coach ID */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Coach ID"
                  value={coach.id}
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

              {/* Managed Dojaangs */}
              {managedDojaangs.length > 0 && (
                <Grid item xs={12}>
                  <TextField
                    label="Managed Dojaangs"
                    value={managedDojaangs.join(", ")}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <SchoolIcon sx={{ mr: 1, color: "var(--accent)" }} />
                      ),
                    }}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                    sx={{
                      ...darkTextFieldSx,
                      "& .MuiInputBase-input": {
                        ...darkTextFieldSx["& .MuiInputBase-input"],
                        color: "var(--accent)",
                        fontWeight: 500,
                      },
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CoachInfoCard;
