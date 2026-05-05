import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/api";

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [error, setError] = useState("");

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
        fetchApplications();
        fetchCompanies();
    }, []);

    const getCompanyName = (companyId) => {
        const company = companies.find((item) => item.id === companyId);
        return company ? company.company_name : `Company ID ${companyId}`;
    };

    const getCompanyRole = (companyId) => {
        const company = companies.find((item) => item.id === companyId);
        return company ? company.role : "Role not found";
    };

    const getStatusClass = (status) => {
        if (status === "Selected") return "badge badge-green";
        if (status === "Rejected") return "badge badge-red";
        if (status === "Shortlisted") return "badge badge-blue";
        if (status === "Interview Scheduled") return "badge badge-yellow";
        return "badge badge-gray";
    };

    return (
        <>
            <Navbar />

            <div className="table-container">
                <h1>My Applications</h1>

                {error && <p className="error">{error}</p>}

                {applications.length === 0 && !error && (
                    <p>You have not applied to any company yet.</p>
                )}

                {applications.map((application) => (
                    <div className="company-card" key={application.id}>
                        <h3>{getCompanyName(application.company_id)}</h3>

                        <p>
                            <strong>Role:</strong> {getCompanyRole(application.company_id)}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            <span className={getStatusClass(application.status)}>
                                {application.status}
                            </span>
                        </p>

                        <p>
                            <strong>Remarks:</strong>{" "}
                            {application.remarks || "No remarks yet"}
                        </p>

                        <p>
                            <strong>Applied At:</strong>{" "}
                            {new Date(application.applied_at).toLocaleString()}
                        </p>

                        <p>
                            <strong>Last Updated:</strong>{" "}
                            {new Date(application.updated_at).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
}

export default MyApplications;