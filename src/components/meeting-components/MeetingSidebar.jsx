import React from "react";
import "../../styles/meeting-styles/live.css";
import MeetingChatPanel from "./MeetingChatPanel";
import MeetingDocsPanel from "./MeetingDocsPanel";
import MeetingTranscribePanel from "./MeetingTranscribePanel";
import MeetingAiPanel from "./MeetingAiPanel";

function MeetingSidebar({
  tab,
  onTabChange,
  onClose,
  host,
  participants,
  onAddParticipant,
  onRemoveParticipant,
  socket,
  meetingKey,
  displayName,
  isHost,
  present,
  followHost,
  onFollowHostChange,
}) {
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
            className={`sidebar-tab ${tab === "docs" ? "sidebar-tab--active" : ""}`}
            onClick={() => onTabChange("docs")}
          >
            Docs
          </button>
          <button
            className={`sidebar-tab ${tab === "chat" ? "sidebar-tab--active" : ""}`}
            onClick={() => onTabChange("chat")}
          >
            Chat
          </button>
          <button
            className={`sidebar-tab ${tab === "ai" ? "sidebar-tab--active" : ""}`}
            onClick={() => onTabChange("ai")}
          >
            AI
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

        {tab === "docs" && (
          <MeetingDocsPanel
            meetingKey={meetingKey}
            isHost={isHost}
            socket={socket}
            present={present}
            followHost={followHost}
            onFollowHostChange={onFollowHostChange}
          />
        )}

        {tab === "chat" && (
          <div className="sidebar-chat">
            <MeetingChatPanel socket={socket} meetingKey={meetingKey} displayName={displayName} />
          </div>
        )}

        {tab === "ai" && (
          <div className="sidebar-ai" style={{ height: "100%" }}>
            <MeetingAiPanel meetingKey={meetingKey} />
          </div>
        )}

        {tab === "transcribe" && (
          <div className="sidebar-transcribe">
            <MeetingTranscribePanel socket={socket} meetingKey={meetingKey} displayName={displayName} />
          </div>
        )}

      </div>

    </aside>
  );
}

export default MeetingSidebar;