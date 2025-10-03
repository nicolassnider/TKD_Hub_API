import React from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
  Schedule as ScheduleIcon,
  Groups as GroupsIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { TrainingClass } from "../../types/api";

interface ClassHeaderProps {
  currentClass: TrainingClass;
  enrolledStudentsCount: number;
  formatScheduleDisplay: (schedules: any[]) => string;
  onBack: () => void;
  onNavigateToStudentManagement: () => void;
  onNavigateToAttendance: () => void;
  onMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canManageStudents: boolean;
  };
}

export const ClassHeader: React.FC<ClassHeaderProps> = ({
  currentClass,
  enrolledStudentsCount,
  formatScheduleDisplay,
  onBack,
  onNavigateToStudentManagement,
  onNavigateToAttendance,
  onMenuClick,
  permissions,
}) => {
  return (
    <>
      {/* Breadcrumbs */}
      <Breadcrumbs
        sx={{
          mb: 2,
          "& .MuiBreadcrumbs-separator": { color: "var(--fg-muted)" },
        }}
      >
        <Link
          href="/classes"
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
          sx={{
            cursor: "pointer",
            color: "var(--primary)",
            textDecoration: "none",
            "&:hover": { color: "var(--accent)" },
          }}
        >
          Classes
        </Link>
        <Typography sx={{ color: "var(--fg)" }}>{currentClass.name}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
        <IconButton
          onClick={onBack}
          sx={{
            mt: -1,
            color: "var(--primary)",
            "&:hover": {
              bgcolor: "var(--primary-50)",
              color: "var(--primary-700)",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              color: "var(--fg)",
              fontWeight: 700,
            }}
            className="page-title"
          >
            {currentClass.name}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            <Chip
              label={`${enrolledStudentsCount} students`}
              icon={<GroupsIcon />}
              sx={{
                bgcolor: "var(--primary-100)",
                color: "var(--primary)",
                fontWeight: 600,
                "& .MuiChip-icon": {
                  color: "var(--primary)",
                },
              }}
            />
            <Chip
              label={formatScheduleDisplay(currentClass.schedules || [])}
              variant="outlined"
              icon={<ScheduleIcon />}
              sx={{
                borderColor: "var(--accent)",
                color: "var(--accent)",
                "& .MuiChip-icon": {
                  color: "var(--accent)",
                },
              }}
            />
          </Box>

          {/* Action Buttons */}
          {permissions.canManageStudents && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                startIcon={<GroupsIcon />}
                onClick={onNavigateToStudentManagement}
                size="small"
                className="auth-button"
                sx={{
                  background:
                    "linear-gradient(135deg, var(--primary), var(--primary-700))",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, var(--primary-600), var(--primary-900))",
                  },
                }}
              >
                Manage Students
              </Button>
              <Button
                variant="outlined"
                startIcon={<AssignmentIcon />}
                onClick={onNavigateToAttendance}
                size="small"
                sx={{
                  borderColor: "var(--accent)",
                  color: "var(--accent)",
                  "&:hover": {
                    borderColor: "var(--accent-700)",
                    bgcolor: "var(--accent-50)",
                    color: "var(--accent-700)",
                  },
                }}
              >
                Take Attendance
              </Button>
            </Box>
          )}
        </Box>

        {(permissions.canEdit || permissions.canDelete) && (
          <IconButton
            onClick={onMenuClick}
            sx={{
              color: "var(--fg-muted)",
              "&:hover": {
                bgcolor: "var(--surface-hover)",
                color: "var(--primary)",
              },
            }}
          >
            <MoreVertIcon />
          </IconButton>
        )}
      </Box>
    </>
  );
};
