// VideoCallAppointmentSystem.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBell,
  FiVideo,
  FiCalendar,
  FiUser,
  FiLogOut,
  FiCheck,
  FiX,
  FiMic,
  FiMicOff,
  FiVideoOff,
  FiShare2,
  FiPhone,
  FiHome,
  FiPhoneIncoming
} from 'react-icons/fi';
import VideoCallsPage from './VideoCalls';
import '../styles/VideoCallAppointmentSystem.css';


const VideoCallDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [incomingCalls, setIncomingCalls] = useState([]);
  const [showCallNotification, setShowCallNotification] = useState(false);
  const [currentCaller, setCurrentCaller] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    purpose: 'career-guidance',
    notes: ''
  });
  const newAppt = {
    id: Date.now(),
    user: newAppointment.name,
    email: newAppointment.email, 
    role: 'Student',
    date: newAppointment.date,
    time: newAppointment.time,
    purpose: newAppointment.purpose,
    status: 'pending-confirmation', 
    online: false,
    notes: newAppointment.notes
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.notifications-container')) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  useEffect(() => {
    let leaveTimer;
  
    if (activeCall) {
      leaveTimer = setTimeout(() => {
        setNotifications(prev => [
          {
            id: Date.now(),
            title: 'Caller Left',
            message: `${activeCall.user} has left the call.`,
            time: 'Just now',
            read: false
          },
          ...prev
        ]);
        alert(`${activeCall.user} has left the call.`);
        setActiveCall(null);
      }, Math.random() * 5000 + 5000);
    }
  
    return () => clearTimeout(leaveTimer);
  }, [activeCall]);

  useEffect(() => {
    setNotifications([
      {
        id: 1,
        title: 'New Appointment Request',
        message: 'Jane Smith requested a video call for Report Clarifications',
        time: '2 days ago',
        read: false
      },
      {
        id: 2,
        title: 'Appointment Status Update',
        message: 'Your appointment with Ahmed El Sayed for Internship Review is now in progress.',
        time: '1 hour ago',
        read: false
      },
      {
        id: 3,
        title: 'Appointment Confirmed',
        message: 'Your appointment with Michael Chen for Grant Proposal Discussion is confirmed for 2025-05-18 at 2:15 PM.',
        time: '3 days ago',
        read: true
      },
      {
        id: 4,
        title: 'New Appointment Request',
        message: 'Sarah Johnson requested a video call for Internship Review',
        time: '4 days ago',
        read: false
      },
      {
        id: 5,
        title: 'Appointment Confirmed',
        message: 'Your appointment with Carlos Rodriguez for Collaboration Opportunity is confirmed for 2025-05-20 at 3:30 PM.',
        time: '1 week ago',
        read: true
      }
    ]);

    setAppointments([
      {
        id: 1,
        user: 'Jane Smith',
        role: 'Student',
        date: '2025-05-16',
        time: '10:30',
        purpose: 'Report Clarifications',
        status: 'pending',
        online: false
      },
      {
        id: 2,
        user: 'Ahmed El Sayed',
        role: 'Intern',
        date: '2025-05-17',
        time: '09:00',
        purpose: 'Internship Review',
        status: 'in-progress',
        online: true
      },
      {
        id: 3,
        user: 'Michael Chen',
        role: 'Student',
        date: '2025-05-18',
        time: '14:15',
        purpose: 'Follow Up',
        status: 'confirmed',
        online: true
      },
      {
        id: 4,
        user: 'Sarah Johnson',
        role: 'Intern',
        date: '2025-05-19',
        time: '11:00',
        purpose: 'Internship Review',
        status: 'pending',
        online: false
      },
      {
        id: 5,
        user: 'Carlos Rodriguez',
        role: 'Intern',
        date: '2025-05-20',
        time: '15:30',
        purpose: 'Follow Up',
        status: 'confirmed',
        online: true
      }
    ]);
    setNewAppointment({
      name: '',
      email: '',
      date: '',
      time: '',
      purpose: 'career-guidance',
      notes: ''
    });
    const callInterval = setInterval(() => {
      if (!activeCall && Math.random() > 0.1) {
        const callerNames = ['Ahmed El Sayed', 'Michael Chen', 'Carlos Rodriguez'];
        const roles = ['Student', 'Intern'];
        const purposes = ['Admission Query', 'Document Verification', 'Appointment Follow-up', 'Internship Review'];
        
        const newCall = {
          id: Date.now(),
          user: callerNames[Math.floor(Math.random() * callerNames.length)],
          role: roles[Math.floor(Math.random() * roles.length)],
          purpose: purposes[Math.floor(Math.random() * purposes.length)],
          time: new Date().toLocaleTimeString()
        };
    
        setIncomingCalls(prev => [newCall, ...prev]);
        setCurrentCaller(newCall);
        setShowCallNotification(true);
    
        setNotifications(prev => [{
          id: Date.now(),
          title: 'Incoming Call',
          message: `${newCall.user} (${newCall.role}) is calling about ${newCall.purpose}`,
          time: 'Just now',
          read: false
        }, ...prev]);
    
        setTimeout(() => {
          if (showCallNotification) {
            setNotifications(prev => [...prev, {
              id: Date.now(),
              title: 'Missed Call',
              message: `Missed call from ${newCall.user} (${newCall.role})`,
              time: 'Just now',
              read: false
            }]);
            setShowCallNotification(false);
          }
        }, 30000);
      }
    }, 30000);

    return () => clearInterval(callInterval);
  }, [showCallNotification]);

  const handleRequestAppointment = () => {
    if (!newAppointment.name || !newAppointment.email || !newAppointment.date || 
        !newAppointment.time || !newAppointment.purpose) {
      alert('Please fill in all required fields: name, email, date, time, and purpose');
      return;
    }



    setAppointments([...appointments, newAppt]);
    setShowAppointmentModal(false);

  setNotifications([
    {
      id: notifications.length + 1,
      title: 'Appointment Requested',
      message: `${newAppointment.name} requested a video call for ${newAppointment.purpose} on ${newAppointment.date} at ${newAppointment.time}`,
      time: 'Just now',
      read: false
    },
    ...notifications
  ]);
};

  const handleAcceptAppointment = (id) => {
    const updatedAppointments = appointments.map(appt =>
      appt.id === id ? { ...appt, status: 'confirmed' } : appt
    );
    setAppointments(updatedAppointments);

    const acceptedAppt = appointments.find(appt => appt.id === id);
    setNotifications([
      {
        id: notifications.length + 1,
        title: 'Appointment Accepted',
        message: `You accepted the appointment with ${acceptedAppt.user} on ${acceptedAppt.date} at ${acceptedAppt.time}`,
        time: 'Just now',
        read: false
      },
      ...notifications
    ]);
  };
  const handleClearNotifications = () => {
    setNotifications([]);
  };
  const handleRejectAppointment = (id) => {
    const rejectedAppt = appointments.find(appt => appt.id === id);
    const updatedAppointments = appointments.filter(appt => appt.id !== id);
    setAppointments(updatedAppointments);

    setNotifications([
      {
        id: notifications.length + 1,
        title: 'Appointment Rejected',
        message: `You rejected the appointment with ${rejectedAppt.user}`,
        time: 'Just now',
        read: false
      },
      ...notifications
    ]);
  };

  const handleStartCall = (appointment) => {
    if (!appointment.online) {
      alert('Cannot start call: User is offline');
      return;
    }
    setActiveCall(appointment);
    setActiveTab('video-calls');
  };

  const handleEndCall = () => {
    setNotifications([
      {
        id: notifications.length + 1,
        title: 'Call Ended',
        message: `Your call with ${activeCall.user} has ended`,
        time: 'Just now',
        read: false
      },
      ...notifications
    ]);
    alert(`Call ended with ${activeCall.user}`);
    setActiveCall(null);
  };

  const handleIncomingCall = (caller) => {
    setIncomingCall(caller);

    setNotifications(prev => [{
      id: Date.now(),
      title: 'Incoming Call',
      message: `${caller.user} (${caller.role}) is calling about ${caller.purpose}`,
      time: 'Just now',
      read: false
    }, ...prev]);
    setTimeout(() => {
      if (incomingCall) {
        setNotifications([
          {
            id: notifications.length + 1,
            title: 'Missed Call',
            message: `Missed call from ${caller.user}`,
            time: 'Just now',
            read: false
          },
          ...notifications
        ]);
        setIncomingCall(null);
      }
    }, 30000);
  };

  const handleAcceptIncomingCall = () => {
    setActiveCall(incomingCall);
    setIncomingCall(null);
    setActiveTab('video-calls');
  };

  const handleRejectIncomingCall = () => {
    setNotifications([
      {
        id: notifications.length + 1,
        title: 'Call Rejected',
        message: `You rejected the call from ${incomingCall.user}`,
        time: 'Just now',
        read: false
      },
      ...notifications
    ]);
    setIncomingCall(null);
  };

  const handleAcceptCall = () => {
    setActiveCall(currentCaller);
    setShowCallNotification(false);
    setActiveTab('video-calls');
    setNotifications(prev => [...prev, {
      id: Date.now(),
      title: 'Call Accepted',
      message: `You accepted call from ${currentCaller.user}`,
      time: 'Just now',
      read: false
    }]);
  };

  const handleRejectCall = () => {
    setShowCallNotification(false);
    setNotifications(prev => [...prev, {
      id: Date.now(),
      title: 'Call Rejected',
      message: `You rejected call from ${currentCaller.user}`,
      time: 'Just now',
      read: false
    }]);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
  };

  const toggleScreenShare = () => {
    setScreenSharing(!screenSharing);
  };

  // Mark individual notification as read when clicked
  const handleNotificationClick = (index) => {
    if (!notifications[index].read) {
      const updatedNotifications = [...notifications];
      updatedNotifications[index].read = true;
      setNotifications(updatedNotifications);
    }
  };

  return (
    <div className="dashboard-wrapper" role="main">
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Link to="/scad-dashboard" className="dashboard-redirect-btn" aria-label="Go back to SCAD Dashboard">
            <FiHome className="dashboard-icon" /> SCAD Dashboard
          </Link>
        </div>

        <div className="sidebar-menu">
          <div className="sidebar-nav">
            <button className={`sidebar-btn ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')} aria-label="View appointments">
              <FiCalendar /> Appointments
            </button>
            <button className={`sidebar-btn ${activeTab === 'video-calls' ? 'active' : ''}`} onClick={() => setActiveTab('video-calls')} aria-label="View video calls">
              <FiVideo /> Video Calls
            </button>
            <button className={`sidebar-btn ${activeTab === 'incoming-calls' ? 'active' : ''}`} onClick={() => setActiveTab('incoming-calls')} aria-label="View incoming calls">
              <FiPhoneIncoming /> Incoming Calls
            </button>
          </div>

          <div className="sidebar-divider"></div>

          <button className="sidebar-btn logout-btn" aria-label="Log out">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>
            {activeTab === 'appointments' && 'Appointments'}
            {activeTab === 'video-calls' && 'Video Calls'}
            {activeTab === 'incoming-calls' && 'Incoming Calls'}
          </h1>

          <div className="user-info">
            <div className="notifications-container">
              <button
                className="notification-btn"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label={`View notifications (${notifications.filter(n => !n.read).length} unread)`}
              >
                <FiBell />
                {notifications.some(n => !n.read) && (
                  <span className="notification-badge">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="notifications-dropdown" role="dialog" aria-label="Notifications">
                  <h4>Notifications</h4>
                  <button onClick={handleClearNotifications} className="clear-btn">Clear All</button>
                  <ul>
                    {notifications.map((notification, index) => (
                      <li
                        key={notification.id}
                        onClick={() => handleNotificationClick(index)}
                        style={{ color: notification.read ? 'inherit' : 'red', cursor: 'pointer' }}
                      >
                        <p>{notification.title || 'Notification'}</p>
                        <small>{notification.message}</small>
                        <small style={{ display: 'block', marginTop: '5px' }}>{notification.time}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-main">
          {activeTab === 'appointments' && (
            <div className="dashboard-card full-width">
              <div className="insights-header">
                <h2><FiCalendar /> My Appointments</h2>
                <button className="btn btn-primary" onClick={() => setShowAppointmentModal(true)} aria-label="Request new appointment">
                  <FiCalendar /> Request Appointment
                </button>
              </div>

              <div className="applications-list">
                {appointments.length === 0 ? <p>No appointments scheduled</p> : (
                  appointments.map(appointment => (
                    <div key={appointment.id} className="application-item">
                      <div>
                        <h3>{appointment.user} ({appointment.role})</h3>
                        <p>{appointment.date} at {appointment.time} - {appointment.purpose}</p>
                        <small>Status: {appointment.status} {appointment.online ? '(Online)' : '(Offline)'}</small>
                      </div>
                      <div className="action-buttons">
                        {appointment.status === 'pending' && (
                          <>
                            <button className="btn btn-success" onClick={() => handleAcceptAppointment(appointment.id)} aria-label="Accept appointment">
                              <FiCheck /> Accept
                            </button>
                            <button className="btn btn-danger" onClick={() => handleRejectAppointment(appointment.id)} aria-label="Reject appointment">
                              <FiX /> Reject
                            </button>
                          </>
                        )}
                        {appointment.status !== 'pending' && (
                          <button className={`btn btn-primary ${!appointment.online ? 'disabled' : ''}`} onClick={() => handleStartCall(appointment)} disabled={!appointment.online} aria-label="Start call">
                            <FiVideo /> Start Call
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

{activeTab === 'video-calls' && (
  <VideoCallsPage
    activeCall={activeCall}
    isMuted={isMuted}
    setIsMuted={setIsMuted}
    videoEnabled={videoEnabled}
    setVideoEnabled={setVideoEnabled}
    screenSharing={screenSharing}
    setScreenSharing={setScreenSharing}
    handleEndCall={handleEndCall}
  />
)}


          {activeTab === 'incoming-calls' && (
            <div className="dashboard-card full-width">
              <h2><FiPhoneIncoming /> Recent Calls</h2>
              <div className="applications-list">
                {incomingCalls.length === 0 ? <p>No recent calls</p> : (
                  incomingCalls.map(call => (
                    <div key={call.id} className="application-item">
                      <div>
                        <h3>{call.user} ({call.role})</h3>
                        <p>{call.purpose} - {call.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showAppointmentModal && (
        <div
          className="modal-overlay appointment-overlay"
          onClick={(e) => {
            if (e.target.className.includes('modal-overlay')) setShowAppointmentModal(false);
          }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal appointment-modal">
            <div className="modal-header">
              <h3>Request Video Call Appointment</h3>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="appointment-name">Student's Name</label>
                <input
                  id="appointment-name"
                  type="text"
                  value={newAppointment.name}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, name: e.target.value })
                  }
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="appointment-email">Email Address</label>
                <input
                  id="appointment-email"
                  type="email"
                  value={newAppointment.email}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, email: e.target.value })
                  }
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="appointment-date">Date</label>
                <input
                  id="appointment-date"
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, date: e.target.value })
                  }
                  min={new Date().toISOString().split('T')[0]}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="appointment-time">Time</label>
                <input
                  id="appointment-time"
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, time: e.target.value })
                  }
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="appointment-purpose">Purpose</label>
                <select
                  id="appointment-purpose"
                  value={newAppointment.purpose}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, purpose: e.target.value })
                  }
                  className="form-control"
                >
                  <option value="career-guidance">Career Guidance</option>
                  <option value="report-clarifications">Report Clarifications</option>
                  <option value="internship-support">Internship Support</option>
                  <option value="academic-advising">Academic Advising</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="appointment-notes">Additional Notes</label>
                <textarea
                  id="appointment-notes"
                  value={newAppointment.notes}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, notes: e.target.value })
                  }
                  placeholder="Please provide any specific topics you'd like to discuss..."
                  className="form-control"
                  rows="3"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAppointmentModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleRequestAppointment}
                disabled={!newAppointment.date || !newAppointment.time}
              >
                Request Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {incomingCall && !activeCall && (
        <div className="modal-overlay incoming-call-overlay" aria-modal="true" role="dialog">
          <div className="modal incoming-call-modal">
            <div className="modal-header">
              <h3>Incoming Video Call</h3>
            </div>

            <div className="modal-body">
              <div className="caller-info">
                <div className="caller-avatar" aria-hidden="true">
                  <FiUser size={48} />
                </div>
                <h4>{incomingCall.user} ({incomingCall.role})</h4>
                <p>{incomingCall.purpose}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-danger" onClick={handleRejectIncomingCall}>
                <FiX /> Decline
              </button>
              <button className="btn btn-success" onClick={handleAcceptIncomingCall}>
                <FiVideo /> Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {showCallNotification && (
        <div className="incoming-call-notification" role="alert">
          <div className="notification-content">
            <FiPhone size={24} className="notification-icon" aria-hidden="true" />
            <div>
              <h4>Incoming Call: {currentCaller.user}</h4>
              <p>{currentCaller.purpose}</p>
            </div>
          </div>

          <div className="notification-actions">
            <button className="btn btn-danger btn-sm" onClick={handleRejectCall} aria-label="Reject call">
              <FiX /> Reject
            </button>
            <button className="btn btn-success btn-sm" onClick={handleAcceptCall} aria-label="Accept call">
              <FiCheck /> Accept
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCallDashboard;
