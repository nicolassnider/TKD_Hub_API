import React from "react";
import {
  Paper,
  Typography,
  Grid,
  Divider,
  Chip,
  Box,
  Button,
} from "@mui/material";
import { GenericDetailPage } from "../../components/layout/GenericDetailPage";
import { fetchJson } from "../../lib/api";
import PromotionFormDialog from "../../components/promotions/PromotionFormDialog";
import { usePromotionForm } from "../../hooks/usePromotionForm";
import { School } from "@mui/icons-material";
import { tkdBrandColors, tkdStyling } from "../../styles/tkdBrandColors";
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

  const renderStudentContent = (student: Student) => (
    <>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ mb: 3, textTransform: "uppercase", fontWeight: 600 }}
        >
          Student Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 1,
                textTransform: "uppercase",
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
              }}
            >
              Full Name
            </Typography>
            <Typography
              variant="body1"
              sx={{ ...tkdStyling.importantText, mb: 2 }}
            >
              {student.fullName}
            </Typography>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 1,
                textTransform: "uppercase",
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
              }}
            >
              Email
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {student.email || "Not provided"}
            </Typography>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {student.currentRank && (
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                }}
              >
                Current Rank
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={student.currentRank}
                  sx={{
                    backgroundColor: tkdBrandColors.gold.main,
                    color: tkdBrandColors.gold.contrast,
                    fontWeight: 600,
                    "& .MuiChip-label": { px: 2 },
                  }}
                  size="small"
                />
              </Box>
              <Divider sx={{ my: 2 }} />
            </Grid>
          )}

          {student.dojaangName && (
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                }}
              >
                Dojaang
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {student.dojaangName}
              </Typography>
              <Divider sx={{ my: 2 }} />
            </Grid>
          )}

          {student.phone && (
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                }}
              >
                Phone
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {student.phone}
              </Typography>
              <Divider sx={{ my: 2 }} />
            </Grid>
          )}

          {student.dateOfBirth && (
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                }}
              >
                Date of Birth
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {new Date(student.dateOfBirth).toLocaleDateString()}
              </Typography>
              <Divider sx={{ my: 2 }} />
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                mb: 1,
                textTransform: "uppercase",
                fontSize: "0.75rem",
                letterSpacing: "0.08em",
              }}
            >
              Status
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={student.isActive ? "Active" : "Inactive"}
                sx={tkdStyling.statusChip(student.isActive ?? false)}
                size="small"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <PromotionFormDialog
        open={promotionFormOpen}
        onClose={closePromotionForm}
        onSubmit={handlePromotionSubmit}
        preselectedStudentId={student.id}
      />
    </>
  );

  const customActions = (student: Student) => (
    <Button
      variant="contained"
      startIcon={<School />}
      onClick={() => openPromotionForm()}
      sx={tkdStyling.primaryButton}
    >
      Add Promotion
    </Button>
  );

  const handleDelete = async (student: Student) => {
    await fetchJson(`/api/Students/${student.id}`, {
      method: "DELETE",
    });
  };

  return (
    <GenericDetailPage
      title="STUDENT DETAILS"
      apiEndpoint="/api/Students"
      backRoute="/students"
      editRoute="/students/edit/:id"
      renderContent={renderStudentContent}
      customActions={customActions}
      onDelete={handleDelete}
    />
  );
}
