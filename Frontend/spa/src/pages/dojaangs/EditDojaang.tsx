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

  useEffect(() => {
    if (id) {
      loadDojaangData();
    }
  }, [id]);

  const loadDojaangData = async () => {
    try {
      const dojaangData = (await fetchJson(
        `/api/dojaangs/${id}`,
      )) as DojaangEditDto;

      setDojaang(dojaangData);
      setFormData({
        name: dojaangData.name,
        address: dojaangData.address,
        location: dojaangData.address, // Use address as location if needed
        koreanName: dojaangData.koreanName || "",
        koreanNamePhonetic: dojaangData.koreanNamePhonetic || "",
        city: dojaangData.city || "",
        state: dojaangData.state || "",
        zipCode: dojaangData.zipCode || "",
        phoneNumber: dojaangData.phoneNumber || "",
        email: dojaangData.email || "",
        description: dojaangData.description || "",
        isActive: dojaangData.isActive,
        establishedDate: dojaangData.establishedDate
          ? dojaangData.establishedDate.split("T")[0]
          : "",
        website: dojaangData.website || "",
      });
    } catch (error) {
      toast.error("Failed to load dojaang data");
      console.error("Error loading dojaang:", error);
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
      const updateData = {
        ...formData,
        phoneNumber: formData.phoneNumber || null,
        email: formData.email || null,
        description: formData.description || null,
        website: formData.website || null,
      };

      await fetchJson(`/api/dojaangs/${id}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });

      toast.success("Dojaang updated successfully");
      navigate(`/dojaangs/${id}`);
    } catch (error) {
      toast.error("Failed to update dojaang");
      console.error("Error updating dojaang:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Typography>Loading dojaang data...</Typography>;
  }

  if (!dojaang) {
    return <Alert severity="error">Dojaang not found</Alert>;
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(`/dojaangs/${id}`)}
          sx={{ mr: 2 }}
        >
          Back to Dojaang
        </Button>
        <Typography variant="h4">Edit Dojaang</Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Basic Information */}
            <Typography variant="h5" color="primary">
              Basic Information
            </Typography>

            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              multiline
              rows={3}
              fullWidth
            />

            <TextField
              label="Established Date"
              type="date"
              value={formData.establishedDate}
              onChange={(e) =>
                handleInputChange("establishedDate", e.target.value)
              }
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
            />

            {/* Address Information */}
            <Typography variant="h5" color="primary" mt={2}>
              Address Information
            </Typography>

            <TextField
              label="Address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
              fullWidth
            />

            <Box display="flex" gap={2}>
              <TextField
                label="City"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                required
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  required
                >
                  {US_STATES.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="ZIP Code"
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                required
                fullWidth
              />
            </Box>

            {/* Contact Information */}
            <Typography variant="h5" color="primary" mt={2}>
              Contact Information
            </Typography>

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
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                fullWidth
              />
            </Box>

            <TextField
              label="Website"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              fullWidth
              helperText="Include https:// or http://"
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
              label="Active Dojaang"
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
                onClick={() => navigate(`/dojaangs/${id}`)}
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
