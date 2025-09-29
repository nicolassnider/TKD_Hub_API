import React, { useState } from "react";
import {
  Button,
  Box,
  Typography,
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
import { Edit, Delete, MoreVert, People } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useApiItems } from "../hooks/useApiItems";
import ApiTable from "../components/common/ApiTable";
import { TrainingClassDto, CreateTrainingClassDto } from "../types/api";
import { ClassForm } from "components/classes";

export default function ClassesManagement() {
  return (
    <div>
      <h2 className="page-title">Manage Classes</h2>
      <ClassesTable />
    </div>
  );
}

function ClassesTable() {
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<TrainingClassDto | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<TrainingClassDto | null>(
    null,
  );
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedClass, setSelectedClass] = useState<TrainingClassDto | null>(
    null,
  );

  const {
    items: classes,
    loading,
    error,
    reload,
  } = useApiItems<TrainingClassDto>("/api/Classes");

  const weekday = (n: number) => {
    const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return names[n] ?? String(n);
  };

  const handleCreate = () => {
    setEditingClass(null);
    setFormOpen(true);
  };

  const handleEdit = (classItem: TrainingClassDto) => {
    setEditingClass(classItem);
    setFormOpen(true);
    setMenuAnchor(null);
  };

  const handleDelete = (classItem: TrainingClassDto) => {
    setClassToDelete(classItem);
    setDeleteDialogOpen(true);
    setMenuAnchor(null);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    classItem: TrainingClassDto,
  ) => {
    event.stopPropagation();
    setSelectedClass(classItem);
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedClass(null);
  };

  const handleSubmit = async (classData: CreateTrainingClassDto) => {
    try {
      const url = editingClass
        ? `/api/Classes/${editingClass.id}`
        : "/api/Classes";
      const method = editingClass ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(classData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${editingClass ? "update" : "create"} class`,
        );
      }

      await reload();
      setFormOpen(false);
      setEditingClass(null);
    } catch (error) {
      console.error("Error submitting class:", error);
      throw error;
    }
  };

  const confirmDelete = async () => {
    if (!classToDelete) return;

    try {
      const response = await fetch(`/api/Classes/${classToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete class");
      }

      await reload();
      setDeleteDialogOpen(false);
      setClassToDelete(null);
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  const handleManageStudents = (classItem: TrainingClassDto) => {
    navigate(`/classes/${classItem.id}/students`);
    setMenuAnchor(null);
  };

  const handleManageAttendance = (classItem: TrainingClassDto) => {
    navigate(`/classes/${classItem.id}/attendance`);
    setMenuAnchor(null);
  };

  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    {
      key: "dojaangName",
      label: "Dojaang",
      render: (r: TrainingClassDto) => r.dojaangName ?? "-",
    },
    {
      key: "coachName",
      label: "Coach",
      render: (r: TrainingClassDto) => r.coachName ?? "-",
    },
    {
      key: "schedules",
      label: "Schedules",
      render: (r: TrainingClassDto) => {
        if (!r.schedules || !Array.isArray(r.schedules)) return "-";
        return (
          <Box>
            {r.schedules.map((s: any, index: number) => {
              const day = typeof s.day === "number" ? weekday(s.day) : s.day;
              const start = s.startTime ?? "";
              const end = s.endTime ? `-${s.endTime}` : "";
              return (
                <Chip
                  key={index}
                  label={`${day} ${start}${end}`.trim()}
                  size="small"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              );
            })}
          </Box>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (r: TrainingClassDto) => (
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
          Create Class
        </Button>
      </div>

      <ApiTable
        rows={classes}
        columns={columns}
        onRowClick={(r) => navigate(`/classes/${r.id}`)}
        defaultPageSize={10}
        pageSizeOptions={[10, 25, 50]}
      />

      {/* Create/Edit Form */}
      <ClassForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingClass(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingClass}
        title={editingClass ? "Edit Class" : "Create New Class"}
      />

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedClass && handleEdit(selectedClass)}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit Class
        </MenuItem>
        <MenuItem
          onClick={() => selectedClass && handleManageStudents(selectedClass)}
        >
          <People fontSize="small" sx={{ mr: 1 }} />
          Manage Students
        </MenuItem>
        <MenuItem
          onClick={() => selectedClass && handleManageAttendance(selectedClass)}
        >
          <People fontSize="small" sx={{ mr: 1 }} />
          Manage Attendance
        </MenuItem>
        <MenuItem
          onClick={() => selectedClass && handleDelete(selectedClass)}
          sx={{ color: "error.main" }}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete Class
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Class</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the class "{classToDelete?.name}"?
            This action cannot be undone and will also remove all associated
            schedules and student assignments.
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
