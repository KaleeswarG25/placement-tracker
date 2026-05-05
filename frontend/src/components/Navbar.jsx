import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <h2>Placement Tracker</h2>

            <div>
                <Link to="/student-dashboard">Dashboard</Link>
                <Link to="/profile">Profile</Link>
                <Link to="/companies">Companies</Link>
                <Link to="/my-applications">My Applications</Link>
                <button onClick={logout}>Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;