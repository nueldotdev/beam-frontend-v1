import { useState, useEffect, useRef } from "react";
export function ChatPanel({ messages, onSend, onClose }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside className="video-panel" aria-label="In-call chat">
      <div className="video-panel__header">
        <h3 className="video-panel__title">In-call messages</h3>
        <button
          className="video-panel__close"
          onClick={onClose}
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>

      <div className="video-chat__messages" role="log" aria-live="polite">
        {messages.length === 0 && (
          <p className="video-chat__empty">
            Messages are only visible to people in this call
          </p>
        )}

        {messages.map((m, i) => (
          <div key={i} className="video-chat__message">
            <span className="video-chat__sender">{m.sender}</span>
            <div
              className={`video-chat__bubble ${m.self ? "video-chat__bubble--self" : "video-chat__bubble--other"}`}
            >
              {m.text}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="video-chat__input-row">
        <input
          className="input video-chat__input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message…"
          aria-label="Chat message"
        />
        <button
          onClick={handleSend}
          className="btn btn-primary video-chat__send"
          aria-label="Send message"
        >
          ➤
        </button>
      </div>
    </aside>
  );
}
