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
  Alert,
} from "@mui/material";
import {
  Home as HomeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Language as LanguageIcon,
  School as SchoolIcon,
  Place as PlaceIcon,
  Web as WebIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { fetchJson } from "../../lib/api";
import { DojaangDto } from "../../types/api";

interface DojaangInfoCardProps {
  dojaang: DojaangDto;
  className?: string;
  showHeader?: boolean;
}

export const DojaangInfoCard: React.FC<DojaangInfoCardProps> = ({
  dojaang,
  className = "",
  showHeader = true,
}) => {
  // State for additional data
  const [coachName, setCoachName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Effect to fetch coach name when dojaang changes
  useEffect(() => {
    const fetchCoachName = async () => {
      if (!dojaang?.coachId) return;

      setLoading(true);
      try {
        const response = await fetchJson(`/api/Coaches/${dojaang.coachId}`);
        const coach = (response as any)?.data ?? response;
        setCoachName(
          `${coach.firstName || ""} ${coach.lastName || ""}`.trim() ||
            "Unknown Coach",
        );
      } catch (error) {
        console.error("Error fetching coach:", error);
        setCoachName("Unknown Coach");
      } finally {
        setLoading(false);
      }
    };

    // Reset coach name when dojaang changes
    setCoachName("");

    if (dojaang?.coachId) {
      fetchCoachName();
    } else if (dojaang?.coachName) {
      // Use the coachName from the dojaang data if available
      setCoachName(dojaang.coachName);
    }
  }, [dojaang?.id, dojaang?.coachId, dojaang?.coachName]);

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

  const getDojaangInitials = (name: string) => {
    const words = name.split(" ");
    if (words.length === 1) {
      return name.slice(0, 2).toUpperCase();
    }
    return words
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  const formatAddress = () => {
    const parts = [
      dojaang.address,
      dojaang.city,
      dojaang.state,
      dojaang.zipCode,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Not provided";
  };

  if (!dojaang) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Alert
          severity="warning"
          sx={{ bgcolor: "var(--panel)", color: "var(--fg)" }}
        >
          No dojaang data available
        </Alert>
      </Box>
    );
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
              {getDojaangInitials(dojaang.name || "D")}
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
                {dojaang.name || "Dojaang"}
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
                  label={dojaang.isActive ? "Active" : "Inactive"}
                  icon={dojaang.isActive ? <ActiveIcon /> : <InactiveIcon />}
                  sx={{
                    bgcolor: dojaang.isActive
                      ? "var(--success-50)"
                      : "var(--error-50)",
                    color: dojaang.isActive ? "var(--success)" : "var(--error)",
                    fontWeight: 600,
                    "& .MuiChip-icon": {
                      color: dojaang.isActive
                        ? "var(--success)"
                        : "var(--error)",
                    },
                  }}
                />
                {dojaang.establishedDate && (
                  <Chip
                    label={`Est. ${new Date(dojaang.establishedDate).getFullYear()}`}
                    icon={<CalendarIcon />}
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
                {coachName && (
                  <Chip
                    label={`Head Coach: ${coachName}`}
                    icon={<PersonIcon />}
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

      {/* Dojaang Information Card */}
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
              <SchoolIcon sx={{ color: "var(--gold)" }} />
              Dojaang Information
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
              {/* Dojaang Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Dojaang Name"
                  value={dojaang.name || ""}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <SchoolIcon sx={{ mr: 1, color: "var(--primary)" }} />
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

              {/* Location */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Location"
                  value={dojaang.location || "Not provided"}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <LocationIcon sx={{ mr: 1, color: "var(--accent)" }} />
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                  sx={darkTextFieldSx}
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <TextField
                  label="Full Address"
                  value={formatAddress()}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <PlaceIcon sx={{ mr: 1, color: "var(--gold)" }} />
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={2}
                  sx={darkTextFieldSx}
                />
              </Grid>

              {/* Phone */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  value={dojaang.phoneNumber || "Not provided"}
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

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  value={dojaang.email || "Not provided"}
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

              {/* Head Coach */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Head Coach"
                  value={coachName || dojaang.coachName || "Not assigned"}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <PersonIcon sx={{ mr: 1, color: "var(--primary)" }} />
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                  sx={{
                    ...darkTextFieldSx,
                    "& .MuiInputBase-input": {
                      ...darkTextFieldSx["& .MuiInputBase-input"],
                      color:
                        coachName || dojaang.coachName
                          ? "var(--primary)"
                          : "var(--fg-muted)",
                      fontWeight: coachName || dojaang.coachName ? 600 : 400,
                    },
                  }}
                />
              </Grid>

              {/* Website */}
              {dojaang.website && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Website"
                    value={dojaang.website}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <WebIcon sx={{ mr: 1, color: "var(--accent)" }} />
                      ),
                    }}
                    variant="outlined"
                    fullWidth
                    sx={{
                      ...darkTextFieldSx,
                      "& .MuiInputBase-input": {
                        ...darkTextFieldSx["& .MuiInputBase-input"],
                        color: "var(--accent)",
                      },
                    }}
                  />
                </Grid>
              )}

              {/* Korean Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Korean Name"
                  value={dojaang.koreanName || "Not provided"}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <LanguageIcon sx={{ mr: 1, color: "var(--gold)" }} />
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                  sx={{
                    ...darkTextFieldSx,
                    "& .MuiInputBase-input": {
                      ...darkTextFieldSx["& .MuiInputBase-input"],
                      color: dojaang.koreanName
                        ? "var(--gold)"
                        : "var(--fg-muted)",
                      fontWeight: dojaang.koreanName ? 500 : 400,
                    },
                  }}
                />
              </Grid>

              {/* Korean Name (Phonetic) */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Korean Name (Phonetic)"
                  value={dojaang.koreanNamePhonetic || "Not provided"}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <LanguageIcon sx={{ mr: 1, color: "var(--gold)" }} />
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                  sx={{
                    ...darkTextFieldSx,
                    "& .MuiInputBase-input": {
                      ...darkTextFieldSx["& .MuiInputBase-input"],
                      color: dojaang.koreanNamePhonetic
                        ? "var(--gold)"
                        : "var(--fg-muted)",
                      fontWeight: dojaang.koreanNamePhonetic ? 500 : 400,
                    },
                  }}
                />
              </Grid>

              {/* Established Date */}
              {dojaang.establishedDate && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Established Date"
                    value={new Date(
                      dojaang.establishedDate,
                    ).toLocaleDateString()}
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
                        fontWeight: 500,
                      },
                    }}
                  />
                </Grid>
              )}

              {/* Description */}
              {dojaang.description && (
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    value={dojaang.description}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <DescriptionIcon
                          sx={{ mr: 1, color: "var(--primary)" }}
                        />
                      ),
                    }}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    sx={darkTextFieldSx}
                  />
                </Grid>
              )}

              {/* Dojaang ID */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Dojaang ID"
                  value={dojaang.id}
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

export default DojaangInfoCard;
