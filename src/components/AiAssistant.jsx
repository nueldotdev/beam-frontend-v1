import React, { useState } from "react";
import Notification from "./Notification.jsx";
import History from "./History.jsx";
import {
  HistoryIcon,
  Bell,
  ArrowLeft,
  Sparkles,
  SendHorizonal
} from "lucide-react";

function AiAssistant() {
  const [activeTab, setActiveTab] = useState(null);
  const [message, setMessage] = useState("");

  const suggestions = [
    "What can you help me with?",
    "Summarize my recent activity",
    "Show my notifications",
    "Explain this project"
  ];

  return (
    <div className="ai-container">

      {/* Header */}
      <div className="ai-header">

        {activeTab !== null && (
          <button
            className="icon-btn"
            onClick={() => setActiveTab(null)}
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <h3 className="ai-title">AI Assistant</h3>

        <div className="header-actions">
          <button
            className={`icon-btn ${activeTab === "chat" ? "active" : ""}`}
            onClick={() =>
              setActiveTab(activeTab === "chat" ? null : "chat")
            }
          >
            <HistoryIcon size={20} />
          </button>
          <button
            className={`icon-btn ${
              activeTab === "notifications" ? "active" : ""
            }`}
            onClick={() =>
              setActiveTab(
                activeTab === "notifications" ? null : "notifications"
              )
            }
          >
            <Bell size={20} />
          </button>
        </div>

      </div>

      {/* Content */}
      <div className="ai-content">

        {/* Default Assistant Screen */}
        {activeTab === null && (
          <div className="assistant-home">

            <Sparkles className="assistant-icon" size={42} />

            {/* Suggestions */}
            <div className="suggestions-grid">
              {suggestions.map((text, index) => (
                <button
                  key={index}
                  className="suggestion-card"
                  onClick={() => setMessage(text)}
                >
                  {text}
                </button>
              ))}
            </div>

          </div>
        )}

        {/* History */}
        {activeTab === "chat" && <History />}

        {/* Notifications */}
        {activeTab === "notifications" && <Notification />}

      </div>

      {/* Input (always visible like Zoom UI) */}
      <div className="ai-input-container">

        <input
          type="text"
          placeholder="Write a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="ai-input"
        />

        <button className="send-btn">
          <SendHorizonal size={18} />
        </button>

      </div>

      <p className="ai-footer">
        AI can make mistakes. Review for accuracy.
      </p>

    </div>
  );
}

export default AiAssistant;