import React, { useState } from 'react'
import '../styles/dashboard.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Button from '../components/Button'
import Sidebar from '../components/Sidebar'
import Participants from '../components/Participants'
import Chat from '../components/Chat'
import DashboardTabs from '../components/DashboardTabs'
import DashboardHome from '../components/DashboardHome'
import genimage from '../assets/dashboard-images/generative-aiicon.png'

function DashBoard() {
  const [isMuted, setIsMuted] = useState(false)
  const [cameraOff, setCameraOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [showParticipants, setShowParticipants] = useState(true)
  const toggleMute = () => setIsMuted(!isMuted)
  const toggleCamera = () => setCameraOff(!cameraOff)
  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing)

   const profile = {
      name: "John Doe",
      email: "john.doe@example.com"
    }
  return (
   
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, <span>{profile.name}</span></h1>
      {/* Profile section */}
      <div className="header-profile">
        <div className="header-icons">
          <img className="header-icon-btn" title="Ai" src={genimage} />
        </div >

         <div className="profile-avatar">JD</div>
      </div>

        {/* <div className="header-stats">
          <span className="participant-count">{participants.length} Participants</span>
          <span className="call-duration">45:32</span>
        </div> */}
      </div>

      <div className="dashboard-content">
        <Routes>
          {/* Default redirect when /dashboard is hit */}
            <Route path="/" element={<Navigate to="home" />} />
          <Route path="home" element={<DashboardHome />} />
        </Routes>
      </div>

      </div>
    </div>
  )
}

export default DashBoard