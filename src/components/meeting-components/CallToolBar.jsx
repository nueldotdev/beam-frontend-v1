import { useState } from "react";
import { Avatar } from "./Avatar.jsx";
import { ControlButton } from "./ControlButton.jsx";
import { MoreMenu } from "./MoreMenu.jsx";

const Ic = ({ d, size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

const ICONS = {
  micOn:
    "M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z",
  micOff:
    "M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z",
  camOn:
    "M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z",
  camOff:
    "M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z",
  screen:
    "M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zm-7-3.53v-2.19c-2.78.48-4.34 1.71-5.5 3.72.19-1.81 1.11-3.53 5.5-4.2V9.75L16 12.25l-3 2.22z",
  hand: "M21 7c0-1.38-1.12-2.5-2.5-2.5-.19 0-.37.02-.54.06C17.67 3.6 16.74 3 15.5 3c-.19 0-.37.02-.54.06C14.67 2.1 13.74 1.5 12.5 1.5 11.12 1.5 10 2.62 10 4v7.52c-.41-.95-1.26-2.63-1.99-3.32-.65-.61-1.37-.73-1.84-.68-.96.1-1.67.92-1.67 1.84 0 .36.1.7.27 1l4.05 7.58C9.5 19.47 11.14 21 13.5 21c4.14 0 7.5-3.36 7.5-7.5V7z",
  chat: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z",
  docs: "M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z",
  ai: "M19.1 0c-1.3.1-2.9.7-4 1.5-.7.5-1.5 1.4-1.9 2L13 3.9 12.8 3c-.2-.5-1.4-2.2-2.3-3L10.2 0 9.8.7c-1 1.5-1.6 3-2 5.2-.2.6-.4 1-.5.9-.2-.2-.5-.1-1 .2a22 22 0 00-6.1 7.2A8 8 0 000 17.6v1l3 1.8a22.5 22.5 0 0013.1 3.5h.7l2.6-1.3c2.9-1.5 4.6-4 4.6-6.6.1-1.8-.4-3.5-1.7-5.5l-.5-.7-.3-.6a17.2 17.2 0 011.6-4 27.2 27.2 0 00.9-4v-1a4 4 0 00-.7-.2h-4.2zm-2.8 1.4c-.2.1-.3.4-.6.8a13 13 0 00-1 4.5l-.1 1-.9-1.2c-.5-.7-1-1.6-1.1-2l-.1-1L12.3 4a12.8 12.8 0 01-1.4 3l-1.4-2.8a12 12 0 01-.1-2.5h1.2-.2c-1.5 0-3 2.1-3 5-.1.5.1 1.2.6 1.7 1.3 1.2 5.1 4.5 4.8 4-.1-.1-.3-.6-.5-1-.5-1-1.2-2.1-1.5-2.6l-.6-.8 1.1 1.6c.5.8 1.4 2 2 2.6l1 1.3V11l-.8-2c-.9-2.1-1-2.6-.6-3 .3-.3 1 1 2 4.1l.9 2.5v1.2c.1-.5.6-2 .9-3 .6-1.6 1.1-3 1.2-4 .2-1.3.1-1.5-.5-1.7z",
  people:
    "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
  more: "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
  endCall:
    "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
};

export function CallToolbar({
  displayName,
  roomId,
  micOn,
  camOn,
  screenSharing,
  handRaised,
  showChat,
  showParticipants,
  showAi,
  showDocs,
  unreadCount,
  onToggleMic,
  onToggleCam,
  onToggleScreen,
  onToggleHand,
  onOpenChat,
  onOpenParticipants,
  onOpenAi,
  onOpenDocs,
  onEndCall,
}) {
  const [showMore, setShowMore] = useState(false);

  return (
    <footer className="video-controls">
      <div className="video-controls__user">
        <Avatar name={displayName} size="sm" />
        <span className="video-controls__username">{displayName}</span>
      </div>

      <div className="video-controls__center">
        <ControlButton
          onClick={onToggleMic}
          active={micOn}
          title={micOn ? "Mute mic" : "Unmute mic"}
        >
          <Ic d={micOn ? ICONS.micOn : ICONS.micOff} />
        </ControlButton>

        <ControlButton
          onClick={onToggleCam}
          active={camOn}
          title={camOn ? "Stop video" : "Start video"}
        >
          <Ic d={camOn ? ICONS.camOn : ICONS.camOff} />
        </ControlButton>

        <ControlButton
          onClick={onToggleScreen}
          active={screenSharing}
          title={screenSharing ? "Stop sharing" : "Share screen"}
        >
          <Ic d={ICONS.screen} />
        </ControlButton>

        <ControlButton
          onClick={onToggleHand}
          active={handRaised}
          title={handRaised ? "Lower hand" : "Raise hand"}
        >
          <Ic d={ICONS.hand} />
        </ControlButton>

        <div className="video-controls__divider" aria-hidden="true" />

        <ControlButton onClick={onOpenDocs} active={showDocs} title="Documents">
            <Ic d={ICONS.docs} />
        </ControlButton>
        
        <ControlButton onClick={onOpenAi} active={showAi} title="Amazon Nova AI">
            <Ic d={ICONS.ai} />
        </ControlButton>

        <div className="video-controls__badge-wrap">
          <ControlButton onClick={onOpenChat} active={showChat} title="Chat">
            <Ic d={ICONS.chat} />
          </ControlButton>
          {unreadCount > 0 && !showChat && (
            <span className="chat-badge" aria-label={`${unreadCount} unread`}>
              {unreadCount}
            </span>
          )}
        </div>

        <ControlButton
          onClick={onOpenParticipants}
          active={showParticipants}
          title="Participants"
        >
          <Ic d={ICONS.people} />
        </ControlButton>

        <div className="video-controls__badge-wrap">
          <ControlButton
            onClick={() => setShowMore((v) => !v)}
            active={showMore}
            title="More options"
          >
            <Ic d={ICONS.more} />
          </ControlButton>
          {showMore && (
            <MoreMenu roomId={roomId} onClose={() => setShowMore(false)} />
          )}
        </div>

        <div className="video-controls__divider" aria-hidden="true" />

        <ControlButton onClick={onEndCall} danger title="Leave call">
          <Ic d={ICONS.endCall} size={22} />
        </ControlButton>
      </div>
    </footer>
  );
}
