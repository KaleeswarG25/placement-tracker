import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import API from "../api/api";

function AdminApplications() {
    const [applications, setApplications] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [statusForm, setStatusForm] = useState({});
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

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

            response.data.forEach((application) => {
                initialStatus[application.id] = {
                    status: application.status,
                    remarks: application.remarks || "",
                };
            });

            setStatusForm(initialStatus);
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

    const handleStatusChange = (applicationId, field, value) => {
        setStatusForm({
            ...statusForm,
            [applicationId]: {
                ...statusForm[applicationId],
                [field]: value,
            },
        });
    };

    const updateStatus = async (applicationId) => {
        setMessage("");
        setError("");

        try {
            await API.put(`/applications/${applicationId}/status`, {
                status: statusForm[applicationId].status,
                remarks: statusForm[applicationId].remarks,
            });

            setMessage("Application status updated successfully");
            fetchApplications();
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to update status");
        }
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
            <AdminNavbar />

            <div className="table-container">
                <h1>Student Applications</h1>

                {message && <p className="success">{message}</p>}
                {error && <p className="error">{error}</p>}

                {applications.length === 0 && !error && (
                    <p>No applications found.</p>
                )}

                {applications.map((application) => (
                    <div className="company-card" key={application.id}>
                        <h3>{getCompanyName(application.company_id)}</h3>

                        <p>
                            <strong>Role:</strong> {getCompanyRole(application.company_id)}
                        </p>

                        <p>
                            <strong>Student ID:</strong> {application.student_id}
                        </p>

                        <p>
                            <strong>Current Status:</strong>{" "}
                            <span className={getStatusClass(application.status)}>
                                {application.status}
                            </span>
                        </p>

                        <p>
                            <strong>Applied At:</strong>{" "}
                            {new Date(application.applied_at).toLocaleString()}
                        </p>

                        <select
                            value={statusForm[application.id]?.status || application.status}
                            onChange={(e) =>
                                handleStatusChange(application.id, "status", e.target.value)
                            }
                        >
                            {statusOptions.map((status) => (
                                <option value={status} key={status}>
                                    {status}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="Remarks"
                            value={statusForm[application.id]?.remarks || ""}
                            onChange={(e) =>
                                handleStatusChange(application.id, "remarks", e.target.value)
                            }
                        />

                        <button
                            className="secondary-btn"
                            onClick={() => updateStatus(application.id)}
                        >
                            Update Status
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}

export default AdminApplications;