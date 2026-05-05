import { useEffect, useState } from "react";
import API from "../api/api";

function StudentProfile() {
  const [form, setForm] = useState({
    department: "",
    cgpa: "",
    skills: "",
    backlog_count: 0,
    resume_url: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/profile/me");
        setForm({
          department: response.data.department,
          cgpa: response.data.cgpa,
          skills: response.data.skills || "",
          backlog_count: response.data.backlog_count,
          resume_url: response.data.resume_url || "",
        });
      } catch (err) {
        // Profile may not exist yet, which is fine
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "backlog_count" ? Number(value) : value,
    });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await API.post("/profile/", {
        ...form,
        cgpa: Number(form.cgpa),
      });
      setMessage("Profile updated successfully!");
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save profile");
    }
  };

  if (loading) return <div className="loading-container"><p>Loading profile...</p></div>;

  return (
    <div className="page-container">
      <div className="card form-card">
        <h2>My Student Profile</h2>
        <p className="subtitle">Keep your details updated to stay eligible for placements.</p>

        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={saveProfile}>
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              name="department"
              placeholder="e.g. Computer Science"
              value={form.department}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Current CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                name="cgpa"
                placeholder="0.00"
                value={form.cgpa}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Active Backlogs</label>
              <input
                type="number"
                min="0"
                name="backlog_count"
                value={form.backlog_count}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Skills (Comma separated)</label>
            <input
              type="text"
              name="skills"
              placeholder="e.g. React, Python, Node.js"
              value={form.skills}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Resume Link (Google Drive/Dropbox)</label>
            <input
              type="url"
              name="resume_url"
              placeholder="https://..."
              value={form.resume_url}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary block">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default StudentProfile;