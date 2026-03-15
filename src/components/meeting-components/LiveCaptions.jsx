import React from "react";

/**
 * LiveCaptions
 * Displays the latest transcription chunks in a floating glassmorphic container.
 */
export function LiveCaptions({ latestTranscripts, currentInterim, remoteInterims = {}, selfName }) {
  const hasTranscripts = latestTranscripts && latestTranscripts.length > 0;
  const hasInterim = !!currentInterim || Object.keys(remoteInterims).length > 0;

  if (!hasTranscripts && !hasInterim) return null;

  return (
    <div className="live-captions-overlay">
      <div className="live-captions-container">
        {latestTranscripts.map((t, i) => (
          <div key={i} className="live-caption-item">
            <span className="live-caption-speaker">{t.speaker?.displayName || t.speakerName || "Unknown"}: </span>
            <span className="live-caption-text">{t.content}</span>
          </div>
        ))}
        {currentInterim && (
          <div className="live-caption-item interim">
            <span className="live-caption-speaker">{selfName}: </span>
            <span className="live-caption-text italicized">{currentInterim}...</span>
          </div>
        )}
        {Object.entries(remoteInterims).map(([id, data]) => (
          <div key={id} className="live-caption-item interim">
            <span className="live-caption-speaker">{data.name}: </span>
            <span className="live-caption-text italicized">{data.content}...</span>
          </div>
        ))}
      </div>
    </div>
  );
}
