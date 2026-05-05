import { useEffect, useState } from "react";
import API from "../api/api";

function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [statusForm, setStatusForm] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const statusOptions = [
    "Applied",
    "Shortlisted",
    "Interview Scheduled",
    "Rejected",
    "Selected",
  ];

  const fetchApplications = async () => {
    try {
      const response = await API.get("/applications/all");
      setApplications(response.data);

      const initialStatus = {};
      response.data.forEach((app) => {
        initialStatus[app.id] = {
          status: app.status,
          remarks: app.remarks || "",
        };
      });
      setStatusForm(initialStatus);
    } catch (err) {
      setError("Failed to load student applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = (appId, field, value) => {
    setStatusForm({
      ...statusForm,
      [appId]: {
        ...statusForm[appId],
        [field]: value,
      },
    });
  };

  const updateStatus = async (appId) => {
    setMessage("");
    setError("");

    try {
      await API.put(`/applications/${appId}/status`, {
        status: statusForm[appId].status,
        remarks: statusForm[appId].remarks,
      });

      setMessage("Application status updated successfully!");
      fetchApplications();
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update status");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Selected": return "status-pill success";
      case "Rejected": return "status-pill danger";
      case "Shortlisted": return "status-pill info";
      case "Interview Scheduled": return "status-pill warning";
      default: return "status-pill neutral";
    }
  };

  if (loading) return <div className="loading-container"><p>Loading applications...</p></div>;

  return (
    <div className="page-container">
      <div className="header-section">
        <h1>Manage Applications</h1>
        <p className="subtitle">Review student applications and update their placement status.</p>
      </div>

      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}

      <div className="admin-applications-list">
        {applications.length === 0 && !error && (
          <p className="empty-msg">No applications received yet.</p>
        )}

        {applications.map((app) => (
          <div className="application-card card" key={app.id}>
            <div className="app-header">
              <div className="student-info">
                <h3>{app.student_name}</h3>
                <span className="small-text">Applied to: <strong>{app.company_name}</strong></span>
              </div>
              <div className={getStatusClass(app.status)}>
                {app.status}
              </div>
            </div>

            <div className="app-body admin-controls">
              <div className="info-grid">
                <p><strong>Student ID:</strong> {app.student_id}</p>
                <p><strong>Applied On:</strong> {new Date(app.applied_at).toLocaleDateString()}</p>
              </div>

              <div className="update-form mt-2">
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Update Status</label>
                    <select
                      value={statusForm[app.id]?.status || app.status}
                      onChange={(e) => handleStatusChange(app.id, "status", e.target.value)}
                    >
                      {statusOptions.map((opt) => (
                        <option value={opt} key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group flex-2">
                    <label>Remarks</label>
                    <input
                      type="text"
                      placeholder="Add interview link or feedback..."
                      value={statusForm[app.id]?.remarks || ""}
                      onChange={(e) => handleStatusChange(app.id, "remarks", e.target.value)}
                    />
                  </div>
                </div>
                <button
                  className="btn btn-secondary mt-1"
                  onClick={() => updateStatus(app.id)}
                >
                  Save Status Update
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminApplications;