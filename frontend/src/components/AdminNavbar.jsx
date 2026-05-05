import { Link, useNavigate } from "react-router-dom";

function AdminNavbar() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <h2>Admin Panel</h2>

            <div>
                <Link to="/admin-dashboard">Dashboard</Link>
                <Link to="/admin/add-company">Add Company</Link>
                <Link to="/admin/applications">Applications</Link>
                <button onClick={logout}>Logout</button>
            </div>
        </nav>
    );
}

export default AdminNavbar;