import React from "react";
import { useLocation } from "react-router-dom";
import "../styles/meeting.css";
import MeetingControls from "./meeting-components/MeetingControls";
import MeetingSidebar from "./meeting-components/MeetingSidebar";
import VideoTile from "./meeting-components/VideoTile";

function LiveMeeting({
  host,
  participants,
  onAddParticipant,
  onRemoveParticipant,
}) {
  const { state } = useLocation();
  const { role, name, meetingId, permission, camStream } = state || {};

  // Initialize mic/camera state based on permission from MeetingEntry
  const [isMuted, setIsMuted] = React.useState(!permission?.mic); // true if mic off
  const [cameraOff, setCameraOff] = React.useState(!permission?.camera); // true if camera off
  const [sidebarTab, setSidebarTab] = React.useState(null);

  const toggleSidebar = (tab) =>
    setSidebarTab((prev) => (prev === tab ? null : tab));

  return (
    <div className="live-meeting">
      <div
        className={`meeting-body ${sidebarTab ? "meeting-body--with-sidebar" : ""}`}
      >
        <div className="video-grid">
          <VideoTile
            name={name || host?.name || "You"} // full name in caps
            initials={
              (name || host?.name || "You")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "?"
            } // initials in caps
            isMuted={isMuted}
            cameraOff={cameraOff}
            role={role || "host"}
            isSelf
          />
          {participants?.map((p) => (
            <VideoTile
              key={p.id}
              name={p.name}
              initials={p.initials}
              isMuted={p.isMuted}
              cameraOff={p.cameraOff}
              role="participant"
              onRemove={() => onRemoveParticipant?.(p.id)}
            />
          ))}
        </div>
      </div>

      {sidebarTab && (
        <MeetingSidebar
          tab={sidebarTab}
          onTabChange={setSidebarTab}
          onClose={() => setSidebarTab(null)}
          host={host}
          participants={participants}
          onAddParticipant={onAddParticipant}
          onRemoveParticipant={onRemoveParticipant}
        />
      )}

      <MeetingControls
        isMuted={isMuted}
        cameraOff={cameraOff}
        isHost={role === "host"}
        sidebarTab={sidebarTab}
        onToggleTranscribe={() => toggleSidebar("transcribe")}
        onToggleMic={() => setIsMuted((prev) => !prev)}
        onToggleVideo={() => setCameraOff((prev) => !prev)}
        onToggleParticipants={() => toggleSidebar("participants")}
        onToggleChat={() => toggleSidebar("chat")}
      />
    </div>
  );
}

export default LiveMeeting;
