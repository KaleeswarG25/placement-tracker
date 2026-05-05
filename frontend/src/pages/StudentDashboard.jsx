import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

function StudentDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await API.get("/dashboard/student");
        setDashboard(response.data);
        setError("");
      } catch (err) {
        if (err.response?.status === 404) {
          setError("PROFILE_MISSING");
        } else {
          setError("Unable to load dashboard. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="loading-container"><p>Loading your dashboard...</p></div>;
  }

  if (error === "PROFILE_MISSING") {
    return (
      <div className="dashboard-empty">
        <div className="card text-center">
          <h2>Welcome to Placement Tracker!</h2>
          <p>It looks like you haven't completed your profile yet.</p>
          <p>To see eligible companies and apply, you need to set up your profile first.</p>
          <Link to="/profile" className="btn">Complete Profile Now</Link>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="dashboard"><p className="error">{error}</p></div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p className="welcome-msg">Welcome back! Here's your placement status overview.</p>
      </div>

      <div className="grid">
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-info">
            <h3>Total Companies</h3>
            <p className="stat-value">{dashboard.total_companies}</p>
          </div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Eligible For</h3>
            <p className="stat-value">{dashboard.eligible_companies}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>Applications</h3>
            <p className="stat-value">{dashboard.total_applications}</p>
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

        <div className="stat-card success-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <h3>Selected</h3>
            <p className="stat-value">{dashboard.selected_count}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💻</div>
          <div className="stat-info">
            <h3>DSA Topics</h3>
            <p className="stat-value">{dashboard.total_dsa_topics}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>DSA Progress</h3>
            <p className="stat-value">{dashboard.dsa_completion_percentage}%</p>
          </div>
        </div>
      </div>

      <div className="quick-actions card">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <Link to="/companies" className="secondary-btn">Browse Companies</Link>
          <Link to="/my-applications" className="secondary-btn">View Applications</Link>
          <Link to="/dsa-progress" className="secondary-btn">Update DSA Progress</Link>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;