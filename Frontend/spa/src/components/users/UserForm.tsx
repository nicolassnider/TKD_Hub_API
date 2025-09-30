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
  UserDto as User,
  CreateUserDto,
  UpdateUserDto,
  UserFormData,
  DojaangDto as Dojaang,
  Rank,
} from "../../types/api";
import { fetchJson, ApiError } from "../../lib/api";
import { GenericFormDialog } from "../common/GenericFormDialog";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ErrorAlert } from "../common/ErrorAlert";

// Type aliases for compatibility
type CreateUserRequest = CreateUserDto;
type UpdateUserRequest = UpdateUserDto;

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (userData: CreateUserRequest | UpdateUserRequest) => Promise<void>;
  user?: User | null;
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

  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    dateOfBirth: "",
    dojaangId: undefined,
    currentRankId: undefined,
    roles: [],
    roleIds: [],
    isActive: true,
  });

  const [dojaangs, setDojaangs] = useState<Dojaang[]>([]);
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const availableRoles = ["Admin", "Coach", "Student"];

  return (
    <GenericFormDialog
      open={open}
      onClose={onClose}
      title={title || (isEditMode ? "Edit User" : "Create User")}
      onSubmit={() => {}}
      submitLabel={isEditMode ? "Update" : "Create"}
      loading={loading}
    >
      {error && <ErrorAlert error={error} />}
      <div>User Form - Placeholder</div>
    </GenericFormDialog>
  );
}
