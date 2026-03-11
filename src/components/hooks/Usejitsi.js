import { useEffect, useRef, useCallback } from "react";
import {
  JITSI_DOMAIN,
  JITSI_CONFIG,
  JITSI_INTERFACE_CONFIG,
} from "../../utils/jitsiConstants";

const loadJitsiScript = () =>
  new Promise((resolve, reject) => {
    if (window.JitsiMeetExternalAPI) return resolve();
    const s = document.createElement("script");
    s.src = `https://${JITSI_DOMAIN}/external_api.js`;
    s.onload = resolve;
    s.onerror = () => reject(new Error("Jitsi script failed to load"));
    document.head.appendChild(s);
  });

/**
 * Injects a <style> into the Jitsi iframe to hide its own chrome.
 * Retries every 500 ms (up to 30 times) since the iframe loads async.
 */
function suppressJitsiUI(containerEl) {
  const css = `
    .premeeting-screen, [class*="premeeting"],
    [class*="prejoin"], .lobby-screen, [class*="lobby"],
    #new-toolbox, .new-toolbox, .toolbox-content,
    .toolbox-content-wrapper, [class*="Toolbox"], [class*="toolbox"],
    .Watermarks, .watermark, .leftwatermark, .rightwatermark,
    [class*="watermark"], .poweredby,
    .subject, [class*="subject"], #subject, [class*="Subject"],
    .conference-timer, [class*="conferenceTimer"],
    .notification-container, [class*="notification"],
    .reactions-menu, [class*="reactions"] {
      display: none !important;
      pointer-events: none !important;
    }
    #largeVideoContainer, #largeVideoWrapper, #largeVideo {
      width: 100% !important;
      height: 100% !important;
    }
  `;

  let tries = 0;

  const inject = () => {
    tries++;
    try {
      const iframe = containerEl?.querySelector("iframe");
      if (!iframe) {
        if (tries < 30) setTimeout(inject, 500);
        return;
      }
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc?.head) {
        if (doc.head.querySelector("#jitsi-suppress")) return; // already injected
        const style = doc.createElement("style");
        style.id = "jitsi-suppress";
        style.textContent = css;
        doc.head.appendChild(style);
        return; // success
      }
    } catch {
      // cross-origin block — can't inject
      return;
    }
    if (tries < 30) setTimeout(inject, 500);
  };

  setTimeout(inject, 800);
}

/**
 * useJitsi
 *
 * Manages Jitsi Meet External API lifecycle.
 * Hides Jitsi's own chrome (prejoin, toolbar, watermarks)
 * so only our custom VideoPage UI is visible.
 */
export function useJitsi({
  roomId,
  displayName,
  startMicOn,
  startCamOn,
  containerRef,
  callbacks = {},
}) {
  const apiRef = useRef(null);

  const executeCommand = useCallback((cmd, ...args) => {
    apiRef.current?.executeCommand(cmd, ...args);
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await loadJitsiScript();
      } catch (e) {
        console.error("[useJitsi]", e);
        return;
      }

      if (cancelled || !containerRef.current) return;

      const api = new window.JitsiMeetExternalAPI(JITSI_DOMAIN, {
        roomName: roomId,
        parentNode: containerRef.current,
        width: "100%",
        height: "100%",
        userInfo: { displayName },
        configOverwrite: {
          ...JITSI_CONFIG,
          startWithAudioMuted: !startMicOn,
          startWithVideoMuted: !startCamOn,
        },
        interfaceConfigOverwrite: JITSI_INTERFACE_CONFIG,
      });

      apiRef.current = api;

      // Suppress immediately (toolbar may render before join event)
      suppressJitsiUI(containerRef.current);

      // Suppress again after join (some elements render after this event)
      api.addListener("videoConferenceJoined", () => {
        suppressJitsiUI(containerRef.current);
      });

      // ── Event wiring ─────────────────────────────────────────
      const on = (ev, cb) => {
        if (cb) api.addListener(ev, cb);
      };

      on("audioMuteStatusChanged", ({ muted }) =>
        callbacks.onAudioMuteChange?.(muted),
      );
      on("videoMuteStatusChanged", ({ muted }) =>
        callbacks.onVideoMuteChange?.(muted),
      );
      on("screenSharingStatusChanged", ({ on: active }) =>
        callbacks.onScreenShareChange?.(active),
      );
      on("participantJoined", ({ id, displayName: n }) =>
        callbacks.onParticipantJoined?.({ id, name: n || "Participant" }),
      );
      on("participantLeft", ({ id }) => callbacks.onParticipantLeft?.({ id }));
      on("incomingMessage", ({ from, message }) =>
        callbacks.onMessageReceived?.({ from, message }),
      );
    })();

    return () => {
      cancelled = true;
      apiRef.current?.dispose();
      apiRef.current = null;
    };
  }, [roomId, displayName, startMicOn, startCamOn]);

  return { executeCommand };
}
