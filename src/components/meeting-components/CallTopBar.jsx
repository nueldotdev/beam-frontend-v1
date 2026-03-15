import { buildInviteLink } from "../../utils/meetingHelpers";
export function CallTopBar({ roomId, formattedTime }) {
  const copyInviteLink = () => {
    navigator.clipboard
      .writeText(buildInviteLink(roomId))
      .then(() => alert("Invite link copied!"))
      .catch(() => alert("Could not copy — please copy the URL manually."));
  };

  return (
    <header className="video-topbar">
      <div className="video-topbar__room">
        <span className="video-topbar__live-dot" aria-hidden="true" />
        <span className="video-topbar__room-name">{roomId}</span>
      </div>

      <span className="video-topbar__timer" aria-label="Call duration">
        {formattedTime}
      </span>

      <button className="video-topbar__invite" onClick={copyInviteLink}>
        <span className="video-topbar__invite-icon" aria-hidden="true">
          🔗
        </span>
        <span className="video-topbar__invite-label">Copy invite</span>
      </button>
    </header>
  );
}
