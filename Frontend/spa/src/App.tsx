import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RoleProvider } from "context/RoleContext";
import { ProfileProvider } from "context/ProfileContext";
import { ClassProvider } from "context/ClassContext";
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

import { RouteConfig } from "./types/api";

// Route configuration types moved to centralized types/api.ts

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
  { path: "/students/new", component: CreateStudent, roles: ["Admin", "Coach"] },
  { path: "/students/:id", component: StudentDetail },
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

export default function App() {
  return (
    <RoleProvider>
      <ProfileProvider>
        <ClassProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Header />
            <main className="app-container">
              <Routes>{routes.map(createRoute)}</Routes>
            </main>
          </BrowserRouter>
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
        theme="light"
      />
    </RoleProvider>
  );
}
