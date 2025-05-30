import React from 'react';
import { FiVideo, FiMic, FiMicOff, FiVideoOff, FiShare2, FiPhone } from 'react-icons/fi';
import '../styles/VideoCalls.css';

const VideoCallsPage = ({ activeCall, isMuted, setIsMuted, videoEnabled, setVideoEnabled, screenSharing, setScreenSharing, handleEndCall }) => {
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
  };

  const toggleScreenShare = () => {
    setScreenSharing(!screenSharing);
  };

  return (
    <div className="video-calls-page">
      <h2><FiVideo /> Video Calls</h2>
      {activeCall ? (
        <div className="video-call-container">
          <div className="video-feed">
            <div className="user-video">
              {videoEnabled ? (
                <div className="video-preview">
                  <p>Your video feed</p>
                </div>
              ) : (
                <div className="video-off">
                  <FiVideoOff size={48} />
                  <p>Your camera is off</p>
                </div>
              )}
            </div>

            <div className="remote-video">
              <div className="video-preview">
                <p>{activeCall.user}'s video feed</p>
              </div>
            </div>
          </div>

          <div className="call-controls">
            <button
              className={`control-btn ${isMuted ? 'active' : ''}`}
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMuted ? <FiMicOff /> : <FiMic />}
              {isMuted ? 'Unmute' : 'Mute'}
            </button>

            <button
              className={`control-btn ${!videoEnabled ? 'active' : ''}`}
              onClick={toggleVideo}
              aria-label={videoEnabled ? 'Stop video' : 'Start video'}
            >
              {videoEnabled ? <FiVideo /> : <FiVideoOff />}
              {videoEnabled ? 'Stop Video' : 'Start Video'}
            </button>

            <button
              className={`control-btn ${screenSharing ? 'active' : ''}`}
              onClick={toggleScreenShare}
              aria-label={screenSharing ? 'Stop screen sharing' : 'Start screen sharing'}
            >
              <FiShare2 />
              {screenSharing ? 'Stop Sharing' : 'Share Screen'}
            </button>

            <button
              className="control-btn end-call"
              onClick={handleEndCall}
              aria-label="End call"
            >
              <FiPhone />
              End Call
            </button>
          </div>
        </div>
      ) : (
        <div className="no-active-call">
          <p>No active call. Start a call from your appointments or wait for an incoming call.</p>
        </div>
      )}
    </div>
  );
};

export default VideoCallsPage;
