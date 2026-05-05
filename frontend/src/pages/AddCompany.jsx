import { useState } from "react";
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
        ...form,
        package_lpa: Number(form.package_lpa),
        required_cgpa: Number(form.required_cgpa),
      });

      setMessage("Company added successfully!");
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
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add company");
    }
  };

  return (
    <div className="page-container">
      <div className="card form-card">
        <h2>Add New Placement Opportunity</h2>
        <p className="subtitle">Fill in the details to post a new company hiring drive.</p>

        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={addCompany}>
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              name="company_name"
              placeholder="e.g. Google, Zoho, TCS"
              value={form.company_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Job Role</label>
            <input
              type="text"
              name="role"
              placeholder="e.g. Software Development Engineer"
              value={form.role}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Package (LPA)</label>
              <input
                type="number"
                step="0.1"
                name="package_lpa"
                placeholder="e.g. 12.5"
                value={form.package_lpa}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Min. CGPA</label>
              <input
                type="number"
                step="0.01"
                name="required_cgpa"
                placeholder="e.g. 7.5"
                value={form.required_cgpa}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Eligible Departments</label>
            <input
              type="text"
              name="eligible_departments"
              placeholder="e.g. CSE, IT, ECE"
              value={form.eligible_departments}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Required Skills</label>
            <input
              type="text"
              name="required_skills"
              placeholder="e.g. Python, Java, DSA"
              value={form.required_skills}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Remote, Bangalore"
                value={form.location}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Application Deadline</label>
              <input
                type="date"
                name="application_deadline"
                value={form.application_deadline}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary block mt-2">Post Opportunity</button>
        </form>
      </div>
    </div>
  );
}

export default AddCompany;