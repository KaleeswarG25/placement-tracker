import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function StudentDashboard() {
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [error, setError] = useState("");

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await API.get("/dashboard/student");
                setDashboard(response.data);
            } catch (err) {
                setError("Unable to load dashboard. Create student profile first.");
            }
        };

        fetchDashboard();
    }, []);

    if (error) {
        return (
            <div className="dashboard">
                <button onClick={logout} style={{ maxWidth: "150px" }}>
                    Logout
                </button>
                <p className="error">{error}</p>
            </div>
        );
    }

    if (!dashboard) {
        return <p style={{ padding: "30px" }}>Loading dashboard...</p>;
    }

    return (
        <div className="dashboard">
            <button onClick={logout} style={{ maxWidth: "150px" }}>
                Logout
            </button>

            <h1>Student Dashboard</h1>

            <div className="grid">
                <div className="stat-card">
                    <h3>Total Companies</h3>
                    <p>{dashboard.total_companies}</p>
                </div>

                <div className="stat-card">
                    <h3>Eligible Companies</h3>
                    <p>{dashboard.eligible_companies}</p>
                </div>

                <div className="stat-card">
                    <h3>Total Applications</h3>
                    <p>{dashboard.total_applications}</p>
                </div>

                <div className="stat-card">
                    <h3>Shortlisted</h3>
                    <p>{dashboard.shortlisted_count}</p>
                </div>

                <div className="stat-card">
                    <h3>Interviews</h3>
                    <p>{dashboard.interview_count}</p>
                </div>

                <div className="stat-card">
                    <h3>Selected</h3>
                    <p>{dashboard.selected_count}</p>
                </div>

                <div className="stat-card">
                    <h3>DSA Topics</h3>
                    <p>{dashboard.total_dsa_topics}</p>
                </div>

                <div className="stat-card">
                    <h3>DSA Completion</h3>
                    <p>{dashboard.dsa_completion_percentage}%</p>
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;