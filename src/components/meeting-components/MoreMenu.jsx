import { useEffect, useRef } from "react";
import { buildInviteLink } from "../../utils/meetingHelpers";

export function MoreMenu({ roomId, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [onClose]);

  const copyLink = () => {
    navigator.clipboard
      .writeText(buildInviteLink(roomId))
      .then(() => alert("Invite link copied!"))
      .catch(() => alert("Could not copy — please copy the URL manually."));
    onClose();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    onClose();
  };

  return (
    <div className="more-menu" role="menu" ref={menuRef}>
      <button className="more-menu__item" role="menuitem" onClick={copyLink}>
        <span className="more-menu__item-icon" aria-hidden="true">
          🔗
        </span>
        Copy invite link
      </button>

      <button
        className="more-menu__item"
        role="menuitem"
        onClick={toggleFullscreen}
      >
        <span className="more-menu__item-icon" aria-hidden="true">
          ⛶
        </span>
        Toggle fullscreen
      </button>

      <div className="more-menu__divider" role="separator" />

      <button
        className="more-menu__item more-menu__item--danger"
        role="menuitem"
        onClick={onClose}
      >
        <span className="more-menu__item-icon" aria-hidden="true">
          ✕
        </span>
        Close menu
      </button>
    </div>
  );
}
