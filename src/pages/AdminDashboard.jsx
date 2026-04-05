import React, { useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [wardNumber, setWardNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [grievances, setGrievances] = useState([]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    console.log("🚀 Attempting login for Ward:", wardNumber);

    try {
      // Using raw axios to ensure no pathing issues
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/wards/login`, {
        wardNumber: parseInt(wardNumber),
        email,
        password
      });

      console.log("✅ Login Response Data:", response.data);
      
      // Save data and switch view
      setGrievances(response.data.grievances || []);
      setIsLoggedIn(true);
      
    } catch (err) {
      console.error("❌ Login Failed:", err);
      setError(err.response?.data?.error || "Connection error to backend.");
    }
  };

  // --- DASHBOARD VIEW (Simple HTML/CSS) ---
  if (isLoggedIn) {
    return (
      <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h2>🏛️ Ward {wardNumber} Admin Panel</h2>
          <button onClick={() => window.location.reload()} style={{ color: 'red', cursor: 'pointer', border: 'none', background: 'none' }}>Logout</button>
        </div>

        <div style={{ marginTop: '20px' }}>
          {grievances.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', padding: '50px' }}>No grievances reported for this ward yet.</p>
          ) : (
            <table style={{ width: '100%', background: 'white', borderCollapse: 'collapse', borderRadius: '10px', overflow: 'hidden' }}>
              <thead style={{ background: '#f4f4f4' }}>
                <tr>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Issue</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Location</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {grievances.map((g, index) => (
                  <tr key={index} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: '15px' }}>
                      <strong>{g.title}</strong><br/>
                      <small style={{ color: '#666' }}>{g.description}</small>
                    </td>
                    <td style={{ padding: '15px' }}>📍 {g.locality}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: g.status === 'OPEN' ? '#fff3cd' : '#d4edda' }}>
                        {g.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  // --- LOGIN VIEW ---
  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', background: 'white', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#1e3a8a' }}>Admin Login</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px', fontSize: '14px', fontWeight: 'bold' }}>⚠️ {error}</div>}
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="number" placeholder="Ward Number" value={wardNumber} onChange={(e) => setWardNumber(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} required />
        <button type="submit" style={{ padding: '12px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Login</button>
      </form>
    </div>
  );
}