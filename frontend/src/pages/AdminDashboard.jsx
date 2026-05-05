import { useEffect, useState } from "react";
import API from "../api/api";
import AdminNavbar from "../components/AdminNavbar";

function AdminDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await API.get("/dashboard/admin");
                setDashboard(response.data);
            } catch (err) {
                setError("Unable to load admin dashboard");
            }
        };

        fetchDashboard();
    }, []);

    if (error) {
        return (
            <>
                <AdminNavbar />
                <div className="dashboard">
                    <p className="error">{error}</p>
                </div>
            </>
        );
    }

    if (!dashboard) {
        return <p style={{ padding: "30px" }}>Loading dashboard...</p>;
    }

    return (
        <>
            <AdminNavbar />

            <div className="dashboard">
                <h1>Admin Dashboard</h1>

                <div className="grid">
                    <div className="stat-card">
                        <h3>Total Students</h3>
                        <p>{dashboard.total_students}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Total Companies</h3>
                        <p>{dashboard.total_companies}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Total Applications</h3>
                        <p>{dashboard.total_applications}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Applied</h3>
                        <p>{dashboard.applied_count}</p>
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
                        <h3>Rejected</h3>
                        <p>{dashboard.rejected_count}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Selected</h3>
                        <p>{dashboard.selected_count}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;