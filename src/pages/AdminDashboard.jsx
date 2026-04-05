import React, { useState } from 'react';
import apiClient from '../services/apiClient'; // Using your custom client
import { LayoutDashboard, FileText, User, MapPin, ClipboardList, LogOut, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminDashboard() {
  // 1. State Management
  const [wardNumber, setWardNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [grievances, setGrievances] = useState([]);

  // 2. Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Note: we use '/wards/login' because apiClient already has '/api/v1'
      const response = await apiClient.post('/wards/login', {
        wardNumber: parseInt(wardNumber),
        email,
        password
      });

      // Data is delivered directly in the login response
      setGrievances(response.data.grievances || []);
      setIsLoggedIn(true);
      
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.error || "Invalid Ward Number, Email, or Password.");
    }
  };

  // 3. Logout Handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setGrievances([]);
    setWardNumber('');
    setEmail('');
    setPassword('');
  };

  // --- VIEW A: THE LIVE DASHBOARD ---
  if (isLoggedIn) {
    return (
      <div className="max-w-6xl mx-auto mt-6 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-blue-900">Ward {wardNumber} Portal</h2>
              <p className="text-gray-500 text-sm font-medium">Administrator: {email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Statistics Bar (Optional but looks great) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="p-2 bg-blue-50 rounded-md"><ClipboardList className="text-blue-600"/></div>
                <div><p className="text-xs text-gray-500 font-bold uppercase">Total Reports</p><p className="text-xl font-black">{grievances.length}</p></div>
            </div>
        </div>

        {/* The Data Table */}
        {grievances.length === 0 ? (
          <div className="bg-white p-16 rounded-xl border-2 border-dashed border-gray-200 text-center">
            <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No Grievances Logged</h3>
            <p className="text-gray-400">Grievances filed for this ward will appear here automatically.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Description</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Location</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Category</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {grievances.map((g) => (
                  <tr key={g.id} className="hover:bg-blue-50/30 transition">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800 text-sm mb-0.5">{g.title || "Untitled Issue"}</p>
                      <p className="text-xs text-gray-500 line-clamp-1 italic">{g.description}</p>
                      <div className="flex items-center gap-1 mt-2 text-[10px] text-blue-600 font-bold">
                         <User className="w-3 h-3" /> {g.citizenName || "Anonymous"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                        <MapPin className="w-3.5 h-3.5 text-red-500" /> {g.locality}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                        {g.subCategory}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border ${
                        g.status === 'OPEN' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                        'bg-green-50 text-green-700 border-green-100'
                      }`}>
                        {g.status === 'OPEN' ? <Clock className="w-3 h-3"/> : <CheckCircle2 className="w-3 h-3"/>}
                        {g.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // --- VIEW B: THE LOGIN FORM ---
  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-blue-900 tracking-tight">Admin Access</h2>
            <p className="text-gray-400 text-sm mt-1">Chandigarh Grievance Management System</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-xs font-bold flex items-center gap-3">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Ward Number</label>
            <input 
              type="number" placeholder="Enter Ward (1-35)" required
              value={wardNumber} onChange={(e) => setWardNumber(e.target.value)}
              className="w-full p-3.5 mt-1 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Official Email</label>
            <input 
              type="email" placeholder="wardX@chd.gov.in" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 mt-1 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Password</label>
            <input 
              type="password" placeholder="••••••••" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 mt-1 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
            />
          </div>
          <button type="submit" className="w-full mt-4 p-4 bg-blue-700 text-white font-black rounded-xl hover:bg-blue-800 transition shadow-lg shadow-blue-200 active:scale-[0.98]">
            Authorize & Enter
          </button>
        </form>
      </div>
      <p className="text-center text-gray-400 text-[10px] mt-8 font-medium">
        SECURE GATEWAY • CHANDIGARH ADMINISTRATION
      </p>
    </div>
  );
}