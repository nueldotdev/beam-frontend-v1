import React from "react";
import { MicOff, VideoOffIcon } from "lucide-react";
import "../../styles/meeting-styles/live.css";

function VideoTile({ name, isMuted, cameraOff, initials, stream }) {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (!videoRef.current) return;
    if (!stream) return;
    videoRef.current.srcObject = stream;
  }, [stream]);

  const showVideo = Boolean(stream) && !cameraOff;

  return (
    <div className="video-tile">
      {showVideo ? (
        <video
          ref={videoRef}
          className="video-tile__stream"
          autoPlay
          muted
          playsInline
        />
      ) : (
        <div className="video-placeholder">
          <div className="avatar-large">{initials}</div>
        </div>
      )}

      <div className="video-tile__bar">
        <span className="video-tile__name">{name}</span>
        <span className="video-tile__icons">
          {isMuted && (
            <span className="video-tile__icon video-tile__icon--muted">
              <MicOff size={16} />
            </span>
          )}
          {cameraOff && (
            <span className="video-tile__icon video-tile__icon--muted">
              <VideoOffIcon size={16} />
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

export default VideoTile;