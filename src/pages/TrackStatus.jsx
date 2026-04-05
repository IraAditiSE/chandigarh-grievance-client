import React, { useState } from 'react';
import { grievanceApi } from '../services/grievanceApi'; // <-- ADD THIS IMPORT

export default function TrackStatus() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [grievances, setGrievances] = useState(null); // null means hasn't searched yet


  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    setGrievances(null);

    try {
      // USE YOUR API SERVICE INSTEAD OF RAW AXIOS
      const data = await grievanceApi.trackByCredentials(email, password);
      setGrievances(data);

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("No grievances found or network error.");
      }
    }
  };
  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Track Your Grievance</h2>
        
        {/* ERROR MESSAGE DISPLAY */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleTrack} className="flex flex-col gap-4">
          <input 
            type="email" placeholder="Registered Email" required
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input 
            type="password" placeholder="Tracking Password" required
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button type="submit" className="mt-2 p-3 bg-blue-700 text-white font-bold rounded hover:bg-blue-800 transition">
            Check Status
          </button>
        </form>
      </div>

      {/* SUCCESS RESULTS DISPLAY */}
      {grievances && grievances.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Your Reports</h3>
          <div className="flex flex-col gap-4">
            {grievances.map((g) => (
              <div key={g.id} className="p-4 border rounded bg-gray-50 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">{g.locality}</p>
                  <p className="text-sm text-gray-600 truncate max-w-xs">{g.description}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  {g.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}