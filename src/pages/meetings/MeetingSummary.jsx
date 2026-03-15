import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function MeetingSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${API_BASE_URL}/meetings/${id}/summary`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setSummary(data.data.summary);
        } else {
          setError(data.message || "Failed to generate summary");
        }
      } catch (err) {
        setError("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [id]);

  const downloadSummary = () => {
    const element = document.createElement("a");
    const file = new Blob([summary], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Meeting_Summary_${id}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: '#0f172a',
      color: 'white',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <header style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '10px' }}>Meeting Summary</h1>
          <p style={{ color: '#94a3b8' }}>AI-generated highlights and action items from your session.</p>
        </header>

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '32px',
          minHeight: '400px',
          position: 'relative',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div className="loader"></div>
              <p style={{ marginTop: '20px', color: '#94a3b8' }}>Generating your summary with Amazon Nova AI...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#f87171', fontSize: '18px' }}>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="btn"
                style={{ marginTop: '20px', background: '#334155', color: 'white' }}
              >
                Retry
              </button>
            </div>
          ) : (
            <div style={{ lineHeight: '1.6', fontSize: '16px', color: '#e2e8f0', whiteSpace: 'pre-wrap' }}>
              {summary}
            </div>
          )}
        </div>

        <footer style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary"
            style={{ padding: '12px 32px' }}
          >
            Back to Dashboard
          </button>
          {!loading && !error && (
            <button 
              onClick={downloadSummary}
              className="btn btn-primary"
              style={{ padding: '12px 32px' }}
            >
              Download PDF / TXT
            </button>
          )}
        </footer>
      </div>

      <style>{`
        .loader {
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-left: 4px solid #3b82f6;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .btn-secondary {
           background: #1e293b;
           color: white;
           border: 1px solid #334155;
        }
        .btn-secondary:hover {
           background: #334155;
        }
      `}</style>
    </div>
  );
}
