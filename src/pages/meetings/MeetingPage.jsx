import { useState, useRef, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import { useJitsi } from "../../components/hooks/useJitsi.js";
import { useCallTimer } from "../../components/hooks/useCallTimer.js";
import { useTranscription } from "../../components/hooks/useTranscription.js";
import { resolveRoomId } from "../../utils/meetingHelpers.js";
import { CallTopBar } from "../../components/meeting-components/CallTopBar.jsx";
import { CallToolbar } from "../../components/meeting-components/CallToolBar.jsx";
import { ChatPanel } from "../../components/meeting-components/ChatPanel.jsx";
import { ParticipantsPanel } from "../../components/meeting-components/ParticipantsPanel.jsx";
import { AiChatPanel } from "../../components/meeting-components/AiChatPanel.jsx";
import { DocumentSidebar } from "../../components/meeting-components/DocumentSidebar.jsx";
import { SharedDocumentViewer } from "../../components/meeting-components/SharedDocumentViewer.jsx";
import { TranscriptPanel } from "../../components/meeting-components/TranscriptPanel.jsx";

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
  const [showAi, setShowAi] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [transcripts, setTranscripts] = useState([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [participants, setParticipants] = useState([
    { name: displayName, isSelf: true, audioMuted: !startMicOn },
  ]);

  const [jaasCredentials, setJaasCredentials] = useState(null);
  const [loadingCredentials, setLoadingCredentials] = useState(true);
  const [credentialsError, setCredentialsError] = useState(null);

  // Synchronized Document State
  const [presentState, setPresentState] = useState(null); // { docId, url, page }
  const [followHost, setFollowHost] = useState(true);

  const [meetingEndedMsg, setMeetingEndedMsg] = useState(null);

  const jitsiContainerRef = useRef(null);
  const socketRef = useRef(null);
  const { formatted: formattedTime } = useCallTimer();

  // Socket connection to send transcriptions and handle documents
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL?.replace('/api/v1', '') || "http://localhost:3000"); // replace with API endpoint from env in prod

    socketRef.current.emit("meeting:join", {
      meetingKey: roomId,
      displayName,
      role: state?.role ?? "participant",
    }, (res) => {
       if (res?.present) {
          setPresentState(res.present);
       }
    });

    socketRef.current.on("present:updated", (data) => {
        // If host stopped presenting (null), always clear for everyone
        if (data.present === null) {
            setPresentState(null);
        } else if (followHost) {
            // Otherwise only sync pages if participant is following the host
            setPresentState(data.present);
        }
    });

    socketRef.current.on("meeting:ended", (data) => {
        setMeetingEndedMsg(data.message || "The host has ended the meeting.");
    });

    socketRef.current.on("transcript:chunk", (chunk) => {
        if (chunk.isFinal) {
            setTranscripts((prev) => [...prev, chunk]);
        }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [roomId, displayName, state, followHost]);

  // Fetch JaaS Credentials
  useEffect(() => {
    let mounted = true;

    const fetchCredentials = async () => {
      try {
        setLoadingCredentials(true);
        const token = localStorage.getItem('authToken');
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
        
        const response = await fetch(`${apiUrl}/meetings/${roomId}/jaas-jwt?name=${encodeURIComponent(displayName)}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (data.success && mounted) {
           setJaasCredentials({
              appId: data.data.appId,
              jwt: data.data.token
           });
        } else if (mounted) {
           setCredentialsError(data.message || 'Failed to fetch meeting credentials');
        }
      } catch (err) {
         if (mounted) setCredentialsError(err.message);
      } finally {
         if (mounted) setLoadingCredentials(false);
      }
    };

    fetchCredentials();

    return () => {
      mounted = false;
    };
  }, [roomId]);

  // Fetch initial transcripts on load
  useEffect(() => {
    let mounted = true;
    const fetchTranscripts = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
        const response = await fetch(`${apiUrl}/meetings/${roomId}/transcripts`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const data = await response.json();
        if (data.success && mounted) {
          setTranscripts(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch initial transcripts:", err);
      }
    };
    fetchTranscripts();
    return () => { mounted = false; };
  }, [roomId]);

  // Proactive token refresh — the default JWT expires in 1h.
  // While in a meeting we re-issue a fresh 8h token every 45 minutes so
  // the host's session never drops mid-call.
  useEffect(() => {
    const REFRESH_INTERVAL_MS = 45 * 60 * 1000; // 45 minutes

    const refresh = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return; // guest user, nothing to refresh
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        const res = await fetch(`${apiUrl}/auth/refresh`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.token) {
            localStorage.setItem('authToken', data.token);
          }
        }
      } catch {
        // Silent — if refresh fails, user will just hit auth later; not worth interrupting the call
      }
    };

    const interval = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Hook into Speech Recognition to track audio and send chunks to backend
  useTranscription({
    micOn,
    onTranscriptChunk: (content) => {
      if (socketRef.current) {
        socketRef.current.emit("transcript:chunk", { content, isFinal: true });
      }
    },
  });

  const { executeCommand } = useJitsi({
    appId: jaasCredentials?.appId,
    jwt: jaasCredentials?.jwt,
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

  useEffect(() => {
    if (meetingEndedMsg) {
      alert(meetingEndedMsg);
      // Use hard navigation instead of React navigate+reload combo:
      // navigate() triggers a soft route change and then reload() interrupts it, causing blank screen.
      executeCommand("hangup");
      window.location.href = `/meetings/entry/${roomId}`;
    }
  }, [meetingEndedMsg, executeCommand, roomId]);

  const openChat = () => {
    setShowChat(true);
    setShowParticipants(false);
    setShowAi(false);
    setShowDocs(false);
    setUnreadCount(0);
  };
  const openParticipants = () => {
    setShowParticipants(true);
    setShowChat(false);
    setShowAi(false);
    setShowDocs(false);
  };
  const openAi = () => {
    setShowAi(true);
    setShowParticipants(false);
    setShowChat(false);
    setShowDocs(false);
  };
  const openDocs = () => {
    setShowDocs(true);
    setShowAi(false);
    setShowParticipants(false);
    setShowChat(false);
    setShowTranscript(false);
  };
  const openTranscript = () => {
    setShowTranscript(true);
    setShowDocs(false);
    setShowAi(false);
    setShowParticipants(false);
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
    if (state?.role === "host") {
      const confirmEnd = window.confirm("Do you want to end the meeting for everyone?");
      if (confirmEnd) {
        // Emit to kick everyone else out, then navigate HOST away immediately.
        // Don't wait for the socket echo — the host's event loop can't reliably
        // receive the 'meeting:ended' broadcast it just triggered.
        socketRef.current?.emit("meeting:end");
        executeCommand("hangup");
        window.location.href = `/meetings/entry/${roomId}`;
        return;
      }
    }
    
    // Participant behavior: just leave the room
    executeCommand("hangup");
    window.location.href = `/meetings/entry/${roomId}`;
  };

  if (loadingCredentials) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#111', color: 'white' }}>
        <h2>Provisioning Meeting Securely...</h2>
      </div>
    );
  }

  if (credentialsError) {
     return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#111', color: '#ff4444' }}>
          <h2>Meeting Access Error</h2>
          <p>{credentialsError}</p>
          <button 
            style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', background: '#333', color: 'white', border: 'none', borderRadius: '5px' }}
            onClick={() => navigate('/dashboard')}
          >
             Return to Dashboard
          </button>
        </div>
     );
  }

  return (
    <div className="video-page">
      <CallTopBar roomId={roomId} formattedTime={formattedTime} />

      <div className="video-body" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {presentState?.url && (
            <div style={{ flex: 1, minWidth: '400px', height: '100%', borderRight: '1px solid #333' }}>
              <SharedDocumentViewer 
                 url={presentState.url}
                 page={presentState.page || 1}
                 fileType={presentState.fileType || 'pdf'}
                 isHost={state?.role === 'host'}
                 followHost={followHost}
                 onPageChange={(page) => {
                    setPresentState(prev => ({...prev, page}));
                    setFollowHost(false); // decoupled from host
                    socketRef.current.emit("browse:update", { page });
                    if (state?.role === "host") {
                       socketRef.current.emit("present:update", { page });
                    }
                 }}
                 onToggleFollow={() => {
                    setFollowHost(true);
                    socketRef.current.emit("meeting:set_follow_host", { followHost: true });
                 }}
                 onStopPresenting={state?.role === 'host' ? () => {
                    setPresentState(null);
                    socketRef.current.emit("present:update", { url: null, docId: null, page: 1, fileType: null });
                 } : null}
              />
            </div>
        )}

        {/* Ensure Jitsi container adapts its width based on presentation */}
        <div 
          ref={jitsiContainerRef} 
          className="video-jitsi-container" 
          style={{ flex: presentState?.url ? 1 : 2, height: '100%', transition: 'all 0.3s' }} 
        />

        {showChat && (
          <ChatPanel
            messages={messages}
            onSend={handleSendMessage}
            onClose={() => setShowChat(false)}
          />
        )}
        {showParticipants && (
          <ParticipantsPanel
            participants={participants}
            onClose={() => setShowParticipants(false)}
          />
        )}
        {showAi && (
          <AiChatPanel 
            roomId={roomId} 
            onClose={() => setShowAi(false)} 
          />
        )}
        {showDocs && (
          <DocumentSidebar 
            meetingId={roomId} 
            onClose={() => setShowDocs(false)} 
            onPresentDocument={(doc) => {
                const payload = { url: doc.fileUrl, docId: doc._id, page: 1, fileType: doc.fileType || 'pdf' };
                setPresentState(payload);
                socketRef.current.emit("present:update", payload);
                setShowDocs(false);
            }}
          />
        )}
        {showTranscript && (
          <TranscriptPanel 
            transcripts={transcripts}
            onClose={() => setShowTranscript(false)}
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
        showAi={showAi}
        showDocs={showDocs}
        showTranscript={showTranscript}
        unreadCount={unreadCount}
        onToggleMic={handleToggleMic}
        onToggleCam={handleToggleCam}
        onToggleScreen={handleToggleScreen}
        onToggleHand={handleToggleHand}
        onOpenChat={openChat}
        onOpenParticipants={openParticipants}
        onOpenAi={openAi}
        onOpenDocs={openDocs}
        onOpenTranscript={openTranscript}
        onEndCall={handleEndCall}
      />
    </div>
  );
}
