import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RoleProvider } from "context/RoleContext";
import { ProfileProvider } from "context/ProfileContext";
import Header from "components/layout/Header";
import ProtectedRoute from "components/auth/ProtectedRoute";
import LoginForm from "./components/auth/LoginForm";

// Page imports
import DojaangAdmin from "components/dojaangs/DojaangAdmin";
import StudentsList from "pages/StudentsList";
import StudentDetail from "pages/StudentDetail";
import StudentPromotionHistory from "pages/StudentPromotionHistory";
import EventsList from "pages/EventsList";
import EventDetail from "pages/EventDetail";
import BlogList from "pages/BlogList";
import BlogDetail from "pages/BlogDetail";
import Register from "pages/Register";
import ClassesList from "pages/ClassesList";
import ClassDetail from "pages/ClassDetail";
import ClassesManagement from "pages/ClassesManagement";
import ClassStudentManagement from "pages/ClassStudentManagement";
import ClassAttendanceManagement from "pages/ClassAttendanceManagement";
import CoachesList from "pages/CoachesList";
import CoachDetail from "pages/CoachDetail";
import CreateCoach from "pages/CreateCoach";
import DojaangsList from "pages/DojaangsList";
import CreateDojaang from "pages/CreateDojaang";
import DojaangDetail from "pages/DojaangDetail";
import PromotionsList from "pages/PromotionsList";
import PromotionsManagement from "pages/PromotionsManagement";
import PromotionDetail from "pages/PromotionDetail";
import RanksList from "pages/RanksList";
import RankDetail from "pages/RankDetail";
import TulsList from "pages/TulsList";
import TulDetail from "pages/TulDetail";
import UserAdministration from "pages/UserAdministration";
import UserDetail from "pages/UserDetail";
import Dashboard from "pages/Dashboard";
import { ProfilePage } from "pages/ProfilePage";
import MercadoPagoDebug from "pages/MercadoPagoDebug";

// Route configuration types
interface RouteConfig {
  path: string;
  component: React.ComponentType;
  roles?: string[];
  isPublic?: boolean;
}

// Route configurations
const routes: RouteConfig[] = [
  // Public routes
  {
    path: "/",
    component: () => (
      <div className="min-h-[60vh] flex items-center justify-center">
        <h1 className="text-3xl font-bold">Welcome to TKD Hub</h1>
      </div>
    ),
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
  { path: "/register", component: Register, isPublic: true },
  { path: "/events", component: EventsList, isPublic: true },
  { path: "/events/:id", component: EventDetail, isPublic: true },
  { path: "/blog", component: BlogList, isPublic: true },
  { path: "/blog/:id", component: BlogDetail, isPublic: true },

  // Protected routes (general users)
  { path: "/profile", component: ProfilePage },
  { path: "/dashboard", component: Dashboard },
  { path: "/students", component: StudentsList },
  { path: "/students/:id", component: StudentDetail },
  {
    path: "/students/:studentId/promotions",
    component: StudentPromotionHistory,
  },
  { path: "/classes", component: ClassesList },
  { path: "/classes/:id", component: ClassDetail },
  { path: "/coaches", component: CoachesList },
  { path: "/coaches/:id", component: CoachDetail },
  { path: "/dojaangs", component: DojaangsList },
  { path: "/dojaangs/:id", component: DojaangDetail },
  { path: "/promotions", component: PromotionsList },
  { path: "/promotions/:id", component: PromotionDetail },
  { path: "/ranks", component: RanksList },
  { path: "/ranks/:id", component: RankDetail },
  { path: "/tuls", component: TulsList },
  { path: "/tuls/:id", component: TulDetail },

  // Admin/Coach routes
  {
    path: "/classes/manage",
    component: ClassesManagement,
    roles: ["Admin", "Coach"],
  },
  {
    path: "/classes/:classId/students",
    component: ClassStudentManagement,
    roles: ["Admin", "Coach"],
  },
  {
    path: "/classes/:classId/attendance",
    component: ClassAttendanceManagement,
    roles: ["Admin", "Coach"],
  },
  {
    path: "/promotions/manage",
    component: PromotionsManagement,
    roles: ["Admin", "Coach"],
  },

  // Admin-only routes
  { path: "/manage", component: DojaangAdmin, roles: ["Admin"] },
  { path: "/manage/dojaangs", component: DojaangAdmin, roles: ["Admin"] },
  { path: "/coaches/new", component: CreateCoach, roles: ["Admin"] },
  { path: "/dojaangs/new", component: CreateDojaang, roles: ["Admin"] },
  { path: "/users", component: UserAdministration, roles: ["Admin"] },
  { path: "/users/:id", component: UserDetail, roles: ["Admin"] },
  {
    path: "/payments/mercadopago",
    component: MercadoPagoDebug,
    roles: ["Admin"],
  },
];

// Helper function to create routes
const createRoute = (config: RouteConfig, index: number) => {
  const { path, component: Component, roles, isPublic } = config;

  if (isPublic) {
    return <Route key={index} path={path} element={<Component />} />;
  }

  return (
    <Route
      key={index}
      path={path}
      element={
        <ProtectedRoute requiredRoles={roles}>
          <Component />
        </ProtectedRoute>
      }
    />
  );
};

export default function App() {
  return (
    <RoleProvider>
      <ProfileProvider>
        <BrowserRouter>
          <Header />
          <main className="app-container p-4">
            <Routes>{routes.map(createRoute)}</Routes>
          </main>
        </BrowserRouter>
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
        theme="light"
      />
    </RoleProvider>
  );
}
