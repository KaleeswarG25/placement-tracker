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