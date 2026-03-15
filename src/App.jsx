// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/DashBoard";
import OAuthPage from "./components/OAuthSuccess";
import { MeetingEntry } from "./pages/meetings/MeetingEntry";
import MeetingPage from "./pages/meetings/MeetingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/google-oauth/callback" element={<OAuthPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/meetings/entry/:id?" element={<MeetingEntry />} />
        <Route path="/meetings/live/:id?" element={<MeetingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
