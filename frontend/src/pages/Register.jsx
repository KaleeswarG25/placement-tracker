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