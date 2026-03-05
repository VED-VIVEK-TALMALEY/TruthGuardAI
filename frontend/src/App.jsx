import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Activity, LayoutDashboard, MessageSquare, Settings } from 'lucide-react';

import Dashboard from './components/Dashboard';
import QueryInterface from './components/QueryInterface';

const Navbar = () => {
  const location = useLocation();

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
      </div >
      <div>
        <button
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          onClick={() => alert("Profile functionality coming soon!")}
        >
          <Settings size={16} /> Profile
        </button>
      </div>
    </nav >
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/query" element={<QueryInterface />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
