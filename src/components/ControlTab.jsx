import React from 'react'
import '../styles/controltab.css'
import { useState } from 'react'

function ControlTab() {

const [isMuted, setIsMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  
  return (
  
    <div className="control-bar">
      {/* Audio / Video / Screen */}
      <div className="controls-group">
        <button
          className={`control-btn ${isMuted ? "active" : ""}`}
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? "🔇" : "🎤"}
        </button>

        <button
          className={`control-btn ${cameraOff ? "active" : ""}`}
          onClick={() => setCameraOff(!cameraOff)}
          title={cameraOff ? "Turn on camera" : "Turn off camera"}
        >
          {cameraOff ? "📹" : "📷"}
        </button>

        <button
          className={`control-btn ${isScreenSharing ? "active" : ""}`}
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          title={isScreenSharing ? "Stop sharing" : "Share screen"}
        >
          🖥️
        </button>
      </div>

      {/* Chat / Participants / More */}
      <div className="controls-group">
        <button className="control-btn" title="Chat">
          💬
        </button>

        <button
          className={`control-btn ${showParticipants ? "active" : ""}`}
          onClick={() => setShowParticipants(!showParticipants)}
          title="Participants"
        >
          👥
        </button>

        <button className="control-btn" title="More options">
          ⋯
        </button>
      </div>

      {/* End Call */}
      <div className="controls-group">
        <button className="control-btn end-call" title="End call">
          📞
        </button>
      </div>
    </div>

  )
}

export default ControlTab