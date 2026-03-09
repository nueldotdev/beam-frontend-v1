import React from "react";
import { useParams } from "react-router-dom";
import LiveMeeting from "../../components/LiveMeeting";

function MeetingPage() {
  const { id } = useParams(); // meeting ID from the URL

  // These will come from your auth context / backend later
  const host = undefined;       // e.g. from useAuth()
  const meetingData = undefined; // e.g. from useMeeting(id)

  return (
    <LiveMeeting
      host={host}
      participants={meetingData?.participants}
      onAddParticipant={(name) => console.log("add:", name)}     // wire to socket later
      onRemoveParticipant={(id) => console.log("remove:", id)}   // wire to socket later
    />
  );
}

export default MeetingPage;