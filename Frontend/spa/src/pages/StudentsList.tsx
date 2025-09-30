import React, { useState, MouseEvent, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApiItems } from "../hooks/useApiItems";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  MoreVert,
  Visibility,
  Delete,
  EmojiEvents,
  Add,
} from "@mui/icons-material";
import { PageLayout } from "../components/layout/PageLayout";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorAlert } from "../components/common/ErrorAlert";
import { EmptyState } from "../components/common/EmptyState";
import ApiTable from "components/common/ApiTable";
import PromotionFormDialog from "../components/promotions/PromotionFormDialog";
import { usePromotionForm } from "../hooks/usePromotionForm";

export default function StudentsList() {
  return <StudentsTable />;
}

function StudentsTable() {
  const { items, loading, error, reload } = useApiItems("/api/Students");
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<any>(null);

  const {
    promotionFormOpen,
    studentForPromotion,
    openPromotionForm,
    closePromotionForm,
    handlePromotionSubmit,
  } = usePromotionForm({
    onSuccess: reload, // Refresh students list after successful promotion
  });

  const handleMenuClick = (event: MouseEvent<HTMLElement>, student: any) => {
    event.stopPropagation();
    setSelectedStudent(student);
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedStudent(null);
  };

  const handleViewDetails = () => {
    if (selectedStudent) {
      navigate(`/students/${selectedStudent.id}`);
    }
    handleMenuClose();
  };

  const handleViewPromotions = () => {
    if (selectedStudent) {
      navigate(`/students/${selectedStudent.id}/promotions`);
    }
    handleMenuClose();
  };

  const handleAddPromotion = () => {
    openPromotionForm(selectedStudent);
    handleMenuClose();
  };

  const handleDelete = () => {
    setStudentToDelete(selectedStudent);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;

    try {
      const response = await fetch(`/api/Students/${studentToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      await reload();
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const cols = useMemo(
    () => [
      { key: "id", label: "ID", sortable: true },
      {
        key: "fullName",
        label: "NAME",
        render: (student: any) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {`${student.firstName} ${student.lastName}`}
          </Box>
        ),
        sortable: true,
      },
      {
        key: "email",
        label: "EMAIL",
        render: (student: any) => student.email || "-",
      },
      {
        key: "phoneNumber",
        label: "PHONE",
        render: (student: any) => student.phoneNumber || "-",
      },
      {
        key: "rankName",
        label: "RANK",
        render: (student: any) => (
          <Chip
            label={student.rankName || "Not assigned"}
            variant="outlined"
            size="small"
            color={student.rankName ? "primary" : "default"}
          />
        ),
      },
      {
        key: "actions",
        label: "ACTIONS",
        render: (student: any) => (
          <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
            <Tooltip title="More Actions">
              <IconButton
                size="small"
                onClick={(e) => handleMenuClick(e, student)}
                sx={{ color: "primary.main" }}
              >
                <MoreVert />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [],
  );
  const pageActions = (
    <Box
      sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}
    >
      <Button
        variant="outlined"
        size="small"
        onClick={() => reload()}
        sx={{ textTransform: "none", borderRadius: 2 }}
      >
        REFRESH
      </Button>
      <Button
        variant="contained"
        size="small"
        onClick={() => navigate("/students/new")}
        startIcon={<Add />}
        sx={{ textTransform: "none", borderRadius: 2 }}
      >
        ADD STUDENT
      </Button>
    </Box>
  );

  if (loading) {
    return (
      <PageLayout title="Students" actions={pageActions}>
        <LoadingSpinner />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Students" actions={pageActions}>
        <ErrorAlert error={error} onRetry={() => reload()} />
      </PageLayout>
    );
  }

  if (!items || items.length === 0) {
    return (
      <PageLayout title="Students" actions={pageActions}>
        <EmptyState
          title="No Students Found"
          description="Add your first student to get started."
          actionLabel="Add First Student"
          onAction={() => navigate("/students/new")}
        />
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout title="Students" actions={pageActions}>
        <ApiTable
          rows={items}
          columns={cols}
          onRowClick={(r) => navigate(`/students/${r.id}`)}
          defaultPageSize={10}
          pageSizeOptions={[10, 25, 50]}
        />
      </PageLayout>

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleViewPromotions}>
          <EmojiEvents fontSize="small" sx={{ mr: 1 }} />
          View Promotions
        </MenuItem>
        <MenuItem onClick={handleAddPromotion}>
          <Add fontSize="small" sx={{ mr: 1 }} />
          Add Promotion
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete Student
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Student</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{studentToDelete?.firstName}{" "}
            {studentToDelete?.lastName}"? This action cannot be undone and will
            remove all associated data including promotions and class
            enrollments.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Promotion Form */}
      <PromotionFormDialog
        open={promotionFormOpen}
        onClose={closePromotionForm}
        onSubmit={handlePromotionSubmit}
        student={studentForPromotion}
      />
    </>
  );
}
