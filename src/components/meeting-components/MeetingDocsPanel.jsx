import React from "react";
import { listMeetingDocuments } from "../../utils/apicalls";

function pdfUrlWithPage(url, page) {
  if (!url) return "";
  const p = Math.max(1, Number(page) || 1);
  // Most PDF viewers support #page=
  return `${url}#page=${p}`;
}

export default function MeetingDocsPanel({
  meetingKey,
  isHost,
  socket,
  present,
  followHost,
  onFollowHostChange,
}) {
  const [docs, setDocs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const [activeDoc, setActiveDoc] = React.useState(null); // { _id, fileUrl, filename }
  const [page, setPage] = React.useState(1);

  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await listMeetingDocuments(meetingKey);
      setDocs(res?.data || []);
    } catch (e) {
      setError(e.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingKey]);

  // When following host, mirror present state
  React.useEffect(() => {
    if (!followHost) return;
    if (!present?.docId && !present?.url) return;

    if (present?.docId) {
      const found = docs.find((d) => String(d._id) === String(present.docId));
      if (found) setActiveDoc(found);
    } else if (present?.url) {
      setActiveDoc({ _id: null, fileUrl: present.url, filename: "Presented" });
    }
    if (present?.page) setPage(present.page);
  }, [followHost, present, docs]);

  const canShow = !!(activeDoc?.fileUrl);

  const bump = (delta) => setPage((p) => Math.max(1, (Number(p) || 1) + delta));

  const presentToAll = () => {
    if (!socket || !canShow) return;
    socket.emit("present:update", {
      docId: activeDoc?._id || null,
      url: activeDoc?.fileUrl || null,
      page,
    });
  };

  const selectDoc = (doc) => {
    setActiveDoc(doc);
    setPage(1);
    onFollowHostChange?.(false);
  };

  return (
    <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
        <strong>Documents</strong>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {!isHost && (
            <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={!!followHost}
                onChange={(e) => onFollowHostChange?.(e.target.checked)}
              />
              Follow host
            </label>
          )}
          <button onClick={refresh} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      {error && <div style={{ color: "salmon" }}>{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 10, flex: 1, minHeight: 0 }}>
        <div style={{ overflow: "auto", border: "1px solid #2a2a2a", borderRadius: 8, padding: 8 }}>
          {loading ? (
            <div style={{ color: "#999" }}>Loading…</div>
          ) : docs.length === 0 ? (
            <div style={{ color: "#999" }}>No docs yet. Upload one in the entry screen.</div>
          ) : (
            docs.map((d) => (
              <button
                key={d._id}
                onClick={() => selectDoc(d)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: 8,
                  marginBottom: 6,
                  borderRadius: 8,
                  border: "1px solid #2a2a2a",
                  background: activeDoc?._id === d._id ? "#1b1b1b" : "transparent",
                  color: "inherit",
                }}
              >
                <div style={{ fontWeight: 600 }}>{d.filename}</div>
                <div style={{ fontSize: 12, color: "#999" }}>{String(d.fileType || "pdf").toUpperCase()}</div>
              </button>
            ))
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 0 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => bump(-1)} disabled={!canShow}>
              Prev
            </button>
            <div style={{ color: "#999" }}>Page</div>
            <input
              value={page}
              onChange={(e) => setPage(Number(e.target.value) || 1)}
              style={{ width: 70 }}
              disabled={!canShow}
            />
            <button onClick={() => bump(1)} disabled={!canShow}>
              Next
            </button>

            {isHost && (
              <button onClick={presentToAll} disabled={!canShow}>
                Present to all
              </button>
            )}
          </div>

          <div style={{ flex: 1, minHeight: 0, border: "1px solid #2a2a2a", borderRadius: 8, overflow: "hidden" }}>
            {canShow ? (
              <iframe
                title="document"
                src={pdfUrlWithPage(activeDoc.fileUrl, page)}
                style={{ width: "100%", height: "100%", border: 0 }}
              />
            ) : (
              <div style={{ padding: 12, color: "#999" }}>Select a document to view.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

