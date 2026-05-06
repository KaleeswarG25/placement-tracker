import React, { useState, useEffect } from 'react';
import api from '../api/config';

export default function StudentProfile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      setUploading(true);
      const res = await api.post('/student/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile({...profile, resume_path: res.data.resume_url});
      alert("Resume uploaded successfully!");
    } catch (err) {
      alert("Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 animate-fade-in relative overflow-hidden">
      {/* Decorative top bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-blue-100">
          ⚙️
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-blue-900 tracking-tight">Complete Your Profile</h2>
          <p className="text-gray-500 text-sm mt-1">Make sure your resume link and CGPA are up to date.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Roll Number</label>
          <input type="text" value={profile.rollno || ''} disabled className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed font-medium" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Phone Number</label>
          <input type="text" value={profile.phone || ''} onChange={e=>setProfile({...profile, phone: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Department</label>
          <input type="text" placeholder="E.g. CSE, IT" value={profile.department || ''} onChange={e=>setProfile({...profile, department: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Graduation Year</label>
          <input type="number" value={profile.year || ''} onChange={e=>setProfile({...profile, year: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">CGPA</label>
          <input type="number" step="0.01" value={profile.cgpa || ''} onChange={e=>setProfile({...profile, cgpa: parseFloat(e.target.value)})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Active Backlogs</label>
          <input type="number" value={profile.backlog_count || 0} onChange={e=>setProfile({...profile, backlog_count: parseInt(e.target.value)})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Address</label>
          <input type="text" value={profile.address || ''} onChange={e=>setProfile({...profile, address: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">Skills <span className="text-gray-400 lowercase font-normal">(comma separated)</span></label>
          <input type="text" value={profile.skills || ''} onChange={e=>setProfile({...profile, skills: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">LinkedIn URL</label>
          <input type="text" placeholder="https://linkedin.com/in/..." value={profile.linkedin || ''} onChange={e=>setProfile({...profile, linkedin: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-blue-600" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wide">GitHub URL</label>
          <input type="text" placeholder="https://github.com/..." value={profile.github || ''} onChange={e=>setProfile({...profile, github: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-blue-600" />
        </div>
        
        <div className="md:col-span-2 border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-2xl p-6 mt-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📄</span>
            <div>
              <label className="block text-sm font-bold text-blue-900 tracking-wide">Resume Upload (PDF)</label>
              <p className="text-xs text-blue-600 mt-0.5">Upload your latest resume. This is what companies will review.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <label className="flex-1 w-full bg-white border border-blue-200 hover:border-blue-400 rounded-xl px-4 py-3 cursor-pointer transition-colors shadow-sm text-center relative overflow-hidden group">
              <span className="text-sm font-bold text-blue-600 group-hover:text-blue-800 transition-colors">
                {uploading ? 'Uploading...' : 'Click to Select File 📤'}
              </span>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" disabled={uploading} />
            </label>
            
            {profile.resume_path && (
              <a href={profile.resume_path} target="_blank" rel="noreferrer" className="flex-1 w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition-colors border border-gray-200">
                View Uploaded Resume 👀
              </a>
            )}
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end mt-6">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}