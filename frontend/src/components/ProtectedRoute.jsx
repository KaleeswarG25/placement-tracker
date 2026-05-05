import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload.role;

    if (allowedRole && role !== allowedRole) {
      if (role === "admin") {
        return <Navigate to="/admin-dashboard" />;
      }

      if (role === "student") {
        return <Navigate to="/student-dashboard" />;
      }

      return <Navigate to="/login" />;
    }

    return children;
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;
