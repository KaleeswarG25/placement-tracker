import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
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
                // Profile may not exist yet. That is okay.
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const saveProfile = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            await API.post("/profile/", {
                department: form.department,
                cgpa: Number(form.cgpa),
                skills: form.skills,
                backlog_count: Number(form.backlog_count),
                resume_url: form.resume_url,
            });

            setMessage("Profile saved successfully");
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to save profile");
        }
    };

    return (
        <>
            <Navbar />

            <div className="form-container">
                <h2>Student Profile</h2>

                {message && <p className="success">{message}</p>}
                {error && <p className="error">{error}</p>}

                <form onSubmit={saveProfile}>
                    <input
                        type="text"
                        name="department"
                        placeholder="Department e.g. CSE"
                        value={form.department}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="number"
                        step="0.01"
                        name="cgpa"
                        placeholder="CGPA"
                        value={form.cgpa}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="skills"
                        placeholder="Skills e.g. Python, React, SQL"
                        value={form.skills}
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="backlog_count"
                        placeholder="Backlog Count"
                        value={form.backlog_count}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="resume_url"
                        placeholder="Resume URL"
                        value={form.resume_url}
                        onChange={handleChange}
                    />

                    <button type="submit">Save Profile</button>
                </form>
            </div>
        </>
    );
}

export default StudentProfile;