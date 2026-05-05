import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [location]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>{role === "admin" ? "Placement Admin" : "Placement Tracker"}</h2>
      </div>

      <div className="nav-links">
        {role === "admin" ? (
          <>
            <Link to="/admin-dashboard" className={isActive("/admin-dashboard")}>
              Dashboard
            </Link>
            <Link to="/admin/add-company" className={isActive("/admin/add-company")}>
              Add Company
            </Link>
            <Link to="/admin/applications" className={isActive("/admin/applications")}>
              Applications
            </Link>
          </>
        ) : (
          <>
            <Link to="/student-dashboard" className={isActive("/student-dashboard")}>
              Dashboard
            </Link>
            <Link to="/profile" className={isActive("/profile")}>
              Profile
            </Link>
            <Link to="/companies" className={isActive("/companies")}>
              Companies
            </Link>
            <Link to="/my-applications" className={isActive("/my-applications")}>
              My Applications
            </Link>
            <Link to="/dsa-progress" className={isActive("/dsa-progress")}>
              DSA Progress
            </Link>
          </>
        )}
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;