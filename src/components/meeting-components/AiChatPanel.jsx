import { useState, useRef, useEffect } from "react";
import axios from "axios";

export function AiChatPanel({ roomId, onClose }) {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { type: "ai", text: "Hi! I am Amazon Nova. I am listening to this meeting. Ask me anything!" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    // Add user message to UI immediately
    setChatHistory((prev) => [...prev, { type: "user", text }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(`http://localhost:3000/api/meetings/${roomId}/ai-chat`, {
        question: text,
      });
      // Append Amazon Nova response
      setChatHistory((prev) => [
        ...prev,
        { type: "ai", text: response.data?.data?.answer || "No response" },
      ]);
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => [
        ...prev,
        { type: "ai", text: "Sorry, I couldn't reach the backend. Did you add AWS credentials to .env?" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside className="video-panel" aria-label="AI Assistant">
      <div className="video-panel__header">
        <h3 className="video-panel__title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>✨</span> Amazon Nova AI
        </h3>
        <button className="video-panel__close" onClick={onClose} aria-label="Close AI chat">
          ✕
        </button>
      </div>

      <div className="video-chat__messages" role="log" aria-live="polite">
        {chatHistory.map((m, i) => (
          <div key={i} className="video-chat__message">
            <span className="video-chat__sender">{m.type === "ai" ? "Nova AI" : "You"}</span>
            <div
              className={`video-chat__bubble ${
                m.type === "user" ? "video-chat__bubble--self" : "video-chat__bubble--ai"
              }`}
              style={m.type === "ai" ? { backgroundColor: "#f3f4f6", color: "#111" } : {}}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="video-chat__message">
            <span className="video-chat__sender">Nova AI</span>
            <div className="video-chat__bubble" style={{ backgroundColor: "#f3f4f6", color: "#111" }}>
              <em>Thinking...</em>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="video-chat__input-row">
        <input
          className="input video-chat__input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Nova about the meeting…"
          aria-label="AI message"
        />
        <button onClick={handleSend} className="btn btn-primary video-chat__send" disabled={isLoading}>
          ➤
        </button>
      </div>
    </aside>
  );
}
