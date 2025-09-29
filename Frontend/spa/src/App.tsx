import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RoleProvider } from "context/RoleContext";
import { ProfileProvider } from "context/ProfileContext";
import Header from "components/Header";
import ProtectedRoute from "components/auth/ProtectedRoute";
import DojaangAdmin from "components/dojaangs/DojaangAdmin";
import StudentsList from "pages/StudentsList";
import StudentDetail from "pages/StudentDetail";
import EventsList from "pages/EventsList";
import EventDetail from "pages/EventDetail";
import BlogList from "pages/BlogList";
import BlogDetail from "pages/BlogDetail";
import Register from "pages/Register";

// wrapper pages
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
import UsersList from "pages/UsersList";
import UserAdministration from "pages/UserAdministration";
import UserDetail from "pages/UserDetail";
import Dashboard from "pages/Dashboard";
import { ProfilePage } from "pages/ProfilePage";
import MercadoPagoDebug from "pages/MercadoPagoDebug";
import LoginForm from "./components/auth/LoginForm";
import StudentPromotionHistory from "pages/StudentPromotionHistory";

export default function App() {
  return (
    <RoleProvider>
      <ProfileProvider>
        <BrowserRouter>
          <Header />
          <main className="app-container p-4">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="min-h-[60vh] flex items-center justify-center">
                    <h1 className="text-3xl font-bold">Welcome to TKD Hub</h1>
                  </div>
                }
              />
              <Route
                path="/login"
                element={
                  <div className="center-vh">
                    <LoginForm />
                  </div>
                }
              />
              <Route path="/register" element={<Register />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage/dojaangs"
                element={
                  <ProtectedRoute requiredRoles={["Admin"]}>
                    <DojaangAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage"
                element={
                  <ProtectedRoute requiredRoles={["Admin"]}>
                    <DojaangAdmin />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/students"
                element={
                  <ProtectedRoute>
                    <StudentsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students/:studentId/promotions"
                element={
                  <ProtectedRoute>
                    <StudentPromotionHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students/:id"
                element={
                  <ProtectedRoute>
                    <StudentDetail />
                  </ProtectedRoute>
                }
              />

              <Route path="/events" element={<EventsList />} />
              <Route path="/events/:id" element={<EventDetail />} />

              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:id" element={<BlogDetail />} />

              <Route
                path="/classes"
                element={
                  <ProtectedRoute>
                    <ClassesList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/classes/manage"
                element={
                  <ProtectedRoute requiredRoles={["Admin", "Coach"]}>
                    <ClassesManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/classes/:classId/students"
                element={
                  <ProtectedRoute requiredRoles={["Admin", "Coach"]}>
                    <ClassStudentManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/classes/:classId/attendance"
                element={
                  <ProtectedRoute requiredRoles={["Admin", "Coach"]}>
                    <ClassAttendanceManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/classes/:id"
                element={
                  <ProtectedRoute>
                    <ClassDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/coaches"
                element={
                  <ProtectedRoute>
                    <CoachesList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coaches/new"
                element={
                  <ProtectedRoute requiredRoles={["Admin"]}>
                    <CreateCoach />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coaches/:id"
                element={
                  <ProtectedRoute>
                    <CoachDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dojaangs"
                element={
                  <ProtectedRoute>
                    <DojaangsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dojaangs/new"
                element={
                  <ProtectedRoute requiredRoles={["Admin"]}>
                    <CreateDojaang />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dojaangs/:id"
                element={
                  <ProtectedRoute>
                    <DojaangDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/promotions"
                element={
                  <ProtectedRoute>
                    <PromotionsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/promotions/manage"
                element={
                  <ProtectedRoute requiredRoles={["Admin", "Coach"]}>
                    <PromotionsManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/promotions/:id"
                element={
                  <ProtectedRoute>
                    <PromotionDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/ranks"
                element={
                  <ProtectedRoute>
                    <RanksList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ranks/:id"
                element={
                  <ProtectedRoute>
                    <RankDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/tuls"
                element={
                  <ProtectedRoute>
                    <TulsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tuls/:id"
                element={
                  <ProtectedRoute>
                    <TulDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/users"
                element={
                  <ProtectedRoute requiredRoles={["Admin"]}>
                    <UserAdministration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/:id"
                element={
                  <ProtectedRoute requiredRoles={["Admin"]}>
                    <UserDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/payments/mercadopago"
                element={
                  <ProtectedRoute requiredRoles={["Admin"]}>
                    <MercadoPagoDebug />
                  </ProtectedRoute>
                }
              />
            </Routes>
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
