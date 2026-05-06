import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/config';

export default function Login({ setRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('role', res.data.role);
      setRole(res.data.role);
      navigate(`/${res.data.role}`);
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">Welcome Back</h2>
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-100">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm hover:shadow-md">
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-800">Create one</Link>
        </p>
      </div>
    </div>
  );
}