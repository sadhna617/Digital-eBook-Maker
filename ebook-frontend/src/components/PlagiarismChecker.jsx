import { useState } from "react";
import axios from "axios";

function PlagiarismChecker({ textToCheck, onClose }) {
    const [text, setText] = useState(textToCheck || "");
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(false);

    const checkPlagiarism = async () => {
        if (!text) {
            alert("Please enter some text to check.");
            return;
        }

        setLoading(true);

        try {
            // NOTE: Ensure your backend port matches (8081)
            const res = await axios.post("http://localhost:8081/api/plagiarism/check", { text });
            setScore(res.data.score);
        } catch (err) {
            console.error(err);
            alert("Error checking plagiarism. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
                <h6 className="m-0 fw-bold">🕵️ Plagiarism Checker</h6>
                {onClose && <button className="btn-close small" onClick={onClose}></button>}
            </div>

            <div className="card-body d-flex flex-column">
                <textarea
                    className="form-control mb-3 flex-grow-1"
                    style={{ minHeight: "150px", resize: "none" }}
                    placeholder="Paste content here or check the current chapter..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <div className="d-flex align-items-center justify-content-between">
                    <button
                        className="btn btn-primary w-100 rounded-pill"
                        onClick={checkPlagiarism}
                        disabled={loading}
                    >
                        {loading ? (
                            <span><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Checking...</span>
                        ) : "Check Plagiarism"}
                    </button>
                </div>

                {score !== null && (
                    <div className="mt-4 text-center animate-fade-in p-3 rounded-3" style={{ background: score > 25 ? "#fff5f5" : "#f0fff4", border: `1px solid ${score > 25 ? "#feb2b2" : "#9ae6b4"}` }}>
                        <span className="d-block text-muted small text-uppercase fw-bold mb-1">Plagiarism Score</span>
                        <div className={`display-4 fw-bold ${score > 25 ? "text-danger" : "text-success"}`}>
                            {score}%
                        </div>
                        <p className="small m-0 text-muted mt-2">
                            {score > 25 ? "⚠️ High similarity detected. Review your content." : "✅ Looks good! Original content."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PlagiarismChecker;
