import React, { useState, useEffect } from 'react';
import { locationApi } from '../services/locationApi';
import { grievanceApi } from '../services/grievanceApi';
import { CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';

// The exact criteria you provided for the hackathon
const GRIEVANCE_CATEGORIES = {
  "GOVERNMENT": [
    "Govt & Administration",
    "Departments",
    "Organizations",
    "Institutions",
    "Acts"
  ],
  "CITIZEN SERVICES": [
    "Education",
    "Social Welfare Initiatives",
    "Health Services",
    "Emergency Services",
    "Employment",
    "Skill Development"
  ]
};

export default function SubmitGrievance() {
  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  
  // Form State
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [formData, setFormData] = useState({
    citizenName: '',
    citizenPhone: '',
    citizenEmail: '',
    citizenPassword: '',
    primaryCategory: '',
    subCategory: '',
    title: '',
    description: '',
    locality: ''
  });

  // Fetch localities when the component loads
  useEffect(() => {
    const loadLocalities = async () => {
      setLoading(true);
      try {
        const data = await locationApi.getAllLocalities();
        setLocalities(data);
      } catch (error) {
        console.error("Failed to load localities:", error);
        setFetchError("Could not load localities. Please ensure the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    loadLocalities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // Reset subCategory if primaryCategory changes
      if (name === 'primaryCategory') {
        newData.subCategory = '';
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      await grievanceApi.submitGrievance(formData);
      setStatus('success');
      // Clear form on success
      setFormData({
        citizenName: '', citizenPhone: '', citizenEmail: '',
        primaryCategory: '', subCategory: '', title: '', description: '', locality: ''
      });
    } catch (error) {
      console.error("Submission failed:", error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto mt-12 bg-white p-8 border border-green-200 rounded-xl shadow-sm text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Grievance Submitted Successfully</h2>
        <p className="text-gray-600 mb-6">
          Your ticket has been automatically routed to the Supervising Officer for your selected locality.
        </p>
        <button 
          onClick={() => setStatus('idle')}
          className="bg-chd-blue text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-chd-blue px-8 py-6 text-white">
        <h2 className="text-2xl font-bold">Lodge a Public Grievance</h2>
        <p className="text-blue-100 text-sm mt-1">Fill out the details below to notify the Chandigarh Administration.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {status === 'error' && (
          <div className="p-4 bg-red-50 text-red-700 flex items-center gap-3 rounded-lg border border-red-200">
            <AlertCircle className="w-5 h-5" />
            <p>Failed to submit grievance. Please try again.</p>
          </div>
        )}

        {fetchError && (
          <div className="p-4 bg-amber-50 text-amber-700 flex items-center gap-3 rounded-lg border border-amber-200">
            <AlertCircle className="w-5 h-5" />
            <p>{fetchError}</p>
          </div>
        )}

        {/* Section 1: Citizen Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2 text-gray-800">1. Citizen Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input required type="text" name="citizenName" value={formData.citizenName} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chd-blue focus:border-chd-blue" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input required type="tel" name="citizenPhone" value={formData.citizenPhone} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chd-blue focus:border-chd-blue" placeholder="10-digit mobile number" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input required type="email" name="citizenEmail" value={formData.citizenEmail} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chd-blue focus:border-chd-blue" placeholder="john@example.com" />
            </div>
            <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Create Tracking Password</label>
    <input required type="password" name="citizenPassword" value={formData.citizenPassword} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chd-blue" placeholder="Create a password" />
  </div>
          </div>
        </div>

        {/* Section 2: Grievance Details */}
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-semibold border-b pb-2 text-gray-800">2. Grievance Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Category</label>
              <select required name="primaryCategory" value={formData.primaryCategory} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chd-blue bg-white">
                <option value="">Select Category...</option>
                {Object.keys(GRIEVANCE_CATEGORIES).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
              <select required name="subCategory" value={formData.subCategory} onChange={handleChange} disabled={!formData.primaryCategory} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chd-blue bg-white disabled:bg-gray-100 disabled:text-gray-400">
                <option value="">Select Sub-category...</option>
                {formData.primaryCategory && GRIEVANCE_CATEGORIES[formData.primaryCategory].map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Locality / Sector</label>
            <select required name="locality" value={formData.locality} onChange={handleChange} disabled={loading} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chd-blue bg-white">
              <option value="">{loading ? "Loading localities..." : "Select your Locality/Sector..."}</option>
              {localities.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">This will automatically route your complaint to the correct Ward Councillor.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grievance Title</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chd-blue" placeholder="Brief summary of the issue" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-chd-blue resize-none" placeholder="Please provide specific details about the issue..."></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button 
            type="submit" 
            disabled={status === 'submitting'}
            className="w-full bg-chd-blue text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-800 transition flex items-center justify-center gap-2 disabled:bg-blue-400"
          >
            {status === 'submitting' ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
            ) : (
              <><Send className="w-5 h-5" /> Submit Grievance</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}