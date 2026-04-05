import React, { useState, useEffect } from 'react';
import { grievanceApi } from '../services/grievanceApi';
import { LayoutDashboard, LogOut, Loader2, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

export default function AdminDashboard() {
  const [wardInput, setWardInput] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentWard, setCurrentWard] = useState(null);
  
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Handle "Login" by Ward Number
  const handleLogin = (e) => {
    e.preventDefault();
    if (wardInput) {
      setCurrentWard(parseInt(wardInput));
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentWard(null);
    setGrievances([]);
    setWardInput('');
  };

  // Fetch tickets for this specific ward
  const fetchGrievances = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await grievanceApi.getByWard(currentWard);
      // Sort: Newest first
      setGrievances(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Could not load grievances. Ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && currentWard !== null) {
      fetchGrievances();
    }
  }, [isLoggedIn, currentWard]);

  // Handle status changes made by the Councillor
  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await grievanceApi.updateStatus(id, newStatus);
      // Refresh the list to reflect the new status
      await fetchGrievances();
    } catch (err) {
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  // ---------------- LOGIN VIEW ----------------
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="text-center mb-8">
          <LayoutDashboard className="w-12 h-12 text-chd-blue mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Officer Login</h2>
          <p className="text-gray-600 mt-2 text-sm">Enter your assigned Ward Number to access your dashboard.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ward Number</label>
            <input 
              type="number" 
              min="0" max="35"
              required
              value={wardInput}
              onChange={(e) => setWardInput(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chd-blue outline-none"
              placeholder="e.g., 2"
            />
          </div>
          <button type="submit" className="w-full bg-chd-dark text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium">
            Access Dashboard
          </button>
        </form>
      </div>
    );
  }

  // ---------------- DASHBOARD VIEW ----------------
  
  // Calculate quick stats
  const openCount = grievances.filter(g => g.status === 'OPEN').length;
  const inProgressCount = grievances.filter(g => g.status === 'IN_PROGRESS').length;
  const resolvedCount = grievances.filter(g => g.status === 'RESOLVED').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ward {currentWard} Dashboard</h2>
          <p className="text-gray-600 text-sm">Manage and resolve civic grievances in your jurisdiction.</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-lg text-amber-600"><Clock className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500 font-medium uppercase">Pending Review</p><p className="text-2xl font-bold text-gray-900">{openCount}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><Loader2 className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500 font-medium uppercase">In Progress</p><p className="text-2xl font-bold text-gray-900">{inProgressCount}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg text-green-600"><CheckCircle2 className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500 font-medium uppercase">Resolved</p><p className="text-2xl font-bold text-gray-900">{resolvedCount}</p></div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 flex items-center gap-3 rounded-lg border border-red-200">
          <AlertCircle className="w-5 h-5" /> <p>{error}</p>
        </div>
      )}

      {/* Ticket List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Active Tickets ({grievances.length})</h3>
          <button onClick={fetchGrievances} className="text-sm text-chd-blue hover:underline">Refresh</button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" /> Loading records...</div>
        ) : grievances.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No grievances found for this ward. Great job!</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {grievances.map((grievance) => (
              <div key={grievance.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  
                  {/* Left: Ticket Info */}
                  <div className="flex-grow space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400">ID: {grievance.id.substring(0,8)}</span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs font-medium text-chd-blue bg-blue-50 px-2 py-0.5 rounded">{grievance.primaryCategory}</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">{grievance.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{grievance.description}</p>
                    <div className="text-sm text-gray-500 flex flex-wrap gap-x-4">
                      <span>👤 {grievance.citizenName} ({grievance.citizenPhone})</span>
                      <span>📍 {grievance.locality}</span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="min-w-[200px] flex flex-col justify-between">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Update Status</label>
                    <select 
                      value={grievance.status}
                      disabled={updatingId === grievance.id}
                      onChange={(e) => handleStatusChange(grievance.id, e.target.value)}
                      className={`w-full p-2 border rounded-lg text-sm font-medium focus:ring-2 focus:ring-chd-blue outline-none
                        ${grievance.status === 'OPEN' ? 'bg-amber-50 border-amber-200 text-amber-800' : ''}
                        ${grievance.status === 'IN_PROGRESS' ? 'bg-blue-50 border-blue-200 text-blue-800' : ''}
                        ${grievance.status === 'RESOLVED' ? 'bg-green-50 border-green-200 text-green-800' : ''}
                        ${grievance.status === 'REJECTED' ? 'bg-red-50 border-red-200 text-red-800' : ''}
                      `}
                    >
                      <option value="OPEN">Pending Review</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                    {updatingId === grievance.id && <span className="text-xs text-blue-500 mt-2 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Updating...</span>}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}