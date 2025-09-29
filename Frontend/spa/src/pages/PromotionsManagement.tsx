import React, { useState } from "react";
import {
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Menu,
  MenuItem,
} from "@mui/material";
import { Add, Edit, Delete, MoreVert, History } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ApiTable from "../components/common/ApiTable";
import PromotionForm from "../components/promotions/PromotionForm";
import { PromotionDto, CreatePromotionDto } from "../types/api";
import { useApiItems } from "../hooks/useApiItems";

export default function PromotionsManagement() {
  return (
    <div>
      <h2 className="page-title">Manage Promotions</h2>
      <PromotionsTable />
    </div>
  );
}

function PromotionsTable() {
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<PromotionDto | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] =
    useState<PromotionDto | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedPromotion, setSelectedPromotion] =
    useState<PromotionDto | null>(null);

  const {
    items: promotions,
    loading,
    error,
    reload,
  } = useApiItems<PromotionDto>("/api/Promotions");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleCreate = () => {
    setEditingPromotion(null);
    setFormOpen(true);
  };

  const handleEdit = (promotion: PromotionDto) => {
    setEditingPromotion(promotion);
    setFormOpen(true);
    setMenuAnchor(null);
  };

  const handleDelete = (promotion: PromotionDto) => {
    setPromotionToDelete(promotion);
    setDeleteDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    promotion: PromotionDto,
  ) => {
    event.stopPropagation();
    setSelectedPromotion(promotion);
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedPromotion(null);
  };

  const handleSubmit = async (promotionData: CreatePromotionDto) => {
    try {
      const url = editingPromotion
        ? `/api/Promotions/${editingPromotion.id}`
        : "/api/Promotions";
      const method = editingPromotion ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(promotionData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${editingPromotion ? "update" : "create"} promotion`,
        );
      }

      await reload();
      setFormOpen(false);
      setEditingPromotion(null);
    } catch (error) {
      console.error("Error submitting promotion:", error);
      throw error;
    }
  };

  const confirmDelete = async () => {
    if (!promotionToDelete) return;

    try {
      const response = await fetch(`/api/Promotions/${promotionToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete promotion");
      }

      await reload();
      setDeleteDialogOpen(false);
      setPromotionToDelete(null);
    } catch (error) {
      console.error("Error deleting promotion:", error);
    }
  };

  const handleViewStudentHistory = (promotion: PromotionDto) => {
    navigate(`/students/${promotion.studentId}/promotions`);
    setMenuAnchor(null);
  };

  const columns = [
    { key: "id", label: "ID", sortable: true },
    {
      key: "studentName",
      label: "Student",
      render: (r: PromotionDto) => r.studentName ?? "-",
      sortable: true,
    },
    {
      key: "rankName",
      label: "Promoted to Rank",
      render: (r: PromotionDto) => (
        <Chip label={r.rankName ?? "-"} color="primary" size="small" />
      ),
      sortable: true,
    },
    {
      key: "promotionDate",
      label: "Promotion Date",
      render: (r: PromotionDto) => formatDate(r.promotionDate),
      sortable: true,
    },
    {
      key: "notes",
      label: "Notes",
      render: (r: PromotionDto) => {
        if (!r.notes) return "-";
        return r.notes.length > 50 ? r.notes.substring(0, 50) + "..." : r.notes;
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (r: PromotionDto) => (
        <IconButton size="small" onClick={(e) => handleMenuClick(e, r)}>
          <MoreVert />
        </IconButton>
      ),
    },
  ];

  if (loading) return <div>Loading table…</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="mb-3">
        <Button variant="outlined" size="small" onClick={reload}>
          Refresh
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleCreate}
          sx={{ ml: 1 }}
        >
          Create Promotion
        </Button>
      </div>

      <ApiTable
        rows={promotions}
        columns={columns}
        onRowClick={(r) => navigate(`/promotions/${r.id}`)}
        defaultPageSize={10}
        pageSizeOptions={[10, 25, 50]}
      />

      {/* Create/Edit Form */}
      <PromotionForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingPromotion(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingPromotion}
        title={editingPromotion ? "Edit Promotion" : "Create New Promotion"}
      />

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => selectedPromotion && handleEdit(selectedPromotion)}
        >
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit Promotion
        </MenuItem>
        <MenuItem
          onClick={() =>
            selectedPromotion && handleViewStudentHistory(selectedPromotion)
          }
        >
          <History fontSize="small" sx={{ mr: 1 }} />
          Student History
        </MenuItem>
        <MenuItem
          onClick={() => selectedPromotion && handleDelete(selectedPromotion)}
          sx={{ color: "error.main" }}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete Promotion
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Promotion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this promotion for "
            {promotionToDelete?.studentName}"? This action cannot be undone and
            will revert the student's rank.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
