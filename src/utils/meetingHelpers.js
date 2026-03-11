// ─── URL Helpers ─────────────────────────────────────────────────────────────

/**
 * Reads `?room=` from the current URL.
 * Falls back to a random short ID if not present.
 */
export const getRoomFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("room") || `room-${Math.random().toString(36).slice(2, 8)}`;
};

/**
 * Returns the room ID from the React Router URL param,
 * falling back to ?room= query param, then a random ID.
 *
 * Usage: const { id } = useParams(); const roomId = resolveRoomId(id);
 */
export const resolveRoomId = (paramId) => {
  if (paramId) return paramId;
  const qp = new URLSearchParams(window.location.search).get("room");
  if (qp) return qp;
  return `room-${Math.random().toString(36).slice(2, 8)}`;
};

/**
 * Builds a shareable invite link for the given roomId.
 */
export const buildInviteLink = (roomId) =>
  `${window.location.origin}${window.location.pathname}?room=${roomId}`;

// ─── Time Helpers ─────────────────────────────────────────────────────────────

/**
 * Formats a duration in seconds as HH:MM:SS or MM:SS.
 * @param {number} totalSeconds
 * @returns {string}
 */
export const formatDuration = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");

  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

// ─── Avatar Helpers ───────────────────────────────────────────────────────────

/**
 * Derives initials (up to 2 chars) from a display name.
 * @param {string} name
 * @returns {string}
 */
export const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/**
 * Generates a deterministic HSL hue from a name string.
 * @param {string} name
 * @returns {number} hue 0–359
 */
export const nameToHue = (name = "") =>
  [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
