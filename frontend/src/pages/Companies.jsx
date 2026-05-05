import { useEffect, useState } from "react";
import API from "../api/api";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [eligibility, setEligibility] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      const response = await API.get("/companies/");
      setCompanies(response.data);
    } catch (err) {
      setError("Failed to load companies");
    }
  };

  const fetchEligibility = async () => {
    try {
      const response = await API.get("/eligibility/all");
      setEligibility(response.data);
    } catch (err) {
      // If student hasn't created a profile, eligibility fetch might fail
      console.log("Eligibility fetch skipped or failed - student profile likely missing.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCompanies(), fetchEligibility()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const getEligibility = (companyId) => {
    return eligibility.find((item) => item.company_id === companyId);
  };

  const applyToCompany = async (companyId) => {
    setMessage("");
    setError("");

    try {
      await API.post("/applications/apply", {
        company_id: companyId,
      });
      setMessage("Application submitted successfully!");
      // Scroll to top to see message
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to apply");
    }
  };

  if (loading) return <div className="loading-container"><p>Loading companies...</p></div>;

  return (
    <div className="page-container">
      <div className="header-section">
        <h1>Available Companies</h1>
        <p className="subtitle">Check your eligibility and apply for upcoming placements.</p>
      </div>

      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}

      <div className="company-grid">
        {companies.length === 0 && <p className="empty-msg">No companies found at the moment.</p>}

        {companies.map((company) => {
          const result = getEligibility(company.id);
          const isEligible = result ? result.eligible : false;

          return (
            <div className={`company-card ${result ? (isEligible ? 'eligible' : 'ineligible') : ''}`} key={company.id}>
              <div className="company-header">
                <h3>{company.company_name}</h3>
                <span className="package-badge">{company.package_lpa} LPA</span>
              </div>

              <div className="company-details">
                <p><strong>Role:</strong> {company.role}</p>
                <p><strong>Location:</strong> {company.location || "TBD"}</p>
                <p><strong>Min CGPA:</strong> {company.required_cgpa}</p>
                <p><strong>Deadline:</strong> {new Date(company.application_deadline).toLocaleDateString()}</p>
              </div>

              <div className="eligibility-info">
                {result ? (
                  <>
                    <div className={`status-pill ${isEligible ? 'success' : 'danger'}`}>
                      {isEligible ? "✓ Eligible" : "✕ Not Eligible"}
                    </div>
                    {!isEligible && <p className="reason">Reason: {result.reason}</p>}
                  </>
                ) : (
                  <p className="info-msg small">Complete your profile to see eligibility.</p>
                )}
              </div>

              <button
                className={`btn ${isEligible ? 'btn-primary' : 'btn-disabled'}`}
                onClick={() => applyToCompany(company.id)}
                disabled={result && !isEligible}
              >
                {isEligible ? "Apply Now" : "Cannot Apply"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Companies;