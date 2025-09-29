import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { useNavigate } from "react-router-dom";
import { useRole } from "context/RoleContext";

// Route configuration
interface RouteConfig {
  path: string;
  label: string;
  roles?: string[]; // If undefined, available to all authenticated users
}

const guestRoutes: RouteConfig[] = [
  { path: "/events", label: "Events" },
  { path: "/blog", label: "Blog" },
  { path: "/register", label: "Register" },
  { path: "/login", label: "Login" },
];

const authenticatedRoutes: RouteConfig[] = [
  { path: "/", label: "Home" },
  { path: "/students", label: "Students" },
  { path: "/events", label: "Events" },
  { path: "/blog", label: "Blog" },
  { path: "/classes", label: "Classes" },
  {
    path: "/classes/manage",
    label: "Manage Classes",
    roles: ["Admin", "Coach"],
  },
  { path: "/coaches", label: "Coaches" },
  { path: "/dojaangs", label: "Dojaangs" },
  { path: "/promotions", label: "Promotions" },
  {
    path: "/promotions/manage",
    label: "Manage Promotions",
    roles: ["Admin", "Coach"],
  },
  { path: "/ranks", label: "Ranks" },
  { path: "/tuls", label: "Tuls" },
  { path: "/users", label: "User Administration", roles: ["Admin"] },
  { path: "/dashboard", label: "Dashboard" },
  { path: "/payments/mercadopago", label: "Payments" },
  { path: "/manage", label: "Manage", roles: ["Admin"] },
];

const desktopRoutes: RouteConfig[] = [
  { path: "/students", label: "Students" },
  { path: "/events", label: "Events" },
  { path: "/blog", label: "Blog" },
  { path: "/classes", label: "Classes" },
  { path: "/coaches", label: "Coaches" },
  { path: "/dojaangs", label: "Dojaangs" },
];

const desktopGuestRoutes: RouteConfig[] = [
  { path: "/events", label: "Events" },
  { path: "/blog", label: "Blog" },
];

export default function Header() {
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
  const open = Boolean(anchorEl);
  const handleMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const [logoutOpen, setLogoutOpen] = React.useState(false);

  const isGuest =
    Array.isArray(role) && role.length === 1 && role[0] === "Guest";

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
      return true; // No role restriction
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
      >
        {route.label}
      </MenuItem>
    );
  };

  // Helper function to create buttons
  const createButton = (route: RouteConfig) => {
    if (!canAccessRoute(route)) {
      return null;
    }
    return (
      <Button
        key={route.path}
        color="inherit"
        onClick={() => navigate(route.path)}
      >
        {route.label}
      </Button>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            {/* Render routes based on user role */}
            {isGuest ? (
              <>{guestRoutes.map(createMenuItem)}</>
            ) : (
              <>
                {authenticatedRoutes.map(createMenuItem).filter(Boolean)}
                {/* Auth actions in menu */}
                {token ? (
                  <>
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        navigate("/profile");
                      }}
                    >
                      {displayName ??
                        (Array.isArray(role) ? role[0] : role) ??
                        "User"}
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        confirmLogout();
                      }}
                    >
                      Logout
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        navigate("/register");
                      }}
                    >
                      Register
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleClose();
                        navigate("/login");
                      }}
                    >
                      Login
                    </MenuItem>
                  </>
                )}
              </>
            )}
          </Menu>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TKD Hub
          </Typography>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {isGuest ? (
              <>{desktopGuestRoutes.map(createButton)}</>
            ) : (
              <>{desktopRoutes.map(createButton).filter(Boolean)}</>
            )}
          </Box>

          {token ? (
            <>
              <Chip
                avatar={
                  displayName || avatarUrl ? (
                    <Avatar
                      alt={displayName ?? "User"}
                      src={avatarUrl ?? undefined}
                    />
                  ) : undefined
                }
                label={
                  displayName ??
                  (Array.isArray(role) ? role[0] : role) ??
                  "User"
                }
                variant="outlined"
                sx={{
                  mr: 1,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
                onClick={() => navigate("/profile")}
              />
              <Button color="inherit" onClick={confirmLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/register")}>
                Register
              </Button>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
            </>
          )}

          <Dialog open={logoutOpen} onClose={cancelLogout}>
            <DialogTitle>Confirm logout</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to sign out?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={cancelLogout}>Cancel</Button>
              <Button onClick={logout} color="primary">
                Sign out
              </Button>
            </DialogActions>
          </Dialog>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
