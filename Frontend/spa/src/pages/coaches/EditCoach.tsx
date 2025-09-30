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
} from "@mui/material";
import { Save, ArrowBack } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { fetchJson } from "../../lib/api";
import { toast } from "react-toastify";
import { CoachDto, CoachFormData, DojaangDto } from "../../types/api";

export default function EditCoach() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [coach, setCoach] = useState<CoachDto | null>(null);
  const [dojaangs, setDojaangs] = useState<DojaangDto[]>([]);
  const [formData, setFormData] = useState<CoachFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    specializations: "",
    isActive: true,
    hireDate: "",
    bio: "",
    certifications: "",
    dojaangId: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadCoachData();
    }
  }, [id]);

  const loadCoachData = async () => {
    try {
      const [coachData, dojaangsData] = await Promise.all([
        fetchJson(`/api/coaches/${id}`) as Promise<CoachDto>,
        fetchJson("/api/dojaangs") as Promise<DojaangDto[]>,
      ]);

      setCoach(coachData);
      setDojaangs(dojaangsData);
      setFormData({
        firstName: coachData.firstName,
        lastName: coachData.lastName,
        email: coachData.email,
        phoneNumber: coachData.phoneNumber || "",
        dateOfBirth: coachData.dateOfBirth
          ? coachData.dateOfBirth.split("T")[0]
          : "",
        specializations: coachData.specializations
          ? coachData.specializations.join(", ")
          : "",
        isActive: coachData.isActive,
        hireDate: coachData.hireDate ? coachData.hireDate.split("T")[0] : "",
        bio: coachData.bio || "",
        certifications: coachData.certifications || "",
        dojaangId: coachData.dojaangId,
      });
    } catch (error) {
      toast.error("Failed to load coach data");
      console.error("Error loading coach:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CoachFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData = {
        ...formData,
        specializations: formData.specializations
          ? formData.specializations
              .split(",")
              .map((spec) => spec.trim())
              .filter((spec) => spec)
          : [],
        dojaangId: Number(formData.dojaangId),
        phoneNumber: formData.phoneNumber || null,
        bio: formData.bio || null,
        certifications: formData.certifications || null,
      };

      await fetchJson(`/api/coaches/${id}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });

      toast.success("Coach updated successfully");
      navigate(`/coaches/${id}`);
    } catch (error) {
      toast.error("Failed to update coach");
      console.error("Error updating coach:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Typography>Loading coach data...</Typography>;
  }

  if (!coach) {
    return <Alert severity="error">Coach not found</Alert>;
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(`/coaches/${id}`)}
          sx={{ mr: 2 }}
        >
          Back to Coach
        </Button>
        <Typography variant="h4">Edit Coach</Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Basic Information */}
            <Typography variant="h5" color="primary">
              Basic Information
            </Typography>

            <Box display="flex" gap={2}>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
                fullWidth
              />
            </Box>

            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              fullWidth
            />

            <Box display="flex" gap={2}>
              <TextField
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                fullWidth
              />
              <TextField
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
            </Box>

            {/* Professional Information */}
            <Typography variant="h5" color="primary" mt={2}>
              Professional Information
            </Typography>

            <FormControl fullWidth>
              <InputLabel>Dojaang</InputLabel>
              <Select
                value={formData.dojaangId}
                onChange={(e) => handleInputChange("dojaangId", e.target.value)}
                required
              >
                {dojaangs.map((dojaang) => (
                  <MenuItem key={dojaang.id} value={dojaang.id}>
                    {dojaang.name} - {dojaang.location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Hire Date"
              type="date"
              value={formData.hireDate}
              onChange={(e) => handleInputChange("hireDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
            />

            <TextField
              label="Specializations"
              value={formData.specializations}
              onChange={(e) =>
                handleInputChange("specializations", e.target.value)
              }
              fullWidth
              helperText="Separate multiple specializations with commas"
            />

            <TextField
              label="Certifications"
              value={formData.certifications}
              onChange={(e) =>
                handleInputChange("certifications", e.target.value)
              }
              multiline
              rows={3}
              fullWidth
            />

            <TextField
              label="Bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              multiline
              rows={4}
              fullWidth
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) =>
                    handleInputChange("isActive", e.target.checked)
                  }
                />
              }
              label="Active Coach"
            />

            <Box display="flex" gap={2} mt={3}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                disabled={saving}
                fullWidth
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(`/coaches/${id}`)}
                fullWidth
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
