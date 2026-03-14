import React, { useState } from "react";
import "../styles/settings.css";


function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const [settings, setSettings] = useState({
    name: "Daniella",
    email: "daniella@email.com",
    microphone: "Default Microphone",
    speaker: "Default Speaker",
    camera: "Integrated Webcam",
    muteOnJoin: true,
    videoOffOnJoin: false,
    darkMode: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="settings-section">
            <h3>Profile</h3>
            <label>
              Full Name
              <input
                type="text"
                name="name"
                value={settings.name}
                onChange={handleChange}
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
              />
            </label>
          </div>
        );

      case "audio":
        return (
          <div className="settings-section">
            <h3>Audio Settings</h3>
            <label>
              Microphone
              <select
                name="microphone"
                value={settings.microphone}
                onChange={handleChange}
              >
                <option>Default Microphone</option>
                <option>External Mic</option>
              </select>
            </label>

            <label>
              Speaker
              <select
                name="speaker"
                value={settings.speaker}
                onChange={handleChange}
              >
                <option>Default Speaker</option>
                <option>Headphones</option>
              </select>
            </label>

            <label className="checkbox">
              <input
                type="checkbox"
                name="muteOnJoin"
                checked={settings.muteOnJoin}
                onChange={handleChange}
              />
              Mute microphone when joining a meeting
            </label>
          </div>
        );

      case "video":
        return (
          <div className="settings-section">
            <h3>Video Settings</h3>
            <label>
              Camera
              <select
                name="camera"
                value={settings.camera}
                onChange={handleChange}
              >
                <option>Integrated Webcam</option>
                <option>External Camera</option>
              </select>
            </label>

            <label className="checkbox">
              <input
                type="checkbox"
                name="videoOffOnJoin"
                checked={settings.videoOffOnJoin}
                onChange={handleChange}
              />
              Turn off video when joining meeting
            </label>
          </div>
        );

      case "preferences":
        return (
          <div className="settings-section">
            <h3>Preferences</h3>

            <label className="checkbox">
              <input
                type="checkbox"
                name="darkMode"
                checked={settings.darkMode}
                onChange={handleChange}
              />
              Enable Dark Mode
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <button onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? "active" : ""}>
          Profile
        </button>
        <button onClick={() => setActiveTab("audio")} className={activeTab === "audio" ? "active" : ""}>
          Audio
        </button>
        <button onClick={() => setActiveTab("video")} className={activeTab === "video" ? "active" : ""}>
          Video
        </button>
        <button onClick={() => setActiveTab("preferences")} className={activeTab === "preferences" ? "active" : ""}>
          Preferences
        </button>
      </div>

      <div className="settings-content">
        {renderContent()}

        <button className="save-btn">Save Changes</button>
      </div>
    </div>
  );
}

export default  Settings;