import React from "react";
import { askMeetingAi } from "../../utils/apicalls";

export default function MeetingAiPanel({ meetingKey }) {
  const [q, setQ] = React.useState("");
  const [items, setItems] = React.useState([]); // { q, a }
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const ask = async () => {
    const question = q.trim();
    if (!question) return;
    setLoading(true);
    setError("");
    setQ("");
    try {
      const res = await askMeetingAi(meetingKey, question);
      const answer = res?.data?.answer || "No answer";
      setItems((prev) => [...prev, { q: question, a: answer }]);
    } catch (e) {
      setError(e.message || "AI request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>Meeting AI</strong>
        {loading && <span style={{ color: "#999" }}>Thinking…</span>}
      </div>

      {error && <div style={{ color: "salmon" }}>{error}</div>}

      <div style={{ flex: 1, overflow: "auto", border: "1px solid #2a2a2a", borderRadius: 8, padding: 10 }}>
        {items.length === 0 ? (
          <div style={{ color: "#999" }}>Ask questions like “What decisions did we make?”</div>
        ) : (
          items.map((it, idx) => (
            <div key={idx} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Q: {it.q}</div>
              <div style={{ whiteSpace: "pre-wrap" }}>A: {it.a}</div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask about the meeting…"
          style={{ flex: 1 }}
          onKeyDown={(e) => e.key === "Enter" && ask()}
        />
        <button onClick={ask} disabled={loading}>
          Ask
        </button>
      </div>
    </div>
  );
}

