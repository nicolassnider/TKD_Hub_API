import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Skeleton,
  IconButton,
  Divider,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fetchJson } from "../../lib/api";
import {
  CreateStudentDto,
  UpdateStudentDto,
  Gender,
  UserDto,
} from "../../types/api";

interface EditStudentProps {
  title: string;
  studentId: number; // 0 for create, actual ID for edit
  onClose?: () => void;
}

interface DojaangOption {
  id: number;
  name: string;
}

interface RankOption {
  id: number;
  name: string;
  color: string | number;
}

export default function EditStudent({
  title,
  studentId,
  onClose,
}: EditStudentProps) {
  const navigate = useNavigate();
  const isEditing = studentId !== 0;

  // Form state
  const [formData, setFormData] = useState<CreateStudentDto>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: null,
    dateOfBirth: null,
    dojaangId: null,
    rankId: null,
  });

  // UI state
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Options
  const [dojaangs, setDojaangs] = useState<DojaangOption[]>([]);
  const [ranks, setRanks] = useState<RankOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Load student data for editing
  useEffect(() => {
    if (isEditing) {
      loadStudent();
    }
    loadOptions();
  }, [studentId]);

  const loadStudent = async () => {
    try {
      const response = (await fetchJson(`/api/Students/${studentId}`)) as {
        data: UserDto;
      };
      const student = response.data;

      setFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phoneNumber: student.phoneNumber || "",
        gender: student.gender,
        dateOfBirth: student.dateOfBirth,
        dojaangId: student.dojaangId,
        rankId: student.currentRankId,
      });
    } catch (error) {
      console.error("Error loading student:", error);
      setError("Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  const loadOptions = async () => {
    try {
      const [dojaangsRes, ranksRes] = await Promise.all([
        fetchJson("/api/Dojaangs") as Promise<{ data: DojaangOption[] }>,
        fetchJson("/api/Ranks") as Promise<{ data: RankOption[] }>,
      ]);

      setDojaangs(dojaangsRes.data || []);
      setRanks(ranksRes.data || []);
    } catch (error) {
      console.error("Error loading options:", error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleInputChange = (field: keyof CreateStudentDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim()
    ) {
      setError("First name, last name, and email are required");
      return;
    }

    // Age validation
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();

      // Check if birth date is in the future
      if (birthDate > today) {
        setError("Birth date cannot be in the future");
        return;
      }

      // Calculate exact age
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const exactAge =
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ? age - 1
          : age;

      if (exactAge < 4) {
        setError("Student must be at least 4 years old");
        return;
      }
    }

    setSaving(true);
    setError(null);

    try {
      if (isEditing) {
        // Update existing student
        const updateData: UpdateStudentDto = {
          id: studentId,
          ...formData,
          currentRankId: formData.rankId,
        };

        await fetchJson(`/api/Students/${studentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });
      } else {
        // Create new student
        await fetchJson("/api/Students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      setSuccess(true);
      setTimeout(() => {
        if (onClose) {
          onClose();
        } else {
          navigate("/students");
        }
      }, 1500);
    } catch (error: any) {
      console.error("Error saving student:", error);
      setError(error.message || "Failed to save student");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/students");
    }
  };

  if (loading) {
    return (
      <Card sx={{ bgcolor: "var(--panel)", border: "1px solid var(--border)" }}>
        <CardContent sx={{ p: 3 }}>
          <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
          <Grid container spacing={3}>
            {[...Array(6)].map((_, i) => (
              <Grid item xs={12} md={6} key={i}>
                <Skeleton variant="rectangular" height={56} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        bgcolor: "var(--panel)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        boxShadow: "var(--shadow)",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 3,
            borderBottom: "1px solid var(--border)",
            bgcolor: "var(--surface)",
          }}
        >
          <IconButton
            onClick={handleBack}
            sx={{
              color: "var(--fg-muted)",
              "&:hover": {
                bgcolor: "var(--surface-hover)",
                color: "var(--fg)",
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <PersonIcon sx={{ color: "var(--primary)", fontSize: "1.75rem" }} />
          <Typography
            variant="h5"
            sx={{
              color: "var(--fg)",
              fontWeight: 700,
              flex: 1,
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Form Content */}
        <Box sx={{ p: 3 }}>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                bgcolor: "var(--error-50)",
                color: "var(--error)",
                borderColor: "var(--error)",
              }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                bgcolor: "var(--success-50)",
                color: "var(--success)",
                borderColor: "var(--success)",
              }}
            >
              {isEditing
                ? "Student updated successfully!"
                : "Student created successfully!"}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "var(--fg)",
                    fontWeight: 600,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PersonIcon sx={{ color: "var(--primary)" }} />
                  Personal Information
                </Typography>
                <Divider sx={{ borderColor: "var(--border)", mb: 3 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  required
                  sx={{
                    "& .MuiInputBase-input": { color: "var(--fg)" },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "var(--surface)",
                      "& fieldset": { borderColor: "var(--border)" },
                      "&:hover fieldset": { borderColor: "var(--primary)" },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--primary)",
                      },
                    },
                    "& .MuiInputLabel-root": { color: "var(--fg-muted)" },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  required
                  sx={{
                    "& .MuiInputBase-input": { color: "var(--fg)" },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "var(--surface)",
                      "& fieldset": { borderColor: "var(--border)" },
                      "&:hover fieldset": { borderColor: "var(--primary)" },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--primary)",
                      },
                    },
                    "& .MuiInputLabel-root": { color: "var(--fg-muted)" },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  sx={{
                    "& .MuiInputBase-input": { color: "var(--fg)" },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "var(--surface)",
                      "& fieldset": { borderColor: "var(--border)" },
                      "&:hover fieldset": { borderColor: "var(--primary)" },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--primary)",
                      },
                    },
                    "& .MuiInputLabel-root": { color: "var(--fg-muted)" },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  sx={{
                    "& .MuiInputBase-input": { color: "var(--fg)" },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "var(--surface)",
                      "& fieldset": { borderColor: "var(--border)" },
                      "&:hover fieldset": { borderColor: "var(--primary)" },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--primary)",
                      },
                    },
                    "& .MuiInputLabel-root": { color: "var(--fg-muted)" },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "var(--fg-muted)" }}>
                    Gender
                  </InputLabel>
                  <Select
                    value={formData.gender ?? ""}
                    onChange={(e) =>
                      handleInputChange(
                        "gender",
                        e.target.value === "" ? null : Number(e.target.value),
                      )
                    }
                    sx={{
                      bgcolor: "var(--surface)",
                      color: "var(--fg)",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--border)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--primary)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--primary)",
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Not specified</em>
                    </MenuItem>
                    <MenuItem value={Gender.MALE}>Male</MenuItem>
                    <MenuItem value={Gender.FEMALE}>Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={
                    formData.dateOfBirth
                      ? formData.dateOfBirth.split("T")[0]
                      : (() => {
                          const fourYearsAgo = new Date();
                          fourYearsAgo.setFullYear(
                            fourYearsAgo.getFullYear() - 4,
                          );
                          return fourYearsAgo.toISOString().split("T")[0];
                        })()
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "dateOfBirth",
                      e.target.value ? `${e.target.value}T00:00:00` : null,
                    )
                  }
                  InputLabelProps={{ shrink: true }}
                  helperText="Student must be at least 4 years old"
                  sx={{
                    "& .MuiInputBase-input": { color: "var(--fg)" },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "var(--surface)",
                      "& fieldset": { borderColor: "var(--border)" },
                      "&:hover fieldset": { borderColor: "var(--primary)" },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--primary)",
                      },
                    },
                    "& .MuiInputLabel-root": { color: "var(--fg-muted)" },
                    "& .MuiFormHelperText-root": { color: "var(--fg-muted)" },
                  }}
                />
              </Grid>

              {/* School Information */}
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "var(--fg)",
                    fontWeight: 600,
                    mb: 2,
                    mt: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <SchoolIcon sx={{ color: "var(--gold)" }} />
                  School Information
                </Typography>
                <Divider sx={{ borderColor: "var(--border)", mb: 3 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "var(--fg-muted)" }}>
                    Dojaang
                  </InputLabel>
                  <Select
                    value={formData.dojaangId ?? ""}
                    onChange={(e) =>
                      handleInputChange(
                        "dojaangId",
                        e.target.value === "" ? null : Number(e.target.value),
                      )
                    }
                    disabled={loadingOptions}
                    sx={{
                      bgcolor: "var(--surface)",
                      color: "var(--fg)",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--border)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--primary)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--primary)",
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>No dojaang assigned</em>
                    </MenuItem>
                    {dojaangs.map((dojaang) => (
                      <MenuItem key={dojaang.id} value={dojaang.id}>
                        {dojaang.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "var(--fg-muted)" }}>
                    Current Rank
                  </InputLabel>
                  <Select
                    value={formData.rankId ?? ""}
                    onChange={(e) =>
                      handleInputChange(
                        "rankId",
                        e.target.value === "" ? null : Number(e.target.value),
                      )
                    }
                    disabled={loadingOptions}
                    sx={{
                      bgcolor: "var(--surface)",
                      color: "var(--fg)",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--border)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--primary)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "var(--primary)",
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>No rank assigned</em>
                    </MenuItem>
                    {ranks.map((rank) => (
                      <MenuItem key={rank.id} value={rank.id}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              backgroundColor: `#${rank.color?.toString().padStart(6, "0") || "000000"}`,
                              borderRadius: "50%",
                              border: "1px solid var(--border)",
                            }}
                          />
                          {rank.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                mt: 4,
                pt: 3,
                borderTop: "1px solid var(--border)",
              }}
            >
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{
                  borderColor: "var(--border)",
                  color: "var(--fg)",
                  "&:hover": {
                    borderColor: "var(--primary)",
                    bgcolor: "var(--surface)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                startIcon={<SaveIcon />}
                sx={{
                  bgcolor: "var(--primary)",
                  color: "white",
                  "&:hover": {
                    bgcolor: "var(--primary-dark)",
                  },
                  "&:disabled": {
                    bgcolor: "var(--surface)",
                    color: "var(--fg-muted)",
                  },
                }}
              >
                {saving
                  ? "Saving..."
                  : isEditing
                    ? "Update Student"
                    : "Create Student"}
              </Button>
            </Box>
          </form>
        </Box>
      </CardContent>
    </Card>
  );
}
