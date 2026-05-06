import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import api from '../api/config';
import StudentProfile from '../components/StudentProfile';

function Overview() {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs');
  
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    api.get('/student/dashboard-stats').then(res => setStats(res.data)).catch(console.error);
    api.get('/student/jobs').then(res => setJobs(res.data)).catch(console.error);
    api.get('/student/applications').then(res => setApplications(res.data)).catch(console.error);
  };

  const handleApply = async (jobId) => {
    try {
      await api.post(`/student/jobs/${jobId}/apply`);
      alert("Application submitted successfully!");
      fetchData();
      setSelectedJob(null);
    } catch(err) {
      alert(err.response?.data?.detail || "Failed to apply");
    }
  };

  if (!stats) return (
    <div className="flex h-64 items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Eligible Openings" value={stats.eligible_openings} icon="🎯" />
        <StatCard title="Applied" value={stats.applied_openings} icon="📝" />
        <StatCard title="Shortlisted" value={stats.shortlisted_applications} icon="🎉" />
        <StatCard title="Rejected" value={stats.rejected_applications} icon="🛑" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-100 bg-gray-50">
          <button onClick={() => setActiveTab('jobs')} className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'jobs' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
            Job Opportunities
          </button>
          <button onClick={() => setActiveTab('tracker')} className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'tracker' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
            Application Tracker
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'jobs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {jobs.map(job => (
                <div key={job.id} onClick={() => setSelectedJob(job)} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h4>
                      <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-1">🏢 {job.company_name}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-bold rounded-md ${job.is_eligible ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                      {job.is_eligible ? "Eligible" : "Locked"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-2 flex-1 bg-gray-50 p-3 rounded-lg">
                    <p className="flex justify-between"><span className="font-semibold">CTC</span> <span className="font-bold text-gray-900">{job.ctc || "N/A"}</span></p>
                    <p className="flex justify-between"><span className="font-semibold">Min CGPA</span> <span className="font-bold text-gray-900">{job.min_cgpa}</span></p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                     <span className="text-sm font-bold text-blue-600 group-hover:underline">View Full Details &rarr;</span>
                  </div>
                </div>
              ))}
              {jobs.length === 0 && <div className="col-span-full py-10 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl">No job openings available at the moment.</div>}
            </div>
          )}

          {activeTab === 'tracker' && (
            <div className="space-y-4">
              {applications.length === 0 ? (
                <div className="py-10 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl">You haven't applied to any jobs yet.</div>
              ) : applications.map(app => (
                <div key={app.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                      {app.company_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{app.job_title}</h4>
                      <p className="text-sm text-gray-500 font-medium">{app.company_name} • Applied on {new Date(app.applied_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 ml-[4rem] sm:ml-0 flex items-center gap-4">
                     <div className="flex items-center gap-2">
                       <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                       <div className={`h-1 w-8 rounded-full ${app.status !== 'applied' ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                       <div className={`h-2 w-2 rounded-full ${app.status !== 'applied' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                     </div>
                     <span className={`px-4 py-1.5 text-xs font-bold rounded-full uppercase tracking-wide border ${
                        app.status === 'shortlisted' ? 'bg-green-50 text-green-700 border-green-200' :
                        app.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {app.status}
                      </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedJob(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="bg-blue-600 p-6 text-white flex justify-between items-start">
              <div>
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">Hiring</span>
                <h3 className="text-2xl font-bold leading-tight">{selectedJob.title}</h3>
                <p className="text-blue-100 mt-1 font-medium text-lg flex items-center gap-2">🏢 {selectedJob.company_name}</p>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-white hover:text-blue-200 text-3xl leading-none">&times;</button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Package / Stipend</p>
                  <p className="text-lg font-extrabold text-green-600">{selectedJob.ctc || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Location</p>
                  <p className="text-lg font-bold text-gray-900">{selectedJob.location || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Min CGPA Required</p>
                  <p className="text-lg font-bold text-gray-900">{selectedJob.min_cgpa}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Eligible Branches</p>
                  <p className="text-sm font-bold text-gray-900 mt-1 leading-tight">{selectedJob.eligible_departments}</p>
                </div>
              </div>
              
              {!selectedJob.is_eligible && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <span className="text-red-500 text-xl">⚠️</span>
                  <div>
                    <h4 className="text-sm font-bold text-red-800">You are not eligible to apply.</h4>
                    <p className="text-sm text-red-600 mt-1">Reason: {selectedJob.reason}</p>
                  </div>
                </div>
              )}
              
              <button 
                disabled={!selectedJob.is_eligible} 
                onClick={() => handleApply(selectedJob.id)} 
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-md ${
                  selectedJob.is_eligible 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg transform hover:-translate-y-0.5' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                }`}>
                {selectedJob.reason === 'Already applied' ? 'Already Applied ✓' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-gray-200 flex items-center shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 group">
      <div className="text-4xl mr-5 bg-blue-50 w-14 h-14 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-3xl font-extrabold text-blue-900">{value}</p>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-8 relative">
      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <span className="font-bold text-blue-900">Student Menu</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-500 text-2xl">☰</button>
      </div>

      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0 z-10`}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
          <div className="p-5 bg-blue-600 border-b border-blue-700 text-center">
             <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center text-2xl mb-3 shadow-inner">👨‍🎓</div>
             <h3 className="font-bold text-white tracking-wide">Student Hub</h3>
          </div>
          <div className="flex flex-col p-3 gap-1">
            <Link to="/student" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all flex items-center gap-3">
              <span>📊</span> Dashboard
            </Link>
            <Link to="/student/profile" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all flex items-center gap-3">
              <span>⚙️</span> Manage Profile
            </Link>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full min-w-0">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/profile" element={<StudentProfile />} />
        </Routes>
      </div>
    </div>
  );
}