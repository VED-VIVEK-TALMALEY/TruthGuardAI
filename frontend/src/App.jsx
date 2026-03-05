import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Activity, LayoutDashboard, MessageSquare, History, LogOut } from 'lucide-react';

import Dashboard from './components/Dashboard';
import QueryInterface from './components/QueryInterface';
import Login from './components/Login';
import QueryHistory from './components/QueryHistory';

const Navbar = ({ onLogout }) => {
  const location = useLocation();

  if (location.pathname === '/login') return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Activity color="var(--accent-blue)" size={28} />
        TruthGuard AI
      </div>
      <div className="nav-links">
        <Link
          to="/"
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LayoutDashboard size={18} /> Dashboard
          </div>
        </Link>
        <Link
          to="/query"
          className={`nav-link ${location.pathname === '/query' ? 'active' : ''}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MessageSquare size={18} /> Evaluate LLMs
          </div>
        </Link>
        <Link
          to="/history"
          className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <History size={18} /> Prompt Storage
          </div>
        </Link>
      </div>
      <div>
        <button
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          onClick={onLogout}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
};

const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />

            <Route path="/" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/query" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <QueryInterface />
              </ProtectedRoute>
            } />

            <Route path="/history" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <QueryHistory />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
