import React from "react";
import "../../styles/chat.css";

export default function MeetingChatPanel({ socket, meetingKey, displayName }) {
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState([]);

  React.useEffect(() => {
    if (!socket) return;
    const onMsg = (msg) => setMessages((prev) => [...prev, msg]);
    socket.on("chat:message", onMsg);
    return () => socket.off("chat:message", onMsg);
  }, [socket]);

  const handleSend = () => {
    const content = input.trim();
    if (!content || !socket) return;
    socket.emit("chat:send", { meetingKey, content, displayName }, (ack) => {
      if (!ack?.ok) console.error(ack?.error || "chat send failed");
    });
    setInput("");
  };

  return (
    <div className="minimal-chat-page" style={{ height: "100%" }}>
      <div className="chat-header">Meeting Chat</div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty">No messages yet</div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`chat-message ${
                m.from?.displayName === displayName ? "me" : "other"
              }`}
            >
              <div className="message-text">
                <strong style={{ marginRight: 6 }}>
                  {m.from?.displayName || "Someone"}
                </strong>
                {m.content}
              </div>
              <div className="message-time">
                {new Date(m.ts).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

