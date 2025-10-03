import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import {
  Groups as GroupsIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { StudentForAssignment } from "../../types/api";

interface StudentsListProps {
  enrolledStudents: StudentForAssignment[];
  onManageStudents: () => void;
  permissions: {
    canManageStudents: boolean;
  };
}

export const StudentsList: React.FC<StudentsListProps> = ({
  enrolledStudents,
  onManageStudents,
  permissions,
}) => {
  const getStudentInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: "16px",
        height: "fit-content",
        maxWidth: "100%",
        bgcolor: "var(--panel-elevated)",
        border: "1px solid",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-lg)",
        color: "var(--fg)",
        overflow: "hidden",
      }}
      className="auth-card"
    >
      <CardContent sx={{ p: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "var(--primary)",
              fontWeight: 700,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <GroupsIcon sx={{ color: "var(--accent)" }} />
              Students (
              {Array.isArray(enrolledStudents) ? enrolledStudents.length : 0})
            </Box>
          </Typography>
          {permissions.canManageStudents && (
            <Button
              size="small"
              startIcon={<PersonAddIcon sx={{ color: "var(--gold)" }} />}
              onClick={onManageStudents}
              sx={{
                color: "var(--gold)",
                borderColor: "var(--gold)",
                "&:hover": {
                  bgcolor: "var(--gold-50)",
                  borderColor: "var(--gold-700)",
                },
              }}
            >
              Manage
            </Button>
          )}
        </Box>

        {!Array.isArray(enrolledStudents) || enrolledStudents.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 3, color: "text.secondary" }}>
            <GroupsIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
            <Typography variant="body2">No students enrolled yet</Typography>
            {permissions.canManageStudents && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<PersonAddIcon />}
                onClick={onManageStudents}
                sx={{ mt: 1 }}
              >
                Add Students
              </Button>
            )}
          </Box>
        ) : (
          <List
            sx={{
              maxHeight: 400,
              overflow: "auto",
              width: "100%",
              pr: 1,
            }}
          >
            {Array.isArray(enrolledStudents)
              ? enrolledStudents.map((student) => (
                  <ListItem
                    key={student.id}
                    sx={{ px: 0, width: "100%", maxWidth: "100%" }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          background:
                            "linear-gradient(135deg, var(--primary), var(--accent))",
                          color: "white",
                          fontWeight: 600,
                        }}
                      >
                        {getStudentInitials(
                          student.firstName,
                          student.lastName,
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${student.firstName} ${student.lastName}`}
                      sx={{
                        minWidth: 0,
                        "& .MuiListItemText-primary": {
                          wordBreak: "break-word",
                        },
                      }}
                      secondary={
                        <Box>
                          {student.email && (
                            <Typography variant="caption" display="block">
                              {student.email}
                            </Typography>
                          )}
                          {student.dojaangName && (
                            <Chip
                              label={student.dojaangName}
                              size="small"
                              variant="outlined"
                              sx={{
                                mt: 0.5,
                                borderColor: "var(--gold)",
                                color: "var(--gold)",
                                fontSize: "0.75rem",
                              }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))
              : null}
          </List>
        )}
      </CardContent>
    </Card>
  );
};
