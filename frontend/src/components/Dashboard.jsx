import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalQuestions: 0,
        verifiedResponses: 0,
        hallucinationsDetected: 0,
        correctionsApplied: 0,
        averageAccuracy: 0
    });

    useEffect(() => {
        // Fetch mock stats from backend
        fetch('http://localhost:5000/api/stats')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error("Error fetching stats:", err));
    }, []);

    const accuracyData = [
        { name: 'GPT', accuracy: 94 },
        { name: 'Claude', accuracy: 96 },
        { name: 'Gemini', accuracy: 88 },
        { name: 'LLaMA', accuracy: 90 },
    ];

    const verificationData = [
        { name: 'Verified', value: stats.verifiedResponses, color: 'var(--accent-green)' },
        { name: 'Hallucinated', value: stats.hallucinationsDetected, color: 'var(--accent-red)' },
        { name: 'Corrected', value: stats.correctionsApplied, color: 'var(--accent-yellow)' },
    ];

    const trendData = [
        { day: 'Mon', questions: 12 },
        { day: 'Tue', questions: 19 },
        { day: 'Wed', questions: 35 },
        { day: 'Thu', questions: 22 },
        { day: 'Fri', questions: 45 },
        { day: 'Sat', questions: 28 },
        { day: 'Sun', questions: 15 },
    ];

    return (
        <div className="fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Global Analysis</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Live platform metrics for LLM hallucination detection & verification</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-label">Total Questions Analyzed</div>
                    <div className="stat-value counter-animate">{stats.totalQuestions}</div>
                </div>
                <div className="stat-card green">
                    <div className="stat-label">Verified Responses</div>
                    <div className="stat-value counter-animate">{stats.verifiedResponses}</div>
                </div>
                <div className="stat-card red">
                    <div className="stat-label">Hallucinations Detected</div>
                    <div className="stat-value counter-animate">{stats.hallucinationsDetected}</div>
                </div>
                <div className="stat-card yellow">
                    <div className="stat-label">Corrections Applied</div>
                    <div className="stat-value counter-animate">{stats.correctionsApplied}</div>
                </div>
                <div className="stat-card blue">
                    <div className="stat-label">Average Accuracy</div>
                    <div className="stat-value counter-animate">{stats.averageAccuracy}%</div>
                </div>
            </div>

            <div className="grid-2">
                <div className="glass-card">
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Model Accuracy Comparison</h3>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={accuracyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                                <YAxis stroke="var(--text-secondary)" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--text-primary)' }}
                                />
                                <Bar dataKey="accuracy" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card">
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Response Distribution</h3>
                    <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={verificationData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {verificationData.map((entry, index) => (
                                        <Cell key={\`cell-\${index}\`} fill={entry.color} />
                  ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--text-primary)' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Analysis Volume Over Time</h3>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis dataKey="day" stroke="var(--text-secondary)" />
                                <YAxis stroke="var(--text-secondary)" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--text-primary)' }}
                                />
                                <Line type="monotone" dataKey="questions" stroke="var(--accent-green)" strokeWidth={3} dot={{ r: 4, fill: 'var(--bg-primary)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
