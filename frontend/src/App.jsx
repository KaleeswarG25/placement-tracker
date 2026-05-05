import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentProfile from "./pages/StudentProfile";
import Companies from "./pages/Companies";
import MyApplications from "./pages/MyApplications";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/profile" element={<StudentProfile />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/my-applications" element={<MyApplications />} />

      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;