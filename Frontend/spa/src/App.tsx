import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoleProvider } from "context/RoleContext";
import Header from "components/Header";
import DojaangAdmin from "components/DojaangAdmin";
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
import CoachesList from "pages/CoachesList";
import CoachDetail from "pages/CoachDetail";
import DojaangsList from "pages/DojaangsList";
import CreateDojaang from "pages/CreateDojaang";
import DojaangDetail from "pages/DojaangDetail";
import PromotionsList from "pages/PromotionsList";
import PromotionDetail from "pages/PromotionDetail";
import RanksList from "pages/RanksList";
import RankDetail from "pages/RankDetail";
import TulsList from "pages/TulsList";
import TulDetail from "pages/TulDetail";
import UsersList from "pages/UsersList";
import UserDetail from "pages/UserDetail";
import Dashboard from "pages/Dashboard";
import MercadoPagoDebug from "pages/MercadoPagoDebug";
import LoginForm from "./components/LoginForm";

export default function App() {
  return (
    <RoleProvider>
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
            <Route path="/manage/dojaangs" element={<DojaangAdmin />} />
            <Route path="/manage" element={<DojaangAdmin />} />

            <Route path="/students" element={<StudentsList />} />
            <Route path="/students/:id" element={<StudentDetail />} />

            <Route path="/events" element={<EventsList />} />
            <Route path="/events/:id" element={<EventDetail />} />

            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogDetail />} />

            <Route path="/classes" element={<ClassesList />} />
            <Route path="/classes/:id" element={<ClassDetail />} />

            <Route path="/coaches" element={<CoachesList />} />
            <Route path="/coaches/:id" element={<CoachDetail />} />

            <Route path="/dojaangs" element={<DojaangsList />} />
            <Route path="/dojaangs/new" element={<CreateDojaang />} />
            <Route path="/dojaangs/:id" element={<DojaangDetail />} />

            <Route path="/promotions" element={<PromotionsList />} />
            <Route path="/promotions/:id" element={<PromotionDetail />} />

            <Route path="/ranks" element={<RanksList />} />
            <Route path="/ranks/:id" element={<RankDetail />} />

            <Route path="/tuls" element={<TulsList />} />
            <Route path="/tuls/:id" element={<TulDetail />} />

            <Route path="/users" element={<UsersList />} />
            <Route path="/users/:id" element={<UserDetail />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route
              path="/payments/mercadopago"
              element={<MercadoPagoDebug />}
            />
          </Routes>
        </main>
      </BrowserRouter>
    </RoleProvider>
  );
}
