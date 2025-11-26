import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getMe, trackVisit } from './api';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';

import LandingPage from './pages/LandingPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await getMe();
          setUser(res.data);
          trackVisit();
        } catch (err) {
          console.error(err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={user ? <Home user={user} logout={logout} /> : <LandingPage />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/admin" element={<AdminPanel user={user} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
