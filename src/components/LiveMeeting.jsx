import React from 'react'

function LiveMeeting() {
  
  return (
    <div>
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
    </div>
  )
}

export default LiveMeeting