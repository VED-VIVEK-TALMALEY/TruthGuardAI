const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// db setup
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.serialize(() => {
            // Create tables based on ER Diagram

            db.run(`CREATE TABLE IF NOT EXISTS Users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT UNIQUE,
                password TEXT
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS Queries (
                query_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                question TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES Users(user_id)
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS LLM_Responses (
                response_id INTEGER PRIMARY KEY AUTOINCREMENT,
                query_id INTEGER,
                model_name TEXT,
                response_text TEXT,
                confidence_score REAL,
                FOREIGN KEY(query_id) REFERENCES Queries(query_id)
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS Verification (
                verification_id INTEGER PRIMARY KEY AUTOINCREMENT,
                query_id INTEGER,
                similarity_score REAL,
                hallucination_prob REAL,
                status TEXT,
                FOREIGN KEY(query_id) REFERENCES Queries(query_id)
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS Corrections (
                correction_id INTEGER PRIMARY KEY AUTOINCREMENT,
                query_id INTEGER,
                original_answer TEXT,
                corrected_answer TEXT,
                reviewer_id INTEGER,
                FOREIGN KEY(query_id) REFERENCES Queries(query_id),
                FOREIGN KEY(reviewer_id) REFERENCES Users(user_id)
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS Sources (
                source_id INTEGER PRIMARY KEY AUTOINCREMENT,
                query_id INTEGER,
                source_name TEXT,
                source_url TEXT,
                evidence_text TEXT,
                FOREIGN KEY(query_id) REFERENCES Queries(query_id)
            )`);
        });
    }
});

// Helper functions for mocking

function generateMockLLMResponses(question) {
    return [
        { model_name: 'GPT', response_text: `GPT says: ${question} is mostly true.`, confidence_score: 0.95 },
        { model_name: 'Claude', response_text: `Claude says: Here is a detailed answer to ${question}.`, confidence_score: 0.96 },
        { model_name: 'Gemini', response_text: `Gemini says: I am not sure about ${question}.`, confidence_score: 0.50 },
        { model_name: 'LLaMA', response_text: `LLaMA says: The concept of ${question} is interesting.`, confidence_score: 0.85 }
    ];
}

function generateMockVerification(responses) {
    const avgConfidence = responses.reduce((acc, curr) => acc + curr.confidence_score, 0) / responses.length;
    const similarity_score = avgConfidence; // Mock similarity based on avg confidence
    const hallucination_prob = 1 - similarity_score;
    const status = similarity_score > 0.7 ? 'Verified' : 'Hallucination';

    return { similarity_score, hallucination_prob, status };
}


// Routes

app.get('/api/stats', (req, res) => {
    // Return mock stats to match global metrics
    res.json({
        totalQuestions: 127,
        verifiedResponses: 109,
        hallucinationsDetected: 18,
        correctionsApplied: 14,
        averageAccuracy: 94
    });
});

app.post('/api/query', (req, res) => {
    const { question, userId = 1 } = req.body;
    
    if (!question) {
        return res.status(400).json({ error: 'Question is required' });
    }

    db.run(`INSERT INTO Queries (user_id, question) VALUES (?, ?)`, [userId, question], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        const queryId = this.lastID;
        const llmResponses = generateMockLLMResponses(question);
        
        let insertedResponsesCount = 0;
        llmResponses.forEach(r => {
            db.run(`INSERT INTO LLM_Responses (query_id, model_name, response_text, confidence_score) VALUES (?, ?, ?, ?)`,
                [queryId, r.model_name, r.response_text, r.confidence_score], 
                function(err) {
                    if (err) console.error(err);
                    insertedResponsesCount++;
                    if(insertedResponsesCount === llmResponses.length) {
                        // After all LLM responses are inserted, generate verification
                        const verification = generateMockVerification(llmResponses);
                        
                        db.run(`INSERT INTO Verification (query_id, similarity_score, hallucination_prob, status) VALUES (?, ?, ?, ?)`,
                            [queryId, verification.similarity_score, verification.hallucination_prob, verification.status],
                            function(err) {
                                if (err) return res.status(500).json({ error: err.message });
                                
                                res.json({
                                    queryId,
                                    question,
                                    llmResponses,
                                    verification
                                });
                            }
                        );
                    }
            });
        });
    });
});


app.listen(PORT, () => {
    console.log(\`Server is running on http://localhost:\${PORT}\`);
});
