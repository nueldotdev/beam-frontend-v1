import React from "react";

function buildJitsiUrl({ roomName, displayName }) {
  const safeRoom = (roomName || "beam").replace(/[^a-zA-Z0-9-_]/g, "-");
  const base = `https://meet.jit.si/${encodeURIComponent(safeRoom)}`;

  // Jitsi supports some config via hash fragments.
  // Keep this minimal and robust (no JWT / no custom server required).
  const hashParams = new URLSearchParams();
  hashParams.set("config.prejoinPageEnabled", "false");
  hashParams.set("config.disableDeepLinking", "true");
  if (displayName) hashParams.set("userInfo.displayName", displayName);

  return `${base}#${hashParams.toString()}`;
}

export default function JitsiFrame({ meetingId, displayName }) {
  const roomName = `beam-${meetingId || "new"}`;
  const src = React.useMemo(
    () => buildJitsiUrl({ roomName, displayName }),
    [roomName, displayName]
  );

  return (
    <iframe
      className="jitsi-frame"
      src={src}
      allow="camera; microphone; fullscreen; display-capture; autoplay"
      title="Video call"
    />
  );
}

