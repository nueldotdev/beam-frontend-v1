import { useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import { useJitsi } from "../../components/hooks/Usejitsi.js";
import { useCallTimer } from "../../components/hooks/useCallTimer.js";
import { resolveRoomId } from "../../utils/meetingHelpers.js";
import { CallTopBar } from "../../components/meeting-components/CallTopBar.jsx";
import { CallToolbar } from "../../components/meeting-components/CallToolBar.jsx";
import { ChatPanel } from "../../components/meeting-components/ChatPanel.jsx";
import { ParticipantsPanel } from "../../components/meeting-components/ParticipantsPanel.jsx";

import "../../styles/meeting-styles/meetingPage.css";
export default function MeetingPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // Map MeetingEntry's exact state shape
  const displayName = state?.name ?? "Guest";
  const roomId = resolveRoomId(state?.meetingId || id);
  const startMicOn = state?.permission?.mic ?? true;
  const startCamOn = state?.permission?.camera ?? true;

  const [micOn, setMicOn] = useState(startMicOn);
  const [camOn, setCamOn] = useState(startCamOn);
  const [screenSharing, setScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [participants, setParticipants] = useState([
    { name: displayName, isSelf: true, audioMuted: !startMicOn },
  ]);

  const jitsiContainerRef = useRef(null);
  const { formatted: formattedTime } = useCallTimer();

  const { executeCommand } = useJitsi({
    roomId,
    displayName,
    startMicOn,
    startCamOn,
    containerRef: jitsiContainerRef,
    callbacks: {
      onAudioMuteChange: (muted) => setMicOn(!muted),
      onVideoMuteChange: (muted) => setCamOn(!muted),
      onScreenShareChange: (on) => setScreenSharing(on),
      onParticipantJoined: ({ id: pid, name }) =>
        setParticipants((prev) => [
          ...prev,
          { id: pid, name, isSelf: false, audioMuted: false },
        ]),
      onParticipantLeft: ({ id: pid }) =>
        setParticipants((prev) => prev.filter((p) => p.id !== pid)),
      onMessageReceived: ({ from, message }) => {
        setMessages((prev) => [
          ...prev,
          { sender: from, text: message, self: false },
        ]);
        setUnreadCount((c) => c + 1);
      },
    },
  });

  const openChat = () => {
    setShowChat(true);
    setShowParticipants(false);
    setUnreadCount(0);
  };
  const openParticipants = () => {
    setShowParticipants(true);
    setShowChat(false);
  };

  const handleToggleMic = () => {
    executeCommand("toggleAudio");
    setMicOn((v) => !v);
  };
  const handleToggleCam = () => {
    executeCommand("toggleVideo");
    setCamOn((v) => !v);
  };
  const handleToggleScreen = () => executeCommand("toggleShareScreen");
  const handleToggleHand = () => {
    executeCommand("toggleRaiseHand");
    setHandRaised((v) => !v);
  };

  const handleSendMessage = (text) => {
    executeCommand("sendChatMessage", text);
    setMessages((prev) => [...prev, { sender: "You", text, self: true }]);
  };

  const handleEndCall = () => {
    executeCommand("hangup");
    navigate(`/meetings/entry/${roomId}`, {
      state: { role: state?.role ?? "participant" },
    });
  };

  return (
    <div className="video-page">
      <CallTopBar roomId={roomId} formattedTime={formattedTime} />

      <div className="video-body">
        <div ref={jitsiContainerRef} className="video-jitsi-container" />

        {showChat && (
          <ChatPanel
            messages={messages}
            onSend={handleSendMessage}
            onClose={() => setShowChat(false)}
          />
        )}
        {showParticipants && !showChat && (
          <ParticipantsPanel
            participants={participants}
            onClose={() => setShowParticipants(false)}
          />
        )}
      </div>

      <CallToolbar
        displayName={displayName}
        roomId={roomId}
        micOn={micOn}
        camOn={camOn}
        screenSharing={screenSharing}
        handRaised={handRaised}
        showChat={showChat}
        showParticipants={showParticipants}
        unreadCount={unreadCount}
        onToggleMic={handleToggleMic}
        onToggleCam={handleToggleCam}
        onToggleScreen={handleToggleScreen}
        onToggleHand={handleToggleHand}
        onOpenChat={openChat}
        onOpenParticipants={openParticipants}
        onEndCall={handleEndCall}
      />
    </div>
  );
}
