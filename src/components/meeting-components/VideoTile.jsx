import React from "react";
import { MicOff, VideoOffIcon } from "lucide-react";
import "../../styles/meeting-styles/live.css";

function VideoTile({ name, isMuted, cameraOff, initials }) {
  return (
    <div className="video-tile">
      <div className="video-placeholder">
        <div className="host-controls">
          <div className="video-placeholder">
            <div className="avatar-large">{initials}</div>
          </div>
        </div>
      </div>

      <div className="video-info">
        <span>{name}</span>
        {isMuted && <MicOff />}
        {cameraOff && <VideoOffIcon />}
      </div>

      {/* {role === "host" && (
        <div className="host-controls">
          <button>Mute</button>
          <button>Remove</button>
        </div>
      )} */}
    </div>
  );
}

export default VideoTile;
