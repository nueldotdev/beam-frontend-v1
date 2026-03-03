import React, { useEffect, useState, useRef } from 'react'
import { Camera, CameraOff, MicIcon, MicOff } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Input from '../../components/Input'
import UploadFiles from '../../components/meeting-components/UploadFiles'
import '../../styles/meeting-styles/entry.css'

export const MeetingEntry = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [name, setName] = useState('')
  const [permission, setPermission] = useState({ camera: null, mic: null })
  const [loadingPerms, setLoadingPerms] = useState(true)
  const [camStream, setCamStream] = useState(null)
  const videoRef = useRef(null)

  // helper to request camera and update state
  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      setPermission((p) => ({ ...p, camera: true }))
      setCamStream(stream)
    } catch (e) {
      setPermission((p) => ({ ...p, camera: false }))
    }
  }

  const toggleCamera = () => {
    if (permission.camera) {
      // turn off: stop existing stream
      if (camStream) {
        camStream.getTracks().forEach((t) => t.stop())
      }
      setCamStream(null)
      setPermission((p) => ({ ...p, camera: false }))
    } else {
      // request again
      requestCamera()
    }
  }

  // request permissions on mount
  useEffect(() => {
    let mounted = true

    const askCamera = async () => {
      if (!mounted) return
      await requestCamera()
    }

    const askMic = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        if (!mounted) return
        setPermission((p) => ({ ...p, mic: true }))
      } catch (e) {
        if (!mounted) return
        setPermission((p) => ({ ...p, mic: false }))
      }
    }

    const check = async () => {
      await Promise.all([askCamera(), askMic()])
      if (mounted) setLoadingPerms(false)
    }

    check()

    return () => {
      mounted = false
    }
  }, [])

  // cleanup previous stream when camStream updates or on unmount
  useEffect(() => {
    return () => {
      if (camStream) {
        camStream.getTracks().forEach((t) => t.stop())
      }
    }
  }, [camStream])

  // when camera stream changes, attach to video element
  useEffect(() => {
    if (videoRef.current && camStream) {
      videoRef.current.srcObject = camStream
    }
  }, [camStream])

  const canJoin = !loadingPerms && name.trim().length > 0

  const handleJoin = () => {
    // TODO: integrate with routing or meeting logic
    console.log('joining with', { name, permission })
    // navigate('/meetings/live') // example
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleJoin()
          }}
          className=""
          autoComplete="off"
        >
          <div className="">
            <label htmlFor="name" className="auth-form-label">
              Display Name
            </label>
            <Input
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loadingPerms}
            />
          </div>

          <Button variant="primary" type="submit" disabled={!canJoin}>
            Join Meeting
          </Button>

          {/* allow file uploads when we know a meeting id */}
        {id && <UploadFiles meetingId={id} />}
        </form>
      </div>

      <div className="cam-mic-card">
        {loadingPerms && (
          <div className="auth-info">
            <span>Checking camera and microphone permissions...</span>
          </div>
        )}

        

        
          <div className="video-preview">
            {permission.camera === false && (
              <video autoPlay muted playsInline className="camera-preview" />
            )}
            {permission.camera === true && (
              <video ref={videoRef} autoPlay muted playsInline className="camera-preview" />
            )}
          </div>
        
        
        {!loadingPerms && (
          <div className="permissions">
            <div className="permission-item">
              <Button
                variant={permission.camera ? 'primary' : 'destructive'}
                onClick={toggleCamera}
              >
                {permission.camera ? <Camera /> : <CameraOff />}
              </Button>
            </div>
            <div className="permission-item">
              <Button
                variant={permission.mic ? 'primary' : 'destructive'}
                onClick={() => setPermission((p) => ({ ...p, mic: !p.mic }))}
              >
                {permission.mic ? <MicIcon /> : <MicOff />} 
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

