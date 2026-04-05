import React, { useState } from 'react';
import { grievanceApi } from '../services/grievanceApi';
import { Search, Loader2, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function TrackStatus() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await grievanceApi.trackByCredentials(email, password);
      // Sort by newest first
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setGrievances(sortedData);
    } catch (err) {
      console.error("Failed to fetch tracking history:", err);
      setError("Could not retrieve your grievance history. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render the correct badge color and icon based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-4 h-4" /> Pending Review
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
            <Loader2 className="w-4 h-4 animate-spin" /> In Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
            <CheckCircle2 className="w-4 h-4" /> Resolved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
            <XCircle className="w-4 h-4" /> Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Search Header */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Your Grievance</h2>
        <p className="text-gray-600 mb-6">Enter your registered phone number to check the real-time status of your complaints.</p>
        
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2">
    <input 
      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
      placeholder="Registered Email" 
      className="flex-grow p-3 border border-gray-300 rounded-lg outline-none" required
    />
    <input 
      type="password" value={password} onChange={(e) => setPassword(e.target.value)}
      placeholder="Password" 
      className="flex-grow p-3 border border-gray-300 rounded-lg outline-none" required
    />
    <button type="submit" disabled={loading} className="bg-chd-blue text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition">
      Search
    </button>
  </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 flex items-center gap-3 rounded-lg border border-red-200">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {/* Results Section */}
      {hasSearched && !loading && !error && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Found {grievances.length} {grievances.length === 1 ? 'record' : 'records'}
          </h3>
          
          {grievances.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500">
              No grievances found for this phone number. Please ensure you entered it correctly.
            </div>
          ) : (
            <div className="grid gap-4">
              {grievances.map((grievance) => (
                <div key={grievance.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">Ticket ID: {grievance.id.substring(0, 8)}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {new Date(grievance.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">{grievance.title}</h4>
                      <p className="text-sm text-chd-blue font-medium mt-1">
                        {grievance.primaryCategory} &gt; {grievance.subCategory}
                      </p>
                    </div>
                    <div>
                      {getStatusBadge(grievance.status)}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{grievance.description}</p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                    <p><strong>Locality:</strong> {grievance.locality}</p>
                    <p><strong>Supervising Officer:</strong> {grievance.assignedOfficerEmail}</p>
                    <p><strong>Ward:</strong> {grievance.mappedWardNumber === 0 ? 'Central Pool' : grievance.mappedWardNumber}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}