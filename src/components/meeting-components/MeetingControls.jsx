import React from 'react'
import { MicOff , Mic, VideoIcon, VideoOffIcon, ScreenShareIcon, } from 'lucide-react'
import { BiChat } from 'react-icons/bi'
import { HiUserAdd } from 'react-icons/hi'
import { MdCallEnd } from 'react-icons/md'
import { RiVoiceprintLine} from 'react-icons/ri'
import { FaRegFileAlt } from 'react-icons/fa'

function MeetingControls({ isMuted, cameraOff, onToggleMic, onToggleVideo, onEndCall, isHost, onToggleParticipants, onToggleChat, onToggleTranscribe, onToggleDocs }) {
  return (
    <div className="meeting-controls">

      <Mic
        className={`control-btn ${isMuted ? "control-btn--active" : ""}`}
        onClick={onToggleMic}
        data-tip={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <MicOff/> : <Mic/>}
      </Mic>
       <BiChat
        className="control-btn"
        onClick={onToggleChat}
        data-tip="Chat"
      >
      </BiChat>

      <FaRegFileAlt
        className="control-btn"
        onClick={onToggleDocs}
        data-tip="Docs"
      />
      
      <VideoIcon
        className={`control-btn ${cameraOff ? "control-btn--active" : ""}`}
        onClick={onToggleVideo}
        data-tip={cameraOff ? "Start video" : "Stop video"}
      >
        {cameraOff ? <VideoOffIcon/> : <VideoIcon/>}
      </VideoIcon>
       <MdCallEnd
        className="control-btn control-btn--end"
        onClick={onEndCall}
        data-tip="Leave call"
      >
      
      </MdCallEnd >

      {isHost && (
        <HiUserAdd className="control-btn" onClick={onToggleParticipants} data-tip="Participants">
          👥
        </HiUserAdd>
      )}
   <RiVoiceprintLine
   className="control-btn"
   onClick={onToggleTranscribe}
   />
      

     

      <ScreenShareIcon
      className="control-btn"
      data-tip="ScreenShare"
      
      />

     

    </div>
  )
}

export default MeetingControls