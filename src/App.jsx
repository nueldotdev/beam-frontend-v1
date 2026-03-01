import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/DashBoard";
import OAuthSuccess from "./components/OAuthSuccess";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard/*" element={<Dashboard />} />

        {/* 
        <Route path="/meet/:id" element={<MeetingRoom />} />
        <Route path="/meetings/:id" element={<MeetingDetail />} />
        <Route path="/settings" element={<Settings />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
