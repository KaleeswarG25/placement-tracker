import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
  );
}
export default App;