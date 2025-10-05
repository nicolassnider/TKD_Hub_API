import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import { RoleProvider } from "context/RoleContext";
import { ProfileProvider } from "context/ProfileContext";
import { ClassProvider } from "context/ClassContext";
import { DashboardProvider } from "context/DashboardContext";
import Header from "components/layout/Header";
import ProtectedRoute from "components/auth/ProtectedRoute";
import LoginForm from "./components/auth/LoginForm";

// Page imports - organized by subfolder
import DojaangAdmin from "components/dojaangs/DojaangAdmin";
import {
  StudentsList,
  StudentDetail,
  StudentPromotionHistory,
  CreateStudent,
  StudentPromotion,
} from "pages/students";
import { EventsList, EventDetail } from "pages/events";
import { BlogList, BlogDetail } from "pages/blog";
import { Register } from "pages/auth";
import {
  ClassesList,
  ClassesManagement,
  ClassStudentManagement,
  ClassAttendanceManagement,
} from "pages/classes";
import { ClassDetail } from "components/classes/ClassDetail";
import {
  CoachesList,
  CoachDetail,
  CreateCoach,
  EditCoach,
} from "pages/coaches";
import {
  DojaangsList,
  CreateDojaang,
  DojaangDetail,
  EditDojaang,
} from "pages/dojaangs";
import {
  PromotionsList,
  PromotionsManagement,
  PromotionDetail,
} from "pages/promotions";
import { RanksList, RankDetail } from "pages/ranks";
import { TulsList, TulDetail } from "pages/tuls";
import { UserAdministration, UserDetail } from "pages/users";
import Dashboard from "pages/Dashboard";
import { ProfilePage, EditProfile } from "pages/profile";
import MercadoPagoDebug from "pages/MercadoPagoDebug";
import { EventsManagement } from "components/events";
import { BlogManagement } from "components/blog";
import { StudentsManagement } from "components/students";
import { PaymentHistory } from "components/payments";
import Home from "pages/Home";

import { RouteConfig } from "./types/api";

// Route configuration types moved to centralized types/api.ts

// Route configurations
const routes: RouteConfig[] = [
  // Public routes
  {
    path: "/",
    component: Home,
    isPublic: true,
  },
  {
    path: "/login",
    component: () => (
      <div className="center-vh">
        <LoginForm />
      </div>
    ),
    isPublic: true,
  },
  {
    path: "/auth/login",
    component: () => (
      <div className="center-vh">
        <LoginForm />
      </div>
    ),
    isPublic: true,
  },
  { path: "/register", component: Register, isPublic: true },
  { path: "/auth/register", component: Register, isPublic: true },
  { path: "/events", component: EventsList, isPublic: true },
  { path: "/events/:id", component: EventDetail, isPublic: true },
  { path: "/blog", component: BlogList, isPublic: true },
  { path: "/blog/:id", component: BlogDetail, isPublic: true },

  // Protected routes (general users)
  { path: "/profile", component: ProfilePage },
  { path: "/profile/edit", component: EditProfile },
  { path: "/payments", component: PaymentHistory },
  { path: "/dashboard", component: Dashboard },
  { path: "/students", component: StudentsList },
  {
    path: "/students/new",
    component: CreateStudent,
    roles: ["Admin", "Coach"],
  },
  { path: "/students/:id", component: StudentDetail },
  {
    path: "/students/:id/promote",
    component: StudentPromotion,
    roles: ["Admin", "Coach"],
  },
  {
    path: "/students/:studentId/promotions",
    component: StudentPromotionHistory,
  },
  { path: "/classes", component: ClassesList },
  { path: "/classes/:id", component: ClassDetail },
  { path: "/coaches", component: CoachesList },
  { path: "/coaches/:id", component: CoachDetail },
  { path: "/coaches/:id/edit", component: EditCoach, roles: ["Admin"] },
  { path: "/dojaangs", component: DojaangsList },
  { path: "/dojaangs/:id", component: DojaangDetail },
  { path: "/dojaangs/:id/edit", component: EditDojaang, roles: ["Admin"] },
  { path: "/promotions", component: PromotionsList },
  { path: "/promotions/:id", component: PromotionDetail },
  { path: "/ranks", component: RanksList },
  { path: "/ranks/:id", component: RankDetail },
  { path: "/tuls", component: TulsList },
  { path: "/tuls/:id", component: TulDetail },

  // Admin routes
  { path: "/admin/dojaangs", component: DojaangAdmin, roles: ["Admin"] },
  { path: "/admin/coaches/create", component: CreateCoach, roles: ["Admin"] },
  {
    path: "/admin/dojaangs/create",
    component: CreateDojaang,
    roles: ["Admin"],
  },
  {
    path: "/admin/classes",
    component: ClassesManagement,
    roles: ["Admin", "Coach"],
  },
  {
    path: "/admin/classes/:classId/students",
    component: ClassStudentManagement,
    roles: ["Admin", "Coach"],
  },
  {
    path: "/admin/classes/:classId/attendance",
    component: ClassAttendanceManagement,
    roles: ["Admin", "Coach"],
  },
  {
    path: "/admin/promotions",
    component: PromotionsManagement,
    roles: ["Admin", "Coach"],
  },
  { path: "/admin/events", component: EventsManagement, roles: ["Admin"] },
  { path: "/admin/blog", component: BlogManagement, roles: ["Admin"] },
  {
    path: "/admin/students",
    component: StudentsManagement,
    roles: ["Admin"],
  },
  { path: "/admin/users", component: UserAdministration, roles: ["Admin"] },
  { path: "/admin/users/:id", component: UserDetail, roles: ["Admin"] },
  { path: "/admin/debug", component: MercadoPagoDebug, roles: ["Admin"] },
];

// Helper function to create route elements
const createRoute = (route: RouteConfig, index: number) => {
  const Component = route.component;

  if (route.isPublic) {
    return <Route key={index} path={route.path} element={<Component />} />;
  }

  return (
    <Route
      key={index}
      path={route.path}
      element={
        <ProtectedRoute requiredRoles={route.roles}>
          <Component />
        </ProtectedRoute>
      }
    />
  );
};

// Material-UI dark theme configuration with TKD logo colors
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff6b35", // TKD Orange/Red from logo
      light: "#ff9966",
      dark: "#cc4400",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#2196f3", // TKD Blue from logo
      light: "#64b5f6",
      dark: "#1565c0",
      contrastText: "#ffffff",
    },
    background: {
      default: "#121212", // Dark background
      paper: "#1e1e1e", // Slightly lighter dark for cards/papers
    },

    text: {
      primary: "#ffffff",
      secondary: "#b3b3b3",
    },
    divider: "#404040",
    action: {
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 107, 53, 0.12)",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: "2.5rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 500,
      fontSize: "1rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 600,
          padding: "12px 24px",
          boxShadow: "0 2px 8px rgba(255, 107, 53, 0.2)",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(255, 107, 53, 0.3)",
          },
        },
        contained: {
          background: "linear-gradient(45deg, #ff6b35 30%, #ff9966 90%)",
          "&:hover": {
            background: "linear-gradient(45deg, #cc4400 30%, #ff6b35 90%)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          backgroundColor: "#1e1e1e",
          border: "1px solid #404040",
          "&:hover": {
            borderColor: "#ff6b35",
            boxShadow: "0 8px 24px rgba(255, 107, 53, 0.15)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          backgroundColor: "#1e1e1e",
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#121212",
          backgroundImage: "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)",
          borderBottom: "1px solid #404040",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1e1e1e",
          borderRight: "1px solid #404040",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e",
          borderRadius: "12px",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#2d2d2d",
          "& .MuiTableCell-head": {
            fontWeight: 700,
            color: "#ff6b35",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
        colorPrimary: {
          backgroundColor: "rgba(255, 107, 53, 0.2)",
          color: "#ff9966",
          border: "1px solid #ff6b35",
        },
      },
    },
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(0,0,0,0.2)",
    "0px 3px 6px rgba(0,0,0,0.3)",
    "0px 4px 8px rgba(0,0,0,0.3)",
    "0px 6px 12px rgba(255, 107, 53, 0.2)",
    "0px 8px 16px rgba(255, 107, 53, 0.25)",
    "0px 10px 20px rgba(255, 107, 53, 0.3)",
    "0px 12px 24px rgba(255, 107, 53, 0.35)",
    "0px 16px 32px rgba(255, 107, 53, 0.4)",
    "0px 20px 40px rgba(255, 107, 53, 0.45)",
    "0px 24px 48px rgba(255, 107, 53, 0.5)",
    "0px 28px 56px rgba(255, 107, 53, 0.55)",
    "0px 32px 64px rgba(255, 107, 53, 0.6)",
    "0px 36px 72px rgba(255, 107, 53, 0.65)",
    "0px 40px 80px rgba(255, 107, 53, 0.7)",
    "0px 44px 88px rgba(255, 107, 53, 0.75)",
    "0px 48px 96px rgba(255, 107, 53, 0.8)",
    "0px 52px 104px rgba(255, 107, 53, 0.85)",
    "0px 56px 112px rgba(255, 107, 53, 0.9)",
    "0px 60px 120px rgba(255, 107, 53, 0.95)",
    "0px 64px 128px rgba(255, 107, 53, 1.0)",
    "0px 68px 136px rgba(255, 107, 53, 1.0)",
    "0px 72px 144px rgba(255, 107, 53, 1.0)",
    "0px 76px 152px rgba(255, 107, 53, 1.0)",
    "0px 80px 160px rgba(255, 107, 53, 1.0)",
  ],
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RoleProvider>
        <ProfileProvider>
          <ClassProvider>
            <DashboardProvider>
              <BrowserRouter
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                    backgroundColor: "background.default",
                  }}
                >
                  <Header />
                  <Box
                    component="main"
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      px: { xs: 1, sm: 2, md: 3 },
                      py: 2,
                    }}
                  >
                    <Routes>{routes.map(createRoute)}</Routes>
                  </Box>
                </Box>
              </BrowserRouter>
            </DashboardProvider>
          </ClassProvider>
        </ProfileProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastStyle={{
            backgroundColor: "#1e1e1e",
            color: "#ffffff",
            border: "1px solid #404040",
          }}
        />
      </RoleProvider>
    </ThemeProvider>
  );
}
