import React, { useState, useEffect } from 'react';
import api from '../api/config';

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  
  const [jobForm, setJobForm] = useState({ title: '', ctc: '', vacancies: 1, min_cgpa: 7.0, eligible_departments: '', skills_required: '', description: '', job_type: 'Full-time' });
  const [editingJob, setEditingJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStats();
    if (activeTab === 'jobs') fetchJobs();
    if (activeTab === 'applications') fetchApplications();
  }, [activeTab]);

  const fetchStats = () => api.get('/company/dashboard-stats').then(res => setStats(res.data)).catch(console.error);
  const fetchJobs = () => api.get('/company/jobs').then(res => setJobs(res.data)).catch(console.error);
  const fetchApplications = () => api.get('/company/applications').then(res => setApplications(res.data)).catch(console.error);

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await api.put(`/company/jobs/${editingJob.id}`, jobForm);
        setEditingJob(null);
      } else {
        await api.post('/company/jobs', jobForm);
      }
      setJobForm({ title: '', ctc: '', vacancies: 1, min_cgpa: 7.0, eligible_departments: '', skills_required: '', description: '', job_type: 'Full-time' });
      fetchJobs();
      fetchStats();
    } catch (err) {
      alert("Failed to save job. Ensure profile is complete.");
    }
  };

  const openEditJob = (job) => {
    setEditingJob(job);
    setJobForm(job); // Prefill form
  };

  const updateAppStatus = async (id, status) => {
    try {
      await api.put(`/company/applications/${id}/status`, { status });
      fetchApplications();
      fetchStats();
      if(selectedStudent && selectedStudent.id === id) setSelectedStudent({...selectedStudent, status});
    } catch (err) { console.error(err); }
  };

  const filteredApps = applications.filter(app => 
    app.student_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.rollno && app.rollno.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-gray-200 pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">Recruitment Portal</h2>
          <p className="text-gray-500 mt-1">Post opportunities, discover talent, and manage hires.</p>
        </div>
        <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
          {['overview', 'jobs', 'applications'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                activeTab === tab ? 'bg-blue-600 text-white shadow-md transform scale-105' : 'text-gray-600 hover:text-blue-600 hover:bg-white'
              }`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Active Postings" value={stats.total_openings} icon="📢" />
          <StatCard title="Total Applications" value={stats.total_applications} icon="📄" />
          <StatCard title="Pending Review" value={stats.pending_applications} icon="⏳" />
          <StatCard title="Shortlisted" value={stats.shortlisted_candidates} icon="✨" />
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-blue-900">Your Postings</h3>
              <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">{jobs.length} Jobs</span>
            </div>
            
            {jobs.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center text-gray-500">
                No jobs posted yet. Create your first opening!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {jobs.map(job => (
                  <div key={job.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center hover:border-blue-300 hover:shadow-md transition-all group">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h4>
                      <div className="text-sm text-gray-600 mt-2 flex flex-wrap gap-3">
                        <span className="flex items-center gap-1">💰 <span className="font-semibold text-gray-900">{job.ctc}</span></span>
                        <span className="flex items-center gap-1">👥 <span className="font-semibold text-gray-900">{job.vacancies} Vacancies</span></span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex flex-col items-end gap-2 w-full sm:w-auto">
                      <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold border border-blue-100 w-full sm:w-auto text-center">
                        {job.applications_count} Applicants
                      </div>
                      <button onClick={() => openEditJob(job)} className="text-sm font-semibold text-blue-600 hover:underline w-full sm:w-auto text-right">Edit Job ✏️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-blue-900">{editingJob ? 'Edit Posting' : 'Post New Job'}</h3>
                {editingJob && <button onClick={() => { setEditingJob(null); setJobForm({ title: '', ctc: '', vacancies: 1, min_cgpa: 7.0, eligible_departments: '', skills_required: '', description: '', job_type: 'Full-time' }); }} className="text-sm text-gray-500 hover:text-gray-900 font-bold">Cancel</button>}
              </div>
              
              <form onSubmit={handlePostJob} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Job Title</label>
                  <input required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CTC / Stipend</label>
                  <input required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" placeholder="e.g. 12 LPA or 40k/mo" value={jobForm.ctc} onChange={e => setJobForm({...jobForm, ctc: e.target.value})} />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vacancies</label>
                    <input type="number" min="1" required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" value={jobForm.vacancies} onChange={e => setJobForm({...jobForm, vacancies: e.target.value})} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Min CGPA</label>
                    <input type="number" step="0.1" required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" value={jobForm.min_cgpa} onChange={e => setJobForm({...jobForm, min_cgpa: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Eligible Departments</label>
                  <input required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all" placeholder="CSE, IT, ECE" value={jobForm.eligible_departments} onChange={e => setJobForm({...jobForm, eligible_departments: e.target.value})} />
                </div>
                <button type="submit" className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md hover:shadow-lg">
                  {editingJob ? 'Save Changes' : 'Publish Job'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-lg font-bold text-blue-900">Applicant Tracking</h3>
            <div className="relative w-full sm:w-72">
              <input 
                type="text" 
                placeholder="Search candidates, jobs, roll no..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-3 top-3 text-gray-400">🔍</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role Applied</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Academics</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Review</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {filteredApps.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">No applications match your search.</td></tr>
                ) : filteredApps.map(app => (
                  <tr key={app.id} className="hover:bg-blue-50 transition-colors duration-200 cursor-pointer group" onClick={() => setSelectedStudent(app)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{app.student_name} <span className="text-xs text-gray-500 font-medium ml-1">({app.rollno || 'N/A'})</span></div>
                      <div className="text-sm text-gray-500">{app.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">{app.job_title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">CGPA: <span className="text-blue-600 font-bold">{app.cgpa}</span></div>
                      <div className="text-xs text-gray-500">{app.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        app.status === 'shortlisted' ? 'bg-green-50 text-green-700 border border-green-200' :
                        app.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      }`}>
                        {app.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button onClick={(e) => { e.stopPropagation(); setSelectedStudent(app); }} className="text-sm font-bold text-blue-600 hover:underline">View Profile &rarr;</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedStudent(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="bg-blue-600 p-6 text-white flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold">{selectedStudent.student_name}</h3>
                <p className="text-blue-100 mt-1 font-medium">{selectedStudent.department} • CGPA: {selectedStudent.cgpa} • Roll: {selectedStudent.rollno}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-white hover:text-blue-200 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-500 font-bold uppercase mb-1">Applied For</p>
                <p className="text-lg font-bold text-blue-900">{selectedStudent.job_title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Email Contact</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{selectedStudent.email}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Phone</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedStudent.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="pt-2">
                <a href={selectedStudent.resume_path || '#'} target="_blank" rel="noreferrer" className="w-full block text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition-colors">
                  📄 View Resume
                </a>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
              <button disabled={selectedStudent.status === 'shortlisted'} onClick={() => updateAppStatus(selectedStudent.id, 'shortlisted')} className={`flex-1 py-2.5 rounded-xl font-bold transition-colors ${selectedStudent.status === 'shortlisted' ? 'bg-green-100 text-green-700 cursor-not-allowed border border-green-200' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'}`}>
                {selectedStudent.status === 'shortlisted' ? 'Shortlisted ✓' : 'Shortlist'}
              </button>
              <button disabled={selectedStudent.status === 'rejected'} onClick={() => updateAppStatus(selectedStudent.id, 'rejected')} className={`flex-1 py-2.5 rounded-xl font-bold transition-colors ${selectedStudent.status === 'rejected' ? 'bg-red-100 text-red-700 cursor-not-allowed border border-red-200' : 'bg-white border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 shadow-sm'}`}>
                {selectedStudent.status === 'rejected' ? 'Rejected ✗' : 'Reject'}
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