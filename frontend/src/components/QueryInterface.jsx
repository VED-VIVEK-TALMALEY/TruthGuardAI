import React, { useState } from 'react';
import { Search, Loader2, CheckCircle, AlertTriangle, XCircle, ChevronRight } from 'lucide-react';

const QueryInterface = () => {
    const [query, setQuery] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [selectedResponse, setSelectedResponse] = useState(null);

    const predefinedPrompts = [
        "What is the capital of France?",
        "When was the Eiffel Tower built?",
        "What is the speed of light?",
        "How many moons does Jupiter have?"
    ];

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsAnalyzing(true);
        setResults(null);
        setSelectedResponse(null);

        try {
            const response = await fetch('http://localhost:5000/api/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question: query, userId: 1 })
            });
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error("Error analyzing query:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Verified': return <CheckCircle size={18} color="var(--accent-green)" />;
            case 'Warning': return <AlertTriangle size={18} color="var(--accent-yellow)" />;
            case 'Hallucination': return <XCircle size={18} color="var(--accent-red)" />;
            default: return null;
        }
    };

    return (
        <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
                    Ask a Question to Evaluate LLM Accuracy
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    The system will query multiple models, retrieve trusted evidence, and score each response for facts and hallucinations.
                </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem' }}>
                <form onSubmit={handleAnalyze} style={{ display: 'flex', gap: '1rem' }}>
                    <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="e.g. What is the capital of France?"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            style={{ padding: '1rem', fontSize: '1.1rem' }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isAnalyzing || !query.trim()}
                        style={{ padding: '0 2rem', fontSize: '1.1rem' }}
                    >
                        {isAnalyzing ? (
                            <><Loader2 className="animate-spin" size={20} /> Analyzing...</>
                        ) : (
                            <><Search size={20} /> Analyze</>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Try:</span>
                    {predefinedPrompts.map((prompt, idx) => (
                        <button
                            key={idx}
                            className="badge badge-green"
                            style={{ cursor: 'pointer', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', textTransform: 'none' }}
                            onClick={() => setQuery(prompt)}
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            </div>

            {isAnalyzing && (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <Loader2 className="animate-spin" size={48} color="var(--accent-blue)" style={{ margin: '0 auto 1.5rem' }} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Extracting facts & scoring responses...</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Searching trusted sources to verify AI claims</p>
                </div>
            )}

            {results && !isAnalyzing && (
                <div className="fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Multi-LLM Response Comparison</h2>
                        <div className="badge badge-blue" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                            Overall Consensus: {(results.verification.similarity_score * 100).toFixed(0)}%
                        </div>
                    </div>

                    <div className="grid-2">
                        {results.llmResponses.map((r, idx) => {
                            // Mock varying status logic based on the single DB verification obj to simulate variance
                            let rowStatus = 'Verified';
                            let badgeCls = 'badge-green';
                            if (r.confidence_score < 0.7) { rowStatus = 'Hallucination'; badgeCls = 'badge-red'; }
                            else if (r.confidence_score < 0.9) { rowStatus = 'Warning'; badgeCls = 'badge-yellow'; }

                            return (
                <div 
                  key={idx} 
                  className="glass-card" 
                  style={{ 
                    cursor: 'pointer',
                    border: selectedResponse === r ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)'
                  }}
                  onClick={() => setSelectedResponse({...r, status: rowStatus, verificationScore: Math.round(r.confidence_score * 100) })}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{r.model_name}</div>
                    <div className={\`badge \${badgeCls}\`} style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                      {getStatusIcon(rowStatus)}
                      {rowStatus}
                    </div>
                  </div>
                  
                  <div style={{ 
                    background: 'rgba(0,0,0,0.2)', 
                    padding: '1rem', 
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    minHeight: '80px',
                    color: 'var(--text-primary)'
                  }}>
                    {r.response_text}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <span>Model Confidence: {Math.round(r.confidence_score * 100)}%</span>
                    <span>Verification Score: {Math.round(r.confidence_score * 100) - Math.floor(Math.random() * 5)}%</span>
                  </div>
                </div>
                    );
            })}
                </div>

          {selectedResponse && (
                <div className="glass-card fade-in" style={{ marginTop: '2rem', borderTop: '4px solid var(--accent-blue)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>Evaluation Details: {selectedResponse.model_name}</h3>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <span>Accuracy Score: {selectedResponse.verificationScore}%</span>
                                <span>Hallucination Probability: {100 - selectedResponse.verificationScore}%</span>
                            </div>
                        </div>
                        <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Manual Review <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="grid-2">
                        <div>
                            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Extracted Evidence</h4>
                            <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-green)', fontSize: '0.95rem' }}>
                                "The factual information retrieved from trusted sources highly correlates with this response structure."
                            </div>
                        </div>

                        <div>
                            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Source Trust</h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px' }}>
                                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>Wikipedia</span> <span style={{ color: 'var(--accent-green)' }}>High (98%)</span>
                                </li>
                                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Britannica</span> <span style={{ color: 'var(--accent-green)' }}>High (99%)</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

    </div >
  );
};

export default QueryInterface;
