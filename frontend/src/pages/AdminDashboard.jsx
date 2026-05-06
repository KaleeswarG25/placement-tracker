import React, { useState, useEffect } from 'react';
import api from '../api/config';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [companyRequests, setCompanyRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    fetchStats();
    if (activeTab === 'requests') fetchRequests();
    if (activeTab === 'students') fetchStudents();
  }, [activeTab]);

  const fetchStats = () => api.get('/admin/dashboard-stats').then(res => setStats(res.data)).catch(console.error);
  const fetchRequests = () => api.get('/admin/company-requests').then(res => setCompanyRequests(res.data)).catch(console.error);
  const fetchStudents = () => api.get('/admin/students').then(res => setStudents(res.data)).catch(console.error);

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/company/${id}/approve`);
      fetchRequests();
      fetchStats();
      setSelectedCompany(null);
    } catch (err) { console.error(err); }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/admin/company/${id}/reject`);
      fetchRequests();
      fetchStats();
      setSelectedCompany(null);
    } catch (err) { console.error(err); }
  };

  const handleToggleBan = async (id, currentStatus) => {
    try {
      if (currentStatus === 'banned') {
        await api.put(`/admin/student/${id}/unban`);
      } else {
        await api.put(`/admin/student/${id}/ban`);
      }
      fetchStudents();
      fetchStats();
    } catch (err) { console.error(err); }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.rollno && s.rollno.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-gray-200 pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">Admin Portal</h2>
          <p className="text-gray-500 mt-1">Manage users, approve companies, and monitor platform activity.</p>
        </div>
        <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
          {['overview', 'requests', 'students'].map(tab => (
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
          <StatCard title="Total Students" value={stats.total_students} icon="👨‍🎓" />
          <StatCard title="Approved Companies" value={stats.approved_companies} icon="🏢" />
          <StatCard title="Pending Approvals" value={stats.pending_approvals} icon="⏳" />
          <StatCard title="Active Jobs" value={stats.total_jobs} icon="💼" />
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-blue-900">Pending Company Approvals</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">{companyRequests.length} Pending</span>
          </div>
          <div className="divide-y divide-gray-100">
            {companyRequests.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <p className="text-lg">No pending requests right now.</p>
                <p className="text-sm mt-2">All companies are reviewed.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {companyRequests.map(req => (
                  <div key={req.id} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-white group cursor-pointer" onClick={() => setSelectedCompany(req)}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg text-blue-600">🏢</div>
                      <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md">Pending</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{req.company_name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{req.industry || 'Technology'}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                       <button onClick={(e) => { e.stopPropagation(); handleApprove(req.id); }} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors">Approve</button>
                       <button onClick={(e) => { e.stopPropagation(); handleReject(req.id); }} className="flex-1 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 py-2 rounded-lg text-sm font-semibold transition-colors">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-lg font-bold text-blue-900">Student Directory</h3>
            <div className="relative w-full sm:w-72">
              <input 
                type="text" 
                placeholder="Search by name, email or roll no..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student Info</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Academic Details</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applications</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-blue-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900">{student.name} <span className="text-xs text-gray-500 font-medium ml-1">({student.rollno || 'No Roll'})</span></div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.department ? (
                        <>
                          <div className="text-sm font-semibold text-gray-900">{student.department}</div>
                          <div className="text-xs text-gray-500">CGPA: <span className="font-bold text-blue-600">{student.cgpa}</span></div>
                        </>
                      ) : <span className="text-sm text-gray-400 italic">Profile incomplete</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                         {student.applications_count} Applied
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        student.status === 'banned' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                        {student.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => handleToggleBan(student.id, student.status)}
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                          student.status === 'banned' ? 'text-green-700 bg-green-100 hover:bg-green-200' : 'text-red-700 bg-red-100 hover:bg-red-200'
                        }`}>
                        {student.status === 'banned' ? 'Restore Access' : 'Ban Account'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStudents.length === 0 && (
              <div className="p-8 text-center text-gray-500">No students found matching your search.</div>
            )}
          </div>
        </div>
      )}

      {/* Company Details Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedCompany(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="bg-blue-600 p-6 text-white flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold">{selectedCompany.company_name}</h3>
                <p className="text-blue-100 mt-1 flex items-center gap-2">📍 {selectedCompany.location || 'Location not specified'}</p>
              </div>
              <button onClick={() => setSelectedCompany(null)} className="text-white hover:text-blue-200 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">HR Representative</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedCompany.hr_name || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Email</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{selectedCompany.email}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Website</p>
                  <a href={selectedCompany.website} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-600 hover:underline truncate block">{selectedCompany.website || 'N/A'}</a>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Phone</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedCompany.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
              <button onClick={() => handleApprove(selectedCompany.id)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold transition-colors">Approve Company</button>
              <button onClick={() => handleReject(selectedCompany.id)} className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-xl font-bold transition-colors">Reject Request</button>
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