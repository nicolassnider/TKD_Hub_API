import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchJson } from "../../lib/api";

import { Button, Box } from "@mui/material";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";
import { LoadingSpinner } from "components/common/LoadingSpinner";
import { ErrorAlert } from "components/common/ErrorAlert";
import { PageLayout } from "./PageLayout";

interface GenericDetailPageProps {
  title: string;
  apiEndpoint: string;
  backRoute: string;
  editRoute?: string;
  renderContent: (item: any) => React.ReactNode;
  customActions?: (item: any) => React.ReactNode;
  onDelete?: (item: any) => Promise<void>;
  transformData?: (item: any) => any;
  paramName?: string; // Default is 'id'
}

export const GenericDetailPage: React.FC<GenericDetailPageProps> = ({
  title,
  apiEndpoint,
  backRoute,
  editRoute,
  renderContent,
  customActions,
  onDelete,
  transformData,
  paramName = "id",
}) => {
  const navigate = useNavigate();
  const params = useParams();
  const itemId = params[paramName];

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!itemId) {
        setError("No ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetchJson(`${apiEndpoint}/${itemId}`);
        const data = transformData ? transformData(response) : response;
        setItem(data);
      } catch (err: any) {
        setError(err.message || "Failed to load item");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId, apiEndpoint, transformData]);

  const handleDelete = async () => {
    if (!onDelete || !item) return;

    try {
      setDeleting(true);
      await onDelete(item);
      navigate(backRoute);
    } catch (err: any) {
      setError(err.message || "Failed to delete item");
    } finally {
      setDeleting(false);
    }
  };

  const actions = (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={() => navigate(backRoute)}
      >
        Back
      </Button>
      {customActions && item && customActions(item)}
      {editRoute && item && (
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(editRoute.replace(":id", item.id))}
        >
          Edit
        </Button>
      )}
      {onDelete && item && (
        <Button
          variant="contained"
          color="error"
          startIcon={<Delete />}
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      )}
    </Box>
  );

  if (loading) {
    return (
      <PageLayout title={title} actions={actions}>
        <LoadingSpinner />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title={title} actions={actions}>
        <ErrorAlert error={error} />
      </PageLayout>
    );
  }

  if (!item) {
    return (
      <PageLayout title={title} actions={actions}>
        <ErrorAlert error="Item not found" />
      </PageLayout>
    );
  }

  return (
    <PageLayout title={title} actions={actions}>
      {renderContent(item)}
    </PageLayout>
  );
};
