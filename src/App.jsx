import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Import our actual page components
import SubmitGrievance from './pages/SubmitGrievance';
import TrackStatus from './pages/TrackStatus';
import AdminDashboard from './pages/AdminDashboard';

// The Home page component
const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
    <h1 className="text-4xl font-bold text-chd-blue mb-4">Chandigarh Public Grievance Portal</h1>
    <p className="text-gray-600 mb-8 max-w-xl mx-auto">
      A centralized platform for citizens to report civic issues and for administration to resolve them efficiently.
    </p>
    <div className="flex justify-center gap-4">
      <Link to="/submit" className="px-6 py-3 bg-chd-blue text-white rounded-lg hover:bg-blue-800 transition">
        Submit a Grievance
      </Link>
      <Link to="/track" className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
        Track Status
      </Link>
    </div>
  </div>
);

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Global Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-chd-blue tracking-tight">CHD Grievance</span>
          </Link>
          <nav className="flex gap-6">
            <Link to="/submit" className="text-sm font-medium text-gray-600 hover:text-chd-blue transition">Submit</Link>
            <Link to="/track" className="text-sm font-medium text-gray-600 hover:text-chd-blue transition">Track</Link>
            <Link to="/admin" className="text-sm font-medium text-gray-600 hover:text-chd-blue transition">Admin Login</Link>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          {/* Active Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/submit" element={<SubmitGrievance />} />
          <Route path="/track" element={<TrackStatus />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <footer className="bg-chd-dark text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Chandigarh Administration. Designed for Smart India Hackathon.
        </div>
      </footer>
    </div>
  );
}