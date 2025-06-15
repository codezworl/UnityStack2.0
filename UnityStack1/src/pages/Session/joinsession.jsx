import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SimplePeer from 'simple-peer';
import io from 'socket.io-client';
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaPhoneSlash, FaCode } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Editor from '@monaco-editor/react';

const socket = io('http://localhost:5000');

const JoinSession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [canJoin, setCanJoin] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  // WebRTC/Call state
  const [callRequested, setCallRequested] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  // Code Editor state
  const [showEditor, setShowEditor] = useState(false);
  const [editorValue, setEditorValue] = useState('// Start coding here...');
  const [editorLanguage, setEditorLanguage] = useState('javascript');

  const localVideo = useRef();
  const remoteVideo = useRef();
  const mediaRecorder = useRef();
  const [recordingUrl, setRecordingUrl] = useState(null);
  const [recordingBlob, setRecordingBlob] = useState(null);
  const [streamError, setStreamError] = useState(null);

  // Add these state variables after the existing ones
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(null);
  const [showRequestButton, setShowRequestButton] = useState(false);
  const [sessionEndTime, setSessionEndTime] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const userData = JSON.parse(atob(token.split('.')[1]));
        const response = await axios.get(`http://localhost:5000/api/sessions/detail/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSession(response.data.session);
        setIsDeveloper(userData.role === 'developer');
        socket.emit('join-session-room', {
          sessionId,
          userId: userData.id || userData._id,
          role: userData.role
        });
      } catch (err) {
        setError('Failed to fetch session details');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  useEffect(() => {
    if (!session) return;
    const getTimeRemaining = () => {
      const now = new Date();
      const sessionDate = new Date(session.date);
      const [startHour] = session.startTime.split(':');
      sessionDate.setHours(parseInt(startHour), 0, 0, 0);
      const diff = sessionDate - now;
      
      // Enable join button when session time arrives
      if (diff <= 0) {
        setCanJoin(true);
        setTimeRemaining('Session started');
        clearInterval(intervalId);
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    };
    getTimeRemaining();
    const id = setInterval(getTimeRemaining, 1000);
    setIntervalId(id);
    return () => clearInterval(id);
  }, [session]);

  useEffect(() => {
    if (!session) return;

    socket.on('join-accepted', () => {
      console.log('Join accepted, starting call...');
      setCallRequested(false);
      setCallActive(true);
      startCall();
    });

    socket.on('join-request', ({ studentName }) => {
      console.log('Join request received from:', studentName);
      setShowAcceptModal(true);
    });

    socket.on('signal', data => {
      console.log('Received signal data:', data.type);
      if (window.peer) {
        window.peer.signal(data);
      }
    });

    // Code editor synchronization events
    socket.on('code-change', ({ code, language }) => {
      setEditorValue(code);
      setEditorLanguage(language);
    });

    socket.on('editor-toggle', ({ show }) => {
      setShowEditor(show);
    });

    socket.on('early-end-request', ({ from }) => {
      console.log('Early end request received from:', from);
      setShowEndConfirmation(true);
    });

    socket.on('early-end-rejected', () => {
      console.log('Early end request was rejected');
      setShowEndConfirmation(false);
    });

    socket.on('early-end-accepted', async () => {
      console.log('Early end request was accepted');
      await handleSessionEnd();
    });

    socket.on('session-ended', async () => {
      console.log('Session ended event received');
      await handleSessionEnd();
    });

    return () => {
      socket.off('join-accepted');
      socket.off('join-request');
      socket.off('signal');
      socket.off('code-change');
      socket.off('editor-toggle');
      socket.off('early-end-request');
      socket.off('early-end-rejected');
      socket.off('early-end-accepted');
      socket.off('session-ended');
    };
  }, [session]);

  // Update the useEffect for session timer
  useEffect(() => {
    if (!session || !callActive) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const sessionDate = new Date(session.date);
      const [startHour] = session.startTime.split(':');
      sessionDate.setHours(parseInt(startHour), 0, 0, 0);
      
      // Calculate end time
      const endTime = new Date(sessionDate);
      endTime.setHours(endTime.getHours() + session.hours);
      
      // Format end time for display
      const endTimeFormatted = endTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      setSessionEndTime(endTimeFormatted);
      
      const diff = endTime - now;
      
      if (diff <= 0) {
        setSessionTimeRemaining('Session ended');
        setShowRequestButton(true);
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setSessionTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      
      // Only show request button if less than 10 minutes remaining AND session has been going for at least 30 minutes
      const sessionDuration = now - sessionDate;
      const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
      
      if (hours === 0 && minutes < 10 && sessionDuration >= thirtyMinutes) {
        setShowRequestButton(true);
      } else {
        setShowRequestButton(false);
      }
    };

    calculateTimeRemaining();
    const timerId = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timerId);
  }, [session, callActive]);

  const startCall = async () => {
    setCallStarted(true);
    setCallActive(true);
    setStreamError(null);

    let stream;
    let streamErrorMsg = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    } catch (e) {
      // Fallback: create a fake stream if real media is not available (for local testing)
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const fakeVideo = canvas.captureStream(10);
        // Create a silent audio track
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const dst = audioCtx.createMediaStreamDestination();
        oscillator.connect(dst);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.01); // short beep
        stream = new MediaStream([
          ...fakeVideo.getVideoTracks(),
          ...dst.stream.getAudioTracks()
        ]);
      } catch (err) {
        streamErrorMsg = 'No camera/mic available and failed to create a fake stream.';
        stream = null;
      }
    }

    if (localVideo.current && stream) {
      localVideo.current.srcObject = stream;
    }

    // If stream is still null, create a dummy MediaStream to avoid SimplePeer crash
    if (!stream) {
      stream = new MediaStream();
    }

    // Recording setup (video and audio)
    if (stream) {
      // Check for supported MIME types
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') 
        ? 'video/webm;codecs=vp9,opus'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
          ? 'video/webm;codecs=vp8,opus'
          : 'video/webm';
      
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: mimeType,
        videoBitsPerSecond: 2500000, // 2.5 Mbps for good quality video
        audioBitsPerSecond: 128000   // 128 kbps for good quality audio
      });
      
      const chunks = [];
      mediaRecorder.current.ondataavailable = e => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.current.onstop = async () => {
        try {
          // Create video blob with the correct MIME type
          const videoBlob = new Blob(chunks, { type: mimeType });
          setRecordingBlob(videoBlob);
          setRecordingUrl(URL.createObjectURL(videoBlob));
          
          // Save recording to DB with retry logic
          const formData = new FormData();
          formData.append('recording', videoBlob, `session-${sessionId}.webm`);
          formData.append('sessionId', sessionId);
          
          let retryCount = 0;
          const maxRetries = 3;
          let success = false;
          
          while (retryCount < maxRetries && !success) {
            try {
              const response = await axios.post('http://localhost:5000/api/sessions/save-recording', formData, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'multipart/form-data'
                },
                timeout: 120000 // 2 minute timeout for video upload
              });
              
              if (response.data.recordingPath) {
                toast.success('Session recording saved successfully!');
                success = true;
                break;
              }
            } catch (error) {
              console.error(`Recording save attempt ${retryCount + 1} failed:`, error);
              retryCount++;
              
              if (retryCount === maxRetries) {
                console.error('Failed to save recording after multiple attempts:', error);
                toast.error('Failed to save session recording. Please contact support.');
                break;
              }
              
              // Wait before retrying (exponential backoff)
              await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
            }
          }
        } catch (error) {
          console.error('Error processing recording:', error);
          toast.error('Error processing session recording.');
        }
      };
      
      // Start recording with 1-second timeslices for better error handling
      mediaRecorder.current.start(1000);
    }

    // WebRTC peer setup
    const initiator = !isDeveloper;
    try {
      const peer = new SimplePeer({
        initiator,
        trickle: false,
        stream,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        }
      });
      window.peer = peer;

      peer.on('signal', data => {
        socket.emit('signal', { sessionId, data });
      });

      peer.on('connect', () => {
        // Connected
      });

      peer.on('stream', remoteStream => {
        if (remoteVideo.current) {
          remoteVideo.current.srcObject = remoteStream;
        }
      });

      peer.on('error', err => {
        setCallActive(true);
        setCallStarted(true);
        setStreamError('Peer connection error: ' + err.message);
      });

      peer.on('close', () => {
        // Peer connection closed
      });
    } catch (err) {
      setCallActive(true);
      setCallStarted(true);
      setStreamError('Peer setup error: ' + err.message);
    }

    if (streamErrorMsg) {
      setStreamError(streamErrorMsg);
    }
  };

  const handleEndCall = () => {
    if (isDeveloper) {
      socket.emit('early-end-request', { 
        sessionId,
        from: 'developer',
        to: 'student'
      });
    } else {
      socket.emit('early-end-request', { 
        sessionId,
        from: 'student',
        to: 'developer'
      });
    }
  };

  const handleSessionEnd = async () => {
    setCallActive(false);
    setCallStarted(false);
    if (window.peer) {
      window.peer.destroy();
      window.peer = null;
    }
    if (localVideo.current && localVideo.current.srcObject) {
      localVideo.current.srcObject.getTracks().forEach(track => track.stop());
      localVideo.current.srcObject = null;
    }
    if (remoteVideo.current && remoteVideo.current.srcObject) {
      remoteVideo.current.srcObject.getTracks().forEach(track => track.stop());
      remoteVideo.current.srcObject = null;
    }
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }

    // Update session status
    try {
      await axios.put(`http://localhost:5000/api/sessions/${sessionId}/complete`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Navigate based on user role
      if (isDeveloper) {
        navigate('/devsessions');
      } else {
        navigate(`/session/${sessionId}/review`);
      }
    } catch (error) {
      console.error('Failed to update session status:', error);
    }
  };

  const toggleCamera = () => {
    if (localVideo.current && localVideo.current.srcObject) {
      const videoTrack = localVideo.current.srcObject.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  };

  const toggleMic = () => {
    if (localVideo.current && localVideo.current.srcObject) {
      const audioTrack = localVideo.current.srcObject.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  };

  const handleAskToJoin = () => {
    if (!canJoin) return;
    console.log('Asking to join session...');
    setCallRequested(true);
    socket.emit('ask-to-join', {
      sessionId,
      studentName: session.studentId?.firstName + ' ' + session.studentId?.lastName
    });
  };

  const handleAccept = () => {
    console.log('Accepting join request...');
    setShowAcceptModal(false);
    setCallActive(true);
    socket.emit('accept-join', { sessionId });
    startCall();
  };

  const handleEditorChange = (value) => {
    setEditorValue(value);
    socket.emit('code-change', { sessionId, code: value, language: editorLanguage });
  };

  const toggleEditor = () => {
    const newShowEditor = !showEditor;
    setShowEditor(newShowEditor);
    socket.emit('editor-toggle', { sessionId, show: newShowEditor });
  };

  // Add this function to handle request button click
  const handleRequestClick = () => {
    navigate(`/session/${sessionId}/request`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!session) return <div>No session found.</div>;

  return (
    <div className="container-fluid p-0">
      <div className="row">
        {/* Left: Session Details and Timer */}
        <div className="col-md-6 mb-4">
          <div className="card p-4 shadow-sm">
            <h3>Session Details</h3>
            <p><strong>Title:</strong> {session.title}</p>
            <p><strong>Status:</strong> {session.status}</p>
            <p><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {session.startTime} - {session.endTime}</p>
            <p><strong>Developer:</strong> {session.developerId?.firstName} {session.developerId?.lastName}</p>
            <p><strong>Student:</strong> {session.studentId?.firstName} {session.studentId?.lastName}</p>
            <div className="mt-4">
              <h5>Time Remaining</h5>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff' }}>{timeRemaining}</div>
            </div>
          </div>
        </div>

        {/* Right: Session Call Window */}
        <div className="col-md-6 mb-4">
          <div className="card p-4 shadow-sm d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '350px' }}>
            <h4>Session Call Window</h4>
            {!callStarted && !isDeveloper && (
              <button 
                className="btn btn-success mt-3" 
                onClick={handleAskToJoin} 
                disabled={callRequested || !canJoin}
              >
                {!canJoin ? 'Waiting for session time...' : callRequested ? 'Request Sent...' : 'Ask to Join'}
              </button>
            )}
            {showAcceptModal && isDeveloper && (
              <div className="alert alert-info d-flex flex-column align-items-center">
                <p>Student is requesting to join the session.</p>
                <button className="btn btn-primary" onClick={handleAccept}>Accept</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Screen Video Call Modal */}
      {callActive && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark" style={{ zIndex: 1050 }}>
          <div className="d-flex flex-column h-100">
            {/* Error message for stream issues */}
            {streamError && (
              <div className="alert alert-warning text-center m-0">
                {streamError}
              </div>
            )}
            {/* Controls at the top */}
            <div className="bg-dark p-3 d-flex justify-content-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 2 }}>
              {/* Session Timer */}
              {sessionTimeRemaining && (
                <div className="position-absolute start-0 ms-3 text-white d-flex align-items-center gap-2" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                  <span className="badge bg-primary">Time Remaining: {sessionTimeRemaining}</span>
                  <span className="badge bg-secondary">Ends at: {sessionEndTime}</span>
                </div>
              )}
              
              <button 
                className="btn btn-light rounded-circle p-3" 
                onClick={toggleCamera}
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                {isCameraOn ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
              </button>
              <button 
                className="btn btn-light rounded-circle p-3" 
                onClick={toggleMic}
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                {isMicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
              </button>
              <button 
                className="btn btn-light rounded-circle p-3" 
                onClick={toggleEditor}
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <FaCode size={20} />
              </button>
              <button 
                className="btn btn-danger rounded-circle p-3" 
                onClick={handleEndCall}
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <FaPhoneSlash size={20} />
              </button>

              {/* Request Button */}
              {showRequestButton && (
                <button 
                  className="btn btn-warning position-absolute end-0 me-3"
                  onClick={handleRequestClick}
                >
                  Request Reschedule
                </button>
              )}
            </div>
            {/* Main content area */}
            <div className="flex-grow-1 d-flex" style={{ height: 'calc(100vh - 80px)' }}>
              {/* Code Editor */}
              {showEditor && (
                <div className="w-50 h-100 border-end border-secondary">
                  <Editor
                    height="100%"
                    defaultLanguage={editorLanguage}
                    value={editorValue}
                    onChange={handleEditorChange}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      wordWrap: 'on',
                      automaticLayout: true
                    }}
                    loading={<div>Loading editor...</div>}
                    onMount={(editor, monaco) => {
                      // Editor is mounted
                      console.log('Editor mounted');
                    }}
                    onValidate={(markers) => {
                      // Handle validation
                      console.log('Validation markers:', markers);
                    }}
                  />
                </div>
              )}
              {/* Video Container */}
              <div className={`flex-grow-1 position-relative ${showEditor ? 'w-50' : 'w-100'}`}>
                <video 
                  ref={remoteVideo} 
                  autoPlay 
                  playsInline
                  className="w-100 h-100 object-fit-cover"
                  style={{ backgroundColor: '#000' }}
                />
                <video 
                  ref={localVideo} 
                  autoPlay 
                  playsInline
                  muted 
                  className="position-absolute bottom-0 end-0"
                  style={{ 
                    width: '200px', 
                    height: '150px', 
                    objectFit: 'cover', 
                    margin: '20px', 
                    borderRadius: '8px',
                    border: '2px solid #fff',
                    boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* End Session Confirmation Modal */}
      {showEndConfirmation && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">End Session</h5>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to end this session early?</p>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowEndConfirmation(false);
                    socket.emit('reject-early-end', { sessionId });
                  }}
                >
                  Reject
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={() => {
                    socket.emit('accept-early-end', { sessionId });
                    handleSessionEnd();
                  }}
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinSession; 