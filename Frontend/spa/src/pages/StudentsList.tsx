import ApiTable from "components/ApiTable";
import { useApiItems } from "../hooks/useApiItems";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  MoreVert,
  Visibility,
  Delete,
  EmojiEvents,
  Add,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState, MouseEvent } from "react";
import PromotionFormDialog from "../components/PromotionFormDialog";
import { usePromotionForm } from "../hooks/usePromotionForm";

export default function StudentsList() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Students</h2>
      <StudentsTable />
    </div>
  );
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

  const cols = [
    { key: "id", label: "ID", sortable: true },
    {
      key: "fullName",
      label: "Name",
      render: (r: any) => `${r.firstName} ${r.lastName}`,
      sortable: true,
    },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone" },
    {
      key: "rankName",
      label: "Rank",
      render: (r: any) => r.rankName || "Not assigned",
    },
    {
      key: "actions",
      label: "Actions",
      render: (r: any) => (
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
        <Button variant="outlined" size="small" onClick={() => reload()}>
          Refresh
        </Button>
      </div>

      <ApiTable
        rows={items}
        columns={cols}
        onRowClick={(r) => navigate(`/students/${r.id}`)}
        defaultPageSize={10}
        pageSizeOptions={[10, 25, 50]}
      />

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
    </div>
  );
}
