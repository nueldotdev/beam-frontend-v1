import React, { useState } from 'react'
import '../styles/dashboard.css'
import Button from '../components/Button'
import Sidebar from '../components/Sidebar'

function DashBoard() {
  const [isMuted, setIsMuted] = useState(false)
  const [cameraOff, setCameraOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [showParticipants, setShowParticipants] = useState(true)

  // Mock participants data
  const participants = [
    { id: 1, name: 'You', isMuted: isMuted, videoOff: cameraOff, isPresenter: true },
    { id: 2, name: 'John Smith', isMuted: false, videoOff: false },
    { id: 3, name: 'Sarah Johnson', isMuted: true, videoOff: false },
    { id: 4, name: 'Mike Chen', isMuted: false, videoOff: false },
    { id: 5, name: 'Emma Davis', isMuted: false, videoOff: true },
    { id: 6, name: 'Alex Wilson', isMuted: false, videoOff: false },
  ]

  const toggleMute = () => setIsMuted(!isMuted)
  const toggleCamera = () => setCameraOff(!cameraOff)
  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing)

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard">
      <div className="dashboard-header">
        <h1>Team Meeting</h1>
        <div className="header-stats">
          <span className="participant-count">{participants.length} Participants</span>
          <span className="call-duration">45:32</span>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Main video area */}
        <div className="main-video-area">
          {isScreenSharing ? (
            <div className="screen-share-container">
              <div className="screen-placeholder">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M2 17h20" />
                </svg>
                <p>Screen being shared</p>
              </div>
            </div>
          ) : (
            <div className="main-video-container">
              <div className="video-feed presenter">
                <div className="video-placeholder">
                  <div className="avatar-large">JD</div>
                </div>
                <div className="video-info">
                  <span className="name">You (Presenter)</span>
                  {isMuted && <span className="status muted">🔇 Muted</span>}
                  {cameraOff && <span className="status camera-off">📹 Camera Off</span>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video gallery */}
        <div className={`video-gallery ${!showParticipants ? 'hidden' : ''}`}>
          <div className="gallery-header">
            <h3>Participants</h3>
            <button 
              className="btn-toggle-gallery"
              onClick={() => setShowParticipants(!showParticipants)}
              title="Collapse gallery"
            >
              ✕
            </button>
          </div>
          <div className="gallery-grid">
            {participants.slice(1).map((participant) => (
              <div key={participant.id} className="gallery-item">
                <div className="video-placeholder small">
                  <div className="avatar-small">{participant.name.split(' ').map(n => n[0]).join('')}</div>
                </div>
                <div className="participant-info">
                  <p className="participant-name">{participant.name}</p>
                  <div className="participant-icons">
                    {participant.isMuted && <span title="Muted">🔇</span>}
                    {participant.videoOff && <span title="Camera Off">📹</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="control-bar">
        <div className="controls-group">
          <Button
            variant={isMuted ? 'danger' : 'secondary'}
            onClick={toggleMute}
            className="control-btn"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <span className="icon">{isMuted ? '🔇' : '🎤'}</span>
            <span className="label">{isMuted ? 'Unmute' : 'Mute'}</span>
          </Button>

          <Button
            variant={cameraOff ? 'danger' : 'secondary'}
            onClick={toggleCamera}
            className="control-btn"
            title={cameraOff ? 'Turn on camera' : 'Turn off camera'}
          >
            <span className="icon">{cameraOff ? '📹' : '📷'}</span>
            <span className="label">{cameraOff ? 'Camera Off' : 'Camera'}</span>
          </Button>

          <Button
            variant={isScreenSharing ? 'success' : 'secondary'}
            onClick={toggleScreenShare}
            className="control-btn"
            title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
          >
            <span className="icon">🖥️</span>
            <span className="label">{isScreenSharing ? 'Sharing' : 'Share'}</span>
          </Button>
        </div>

        <div className="controls-group">
          <Button
            variant="secondary"
            className="control-btn"
            title="Show chat"
          >
            <span className="icon">💬</span>
            <span className="label">Chat</span>
          </Button>

          <Button
            variant="secondary"
            className="control-btn"
            onClick={() => setShowParticipants(!showParticipants)}
            title="Toggle participant list"
          >
            <span className="icon">👥</span>
            <span className="label">People</span>
          </Button>

          <Button
            variant="secondary"
            className="control-btn"
            title="More options"
          >
            <span className="icon">⋯</span>
            <span className="label">More</span>
          </Button>
        </div>

        <div className="controls-group">
          <Button
            variant="danger"
            className="control-btn end-call"
            title="End call"
          >
            <span className="icon">📞</span>
            <span className="label">End Call</span>
          </Button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default DashBoard