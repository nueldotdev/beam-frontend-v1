import { io } from "socket.io-client";

function inferWsUrl(apiUrl) {
  // If API_BASE_URL is like "http://localhost:3000/api", sockets run on same origin without "/api".
  try {
    const u = new URL(apiUrl);
    u.pathname = "";
    u.search = "";
    u.hash = "";
    return u.toString().replace(/\/$/, "");
  } catch {
    return apiUrl;
  }
}

export function createMeetingSocket() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const wsUrl = import.meta.env.VITE_WS_URL || inferWsUrl(apiUrl);
  const token = localStorage.getItem("authToken");

  return io(wsUrl, {
    transports: ["websocket"],
    auth: token ? { token } : {},
  });
}

