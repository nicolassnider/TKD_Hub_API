import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Groups as StudentsIcon,
  EmojiEvents as EventsIcon,
  School as ClassesIcon,
  Article as BlogIcon,
  SportsKabaddi as TKDIcon,
  Person as ProfileIcon,
  Dashboard as DashboardIcon,
  Login as LoginIcon,
} from "@mui/icons-material";
import { useRole } from "../context/RoleContext";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  buttonAction: () => void;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  buttonText,
  buttonAction,
  color,
}) => {
  const theme = useTheme();

  return (
    <Card
      elevation={3}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: `1px solid ${alpha(color, 0.2)}`,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 8px 25px ${alpha(color, 0.3)}`,
          border: `1px solid ${alpha(color, 0.4)}`,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: "12px",
              background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.8)})`,
              mr: 2,
              color: "white",
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="h3" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 3, pt: 0 }}>
        <Button
          variant="contained"
          onClick={buttonAction}
          fullWidth
          sx={{
            background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.8)})`,
            color: "white",
            fontWeight: 600,
            py: 1.5,
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": {
              background: `linear-gradient(135deg, ${alpha(color, 0.9)}, ${alpha(color, 0.7)})`,
            },
          }}
        >
          {buttonText}
        </Button>
      </CardActions>
    </Card>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { token, role } = useRole();
  const theme = useTheme();

  const isAuthenticated = !!token;

  const publicFeatures = [
    {
      title: "Upcoming Events",
      description:
        "Stay updated with tournaments, seminars, and special training sessions happening in our community.",
      icon: <EventsIcon />,
      buttonText: "View Events",
      buttonAction: () => navigate("/events"),
      color: "#FF6B35",
    },
    {
      title: "Latest News & Articles",
      description:
        "Read the latest news, training tips, and insights from our Taekwondo community.",
      icon: <BlogIcon />,
      buttonText: "Read Blog",
      buttonAction: () => navigate("/blog"),
      color: "#4ECDC4",
    },
    {
      title: "Join Our Community",
      description:
        "Create an account to access training schedules, track your progress, and connect with other practitioners.",
      icon: <LoginIcon />,
      buttonText: "Sign Up",
      buttonAction: () => navigate("/register"),
      color: "#45B7D1",
    },
  ];

  const authenticatedFeatures = [
    {
      title: "My Dashboard",
      description:
        "View your personal dashboard with training progress, upcoming classes, and important notifications.",
      icon: <DashboardIcon />,
      buttonText: "Go to Dashboard",
      buttonAction: () => navigate("/dashboard"),
      color: "#6C5CE7",
    },
    {
      title: "Training Classes",
      description:
        "Browse and manage your training classes, view schedules, and track attendance.",
      icon: <ClassesIcon />,
      buttonText: "View Classes",
      buttonAction: () => navigate("/classes"),
      color: "#A29BFE",
    },
    {
      title: "Students & Community",
      description:
        "Connect with fellow students, view profiles, and track training progress together.",
      icon: <StudentsIcon />,
      buttonText: "View Students",
      buttonAction: () => navigate("/students"),
      color: "#FD79A8",
    },
    {
      title: "My Profile",
      description:
        "Manage your profile information, track your belt progression, and update your details.",
      icon: <ProfileIcon />,
      buttonText: "View Profile",
      buttonAction: () => navigate("/profile"),
      color: "#00B894",
    },
  ];

  const features = isAuthenticated ? authenticatedFeatures : publicFeatures;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      }}
    >
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box
          sx={{
            pt: { xs: 8, md: 12 },
            pb: { xs: 6, md: 8 },
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: 60, md: 80 },
                height: { xs: 60, md: 80 },
                borderRadius: "20px",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                mr: 3,
                color: "white",
              }}
            >
              <TKDIcon sx={{ fontSize: { xs: 32, md: 40 } }} />
            </Box>
            <Typography
              variant="h2"
              component="h1"
              fontWeight={700}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
            >
              TKD Hub
            </Typography>
          </Box>

          <Typography
            variant="h5"
            component="h2"
            sx={{
              mb: 3,
              color: "text.primary",
              fontWeight: 500,
              fontSize: { xs: "1.25rem", md: "1.5rem" },
            }}
          >
            Your Complete Taekwondo Training Platform
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: "text.secondary",
              maxWidth: "600px",
              mx: "auto",
              fontSize: { xs: "1rem", md: "1.125rem" },
              lineHeight: 1.6,
            }}
          >
            {isAuthenticated
              ? `Welcome back! Manage your training, track your progress, and stay connected with your Taekwondo community.`
              : `Join our community to access training schedules, track your belt progression, participate in events, and connect with fellow practitioners.`}
          </Typography>

          {!isAuthenticated && (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/register")}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  color: "white",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "1.1rem",
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/login")}
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "1.1rem",
                }}
              >
                Sign In
              </Button>
            </Box>
          )}
        </Box>

        {/* Features Section */}
        <Box sx={{ pb: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            fontWeight={600}
            sx={{ mb: 6, color: "text.primary" }}
          >
            {isAuthenticated ? "Quick Access" : "Discover What We Offer"}
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Footer CTA */}
        {!isAuthenticated && (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
              Ready to Begin Your Journey?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
              Join thousands of practitioners who are already part of our
              community.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/register")}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: "white",
                fontWeight: 600,
                px: 6,
                py: 2,
                borderRadius: "12px",
                textTransform: "none",
                fontSize: "1.1rem",
              }}
            >
              Join TKD Hub Today
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Home;
