import React from 'react'
import { useState } from 'react'
import"../styles/dashboardhome.css"
import AiAssistant from './AiAssistant.jsx'
import { PlusIcon, VideoIcon,CalendarSearch } from 'lucide-react'


function DashboardHome() {
      const [isMuted, setIsMuted] = useState(false)
      const [cameraOff, setCameraOff] = useState(false)
      const [isScreenSharing, setIsScreenSharing] = useState(false)
      const [showParticipants, setShowParticipants] = useState(true)
      const toggleMute = () => setIsMuted(!isMuted)
      const toggleCamera = () => setCameraOff(!cameraOff)
      const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing)
  return (
    <div className='home-container'>
        <div className="main-video-area">

  {/* Zoom Quick Actions */}
  <div className="zoom-actions">
    <button className="zoom-btn new-meeting">
     <VideoIcon size={35}  /> </button>
     <h4>Host</h4>
    <button className="zoom-btn join-meeting">
        <PlusIcon size={35} />
     </button>
     <h4>Join</h4>
    <button className="zoom-btn schedule-meeting">
     <CalendarSearch size={35} />
     </button>
     <h4>Schedule</h4>
  </div>

  {/* Video Section */}
  {isScreenSharing ? (
    <div className="screen-share-container medium">
      <div className="screen-placeholder">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M2 17h20" />
        </svg>
        <p>Screen being shared</p>
      </div>
    </div>
  ) : (
    <div className="main-video-container medium">
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
          <AiAssistant />
        </div>
    </div>
  )
}

export default DashboardHome