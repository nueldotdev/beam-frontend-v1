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
import LiveMeeting from "../components/LiveMeeting"
import  Settings  from '../components/Settings.jsx'
import Meetings from '../components/Meetings.jsx'
import Docs from "../components/Docs.jsx"

function DashBoard() {

const user = JSON.parse(localStorage.getItem("user")) || {};
const name = user?.profile?.firstName || "User";

const profileCaps = name[0].toUpperCase() + name.slice(1);
const profileInitials = name.split(" ").map(n => n[0]).join("").toUpperCase();

  return (
   
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, <span>{profileCaps}</span></h1>
      {/* Profile section */}
      <div className="header-profile">
        <div className="header-icons">
          <img className="header-icon-btn" title="Ai" src={genimage} />
        </div >

         <div className="profile-avatar">{profileInitials}</div>
      </div>

        {/* <div className="header-stats">
          <span className="participant-count">{participants.length} Participants</span>
          <span className="call-duration">45:32</span>
        </div> */}
      </div>

      <div className="dashboard-content">
        <Routes>
        <Route path="/home" element={<DashboardHome profileInitials={profileInitials}  />} />
          <Route path='/meetings' element={<Meetings  />} />
          <Route path='/meetings/live/:id' element={<LiveMeeting />} />
          <Route path='/chat' element={<Chat/>}/>
          <Route path="/settings" element={<Settings/>}/>
          <Route path='/docs' element={<Docs/>}/>
        </Routes>
      </div>

      </div>
    </div>
  )
}

export default DashBoard