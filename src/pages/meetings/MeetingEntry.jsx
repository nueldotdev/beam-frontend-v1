import React, { useEffect, useState, useRef } from "react";
import { Camera, CameraOff, MicIcon, MicOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import UploadFiles from "../../components/meeting-components/UploadFiles";
import "../../styles/meeting-styles/entry.css";

export const MeetingEntry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || { role: "participant" };

  const [name, setName] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [permission, setPermission] = useState({ camera: null, mic: null });
  const [loadingPerms, setLoadingPerms] = useState(true);
  const [camStream, setCamStream] = useState(null);
  const [error, setError] = useState({ name: "", meetingId: "" });
  const videoRef = useRef(null);

  // ── Camera & Mic ─────────────────────────────────────────
  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setPermission((p) => ({ ...p, camera: true }));
      setCamStream(stream);
    } catch {
      setPermission((p) => ({ ...p, camera: false }));
    }
  };

  const toggleCamera = () => {
    if (permission.camera) {
      camStream?.getTracks().forEach((t) => t.stop());
      setCamStream(null);
      setPermission((p) => ({ ...p, camera: false }));
    } else {
      requestCamera();
    }
  };

  useEffect(() => {
    let mounted = true;
    const askCamera = async () => mounted && (await requestCamera());
    const askMic = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        mounted && setPermission((p) => ({ ...p, mic: true }));
      } catch {
        mounted && setPermission((p) => ({ ...p, mic: false }));
      }
    };
    const check = async () => {
      await Promise.all([askCamera(), askMic()]);
      mounted && setLoadingPerms(false);
    };
    check();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    return () => camStream?.getTracks().forEach((t) => t.stop());
  }, [camStream]);

  useEffect(() => {
    if (videoRef.current && camStream) videoRef.current.srcObject = camStream;
  }, [camStream]);

  // ── Join Handler ─────────────────────────────────────────
  const handleJoin = () => {
    let hasError = false;
    const newError = { name: "", meetingId: "" };

    if (!name.trim()) {
      newError.name = "Please enter your display name.";
      hasError = true;
    }

    if (role === "participant" && !meetingId.trim()) {
      newError.meetingId = "Please enter a valid Meeting ID.";
      hasError = true;
    }

    setError(newError);
    if (hasError) return;

    // Stop the preview stream — Jitsi will own the camera from here
    camStream?.getTracks().forEach((t) => t.stop());

    // Navigate to VideoPage, passing all state it needs
    navigate(`/meetings/live/${meetingId || "new"}`, {
      state: {
        role,
        name,
        meetingId: meetingId || "new",
        permission, // { camera: bool, mic: bool } — VideoPage reads these
      },
    });
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="auth-container">
      <div className="auth-card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleJoin();
          }}
          autoComplete="off"
        >
          {/* Name */}
          <label htmlFor="name" className="auth-form-label">
            Display Name
          </label>
          <Input
            id="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loadingPerms}
            style={{ borderColor: error.name ? "red" : undefined }}
          />
          {error.name && (
            <p style={{ color: "red", marginTop: "4px" }}>{error.name}</p>
          )}

          {/* Meeting ID — participants only */}
          {role === "participant" && (
            <div>
              <label htmlFor="meetingId" className="auth-form-label">
                Meeting ID
              </label>
              <Input
                id="meetingId"
                placeholder="Enter Meeting ID"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                style={{ borderColor: error.meetingId ? "red" : undefined }}
              />
              {error.meetingId && (
                <p style={{ color: "red", marginTop: "4px" }}>
                  {error.meetingId}
                </p>
              )}
            </div>
          )}

          <Button variant="primary" type="submit">
            Join Meeting
          </Button>

          {meetingId && <UploadFiles meetingId={meetingId} />}
        </form>
      </div>

      {/* Camera preview + permission toggles */}
      <div className="cam-mic-card">
        {loadingPerms && (
          <span>Checking camera and microphone permissions...</span>
        )}
        <div className="video-preview">
          {permission.camera === true && (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="camera-preview"
            />
          )}
          {permission.camera === false && (
            <video autoPlay muted playsInline className="camera-preview" />
          )}
        </div>
        {!loadingPerms && (
          <div className="permissions">
            <Button
              variant={permission.camera ? "primary" : "destructive"}
              onClick={toggleCamera}
            >
              {permission.camera ? <Camera /> : <CameraOff />}
            </Button>
            <Button
              variant={permission.mic ? "primary" : "destructive"}
              onClick={() => setPermission((p) => ({ ...p, mic: !p.mic }))}
            >
              {permission.mic ? <MicIcon /> : <MicOff />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
