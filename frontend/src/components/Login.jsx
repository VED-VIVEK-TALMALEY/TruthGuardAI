import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, LogIn, Lock, Mail } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate auth
        if (email && password) {
            localStorage.setItem('isAuthenticated', 'true');
            onLogin();
            navigate('/');
        }
    };

    return (
        <div className="fade-in" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '70vh'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Activity color="var(--accent-blue)" size={48} style={{ margin: '0 auto 1rem' }} />
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Welcome to TruthGuard AI</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Sign in to start evaluating intelligence.</p>
            </div>

            <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Mail size={16} /> Email
                        </label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="admin@truthguard.ai"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Lock size={16} /> Password
                        </label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '1rem', fontSize: '1.1rem' }}>
                        <LogIn size={18} /> Sign In
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    For demo purposes, any email/password works.
                </div>
            </div>
        </div>
    );
};

export default Login;
