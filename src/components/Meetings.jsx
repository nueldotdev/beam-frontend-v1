import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import "../styles/meeting.css"

  
const initialMeetings = [
  {
    id: 1,
    title: "Team Standup",
    date: "Feb 27, 2026",
    time: "09:00 AM",
    host: "You",
  },
  {
    id: 2,
    title: "Project Review",
    date: "Feb 27, 2026",
    time: "02:00 PM",
    host: "Alice Johnson",
  },
  {
    id: 3,
    title: "Client Meeting",
    date: "Feb 28, 2026",
    time: "11:30 AM",
    host: "Bob Smith",
  },
  {
    id: 4,
    title: "UX/UI Design Meeting",
    date: "Feb 28, 2026",
    time: "11:00 AM",
    host: "Lara Smith",
  },

];

function Meetings({className}) {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState(initialMeetings);

  const handleStartMeeting = (meeting) => {
    // navigate to public pre-join entry page with meeting id
    navigate(`/meetings/entry/${meeting.id}`);
  };

  const handleNewMeeting = () => {
    alert("Create new instant meeting");
  };

  return (
    <div  className={`meetings-container ${className}`}>

      {/* Header */}
      <div className="meetings-header">
        <h2>Meetings</h2>

        <button
          className="start-meeting-btn"
          onClick={handleStartMeeting}
        >
          + Start New Meeting
        </button>
      </div>

      {/* Upcoming Meetings */}
      <div className="meetings-list">

        <h3 className="section-title">Upcoming Meetings</h3>

        {meetings.length === 0 ? (
          <div className="empty">
            No upcoming meetings
          </div>
        ) : (
          meetings.map((meeting) => (
            <div key={meeting.id} className="meeting-card">

              <div className="meeting-info">
                <h4>{meeting.title}</h4>

                <p>
                  {meeting.date} • {meeting.time}
                </p>

                <span className="host">
                  Host: {meeting.host}
                </span>
              </div>

              <button
                className="join-btn"
                onClick={() => handleStartMeeting(meeting)}
              >
                Start
              </button>

            </div>
          ))
        )}

      </div>

    </div>


  )
}

export default Meetings