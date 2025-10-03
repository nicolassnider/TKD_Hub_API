import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Backdrop,
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  School as SchoolIcon,
  Home as HomeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Web as WebIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Language as LanguageIcon,
  Place as PlaceIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { fetchJson, ApiError } from "../../lib/api";
import { DojaangEditDto, DojaangFormData } from "../../types/api";

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

export default function EditDojaang() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dojaang, setDojaang] = useState<DojaangEditDto | null>(null);
  const [formData, setFormData] = useState<DojaangFormData>({
    name: "",
    address: "",
    location: "",
    koreanName: "",
    koreanNamePhonetic: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    email: "",
    description: "",
    isActive: true,
    establishedDate: "",
    website: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState<{
    open: boolean;
    severity?: "success" | "error";
    message?: string;
  }>({ open: false });

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
      "&.Mui-focused": {
        color: "var(--primary)",
      },
    },
  };

  // Dark theme FormControl styling
  const darkFormControlSx = {
    "& .MuiInputLabel-root": {
      color: "var(--fg-muted)",
      "&.Mui-focused": {
        color: "var(--primary)",
      },
    },
    "& .MuiSelect-select": {
      color: "var(--fg)",
      bgcolor: "var(--panel)",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--border)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--border-accent)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--primary)",
    },
  };

  useEffect(() => {
    if (id) {
      loadDojaangData();
    }
  }, [id]);

  const loadDojaangData = async () => {
    try {
      const response = await fetchJson(`/api/Dojaangs/${id}`);
      const dojaangData = (response as any)?.data ?? response;

      setDojaang(dojaangData);
      setFormData({
        name: dojaangData.name || "",
        address: dojaangData.address || "",
        location: dojaangData.location || "",
        koreanName: dojaangData.koreanName || "",
        koreanNamePhonetic: dojaangData.koreanNamePhonetic || "",
        city: dojaangData.city || "",
        state: dojaangData.state || "",
        zipCode: dojaangData.zipCode || "",
        phoneNumber: dojaangData.phoneNumber || "",
        email: dojaangData.email || "",
        description: dojaangData.description || "",
        isActive: dojaangData.isActive ?? true,
        establishedDate: dojaangData.establishedDate
          ? dojaangData.establishedDate.split("T")[0]
          : "",
        website: dojaangData.website || "",
      });
    } catch (error) {
      console.error("Error loading dojaang:", error);
      setSnack({
        open: true,
        severity: "error",
        message: "Failed to load dojaang data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof DojaangFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!id) {
        throw new Error("Dojaang ID is required");
      }

      const updateData = {
        id: parseInt(id, 10), // Include the ID in the request body
        ...formData,
        phoneNumber: formData.phoneNumber || null,
        email: formData.email || null,
        description: formData.description || null,
        website: formData.website || null,
        establishedDate: formData.establishedDate || null,
      };

      await fetchJson(`/api/Dojaangs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      setSnack({
        open: true,
        severity: "success",
        message: "Dojaang updated successfully",
      });

      // Navigate back after a short delay
      setTimeout(() => {
        navigate(`/dojaangs/${id}`);
      }, 1000);
    } catch (error) {
      console.error("Error updating dojaang:", error);
      setSnack({
        open: true,
        severity: "error",
        message:
          error instanceof ApiError
            ? error.message
            : "Failed to update dojaang",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={48} sx={{ color: "var(--primary)" }} />
        <Alert
          severity="info"
          sx={{ bgcolor: "var(--panel)", color: "var(--fg)" }}
        >
          Loading dojaang data...
        </Alert>
      </Box>
    );
  }

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
          severity="error"
          sx={{ bgcolor: "var(--panel)", color: "var(--fg)" }}
        >
          Dojaang not found
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1400,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
        minHeight: "100vh",
        bgcolor: "var(--background)",
      }}
    >
      {/* Navigation Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/dojaangs/${id}`)}
          sx={{
            borderColor: "var(--border)",
            color: "var(--fg)",
            "&:hover": {
              borderColor: "var(--primary)",
              bgcolor: "var(--surface)",
            },
          }}
        >
          Back to Dojaang
        </Button>

        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: "var(--fg)",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
          className="page-title"
        >
          <SchoolIcon sx={{ color: "var(--gold)", fontSize: "2rem" }} />
          Edit Dojaang
        </Typography>
      </Box>

      {/* Edit Form */}
      <Card
        elevation={2}
        sx={{
          borderRadius: "16px",
          bgcolor: "var(--panel-elevated)",
          border: "1px solid",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow-lg)",
          color: "var(--fg)",
          maxWidth: 1000,
          mx: "auto",
        }}
        className="auth-card"
      >
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {/* Basic Information Section */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "var(--primary)",
                    fontWeight: 700,
                    mb: 3,
                    fontSize: "1.3rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <SchoolIcon sx={{ color: "var(--gold)" }} />
                  Basic Information
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    bgcolor: "var(--panel)",
                    borderColor: "var(--border)",
                    borderRadius: "12px",
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Dojaang Name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        required
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <SchoolIcon
                              sx={{ mr: 1, color: "var(--primary)" }}
                            />
                          ),
                        }}
                        sx={darkTextFieldSx}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Location/Area"
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <PlaceIcon sx={{ mr: 1, color: "var(--accent)" }} />
                          ),
                        }}
                        sx={darkTextFieldSx}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Description"
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        multiline
                        rows={3}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <DescriptionIcon
                              sx={{ mr: 1, color: "var(--primary)" }}
                            />
                          ),
                        }}
                        sx={darkTextFieldSx}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Established Date"
                        type="date"
                        value={formData.establishedDate}
                        onChange={(e) =>
                          handleInputChange("establishedDate", e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <CalendarIcon
                              sx={{ mr: 1, color: "var(--success)" }}
                            />
                          ),
                        }}
                        sx={darkTextFieldSx}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.isActive}
                            onChange={(e) =>
                              handleInputChange("isActive", e.target.checked)
                            }
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "var(--success)",
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                {
                                  bgcolor: "var(--success-50)",
                                },
                            }}
                          />
                        }
                        label="Active Dojaang"
                        sx={{
                          color: "var(--fg)",
                          "& .MuiFormControlLabel-label": {
                            fontWeight: 500,
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Box>

              {/* Address Information Section */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "var(--primary)",
                    fontWeight: 700,
                    mb: 3,
                    fontSize: "1.3rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <HomeIcon sx={{ color: "var(--gold)" }} />
                  Address Information
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    bgcolor: "var(--panel)",
                    borderColor: "var(--border)",
                    borderRadius: "12px",
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        label="Street Address"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        required
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <HomeIcon sx={{ mr: 1, color: "var(--accent)" }} />
                          ),
                        }}
                        sx={darkTextFieldSx}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        label="City"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        required
                        fullWidth
                        sx={darkTextFieldSx}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth sx={darkFormControlSx}>
                        <InputLabel>State</InputLabel>
                        <Select
                          value={formData.state}
                          onChange={(e) =>
                            handleInputChange("state", e.target.value)
                          }
                          label="State"
                          required
                        >
                          {US_STATES.map((state) => (
                            <MenuItem key={state} value={state}>
                              {state}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        label="ZIP Code"
                        value={formData.zipCode}
                        onChange={(e) =>
                          handleInputChange("zipCode", e.target.value)
                        }
                        required
                        fullWidth
                        sx={darkTextFieldSx}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Box>

              {/* Contact Information Section */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "var(--primary)",
                    fontWeight: 700,
                    mb: 3,
                    fontSize: "1.3rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PhoneIcon sx={{ color: "var(--gold)" }} />
                  Contact Information
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    bgcolor: "var(--panel)",
                    borderColor: "var(--border)",
                    borderRadius: "12px",
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Phone Number"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          handleInputChange("phoneNumber", e.target.value)
                        }
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <PhoneIcon sx={{ mr: 1, color: "var(--accent)" }} />
                          ),
                        }}
                        sx={darkTextFieldSx}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <EmailIcon sx={{ mr: 1, color: "var(--accent)" }} />
                          ),
                        }}
                        sx={darkTextFieldSx}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Website"
                        value={formData.website}
                        onChange={(e) =>
                          handleInputChange("website", e.target.value)
                        }
                        fullWidth
                        helperText="Include https:// or http://"
                        InputProps={{
                          startAdornment: (
                            <WebIcon sx={{ mr: 1, color: "var(--accent)" }} />
                          ),
                        }}
                        sx={{
                          ...darkTextFieldSx,
                          "& .MuiFormHelperText-root": {
                            color: "var(--fg-muted)",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Box>

              {/* Korean Names Section */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "var(--primary)",
                    fontWeight: 700,
                    mb: 3,
                    fontSize: "1.3rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <LanguageIcon sx={{ color: "var(--gold)" }} />
                  Korean Names
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    bgcolor: "var(--panel)",
                    borderColor: "var(--border)",
                    borderRadius: "12px",
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Korean Name"
                        value={formData.koreanName}
                        onChange={(e) =>
                          handleInputChange("koreanName", e.target.value)
                        }
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <LanguageIcon
                              sx={{ mr: 1, color: "var(--gold)" }}
                            />
                          ),
                        }}
                        sx={darkTextFieldSx}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Korean Name (Phonetic)"
                        value={formData.koreanNamePhonetic}
                        onChange={(e) =>
                          handleInputChange(
                            "koreanNamePhonetic",
                            e.target.value,
                          )
                        }
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <LanguageIcon
                              sx={{ mr: 1, color: "var(--gold)" }}
                            />
                          ),
                        }}
                        sx={darkTextFieldSx}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/dojaangs/${id}`)}
                  disabled={saving}
                  sx={{
                    borderColor: "var(--border)",
                    color: "var(--fg)",
                    "&:hover": {
                      borderColor: "var(--fg)",
                      bgcolor: "var(--surface)",
                    },
                    minWidth: 120,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={
                    saving ? <CircularProgress size={16} /> : <SaveIcon />
                  }
                  disabled={saving}
                  sx={{
                    bgcolor: "var(--primary)",
                    "&:hover": {
                      bgcolor: "var(--primary-dark)",
                    },
                    minWidth: 140,
                  }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Loading Backdrop */}
      {saving && (
        <Backdrop
          sx={{
            color: "var(--primary)",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            bgcolor: "rgba(0, 0, 0, 0.7)",
          }}
          open={saving}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress color="inherit" size={64} />
            <Alert
              severity="info"
              sx={{ bgcolor: "var(--panel)", color: "var(--fg)" }}
            >
              Saving dojaang changes...
            </Alert>
          </Box>
        </Backdrop>
      )}

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        {snack.severity ? (
          <Alert
            severity={snack.severity}
            onClose={() => setSnack({ open: false })}
            sx={{
              bgcolor:
                snack.severity === "success"
                  ? "var(--success-50)"
                  : "var(--error-50)",
              color:
                snack.severity === "success"
                  ? "var(--success)"
                  : "var(--error)",
              "& .MuiAlert-icon": {
                color:
                  snack.severity === "success"
                    ? "var(--success)"
                    : "var(--error)",
              },
            }}
          >
            {snack.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
