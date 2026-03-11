import React from "react";
import { addMeetingTranscript } from "../../utils/apicalls";

function getSpeechRecognition() {
  return (
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    null
  );
}

export default function MeetingTranscribePanel({ socket, meetingKey, displayName }) {
  const [supported] = React.useState(() => !!getSpeechRecognition());
  const [isRunning, setIsRunning] = React.useState(false);
  const [lines, setLines] = React.useState([]);
  const recognitionRef = React.useRef(null);

  React.useEffect(() => {
    if (!socket) return;
    const onChunk = (chunk) => {
      setLines((prev) => [
        ...prev,
        {
          id: `${chunk.ts}-${chunk.speaker?.socketId || "x"}`,
          speaker: chunk.speaker?.displayName || "Someone",
          content: chunk.content,
          ts: chunk.ts,
          isFinal: chunk.isFinal,
        },
      ]);
    };
    socket.on("transcript:chunk", onChunk);
    return () => socket.off("transcript:chunk", onChunk);
  }, [socket]);

  const start = () => {
    if (!supported || !socket) return;
    const SR = getSpeechRecognition();
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (event) => {
      let interim = "";
      let finals = [];
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        const text = r[0]?.transcript || "";
        if (r.isFinal) finals.push(text.trim());
        else interim += text;
      }
      if (interim.trim()) socket.emit("transcript:chunk", { content: interim.trim(), isFinal: false });
      if (finals.length) {
        const finalText = finals.join(" ").trim();
        socket.emit("transcript:chunk", { content: finalText, isFinal: true });
        // persist finals so AI Q&A can use them
        addMeetingTranscript(meetingKey, { speakerName: displayName || "You", content: finalText, isFinal: true })
          .catch((e) => console.error("persist transcript failed", e));
      }
    };

    rec.onerror = (e) => {
      console.error("speech error", e);
      setIsRunning(false);
    };
    rec.onend = () => {
      recognitionRef.current = null;
      setIsRunning(false);
    };

    recognitionRef.current = rec;
    setIsRunning(true);
    rec.start();
  };

  const stop = () => {
    recognitionRef.current?.stop?.();
  };

  return (
    <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>
      {!supported && (
        <div style={{ color: "#999" }}>
          Your browser doesn’t support live transcription (Web Speech API).
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={start} disabled={!supported || isRunning}>
          Start
        </button>
        <button onClick={stop} disabled={!isRunning}>
          Stop
        </button>
      </div>

      <div style={{ overflow: "auto", flex: 1, border: "1px solid #2a2a2a", borderRadius: 8, padding: 10 }}>
        {lines.length === 0 ? (
          <div style={{ color: "#999" }}>No transcript yet.</div>
        ) : (
          lines.map((l) => (
            <div key={l.id} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: "#999" }}>
                {l.speaker} •{" "}
                {new Date(l.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                {l.isFinal ? "" : " (partial)"}
              </div>
              <div>{l.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

