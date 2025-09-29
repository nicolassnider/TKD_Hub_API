import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchJson } from "../../lib/api";

import { Button, Box, Paper } from "@mui/material";
import { ArrowBack, Save } from "@mui/icons-material";
import { PageLayout } from "./PageLayout";
import { LoadingSpinner } from "components/common/LoadingSpinner";
import { ErrorAlert } from "components/common/ErrorAlert";

interface GenericFormPageProps {
  title: string;
  apiEndpoint: string;
  backRoute: string;
  renderForm: (
    data: any,
    onChange: (data: any) => void,
    errors: any,
  ) => React.ReactNode;
  initialData?: any;
  isEditMode?: boolean;
  onSubmit: (data: any) => Promise<void>;
  validate?: (data: any) => Record<string, string>;
  transformDataForEdit?: (item: any) => any;
  paramName?: string; // Default is 'id'
}

export const GenericFormPage: React.FC<GenericFormPageProps> = ({
  title,
  apiEndpoint,
  backRoute,
  renderForm,
  initialData = {},
  isEditMode = false,
  onSubmit,
  validate,
  transformDataForEdit,
  paramName = "id",
}) => {
  const navigate = useNavigate();
  const params = useParams();
  const itemId = params[paramName];

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(isEditMode && !!itemId);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!isEditMode || !itemId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await fetchJson(`${apiEndpoint}/${itemId}`);
        const data = transformDataForEdit
          ? transformDataForEdit(response)
          : response;
        setFormData({ ...initialData, ...data });
      } catch (err: any) {
        setError(err.message || "Failed to load item");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId, apiEndpoint, isEditMode, transformDataForEdit]);

  const handleSubmit = async () => {
    // Validate form data
    if (validate) {
      const validationErrors = validate(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }

    try {
      setSubmitting(true);
      setError(null);
      setErrors({});
      await onSubmit(formData);
      navigate(backRoute);
    } catch (err: any) {
      setError(err.message || "Failed to save item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDataChange = (newData: any) => {
    setFormData(newData);
    // Clear errors for fields that are being changed
    if (errors && Object.keys(errors).length > 0) {
      const clearedErrors = { ...errors };
      Object.keys(newData).forEach((key) => {
        if (newData[key] !== formData[key]) {
          delete clearedErrors[key];
        }
      });
      setErrors(clearedErrors);
    }
  };

  const actions = (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={() => navigate(backRoute)}
        disabled={submitting}
      >
        Back
      </Button>
      <Button
        variant="contained"
        startIcon={<Save />}
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "Saving..." : "Save"}
      </Button>
    </Box>
  );

  if (loading) {
    return (
      <PageLayout title={title} actions={actions}>
        <LoadingSpinner />
      </PageLayout>
    );
  }

  return (
    <PageLayout title={title} actions={actions}>
      {error && <ErrorAlert error={error} />}
      <Paper sx={{ p: 3 }}>
        {renderForm(formData, handleDataChange, errors)}
      </Paper>
    </PageLayout>
  );
};
