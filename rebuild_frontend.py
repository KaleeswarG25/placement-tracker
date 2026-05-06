import os

FRONTEND_SRC = "e:/KALI/placemaet/placement-tracker/frontend/src"

files = {}

files["api/config.js"] = """
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default api;
"""

files["App.jsx"] = """
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';

function App() {
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const handleStorageChange = () => setRole(localStorage.getItem('role'));
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
        {role && <Navbar role={role} setRole={setRole} />}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login setRole={setRole} />} />
            <Route path="/register" element={<Register />} />
            {role === 'student' && <Route path="/student/*" element={<StudentDashboard />} />}
            {role === 'company' && <Route path="/company/*" element={<CompanyDashboard />} />}
            {role === 'admin' && <Route path="/admin/*" element={<AdminDashboard />} />}
            <Route path="*" element={<Navigate to={role ? `/${role}` : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App;
"""

files["components/Navbar.jsx"] = """
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar({ role, setRole }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={`/${role}`} className="text-xl font-bold text-indigo-600">Placement Tracker</Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 capitalize px-3 py-1 bg-gray-100 rounded-full">{role}</span>
            <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:text-red-800 transition">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
"""

files["pages/Login.jsx"] = """
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
"""

files["pages/Register.jsx"] = """
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/config';

export default function Register() {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, role };
      if (role === 'student') {
        await api.post('/auth/register/student', payload);
      } else {
        await api.post('/auth/register/company', payload);
      }
      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">Create Account</h2>
        <div className="flex justify-center space-x-2 mb-8 bg-gray-100 p-1 rounded-lg">
          <button type="button" onClick={() => setRole('student')} className={`flex-1 py-2 text-sm font-medium rounded-md transition ${role==='student'?'bg-white text-indigo-600 shadow-sm':'text-gray-500 hover:text-gray-700'}`}>Student</button>
          <button type="button" onClick={() => setRole('company')} className={`flex-1 py-2 text-sm font-medium rounded-md transition ${role==='company'?'bg-white text-indigo-600 shadow-sm':'text-gray-500 hover:text-gray-700'}`}>Company</button>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          {role === 'student' ? (
            <>
              <input type="text" placeholder="Full Name" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({...formData, full_name: e.target.value})} />
              <input type="text" placeholder="Roll Number" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({...formData, rollno: e.target.value})} />
              <input type="email" placeholder="Email Address" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({...formData, email: e.target.value})} />
              <input type="password" placeholder="Password" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({...formData, password: e.target.value})} />
            </>
          ) : (
            <>
              <input type="text" placeholder="Company Name" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({...formData, company_name: e.target.value})} />
              <input type="email" placeholder="Email Address" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({...formData, email: e.target.value})} />
              <input type="password" placeholder="Password" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({...formData, password: e.target.value})} />
              <input type="text" placeholder="HR Name" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({...formData, hr_name: e.target.value})} />
              <input type="text" placeholder="Company Website" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({...formData, website: e.target.value})} />
              <input type="text" placeholder="Location" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({...formData, location: e.target.value})} />
              <textarea placeholder="Description" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" onChange={e => setFormData({...formData, description: e.target.value})} />
            </>
          )}
          <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 mt-4">Complete Registration</button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600"><Link to="/login" className="text-indigo-600 font-semibold">Back to Login</Link></p>
      </div>
    </div>
  );
}
"""

files["pages/StudentDashboard.jsx"] = """
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import api from '../api/config';
import StudentProfile from '../components/StudentProfile';

function Overview() {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  
  useEffect(() => {
    api.get('/student/dashboard-stats').then(res => setStats(res.data)).catch(console.error);
    api.get('/student/jobs').then(res => setJobs(res.data)).catch(console.error);
  }, []);

  const handleApply = async (jobId) => {
    try {
      await api.post(`/student/jobs/${jobId}/apply`);
      alert("Applied Successfully!");
      window.location.reload();
    } catch(err) {
      alert(err.response?.data?.detail || "Failed to apply");
    }
  }

  if (!stats) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-gray-500 text-sm font-medium">Eligible Openings</span>
          <span className="text-3xl font-bold text-indigo-600 mt-2">{stats.eligible_openings}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-gray-500 text-sm font-medium">Applied</span>
          <span className="text-3xl font-bold text-blue-600 mt-2">{stats.applied_openings}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-gray-500 text-sm font-medium">Shortlisted</span>
          <span className="text-3xl font-bold text-green-600 mt-2">{stats.shortlisted_applications}</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-gray-500 text-sm font-medium">Rejected</span>
          <span className="text-3xl font-bold text-red-600 mt-2">{stats.rejected_applications}</span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Job Openings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map(job => (
          <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-bold text-gray-900">{job.title}</h4>
                <p className="text-sm text-gray-500">{job.company_name}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${job.is_eligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {job.is_eligible ? "Eligible" : "Not Eligible"}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-2 flex-1">
              <p><span className="font-medium">CTC:</span> {job.ctc || "N/A"}</p>
              <p><span className="font-medium">Location:</span> {job.location || "N/A"}</p>
              <p><span className="font-medium">Min CGPA:</span> {job.min_cgpa}</p>
              <p><span className="font-medium">Last Date:</span> {job.last_date ? new Date(job.last_date).toLocaleDateString() : "N/A"}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              {job.is_eligible ? (
                <button onClick={()=>handleApply(job.id)} className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">Apply Now</button>
              ) : (
                <p className="text-sm text-red-500 text-center font-medium">{job.reason}</p>
              )}
            </div>
          </div>
        ))}
        {jobs.length === 0 && <p className="text-gray-500 col-span-3 text-center py-8">No job openings available.</p>}
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <h3 className="font-bold text-gray-700">Student Menu</h3>
          </div>
          <div className="flex flex-col p-2">
            <Link to="/student" className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition mb-1">Dashboard Overview</Link>
            <Link to="/student/profile" className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition mb-1">My Profile & Resume</Link>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/profile" element={<StudentProfile />} />
        </Routes>
      </div>
    </div>
  );
}
"""

files["components/StudentProfile.jsx"] = """
import React, { useState, useEffect } from 'react';
import api from '../api/config';

export default function StudentProfile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/student/profile').then(res => {
      setProfile(res.data || {});
      setLoading(false);
    }).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/student/profile', profile);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Error updating profile");
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
          <input type="text" value={profile.rollno || ''} disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input type="text" value={profile.phone || ''} onChange={e=>setProfile({...profile, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department (E.g. CSE, IT)</label>
          <input type="text" value={profile.department || ''} onChange={e=>setProfile({...profile, department: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
          <input type="number" value={profile.year || ''} onChange={e=>setProfile({...profile, year: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
          <input type="number" step="0.01" value={profile.cgpa || ''} onChange={e=>setProfile({...profile, cgpa: parseFloat(e.target.value)})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Active Backlogs</label>
          <input type="number" value={profile.backlog_count || 0} onChange={e=>setProfile({...profile, backlog_count: parseInt(e.target.value)})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input type="text" value={profile.address || ''} onChange={e=>setProfile({...profile, address: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
          <input type="text" value={profile.skills || ''} onChange={e=>setProfile({...profile, skills: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
          <input type="text" value={profile.linkedin || ''} onChange={e=>setProfile({...profile, linkedin: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
          <input type="text" value={profile.github || ''} onChange={e=>setProfile({...profile, github: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="md:col-span-2 border-t border-gray-200 pt-6 mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Resume Link (Google Drive / S3)</label>
          <input type="text" placeholder="https://..." value={profile.resume_path || ''} onChange={e=>setProfile({...profile, resume_path: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          <p className="text-xs text-gray-500 mt-1">Provide a public link to your resume PDF so companies can view it.</p>
        </div>
        <div className="md:col-span-2 flex justify-end mt-4">
          <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm hover:shadow-md">Save Profile</button>
        </div>
      </form>
    </div>
  );
}
"""

files["pages/CompanyDashboard.jsx"] = """
import React, { useState, useEffect } from 'react';
import api from '../api/config';

export default function CompanyDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/company/dashboard-stats').then(res => setStats(res.data)).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Company Dashboard</h2>
      <p className="text-gray-600">This is a placeholder for the company dashboard. API routes have been established, but UI needs expansion based on requirements.</p>
      {stats && (
        <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">{JSON.stringify(stats, null, 2)}</pre>
      )}
    </div>
  );
}
"""

files["pages/AdminDashboard.jsx"] = """
import React, { useState, useEffect } from 'react';
import api from '../api/config';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard-stats').then(res => setStats(res.data)).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
      <p className="text-gray-600">This is a placeholder for the admin dashboard. Admins can approve companies, ban students, etc via established API routes.</p>
      {stats && (
        <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">{JSON.stringify(stats, null, 2)}</pre>
      )}
    </div>
  );
}
"""


def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip())

for path, content in files.items():
    write_file(f"{FRONTEND_SRC}/{path}", content)

print("Frontend rebuilt.")
