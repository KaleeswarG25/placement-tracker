import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        navigate(payload.role === "admin" ? "/admin-dashboard" : "/student-dashboard");
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", form.email);
      formData.append("password", form.password);

      const response = await API.post("/users/login", formData);
      localStorage.setItem("token", response.data.access_token);

      const payload = JSON.parse(atob(response.data.access_token.split(".")[1]));
      navigate(payload.role === "admin" ? "/admin-dashboard" : "/student-dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p className="subtitle">Sign in to your placement account</p>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@university.edu"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary block mt-1" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <p>New to the platform? <Link to="/register">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;