import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Alert,
  Skeleton,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Breadcrumbs,
  Link,
  Paper,
  Stack,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Home as HomeIcon,
  Badge as BadgeIcon,
  Group as GroupIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  QuestionMark as QuestionMarkIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { fetchJson, ApiError } from "../../lib/api";
import { UserDto, Gender } from "../../types/api";

const getGenderDisplay = (gender?: number | Gender | null) => {
  switch (gender) {
    case Gender.MALE:
    case 1: // API returns numbers: 0=unspecified, 1=male, 2=female
      return { label: "Male", icon: <MaleIcon />, color: "primary" as const };
    case Gender.FEMALE:
    case 2:
      return {
        label: "Female",
        icon: <FemaleIcon />,
        color: "secondary" as const,
      };
    case Gender.OTHER:
    case 0:
    default:
      return {
        label: "Not Specified",
        icon: <QuestionMarkIcon />,
        color: "default" as const,
      };
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "Not specified";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Invalid date";
  }
};

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetchJson<any>(`/api/Users/${id}`);
        // Handle different API response structures
        const userData = response.data || response;
        setUser(userData);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load user details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleBack = () => {
    navigate("/users");
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
        <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" height={48} sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <IconButton onClick={handleBack} sx={{ color: "primary.main" }}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          User not found
        </Alert>
        <IconButton onClick={handleBack} sx={{ color: "primary.main" }}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
    );
  }

  const genderInfo = getGenderDisplay(user.gender);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto", minHeight: "100vh" }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          href="/users"
          onClick={(e) => {
            e.preventDefault();
            handleBack();
          }}
          sx={{
            cursor: "pointer",
            color: "primary.main",
            textDecoration: "none",
          }}
        >
          Users
        </Link>
        <Typography color="text.primary">
          {user.firstName} {user.lastName}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mt: -1, color: "primary.main" }}>
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            {user.firstName} {user.lastName}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={user.isActive ? "Active" : "Inactive"}
              color={user.isActive ? "success" : "default"}
              icon={user.isActive ? <CheckCircleIcon /> : <CancelIcon />}
            />
            {user.roles &&
              user.roles.map((role) => (
                <Chip
                  key={role}
                  label={role}
                  variant="outlined"
                  color="primary"
                />
              ))}
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* User Profile Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ borderRadius: "16px" }}>
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: "auto",
                  mb: 2,
                  bgcolor: "primary.main",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              >
                {getInitials(user.firstName, user.lastName)}
              </Avatar>

              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                {user.firstName} {user.lastName}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                ID: {user.id}
              </Typography>

              {user.beltLevel && (
                <Chip
                  label={user.beltLevel}
                  color="warning"
                  sx={{ mb: 2, fontWeight: 600 }}
                />
              )}

              <Divider sx={{ my: 2 }} />

              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <EmailIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={user.email}
                    secondaryTypographyProps={{
                      sx: { wordBreak: "break-word" },
                    }}
                  />
                </ListItem>

                {user.phoneNumber && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <PhoneIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone"
                      secondary={user.phoneNumber}
                    />
                  </ListItem>
                )}

                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {genderInfo.icon}
                  </ListItemIcon>
                  <ListItemText primary="Gender" secondary={genderInfo.label} />
                </ListItem>

                {user.dateOfBirth && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CakeIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Date of Birth"
                      secondary={formatDate(user.dateOfBirth)}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Information */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* Personal Information */}
            <Card elevation={2} sx={{ borderRadius: "16px" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PersonIcon color="primary" />
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, bgcolor: "background.default" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        First Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {user.firstName}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, bgcolor: "background.default" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Last Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {user.lastName}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, bgcolor: "background.default" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500, wordBreak: "break-word" }}
                      >
                        {user.email}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, bgcolor: "background.default" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Phone Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {user.phoneNumber || "Not provided"}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Dojang Information */}
            <Card elevation={2} sx={{ borderRadius: "16px" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <HomeIcon color="primary" />
                  Dojang Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, bgcolor: "background.default" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Dojang ID
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {user.dojaangId}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, bgcolor: "background.default" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Dojang Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {user.dojaangName || "Not available"}
                      </Typography>
                    </Paper>
                  </Grid>
                  {user.currentRankId && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Paper
                          variant="outlined"
                          sx={{ p: 2, bgcolor: "background.default" }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Current Rank ID
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {user.currentRankId}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper
                          variant="outlined"
                          sx={{ p: 2, bgcolor: "background.default" }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Rank Name
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {user.currentRankName || "Not available"}
                          </Typography>
                        </Paper>
                      </Grid>
                    </>
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Membership Information */}
            <Card elevation={2} sx={{ borderRadius: "16px" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <BadgeIcon color="primary" />
                  Membership Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, bgcolor: "background.default" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        <Chip
                          label={user.isActive ? "Active" : "Inactive"}
                          color={user.isActive ? "success" : "default"}
                          size="small"
                          icon={
                            user.isActive ? <CheckCircleIcon /> : <CancelIcon />
                          }
                        />
                      </Box>
                    </Paper>
                  </Grid>
                  {user.joinDate && (
                    <Grid item xs={12} sm={6}>
                      <Paper
                        variant="outlined"
                        sx={{ p: 2, bgcolor: "background.default" }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Member Since
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {formatDate(user.joinDate)}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                  {user.roles && user.roles.length > 0 && (
                    <Grid item xs={12}>
                      <Paper
                        variant="outlined"
                        sx={{ p: 2, bgcolor: "background.default" }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Roles
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {user.roles.map((role) => (
                            <Chip
                              key={role}
                              label={role}
                              variant="outlined"
                              color="primary"
                              size="small"
                              icon={<GroupIcon />}
                            />
                          ))}
                        </Box>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
