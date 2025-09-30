import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Avatar,
  Divider,
  Alert,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Save, Edit, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fetchJson } from "../../lib/api";
import { toast } from "react-toastify";
import { ProfileDto, ProfileFormData } from "../../types/api";

export default function EditProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    bio: "",
    emergencyContact: "",
    emergencyPhone: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    medicalNotes: "",
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const profileData = (await fetchJson("/api/profile")) as ProfileDto;

      setProfile(profileData);
      setFormData({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber || "",
        dateOfBirth: profileData.dateOfBirth
          ? profileData.dateOfBirth.split("T")[0]
          : "",
        bio: profileData.bio || "",
        emergencyContact: profileData.emergencyContact || "",
        emergencyPhone: profileData.emergencyPhone || "",
        parentName: profileData.parentName || "",
        parentEmail: profileData.parentEmail || "",
        parentPhone: profileData.parentPhone || "",
        medicalNotes: profileData.medicalNotes || "",
        emailNotifications: profileData.preferences?.emailNotifications ?? true,
        smsNotifications: profileData.preferences?.smsNotifications ?? false,
        marketingEmails: profileData.preferences?.marketingEmails ?? false,
      });
    } catch (error) {
      toast.error("Failed to load profile data");
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber || null,
        dateOfBirth: formData.dateOfBirth,
        bio: formData.bio || null,
        emergencyContact: formData.emergencyContact || null,
        emergencyPhone: formData.emergencyPhone || null,
        parentName: formData.parentName || null,
        parentEmail: formData.parentEmail || null,
        parentPhone: formData.parentPhone || null,
        medicalNotes: formData.medicalNotes || null,
        preferences: {
          emailNotifications: formData.emailNotifications,
          smsNotifications: formData.smsNotifications,
          marketingEmails: formData.marketingEmails,
        },
      };

      await fetchJson("/api/profile", {
        method: "PUT",
        body: JSON.stringify(updateData),
      });

      toast.success("Profile updated successfully");
      navigate("/profile");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Typography>Loading profile data...</Typography>;
  }

  if (!profile) {
    return <Alert severity="error">Profile not found</Alert>;
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/profile")}
          sx={{ mr: 2 }}
        >
          Back to Profile
        </Button>
        <Typography variant="h4">Edit Profile</Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar
            src={profile.profilePicture || ""}
            sx={{ width: 80, height: 80, mr: 2 }}
          >
            {profile.firstName[0]}
            {profile.lastName[0]}
          </Avatar>
          <Box>
            <Typography variant="h5">
              {profile.firstName} {profile.lastName}
            </Typography>
            <Typography color="text.secondary">{profile.email}</Typography>
            {profile.currentRankName && (
              <Typography variant="body2" color="primary">
                Current Rank: {profile.currentRankName}
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

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
                fullWidth
              />
            </Box>

            <TextField
              label="Bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              multiline
              rows={4}
              fullWidth
              helperText="Tell us a bit about yourself"
            />

            {/* Emergency Contact */}
            <Typography variant="h5" color="primary" mt={2}>
              Emergency Contact
            </Typography>

            <Box display="flex" gap={2}>
              <TextField
                label="Emergency Contact Name"
                value={formData.emergencyContact}
                onChange={(e) =>
                  handleInputChange("emergencyContact", e.target.value)
                }
                fullWidth
              />
              <TextField
                label="Emergency Contact Phone"
                value={formData.emergencyPhone}
                onChange={(e) =>
                  handleInputChange("emergencyPhone", e.target.value)
                }
                fullWidth
              />
            </Box>

            {/* Parent/Guardian Information (for students) */}
            {profile.parentName !== undefined && (
              <>
                <Typography variant="h5" color="primary" mt={2}>
                  Parent/Guardian Information
                </Typography>

                <TextField
                  label="Parent/Guardian Name"
                  value={formData.parentName}
                  onChange={(e) =>
                    handleInputChange("parentName", e.target.value)
                  }
                  fullWidth
                />

                <Box display="flex" gap={2}>
                  <TextField
                    label="Parent/Guardian Email"
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) =>
                      handleInputChange("parentEmail", e.target.value)
                    }
                    fullWidth
                  />
                  <TextField
                    label="Parent/Guardian Phone"
                    value={formData.parentPhone}
                    onChange={(e) =>
                      handleInputChange("parentPhone", e.target.value)
                    }
                    fullWidth
                  />
                </Box>

                <TextField
                  label="Medical Notes"
                  value={formData.medicalNotes}
                  onChange={(e) =>
                    handleInputChange("medicalNotes", e.target.value)
                  }
                  multiline
                  rows={3}
                  fullWidth
                />
              </>
            )}

            {/* Notification Preferences */}
            <Typography variant="h5" color="primary" mt={2}>
              Notification Preferences
            </Typography>

            <Box display="flex" flexDirection="column" gap={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.emailNotifications}
                    onChange={(e) =>
                      handleInputChange("emailNotifications", e.target.checked)
                    }
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.smsNotifications}
                    onChange={(e) =>
                      handleInputChange("smsNotifications", e.target.checked)
                    }
                  />
                }
                label="SMS Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.marketingEmails}
                    onChange={(e) =>
                      handleInputChange("marketingEmails", e.target.checked)
                    }
                  />
                }
                label="Marketing Emails"
              />
            </Box>

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
                onClick={() => navigate("/profile")}
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
