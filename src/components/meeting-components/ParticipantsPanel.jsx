import { Avatar } from "./Avatar.jsx";

export function ParticipantsPanel({ participants, onClose }) {
  return (
    <aside className="video-panel" aria-label="Participants">
      <div className="video-panel__header">
        <h3 className="video-panel__title">People ({participants.length})</h3>
        <button
          className="video-panel__close"
          onClick={onClose}
          aria-label="Close participants"
        >
          ✕
        </button>
      </div>

      <ul className="video-participants__list" role="list">
        {participants.map((p, i) => (
          <li key={p.id ?? i} className="video-participants__item">
            <Avatar name={p.name} size="md" />
            <div className="video-participants__info">
              <p className="video-participants__name">
                {p.name}
                {p.isSelf && " (You)"}
              </p>
              <p className="video-participants__status">
                <span
                  className={`video-participants__status-icon ${p.audioMuted ? "video-participants__status-icon--muted" : ""}`}
                  aria-hidden="true"
                />
                {p.audioMuted ? "Muted" : "Speaking"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
