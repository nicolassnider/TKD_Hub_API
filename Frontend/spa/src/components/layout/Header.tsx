import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Groups as StudentsIcon,
  School as ClassesIcon,
  EmojiEvents as EventsIcon,
  Article as BlogIcon,
  Home as DojaangsIcon,
  Person as CoachesIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../context/RoleContext";

// Route configuration
interface RouteConfig {
  path: string;
  label: string;
  icon?: React.ReactElement;
  roles?: string[];
}

const guestRoutes: RouteConfig[] = [
  { path: "/events", label: "Events", icon: <EventsIcon /> },
  { path: "/blog", label: "Blog", icon: <BlogIcon /> },
];

const authenticatedRoutes: RouteConfig[] = [
  { path: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  { path: "/students", label: "Students", icon: <StudentsIcon /> },
  { path: "/classes", label: "Classes", icon: <ClassesIcon /> },
  { path: "/events", label: "Events", icon: <EventsIcon /> },
  { path: "/coaches", label: "Coaches", icon: <CoachesIcon /> },
  { path: "/dojaangs", label: "Dojaangs", icon: <DojaangsIcon /> },
  { path: "/blog", label: "Blog", icon: <BlogIcon /> },
  {
    path: "/users",
    label: "User Administration",
    icon: <AdminIcon />,
    roles: ["Admin"],
  },
];

const desktopRoutes: RouteConfig[] = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/students", label: "Students" },
  { path: "/classes", label: "Classes" },
  { path: "/events", label: "Events" },
  { path: "/coaches", label: "Coaches" },
  { path: "/dojaangs", label: "Dojaangs" },
  { path: "/blog", label: "Blog" },
];

const desktopGuestRoutes: RouteConfig[] = [
  { path: "/events", label: "Events" },
  { path: "/blog", label: "Blog" },
];

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const {
    token,
    role,
    displayName,
    avatarUrl,
    setToken,
    setRole,
    setDisplayName,
    setAvatarUrl,
    hasRole,
  } = useRole();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [logoutOpen, setLogoutOpen] = React.useState(false);

  const open = Boolean(anchorEl);
  const isGuest =
    Array.isArray(role) && role.length === 1 && role[0] === "Guest";

  const handleMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const logout = () => {
    setToken(null);
    setRole(["Guest"]);
    setDisplayName?.(null);
    setAvatarUrl?.(null);
    setLogoutOpen(false);
    navigate("/");
  };

  const confirmLogout = () => setLogoutOpen(true);
  const cancelLogout = () => setLogoutOpen(false);

  // Helper function to check if user can access a route
  const canAccessRoute = (route: RouteConfig) => {
    if (!route.roles || route.roles.length === 0) {
      return true;
    }
    return route.roles.some((requiredRole) => hasRole(requiredRole));
  };

  // Helper function to create menu items
  const createMenuItem = (route: RouteConfig) => {
    if (!canAccessRoute(route)) {
      return null;
    }
    return (
      <MenuItem
        key={route.path}
        onClick={() => {
          handleClose();
          navigate(route.path);
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          py: 1.5,
          px: 2,
          "&:hover": {
            backgroundColor: "rgba(255, 107, 53, 0.1)",
            color: "#ff9966",
          },
        }}
      >
        {route.icon && (
          <Box sx={{ display: "flex", alignItems: "center", minWidth: 24 }}>
            {route.icon}
          </Box>
        )}
        <Typography variant="body1">{route.label}</Typography>
      </MenuItem>
    );
  };

  // Helper function to create desktop buttons
  const createButton = (route: RouteConfig) => {
    if (!canAccessRoute(route)) {
      return null;
    }
    return (
      <Button
        key={route.path}
        color="inherit"
        onClick={() => navigate(route.path)}
        sx={{
          textTransform: "none",
          fontWeight: 500,
          px: 2,
          py: 1,
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "rgba(255, 107, 53, 0.15)",
            color: "#ff9966",
          },
        }}
      >
        {route.label}
      </Button>
    );
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)",
          borderBottom: "2px solid #ff6b35",
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 64, md: 72 },
            px: { xs: 2, sm: 3, md: 4 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(255, 107, 53, 0.15)",
                  color: "#ff9966",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Logo/Brand */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: { xs: 1, md: 0 },
            }}
          >
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 800,
                letterSpacing: "1px",
                cursor: "pointer",
                textDecoration: "none",
                background: "linear-gradient(45deg, #ff6b35 30%, #2196f3 70%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                "&:hover": {
                  transform: "scale(1.05)",
                  filter: "brightness(1.2)",
                },
                transition: "all 0.3s ease-in-out",
                textShadow: "0 0 20px rgba(255, 107, 53, 0.3)",
              }}
              onClick={() => navigate("/")}
            >
              TKD HUB
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
            {isGuest ? (
              <>{desktopGuestRoutes.map(createButton)}</>
            ) : (
              <>{desktopRoutes.map(createButton).filter(Boolean)}</>
            )}
          </Box>

          {/* User Actions */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexGrow: 0,
            }}
          >
            {token ? (
              <>
                <Chip
                  avatar={
                    displayName || avatarUrl ? (
                      <Avatar
                        alt={displayName ?? "User"}
                        src={avatarUrl ?? undefined}
                        sx={{ width: 28, height: 28 }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: "secondary.main",
                        }}
                      >
                        {(displayName ?? "U").charAt(0).toUpperCase()}
                      </Avatar>
                    )
                  }
                  label={
                    displayName ??
                    (Array.isArray(role) ? role[0] : role) ??
                    "User"
                  }
                  variant="outlined"
                  clickable
                  sx={{
                    cursor: "pointer",
                    borderColor: "rgba(255,255,255,0.3)",
                    color: "inherit",
                    bgcolor: "rgba(255,255,255,0.05)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 107, 53, 0.15)",
                      borderColor: "rgba(255,255,255,0.5)",
                    },
                    "& .MuiChip-label": {
                      px: 1.5,
                      fontWeight: 500,
                    },
                  }}
                  onClick={() => navigate("/profile")}
                />
                <Button
                  color="inherit"
                  onClick={confirmLogout}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: "rgba(255,255,255,0.3)",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderColor: "rgba(255,255,255,0.5)",
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate("/register")}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "rgba(255, 107, 53, 0.15)",
                      color: "#ff9966",
                    },
                  }}
                >
                  Register
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate("/login")}
                  variant="outlined"
                  sx={{
                    borderColor: "rgba(255,255,255,0.5)",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderColor: "rgba(255,255,255,0.7)",
                    },
                  }}
                >
                  Login
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 250,
            maxWidth: 300,
            borderRadius: "12px",
            boxShadow: theme.shadows[8],
            "& .MuiMenuItem-root": {
              borderRadius: "8px",
              mx: 1,
              my: 0.5,
            },
          },
        }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        {isGuest ? (
          <>
            {guestRoutes.map(createMenuItem)}
            <Box sx={{ borderTop: 1, borderColor: "divider", mt: 1, pt: 1 }}>
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/register");
                }}
              >
                <Typography variant="body1">Register</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/login");
                }}
              >
                <Typography variant="body1">Login</Typography>
              </MenuItem>
            </Box>
          </>
        ) : (
          <>
            {authenticatedRoutes.map(createMenuItem).filter(Boolean)}
            {token && (
              <Box sx={{ borderTop: 1, borderColor: "divider", mt: 1, pt: 1 }}>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate("/profile");
                  }}
                >
                  <Typography variant="body1">Profile</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    confirmLogout();
                  }}
                >
                  <Typography variant="body1">Logout</Typography>
                </MenuItem>
              </Box>
            )}
          </>
        )}
      </Menu>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutOpen}
        onClose={cancelLogout}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            minWidth: 300,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Confirm Logout
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <DialogContentText>
            Are you sure you want to sign out? You'll need to log in again to
            access your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={cancelLogout}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={logout}
            variant="contained"
            color="primary"
            sx={{ textTransform: "none" }}
          >
            Sign Out
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
