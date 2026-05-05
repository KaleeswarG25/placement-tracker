import { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import API from "../api/api";

function AddCompany() {
    const [form, setForm] = useState({
        company_name: "",
        role: "",
        package_lpa: "",
        required_cgpa: "",
        eligible_departments: "",
        required_skills: "",
        location: "",
        application_deadline: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const addCompany = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            await API.post("/companies/", {
                company_name: form.company_name,
                role: form.role,
                package_lpa: Number(form.package_lpa),
                required_cgpa: Number(form.required_cgpa),
                eligible_departments: form.eligible_departments,
                required_skills: form.required_skills,
                location: form.location,
                application_deadline: form.application_deadline,
            });

            setMessage("Company added successfully");

            setForm({
                company_name: "",
                role: "",
                package_lpa: "",
                required_cgpa: "",
                eligible_departments: "",
                required_skills: "",
                location: "",
                application_deadline: "",
            });
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to add company");
        }
    };

    return (
        <>
            <AdminNavbar />

            <div className="form-container">
                <h2>Add Company</h2>

                {message && <p className="success">{message}</p>}
                {error && <p className="error">{error}</p>}

                <form onSubmit={addCompany}>
                    <input
                        type="text"
                        name="company_name"
                        placeholder="Company Name e.g. Zoho"
                        value={form.company_name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="role"
                        placeholder="Role e.g. Software Developer"
                        value={form.role}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="number"
                        step="0.1"
                        name="package_lpa"
                        placeholder="Package in LPA e.g. 8.5"
                        value={form.package_lpa}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="number"
                        step="0.01"
                        name="required_cgpa"
                        placeholder="Required CGPA e.g. 7.0"
                        value={form.required_cgpa}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="eligible_departments"
                        placeholder="Eligible Departments e.g. CSE, IT, ECE"
                        value={form.eligible_departments}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="required_skills"
                        placeholder="Required Skills e.g. DSA, Python, SQL"
                        value={form.required_skills}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="location"
                        placeholder="Location e.g. Chennai"
                        value={form.location}
                        onChange={handleChange}
                    />

                    <input
                        type="date"
                        name="application_deadline"
                        value={form.application_deadline}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">Add Company</button>
                </form>
            </div>
        </>
    );
}

export default AddCompany;