import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { ClassForm } from "./ClassForm";
import { ClassHeader } from "./ClassHeader.tsx";
import { ClassInformation } from "./ClassInformation";
import { StudentsList } from "./StudentsList";
import { ClassDetailSkeleton } from "./ClassDetailSkeleton";
import { ClassDetailError } from "./ClassDetailError";
import { ClassActionMenu } from "./ClassActionMenu";
import { useClassContext } from "context/ClassContext";
import { StudentAssignment } from "components/students/StudentAssignment";
import { DeleteConfirmationDialog } from "components/forms/DeleteConfirmationDialog";

export const ClassDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentClass,
    enrolledStudents,
    loading,
    error,
    fetchClass,
    fetchStudentsForClass,
    deleteClass,
    getPermissions,
    formatScheduleDisplay,
  } = useClassContext();

  const [formOpen, setFormOpen] = useState(false);
  const [studentAssignmentOpen, setStudentAssignmentOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (id) {
      const classId = parseInt(id, 10);
      fetchClass(classId);
      fetchStudentsForClass(classId);
    }
  }, [id]); // Remove function dependencies to prevent infinite loops

  const handleBack = () => {
    navigate("/classes");
  };

  const handleEdit = () => {
    setFormOpen(true);
    handleCloseMenu();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  const handleDeleteConfirm = async () => {
    if (currentClass) {
      await deleteClass(currentClass.id);
      setDeleteDialogOpen(false);
      navigate("/classes");
    }
  };

  const handleManageStudents = () => {
    setStudentAssignmentOpen(true);
    handleCloseMenu();
  };

  const handleNavigateToStudentManagement = () => {
    if (currentClass) {
      navigate(`/classes/${currentClass.id}/students`);
    }
  };

  const handleNavigateToAttendance = () => {
    if (currentClass) {
      navigate(`/classes/${currentClass.id}/attendance`);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return <ClassDetailSkeleton />;
  }

  if (error) {
    return <ClassDetailError error={error} onBack={handleBack} />;
  }

  if (!currentClass) {
    return <ClassDetailError notFound onBack={handleBack} />;
  }

  const permissions = getPermissions(currentClass);
  const enrolledStudentsCount = Array.isArray(enrolledStudents)
    ? enrolledStudents.length
    : 0;

  return (
    <Box
      sx={{
        p: 1.5,
        maxWidth: 900,
        mx: "auto",
        bgcolor: "var(--bg)",
        minHeight: "100vh",
      }}
    >
      <ClassHeader
        currentClass={currentClass}
        enrolledStudentsCount={enrolledStudentsCount}
        formatScheduleDisplay={formatScheduleDisplay}
        onBack={handleBack}
        onNavigateToStudentManagement={handleNavigateToStudentManagement}
        onNavigateToAttendance={handleNavigateToAttendance}
        onMenuClick={handleMenuClick}
        permissions={permissions}
      />

      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
        {/* Main Class Information */}
        <Box sx={{ flex: "2 1 65%", minWidth: "400px" }}>
          <ClassInformation
            currentClass={currentClass}
            enrolledStudentsCount={enrolledStudentsCount}
          />
        </Box>

        {/* Student List */}
        <Box sx={{ flex: "1 1 32%", minWidth: "280px" }}>
          <StudentsList
            enrolledStudents={enrolledStudents || []}
            onManageStudents={handleManageStudents}
            permissions={permissions}
          />
        </Box>
      </Box>

      {/* Action Menu */}
      <ClassActionMenu
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onManageStudents={handleManageStudents}
        permissions={permissions}
      />

      {/* Class Form Dialog */}
      <ClassForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        trainingClass={currentClass}
        mode="edit"
      />

      {/* Student Assignment Dialog */}
      <StudentAssignment
        open={studentAssignmentOpen}
        onClose={() => setStudentAssignmentOpen(false)}
        classId={currentClass.id}
        className={currentClass.name}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        entityName="training class"
        entityDescription={currentClass.name}
      />
    </Box>
  );
};
import React from "react";
import { Box, Alert, Button } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

interface ClassDetailErrorProps {
  error?: string;
  notFound?: boolean;
  onBack: () => void;
}

export const ClassDetailError: React.FC<ClassDetailErrorProps> = ({
  error,
  notFound = false,
  onBack,
}) => {
  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Alert severity={notFound ? "info" : "error"} sx={{ mb: 2 }}>
        {error || (notFound ? "Training class not found" : "An error occurred")}
      </Alert>
      <Button startIcon={<ArrowBackIcon />} onClick={onBack}>
        Back to Classes
      </Button>
    </Box>
  );
};
