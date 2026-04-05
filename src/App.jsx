import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Import our actual page components
import SubmitGrievance from './pages/SubmitGrievance';
import TrackStatus from './pages/TrackStatus';
import AdminDashboard from './pages/AdminDashboard';

// The Home page component
const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
    <h1 className="text-4xl font-bold text-blue-900 mb-4 drop-shadow-sm">Chandigarh Public Grievance Portal</h1>
    <p className="text-gray-800 font-medium mb-8 max-w-xl mx-auto bg-white/50 p-4 rounded-xl">
      A centralized platform for citizens to report civic issues and for administration to resolve them efficiently.
    </p>
    <div className="flex justify-center gap-4">
      <Link to="/submit" className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition shadow-lg">
        Submit a Grievance
      </Link>
      <Link to="/track" className="px-6 py-3 bg-white border-2 border-blue-700 text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition shadow-lg">
        Track Status
      </Link>
    </div>
  </div>
);

export default function App() {
  return (
    // 1. THE BACKGROUND MAP: Live URL to Le Corbusier's Map of Chandigarh
    <div 
      className="min-h-screen flex flex-col relative"
      style={{
        backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Le_Corbusier_Map.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Frosted white overlay so the map is visible but text remains highly readable */}
      <div className="absolute inset-0 bg-white/85 z-0 pointer-events-none"></div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Global Header */}
        <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              {/* 2. THE EMBLEM: Live URL to the official Chandigarh Flag/Emblem */}
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Flag_of_Chandigarh.svg" 
                alt="Chandigarh Emblem" 
                className="h-10 w-auto drop-shadow-sm"
              />
              <span className="text-xl font-bold text-blue-900 tracking-tight">CHD Grievance</span>
            </Link>
            <nav className="flex gap-6">
              <Link to="/submit" className="text-sm font-bold text-gray-700 hover:text-blue-700 transition">Submit</Link>
              <Link to="/track" className="text-sm font-bold text-gray-700 hover:text-blue-700 transition">Track</Link>
              <Link to="/admin" className="text-sm font-bold text-gray-700 hover:text-blue-700 transition">Admin Login</Link>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/submit" element={<SubmitGrievance />} />
            <Route path="/track" element={<TrackStatus />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer className="bg-gray-900/95 text-white py-6 mt-auto border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Chandigarh Administration. Designed for Smart India Hackathon.
          </div>
        </footer>
      </div>
    </div>
  );
}