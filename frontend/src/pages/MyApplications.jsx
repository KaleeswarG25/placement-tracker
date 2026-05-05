import { useEffect, useState } from "react";
import API from "../api/api";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const response = await API.get("/applications/my");
      setApplications(response.data);
    } catch (err) {
      setError("Failed to load applications");
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await API.get("/companies/");
      setCompanies(response.data);
    } catch (err) {
      setError("Failed to load companies");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchApplications(), fetchCompanies()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const getCompanyDetails = (companyId) => {
    return companies.find((item) => item.id === companyId) || {};
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

  if (loading) return <div className="loading-container"><p>Loading your applications...</p></div>;

  return (
    <div className="page-container">
      <div className="header-section">
        <h1>My Applications</h1>
        <p className="subtitle">Track the status of your company applications here.</p>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className="applications-list">
        {applications.length === 0 && !error && (
          <div className="card text-center">
            <p>You haven't applied to any companies yet.</p>
            <p className="small">Go to the Companies page to start applying!</p>
          </div>
        )}

        {applications.map((app) => {
          const company = getCompanyDetails(app.company_id);
          return (
            <div className="application-card card" key={app.id}>
              <div className="app-header">
                <div className="company-info">
                  <h3>{company.company_name || "Unknown Company"}</h3>
                  <span className="role-text">{company.role || "N/A"}</span>
                </div>
                <div className={getStatusClass(app.status)}>
                  {app.status}
                </div>
              </div>

              <div className="app-body">
                <div className="info-row">
                  <span><strong>Package:</strong> {company.package_lpa || "?"} LPA</span>
                  <span><strong>Applied On:</strong> {new Date(app.applied_at).toLocaleDateString()}</span>
                </div>
                
                {app.remarks && (
                  <div className="remarks-box">
                    <strong>Admin Remarks:</strong>
                    <p>{app.remarks}</p>
                  </div>
                )}
              </div>

              <div className="app-footer">
                <span className="last-updated">Last update: {new Date(app.updated_at).toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyApplications;