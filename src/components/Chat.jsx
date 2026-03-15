import React, { useState } from "react";
import "../styles/chat.css";
import { LuMessageCircleMore } from "react-icons/lu";
import {
  MessageCircleCheck,
  MessageCircleIcon,
  MessageCircleOff,
  MessageSquareDashedIcon,
} from "lucide-react";
import { TbMessageCircleCode } from "react-icons/tb";

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // start with empty messages

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: input,
      isMe: true,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <div className="minimal-chat-page">
      {/* Chat Header */}
      <div className="chat-header">Live Meeting Chat</div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty">
            <LuMessageCircleMore size={100} />
            No messages yet
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message ${msg.isMe ? "me" : "other"}`}
            >
              <div className="message-text">{msg.text}</div>
              <div className="message-time">{msg.time}</div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
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

export default Chat;
