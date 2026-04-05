import React, { useState } from 'react';
import { grievanceApi } from '../services/grievanceApi'; // <-- ADD THIS IMPORT

export default function AdminDashboard() {
  // State for the form
  const [wardNumber, setWardNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State for UI feedback
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // USE YOUR API SERVICE INSTEAD OF RAW AXIOS
      await grievanceApi.adminLogin(wardNumber, email, password);
      
      setIsLoggedIn(true);
      
    } catch (err) {
      // Your api service throws a generic error, or you can capture the specific one
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Invalid Ward Number, Email, or Password.");
      }
    }
  };

  // If logged in, show the dashboard view. Otherwise, show the login form.
  if (isLoggedIn) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Login Successful!</h2>
        <p>Welcome, Admin for Ward {wardNumber}.</p>
        {/* You will eventually load your grievance table here */}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Admin Login</h2>
      
      {/* ERROR MESSAGE DISPLAY */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input 
          type="number" placeholder="Ward Number (e.g., 2)" required
          value={wardNumber} onChange={(e) => setWardNumber(e.target.value)}
          className="p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input 
          type="email" placeholder="Admin Email" required
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input 
          type="password" placeholder="Password" required
          value={password} onChange={(e) => setPassword(e.target.value)}
          className="p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button type="submit" className="mt-2 p-3 bg-blue-700 text-white font-bold rounded hover:bg-blue-800 transition">
          Secure Login
        </button>
      </form>
    </div>
  );
}