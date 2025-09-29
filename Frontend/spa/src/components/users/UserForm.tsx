import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  Chip,
  Typography,
} from "@mui/material";
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  Dojaang,
  Rank,
} from "../../types/user";
import { fetchJson, ApiError } from "../../lib/api";
import { GenericFormDialog } from "components/common/GenericFormDialog";
import { LoadingSpinner } from "components/common/LoadingSpinner";
import { ErrorAlert } from "components/common/ErrorAlert";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (userData: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  user?: User | null; // If provided, it's edit mode; otherwise, create mode
  title?: string;
}

export default function UserFormModal({
  open,
  onClose,
  onSave,
  user = null,
  title,
}: UserFormModalProps) {
  const isEditMode = !!user;

  const [formData, setFormData] = useState<CreateUserRequest & { id?: number }>(
    {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      dateOfBirth: "",
      dojaangId: undefined,
      currentRankId: undefined,
      roles: ["Student"],
      isActive: true,
    },
  );

  const [dojaangs, setDojaangs] = useState<Dojaang[]>([]);
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const availableRoles = ["Admin", "Coach", "Student"];

  // Initialize form data when user changes or modal opens
  useEffect(() => {
    if (open) {
      if (isEditMode && user) {
        setFormData({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber || "",
          dateOfBirth: user.dateOfBirth || "",
          dojaangId: user.dojaangId || undefined,
          currentRankId: user.currentRankId || undefined,
          roles: [...user.roles],
          isActive: user.isActive,
          password: "", // Don't show existing password
        });
      } else {
        // Reset for create mode
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phoneNumber: "",
          dateOfBirth: "",
          dojaangId: undefined,
          currentRankId: undefined,
          roles: ["Student"],
          isActive: true,
        });
      }
      setError(null);
    }
  }, [open, user, isEditMode]);

  useEffect(() => {
    if (open) {
      const loadReferenceData = async () => {
        try {
          setLoadingData(true);
          const [dojaangsResponse, ranksResponse] = await Promise.all([
            fetchJson("/api/dojaangs"),
            fetchJson("/api/ranks"),
          ]);
          setDojaangs(dojaangsResponse as Dojaang[]);
          setRanks(ranksResponse as Rank[]);
        } catch (err) {
          console.error("Failed to load reference data:", err);
          setError("Failed to load reference data");
        } finally {
          setLoadingData(false);
        }
      };

      loadReferenceData();
    }
  }, [open]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string | number) => {
    if (name === "dojaangId" || name === "currentRankId") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseInt(String(value), 10) : undefined,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      roles: checked
        ? [...prev.roles, role]
        : prev.roles.filter((r) => r !== role),
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!isEditMode && !formData.password.trim()) {
      setError("Password is required for new users");
      return false;
    }
    if (formData.roles.length === 0) {
      setError("At least one role must be selected");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      if (isEditMode) {
        // Edit mode - create UpdateUserRequest
        const updateData: UpdateUserRequest = {
          id: formData.id!,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth,
          dojaangId: formData.dojaangId,
          currentRankId: formData.currentRankId,
          roles: formData.roles,
          isActive: formData.isActive,
        };

        // Only include password if it was provided
        if (formData.password.trim()) {
          (updateData as any).password = formData.password;
        }

        await onSave(updateData);
      } else {
        // Create mode - create CreateUserRequest
        const createData: CreateUserRequest = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth,
          dojaangId: formData.dojaangId,
          currentRankId: formData.currentRankId,
          roles: formData.roles,
          isActive: formData.isActive,
        };
        await onSave(createData);
      }

      onClose();
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  const modalTitle = title || (isEditMode ? "Edit User" : "Create User");

  return (
    <GenericFormDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={modalTitle}
      loading={loading}
      submitLabel={isEditMode ? "Update User" : "Create User"}
      maxWidth="md"
    >
      {loadingData ? (
        <LoadingSpinner variant="centered" message="Loading form data..." />
      ) : (
        <>
          {error && (
            <Box sx={{ mb: 2 }}>
              <ErrorAlert error={error} />
            </Box>
          )}

          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                fullWidth
                required
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                fullWidth
                required
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                required
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="password"
                label={
                  isEditMode
                    ? "New Password (leave blank to keep current)"
                    : "Password"
                }
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                required={!isEditMode}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="phoneNumber"
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                fullWidth
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="dateOfBirth"
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                disabled={loading}
              />
            </Grid>

            {/* Training Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Training Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Dojaang</InputLabel>
                <Select
                  name="dojaangId"
                  value={formData.dojaangId || ""}
                  onChange={(e) =>
                    handleSelectChange("dojaangId", e.target.value)
                  }
                  label="Dojaang"
                  disabled={loading}
                >
                  <MenuItem value="">No Dojaang</MenuItem>
                  {dojaangs.map((dojaang) => (
                    <MenuItem key={dojaang.id} value={dojaang.id}>
                      {dojaang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Current Rank</InputLabel>
                <Select
                  name="currentRankId"
                  value={formData.currentRankId || ""}
                  onChange={(e) =>
                    handleSelectChange("currentRankId", e.target.value)
                  }
                  label="Current Rank"
                  disabled={loading}
                >
                  <MenuItem value="">No Rank</MenuItem>
                  {ranks.map((rank) => (
                    <MenuItem key={rank.id} value={rank.id}>
                      {rank.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Roles and Status */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Roles and Status
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Roles
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {availableRoles.map((role) => (
                  <FormControlLabel
                    key={role}
                    control={
                      <Checkbox
                        checked={formData.roles.includes(role)}
                        onChange={(e) =>
                          handleRoleChange(role, e.target.checked)
                        }
                        disabled={loading}
                      />
                    }
                    label={role}
                  />
                ))}
              </Box>
              <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {formData.roles.map((role) => (
                  <Chip key={role} label={role} size="small" color="primary" />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                }
                label="Active User"
              />
            </Grid>
          </Grid>
        </>
      )}
    </GenericFormDialog>
  );
}
