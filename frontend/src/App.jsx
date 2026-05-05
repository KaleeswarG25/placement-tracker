import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentProfile from "./pages/StudentProfile";
import Companies from "./pages/Companies";
import MyApplications from "./pages/MyApplications";
import AddCompany from "./pages/AddCompany";
import AdminApplications from "./pages/AdminApplications";
import DSAProgress from "./pages/DSAProgress";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/companies"
        element={
          <ProtectedRoute allowedRole="student">
            <Companies />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-applications"
        element={
          <ProtectedRoute allowedRole="student">
            <MyApplications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dsa-progress"
        element={
          <ProtectedRoute allowedRole="student">
            <DSAProgress />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/add-company"
        element={
          <ProtectedRoute allowedRole="admin">
            <AddCompany />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/applications"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminApplications />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;