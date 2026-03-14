import React from 'react'
import "../styles/dashboardtabs.css"
import { useState } from 'react'
import Participants from './Participants';
import Chat from './Chat';


function DashboardTabs() {
    const [activeTab, setActiveTab] = useState("participants"); // default tab
  return (
    <div className="gallery-container">
      {/* Header / Tabs */}
      <div className="gallery-header">
        <button
          className={`tab-btn ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          Chat
        </button>
        <button
          className={`tab-btn ${activeTab === "participants" ? "active" : ""}`}
          onClick={() => setActiveTab("participants")}
        >
          Participants
        </button>
        <button
          className="btn-toggle-gallery"
          onClick={() => console.log("Collapse gallery")}
          title="Collapse gallery"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      
      <div className="gallery-content">
        {activeTab === "chat" && (
          <div className="chat-tab">
            <Chat />
          </div>
        )}
        {activeTab === "participants" && (
          <div className="participants-tab">
           <Participants />
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardTabs