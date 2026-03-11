import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../styles/meeting.css";
import MeetingControls from "./meeting-components/MeetingControls";
import MeetingSidebar from "./meeting-components/MeetingSidebar";
import VideoTile from "./meeting-components/VideoTile";
import JitsiFrame from "./meeting-components/JitsiFrame";
import { createMeetingSocket } from "../utils/socket";

function LiveMeeting({ host, participants, onAddParticipant, onRemoveParticipant }) {
  const navigate = useNavigate();
  const params = useParams();
  const { state } = useLocation();
  const { role, name, meetingId: meetingIdFromState, permission, camStream } =
    state || {};
  const meetingId = meetingIdFromState || params?.id || "new";
  const meetingKey = meetingId;

  // Initialize mic/camera state based on permission from MeetingEntry
  const [isMuted, setIsMuted] = React.useState(!permission?.mic) // true if mic off
  const [cameraOff, setCameraOff] = React.useState(!permission?.camera) // true if camera off
  const [sidebarTab, setSidebarTab] = React.useState(null)
  const [socket, setSocket] = React.useState(null)
  const [roster, setRoster] = React.useState([])
  const [present, setPresent] = React.useState({ docId: null, page: 1, url: null })
  const [followHost, setFollowHost] = React.useState(role !== "host")

  const toggleSidebar = (tab) => setSidebarTab(prev => prev === tab ? null : tab)

  React.useEffect(() => {
    const s = createMeetingSocket();
    setSocket(s);

    s.on("connect", () => {
      s.emit(
        "meeting:join",
        { meetingKey, displayName: name || host?.name || "You", role: role === "host" ? "host" : "participant" },
        (ack) => {
          if (!ack?.ok) {
            console.error("join failed", ack?.error);
            return;
          }
          setPresent(ack.present || { docId: null, page: 1, url: null });
          setRoster(ack.roster || []);
        }
      );
    });

    const onRoster = (payload) => setRoster(payload?.roster || []);
    const onPresent = (payload) => setPresent(payload?.present || { docId: null, page: 1, url: null });

    s.on("meeting:roster", onRoster);
    s.on("present:updated", onPresent);

    return () => {
      s.off("meeting:roster", onRoster);
      s.off("present:updated", onPresent);
      s.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingKey]);

  const isHost = role === "host";

  return (
    <div className="live-meeting">

      <div className={`meeting-body ${sidebarTab ? "meeting-body--with-sidebar" : ""}`}>
        <div className="video-grid">
          <JitsiFrame meetingId={meetingId} displayName={name || host?.name || "You"} />
          <VideoTile
            name={name || host?.name || "You"}
            initials={(name || host?.name || "You")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || "?"}
            isMuted={isMuted}
            cameraOff={cameraOff}
            stream={camStream}
          />
        </div>
      </div>

      {sidebarTab && (
        <MeetingSidebar
          tab={sidebarTab}
          onTabChange={setSidebarTab}
          onClose={() => setSidebarTab(null)}
          host={host}
          participants={roster.filter((p) => p.role !== "host").map((p) => ({
            id: p.socketId,
            name: p.displayName,
            initials: (p.displayName || "?").split(" ").map((n) => n[0]).join("").toUpperCase(),
            isMuted: false,
            cameraOff: false,
          }))}
          onAddParticipant={onAddParticipant}
          onRemoveParticipant={onRemoveParticipant}
          socket={socket}
          meetingKey={meetingKey}
          displayName={name || host?.name || "You"}
          isHost={isHost}
          present={present}
          followHost={followHost}
          onFollowHostChange={(v) => {
            setFollowHost(v);
            socket?.emit?.("meeting:set_follow_host", { followHost: v });
          }}
        />
      )}

      <MeetingControls
        isMuted={isMuted}
        cameraOff={cameraOff}
        isHost={isHost}
        sidebarTab={sidebarTab}
        onToggleTranscribe={() => toggleSidebar("transcribe")}
        onToggleDocs={() => toggleSidebar("docs")}
        onToggleMic={() => setIsMuted(prev => !prev)}
        onToggleVideo={() => setCameraOff(prev => !prev)}
        onToggleParticipants={() => toggleSidebar("participants")}
        onToggleChat={() => toggleSidebar("chat")}
        onEndCall={() => navigate("/dashboard/home")}
      />

    </div>
  );
}

export default LiveMeeting;