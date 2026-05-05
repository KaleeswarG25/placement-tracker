import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        password: "",
        role: "student",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await API.post("/users/register", form);

            setSuccess("Registration successful. Please login.");

            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.detail || "Registration failed");
        }
    };

    return (
        <div className="page">
            <div className="card">
                <h2>Create Account</h2>

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        name="full_name"
                        placeholder="Full name"
                        value={form.full_name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <select name="role" value={form.role} onChange={handleChange}>
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button type="submit">Register</button>
                </form>

                <p style={{ textAlign: "center" }}>
                    Already have account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;