import React from "react";
import "../../styles/meeting-styles/live.css";
import { RiVoiceAiLine } from "react-icons/ri";
import { AlignCenter } from "lucide-react";
import Transciption from "../Transcription";

function MeetingSidebar({ tab, onTabChange, onClose, host, participants, onAddParticipant, onRemoveParticipant }) {
  const [newName, setNewName] = React.useState("");
  const totalCount = (participants?.length || 0) + 1;

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onAddParticipant?.(trimmed);
    setNewName("");
  };

  return (
    <aside className="meeting-sidebar">

      <div className="sidebar-header">
        <div className="sidebar-tabs">
          <button
            className={`sidebar-tab ${tab === "participants" ? "sidebar-tab--active" : ""}`}
            onClick={() => onTabChange("participants")}
          >
            People ({totalCount})
          </button>
          <button
            className={`sidebar-tab ${tab === "chat" ? "sidebar-tab--active" : ""}`}
            onClick={() => onTabChange("chat")}
          >
            Chat
          </button>
           <button
            className={`sidebar-tab ${tab === "transcribe" ? "sidebar-tab--active" : ""}`}
            onClick={() => onTabChange("transcribe")}
          >
            Transcribe
          </button>
        </div>
        <button className="sidebar-close" onClick={onClose}>✕</button>
      </div>

      <div className="sidebar-content">
        {tab === "participants" && (
          <div className="sidebar-participants">

            {/* Host row */}
            <div className="participant-row">
              <div className="participant-row__avatar">{host?.initials || "?"}</div>
              <span className="participant-row__name">
                {host?.name || "You"} <span className="badge">Host</span>
              </span>
            </div>

            {/* Participant rows */}
            {participants?.map((p) => (
              <div key={p.id} className="participant-row">
                <div className="participant-row__avatar">
                  {p.initials || p.name?.[0]?.toUpperCase()}
                </div>
                <span className="participant-row__name">{p.name}</span>
                <div className="participant-row__icons">
                  {p.isMuted && <span>🔇</span>}
                  {p.cameraOff && <span>📷</span>}
                  <button
                    className="participant-row__remove"
                    onClick={() => onRemoveParticipant?.(p.id)}
                  >✕</button>
                </div>
              </div>
            ))}

            {/* Add participant */}
            <div className="sidebar-add">
              <input
                type="text"
                placeholder="Add participant..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              <button onClick={handleAdd}>Add</button>
            </div>

          </div>
        )}

        {tab === "chat" && (
          <div className="sidebar-chat">
            <p className="sidebar-empty">Chat coming soon.</p>
          </div>
        )}

        {tab === "transcribe" && (
          <div className="sidebar-transcribe">
          <Transciption />
          </div>
        )}

      </div>

    </aside>
  );
}

export default MeetingSidebar;