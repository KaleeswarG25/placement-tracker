import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const formData = new FormData();

            // OAuth2PasswordRequestForm expects "username", not "email"
            formData.append("username", form.email);
            formData.append("password", form.password);

            const response = await API.post("/users/login", formData);

            localStorage.setItem("token", response.data.access_token);

            // Decode JWT payload to get role
            const tokenPayload = JSON.parse(
                atob(response.data.access_token.split(".")[1])
            );

            const role = tokenPayload.role;

            if (role === "admin") {
                navigate("/admin-dashboard");
            } else {
                navigate("/student-dashboard");
            }
        } catch (err) {
            console.log(err.response?.data);
            setError("Invalid email or password");
        }
    };

    return (
        <div className="page">
            <div className="card">
                <h2>Placement Tracker Login</h2>

                {error && <p className="error">{error}</p>}

                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">Login</button>
                </form>

                <p style={{ textAlign: "center" }}>
                    New user? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;