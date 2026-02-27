import React from 'react'
import "../styles/participants.css"
import { IoCallOutline } from "react-icons/io5";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import {ParticipantsData} from '../constants/ParticipantsData'

function Participants() {
  return (
    <div className='participants-list'>
      {ParticipantsData.map((participant) => (
        <div key={participant.id} className="participant-item">
          <img src={participant.avatar} alt={participant.name} className="participant-avatar" />
          <span className="participant-name">{participant.name}</span>
          <div className="participant-actions">
            <button
              className="action-btn voice-btn"
              onClick={() => console.log(`Voice call ${participant.name}`)}
              title={`Voice call ${participant.name}`}
            >
              <MdOutlineKeyboardVoice className='icon-btn'/>
            </button>
            <button
              className="action-btn video-btn"
              onClick={() => console.log(`Video call ${participant.name}`)}
              title={`Video call ${participant.name}`}
            >
              <IoCallOutline className='icon-btn'/>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Participants