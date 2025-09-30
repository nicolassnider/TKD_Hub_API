import React, { useCallback } from "react";
import { Box, Button } from "@mui/material";
import { School as SchoolIcon, Edit as EditIcon } from "@mui/icons-material";
import { GenericDetailPage } from "../../components/layout/GenericDetailPage";
import { fetchJson } from "../../lib/api";
import PromotionFormDialog from "../../components/promotions/PromotionFormDialog";
import { usePromotionForm } from "../../hooks/usePromotionForm";
import { StudentInfoCard } from "../../components/students/StudentInfoCard";
import { UserDto } from "../../types/api";

// Local Student type for display (extends UserDto with computed fields)
type Student = UserDto & {
  fullName?: string; // computed from firstName + lastName
  currentRank?: string; // alias for currentRankName
  phone?: string; // alias for phoneNumber
};

export default function StudentDetail() {
  const {
    promotionFormOpen,
    openPromotionForm,
    closePromotionForm,
    handlePromotionSubmit,
  } = usePromotionForm();

  const renderStudentContent = useCallback(
    (student: Student) => {
      console.log("StudentDetail - Received student data:", student);

      return (
        <Box
          sx={{
            p: 4,
            maxWidth: 1200,
            mx: "auto",
            bgcolor: "var(--bg)",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <StudentInfoCard student={student} />

          <PromotionFormDialog
            open={promotionFormOpen}
            onClose={closePromotionForm}
            onSubmit={handlePromotionSubmit}
            preselectedStudentId={student.id}
          />
        </Box>
      );
    },
    [promotionFormOpen, closePromotionForm, handlePromotionSubmit],
  );

  const customActions = (student: Student) => (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
      <Button
        variant="contained"
        startIcon={<SchoolIcon />}
        onClick={() => openPromotionForm()}
        size="small"
        sx={{
          background:
            "linear-gradient(135deg, var(--accent), var(--accent-700))",
          color: "white",
          fontWeight: 600,
          textTransform: "none",
          "&:hover": {
            background:
              "linear-gradient(135deg, var(--accent-600), var(--accent-900))",
          },
        }}
      >
        Add Promotion
      </Button>
      <Button
        variant="outlined"
        startIcon={<EditIcon />}
        size="small"
        sx={{
          borderColor: "var(--primary)",
          color: "var(--primary)",
          fontWeight: 600,
          textTransform: "none",
          "&:hover": {
            borderColor: "var(--primary-700)",
            bgcolor: "var(--primary-50)",
            color: "var(--primary-700)",
          },
        }}
      >
        Edit Student
      </Button>
    </Box>
  );

  const handleDelete = async (student: Student) => {
    await fetchJson(`/api/Students/${student.id}`, {
      method: "DELETE",
    });
  };

  // Transform API response to extract data
  const transformData = useCallback((response: any) => {
    console.log("StudentDetail - API response:", response);

    // If the response has a 'data' property, extract it
    if (response && typeof response === "object" && "data" in response) {
      console.log("StudentDetail - Extracted data:", response.data);
      return response.data;
    }

    // Otherwise return the response as-is
    console.log("StudentDetail - Using response directly:", response);
    return response;
  }, []);

  return (
    <GenericDetailPage
      title="STUDENT DETAILS"
      apiEndpoint="/api/Students"
      backRoute="/students"
      editRoute="/students/edit/:id"
      renderContent={renderStudentContent}
      customActions={customActions}
      onDelete={handleDelete}
      transformData={transformData}
    />
  );
}
