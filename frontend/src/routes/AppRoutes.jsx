import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Students from "../pages/Students";
import Faculty from "../pages/Faculty";
import Courses from "../pages/Courses";
import Assignments from "../pages/Assignments";
import Exams from "../pages/Exams";

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/login" element={<Login />} />

    {/* Protected — wrapped in MainLayout (Navbar + Outlet) */}
    <Route
      element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Admin only */}
      <Route
        path="/users"
        element={
          <ProtectedRoute roles={["admin"]}>
            <Users />
          </ProtectedRoute>
        }
      />

      {/* Admin & Faculty */}
      <Route
        path="/students"
        element={
          <ProtectedRoute roles={["admin", "faculty"]}>
            <Students />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty"
        element={
          <ProtectedRoute roles={["admin", "faculty"]}>
            <Faculty />
          </ProtectedRoute>
        }
      />

      {/* All authenticated users */}
      <Route path="/courses" element={<Courses />} />
      <Route path="/assignments" element={<Assignments />} />
      <Route path="/exams" element={<Exams />} />
    </Route>

    {/* Catch-all → dashboard if logged in, else login */}
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AppRoutes;
