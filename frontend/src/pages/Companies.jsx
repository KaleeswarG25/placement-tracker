import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/api";

function Companies() {
    const [companies, setCompanies] = useState([]);
    const [eligibility, setEligibility] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

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
            setError("Create your student profile first to check eligibility");
        }
    };

    useEffect(() => {
        fetchCompanies();
        fetchEligibility();
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

            setMessage("Application submitted successfully");
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to apply");
        }
    };

    return (
        <>
            <Navbar />

            <div className="table-container">
                <h1>Companies</h1>

                {message && <p className="success">{message}</p>}
                {error && <p className="error">{error}</p>}

                {companies.length === 0 && <p>No companies found.</p>}

                {companies.map((company) => {
                    const result = getEligibility(company.id);

                    return (
                        <div className="company-card" key={company.id}>
                            <h3>{company.company_name}</h3>

                            <p>
                                <strong>Role:</strong> {company.role}
                            </p>

                            <p>
                                <strong>Package:</strong> {company.package_lpa} LPA
                            </p>

                            <p>
                                <strong>Required CGPA:</strong> {company.required_cgpa}
                            </p>

                            <p>
                                <strong>Eligible Departments:</strong>{" "}
                                {company.eligible_departments}
                            </p>

                            <p>
                                <strong>Required Skills:</strong>{" "}
                                {company.required_skills || "Not specified"}
                            </p>

                            <p>
                                <strong>Location:</strong> {company.location || "Not specified"}
                            </p>

                            <p>
                                <strong>Deadline:</strong> {company.application_deadline}
                            </p>

                            {result && (
                                <>
                                    <span
                                        className={
                                            result.eligible
                                                ? "badge badge-green"
                                                : "badge badge-red"
                                        }
                                    >
                                        {result.eligible ? "Eligible" : "Not Eligible"}
                                    </span>

                                    <p>
                                        <strong>Reason:</strong> {result.reason}
                                    </p>
                                </>
                            )}

                            <button
                                className="secondary-btn"
                                onClick={() => applyToCompany(company.id)}
                                disabled={result && !result.eligible}
                            >
                                Apply
                            </button>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default Companies;