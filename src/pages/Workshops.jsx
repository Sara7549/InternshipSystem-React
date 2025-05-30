import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Workshops = () => {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isPro = user?.userType === 'pro-student';

  const [registeredLive, setRegisteredLive] = useState(false);
  const [registeredVideo, setRegisteredVideo] = useState(false);
  const [liveStarted, setLiveStarted] = useState(false);
  const [liveFeedback, setLiveFeedback] = useState('');
  const [videoFeedback, setVideoFeedback] = useState('');
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState('');

  // New: chat & live notes
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [liveNotes, setLiveNotes] = useState('');
  const [savedLiveNotes, setSavedLiveNotes] = useState('');

  useEffect(() => {
    setRegisteredLive(false);
    setRegisteredVideo(false);
    setLiveStarted(false);
    setChatMessages([]);
  }, []);

  const handleLiveRegister = () => {
    setRegisteredLive(true);
    alert("🔔 You're registered! You’ll be notified when the live workshop begins.");
    setTimeout(() => {
      alert('📢 The live workshop is starting now!');
      setLiveStarted(true);
    }, 5000);
  };

  const handleVideoRegister = () => {
    setRegisteredVideo(true);
    alert("📼 You've registered for the pre-recorded workshop!");
  };

  const handleSaveNotes = () => {
    setSavedNotes(notes);
    alert('📝 Notes saved!');
  };

  const handleSubmitFeedback = (type) => {
    alert(`✅ ${type === 'live' ? 'Live' : 'Video'} workshop feedback submitted!`);
    if (type === 'live') setLiveFeedback('');
    else setVideoFeedback('');
  };

  const generateCertificate = () => {
    const certificateText = `
      Certificate of Attendance
      This certifies that ${user.name} attended the Live Career Workshop.
    `;
    const blob = new Blob([certificateText], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Certificate.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSendChat = () => {
    if (chatInput.trim() !== '') {
      setChatMessages([...chatMessages, { user: user.name, message: chatInput }]);
      setChatInput('');
    }
  };

  const handleSaveLiveNotes = () => {
    setSavedLiveNotes(liveNotes);
    alert('✅ Live notes saved!');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Career Workshops</h1>
        <div className="user-info">
          <span>{user.name}</span>
          <button onClick={() => navigate(-1)} className="back-btn">Back to Dashboard</button>
        </div>
      </header>

      {/* LIVE WORKSHOP */}
      <section className="dashboard-card full-width">
        <h2>🟢 Live Workshop: How to Succeed in Tech Interviews</h2>
        <p><strong>Speaker:</strong> Jane Smith, Lead Recruiter at TechCorp</p>
        <p><strong>Time:</strong> Today at 5:00 PM</p>

        {!registeredLive && isPro && (
          <button onClick={handleLiveRegister} className="action-btn">Register</button>
          
        )}
        {/* <button onClick={navigate("/view-details-pro")} className="action-btn">View Details</button>
        <button onClick={navigate()} className="action-btn">Join Live</button> */}

        {registeredLive && liveStarted && (
          <>
            <div className="video-placeholder">[🟢 Live Stream Window Simulation]</div>

            {/* Live Chat Box */}
            <div style={{ marginTop: '20px' }}>
              <h4>💬 Live Chat</h4>
              <div style={{ maxHeight: '150px', overflowY: 'auto', background: '#f1f1f1', padding: '10px', marginBottom: '10px' }}>
                {chatMessages.map((msg, i) => (
                  <p key={i}><strong>{msg.user}:</strong> {msg.message}</p>
                ))}
              </div>
              <input
                type="text"
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{ width: '80%', marginRight: '10px' }}
              />
              <button onClick={handleSendChat} className="action-btn">Send</button>
            </div>

            {/* Live Notes */}
            <div style={{ marginTop: '20px' }}>
              <h4>📝 Take Notes During Workshop</h4>
              <textarea
                value={liveNotes}
                onChange={(e) => setLiveNotes(e.target.value)}
                placeholder="Write your live notes here..."
                rows={4}
                style={{ width: '100%' }}
              />
              <button onClick={handleSaveLiveNotes} className="action-btn">Save Notes</button>
              {savedLiveNotes && (
                <div style={{ marginTop: '10px', background: '#f1f1f1', padding: '10px' }}>
                  <h4>📓 Your Live Notes:</h4>
                  <p>{savedLiveNotes}</p>
                </div>
              )}
            </div>

            {/* Feedback and Certificate */}
            <textarea
              value={liveFeedback}
              onChange={(e) => setLiveFeedback(e.target.value)}
              placeholder="Write your feedback..."
              rows={4}
              style={{ width: '100%', marginTop: '12px' }}
            />
            <button onClick={() => handleSubmitFeedback('live')} className="action-btn">Submit Feedback</button>
            <button onClick={generateCertificate} className="action-btn" style={{ background: 'green', marginLeft: '12px' }}>
              Download Certificate
            </button>
          </>
        )}
      </section>

      {/* PRE-RECORDED WORKSHOP */}
      <section className="dashboard-card full-width">
        <h2>📼 Pre-recorded Workshop: Top Interview Tips</h2>
        <p><strong>Speaker:</strong> Career Coach Team</p>

        {!registeredVideo && isPro && (
          <button onClick={handleVideoRegister} className="action-btn">Register</button>
        )}

        {registeredVideo && (
          <>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src="https://www.youtube.com/embed/9P9kNwFJFjQ?si=6CdUdp8laBtOtTkr"
                title="Interview Skills Workshop"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Take your notes here..."
              rows={5}
              style={{ width: '100%', marginTop: '12px' }}
            />
            <button onClick={handleSaveNotes} className="action-btn">Save Notes</button>
            {savedNotes && (
              <div style={{ marginTop: '10px', background: '#f1f1f1', padding: '10px' }}>
                <h4>📓 Your Saved Notes:</h4>
                <p>{savedNotes}</p>
              </div>
            )}

            <textarea
              value={videoFeedback}
              onChange={(e) => setVideoFeedback(e.target.value)}
              placeholder="Your feedback about this video..."
              rows={4}
              style={{ width: '100%', marginTop: '12px' }}
            />
            <button onClick={() => handleSubmitFeedback('video')} className="action-btn">Submit Feedback</button>
          </>
        )}
      </section>
    </div>
  );
};



export default Workshops;

