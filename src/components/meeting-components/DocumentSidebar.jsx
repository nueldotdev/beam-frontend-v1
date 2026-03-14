import { useState, useEffect } from "react";
import UploadFiles from "./UploadFiles.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export function DocumentSidebar({ meetingId, onClose, onPresentDocument }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_BASE_URL}/documents?meetingId=${meetingId}`, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
      });
      const data = await res.json();
      if (data.success) {
        setDocuments(data.data);
      }
    } catch (e) {
      console.error("Failed to fetch documents", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // Poll for new docs every few seconds for simplicity
    const interval = setInterval(fetchDocuments, 5000);
    return () => clearInterval(interval);
  }, [meetingId]);

  return (
    <aside className="video-panel" aria-label="Meeting Documents">
      <div className="video-panel__header">
        <h3 className="video-panel__title">Documents</h3>
        <button className="video-panel__close" onClick={onClose}>✕</button>
      </div>

      <div className="video-panel__content" style={{ padding: '10px', overflowY: 'auto' }}>
        <UploadFiles meetingId={meetingId} />
        
        <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Available Files</h4>
        {loading && documents.length === 0 ? <p>Loading...</p> : null}
        
        {documents.map(doc => (
          <div key={doc._id} style={{ border: '1px solid #e5e7eb', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
            <p style={{ fontWeight: 'bold', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden' }}>{doc.filename}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
               <button 
                 className="btn btn-primary" 
                 onClick={() => onPresentDocument(doc)}
                 style={{ fontSize: '12px' }}
               >
                 Present
               </button>
               <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="btn" style={{ fontSize: '12px' }}>Download</a>
            </div>
          </div>
        ))}
        {documents.length === 0 && !loading && <p style={{ color: '#6b7280', fontSize: '14px' }}>No documents uploaded to this meeting yet.</p>}
      </div>
    </aside>
  );
}
