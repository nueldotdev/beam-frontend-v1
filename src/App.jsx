import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/DashBoard";
import OAuthSuccess from "./components/OAuthSuccess";
import { MeetingEntry } from "./pages/meetings/MeetingEntry";
import LiveMeeting from "./components/LiveMeeting";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/signup" element={<Signup />} />

        {/* dashboard keeps its own nested meeting routes */}
        <Route path="/dashboard/*" element={<Dashboard />} />

        {/* public meeting routes */}
        <Route path="/meetings/entry/:id?" element={<MeetingEntry />} />
        <Route path="/meetings/live" element={<LiveMeeting />} />
      </Routes>
    </Router>
  );
}

export default App;
