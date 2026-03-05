import React, { useState, useEffect } from 'react';
import { History, ListVideo, CheckCircle, AlertTriangle, XCircle, Search } from 'lucide-react';

const QueryHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/history')
            .then(res => res.json())
            .then(data => {
                setHistory(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching history", err);
                setLoading(false);
            });
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Verified': return <span className="badge badge-green"><CheckCircle size={14} style={{ marginRight: '4px' }} /> Verified</span>;
            case 'Warning': return <span className="badge badge-yellow"><AlertTriangle size={14} style={{ marginRight: '4px' }} /> Warning</span>;
            case 'Hallucination': return <span className="badge badge-red"><XCircle size={14} style={{ marginRight: '4px' }} /> Hallucination</span>;
            default: return null;
        }
    };

    return (
        <div className="fade-in">
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <History color="var(--accent-blue)" size={32} />
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Prompt Storage & History</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Log of all past queries and verified responses</p>
                </div>
            </div>

            <div className="glass-card">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        Loading query history...
                    </div>
                ) : history.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        No prompts found. Go to "Evaluate LLMs" to analyze your first question!
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Date</th>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Prompt / Question</th>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Consensus Accuracy</th>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>System Status</th>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((q, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        {new Date(q.timestamp).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 500, maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {q.question}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '100px', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ width: `${Math.round(q.similarity_score * 100)}%`, height: '100%', background: q.similarity_score > 0.7 ? 'var(--accent-green)' : 'var(--accent-red)' }}></div>
                                            </div>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{Math.round(q.similarity_score * 100)}%</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {getStatusBadge(q.status)}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                                            <Search size={14} /> Review
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div >
    );
};

export default QueryHistory;
