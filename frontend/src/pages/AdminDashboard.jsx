import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await API.get("/dashboard/admin");
        setDashboard(response.data);
      } catch (err) {
        setError("Unable to load admin dashboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="loading-container"><p>Loading admin stats...</p></div>;
  }

  if (error) {
    return <div className="dashboard"><p className="error">{error}</p></div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p className="welcome-msg">Overview of students, companies, and application statuses.</p>
      </div>

      <div className="grid">
        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-info">
            <h3>Total Students</h3>
            <p className="stat-value">{dashboard.total_students}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-info">
            <h3>Total Companies</h3>
            <p className="stat-value">{dashboard.total_companies}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>Total Applications</h3>
            <p className="stat-value">{dashboard.total_applications}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🕒</div>
          <div className="stat-info">
            <h3>New Applications</h3>
            <p className="stat-value">{dashboard.applied_count}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>Shortlisted</h3>
            <p className="stat-value">{dashboard.shortlisted_count}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🤝</div>
          <div className="stat-info">
            <h3>Interviews</h3>
            <p className="stat-value">{dashboard.interview_count}</p>
          </div>
        </div>

        <div className="stat-card danger-card">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <h3>Rejected</h3>
            <p className="stat-value">{dashboard.rejected_count}</p>
          </div>
        </div>

        <div className="stat-card success-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <h3>Placed</h3>
            <p className="stat-value">{dashboard.selected_count}</p>
          </div>
        </div>
      </div>

      <div className="quick-actions card">
        <h3>Admin Actions</h3>
        <div className="action-buttons">
          <Link to="/admin/add-company" className="btn">Add New Company</Link>
          <Link to="/admin/applications" className="secondary-btn">Review Applications</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;