import React, { useRef, useEffect } from "react";

/**
 * TranscriptPanel
 * Displays a real-time scrollable history of meeting transcriptions.
 */
export function TranscriptPanel({ transcripts, onClose }) {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom as new transcripts arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts]);

  const formatTime = (ts) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <aside className="video-panel" aria-label="Meeting Transcript">
      <div className="video-panel__header">
        <h3 className="video-panel__title">Transcript</h3>
        <button className="video-panel__close" onClick={onClose} aria-label="Close transcript">
          ✕
        </button>
      </div>

      <div className="video-panel__content transcript-list" ref={scrollRef} style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
        {transcripts.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', marginTop: '20px' }}>
            Transcription will appear here once someone starts speaking.
          </p>
        ) : (
          transcripts.map((t, i) => (
            <div key={i} className="transcript-item" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#3b82f6' }}>
                  {t.speaker?.displayName || t.speakerName || "Unknown"}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>
                  {formatTime(t.ts || t.timestamp)}
                </span>
              </div>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.4', margin: 0, color: '#e5e7eb' }}>
                {t.content}
              </p>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
