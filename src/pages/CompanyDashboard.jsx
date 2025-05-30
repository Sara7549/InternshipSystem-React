//SAMA
import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import { MOCK_STUDENTS } from '../data/mockStudents';
import { HARDCODED_INTERNSHIPS } from '../data/mockInternships';
import { HARDCODED_APPLICATIONS } from '../data/mockApplications';

const CompanyDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  // Company registration state
  const [companyName, setCompanyName] = useState(user?.name || '');
  const [industry, setIndustry] = useState(user?.industry || '');
  const [companySize, setCompanySize] = useState(user?.companySize || '');
  const [companyLogo, setCompanyLogo] = useState(null);
  const [officialEmail, setOfficialEmail] = useState(user?.email || '');
  const [taxDocument, setTaxDocument] = useState(null);

  // Internship state
  const [internships, setInternships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [applications, setApplications] = useState(HARDCODED_APPLICATIONS);

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Load internships, applications, and notifications
  useEffect(() => {
    if (user) {
      // Load internships
      const savedInternships = localStorage.getItem(`internships_${user.email}`);
      let loadedInternships = savedInternships
        ? JSON.parse(savedInternships)
        : HARDCODED_INTERNSHIPS;

      // Update internship statuses
      const currentDate = new Date();
      loadedInternships = loadedInternships.map(internship => {
        const deadlineDate = new Date(internship.deadline);
        if (currentDate > deadlineDate && internship.status === 'Open') {
          return { ...internship, status: 'Closed' };
        }
        return internship;
      });

      setInternships(loadedInternships);
      localStorage.setItem(`internships_${user.email}`, JSON.stringify(loadedInternships));

      // Update global internships
      const allInternships = JSON.parse(localStorage.getItem('allInternships')) || [];
      const otherCompaniesInternships = allInternships.filter(
        int => int.companyId !== user.email
      );
      localStorage.setItem(
        'allInternships',
        JSON.stringify([...otherCompaniesInternships, ...loadedInternships])
      );

      // Load applications
      const savedApplications = localStorage.getItem(`applications_${user.email}`);
      if (savedApplications) {
        setApplications(JSON.parse(savedApplications));
      } else {
        localStorage.setItem(`applications_${user.email}`, JSON.stringify(HARDCODED_APPLICATIONS));
        setApplications(HARDCODED_APPLICATIONS);
      }

      // Load or generate notifications
      const savedNotifications = localStorage.getItem(`notifications_${user.email}`);
      let loadedNotifications = savedNotifications ? JSON.parse(savedNotifications) : [];

      // Generate dummy notifications if none exist
      if (loadedNotifications.length === 0) {
        const newNotifications = MOCK_STUDENTS.slice(0, 3).map((student, index) => {
          const internship = loadedInternships[index % loadedInternships.length] || HARDCODED_INTERNSHIPS[0];
          return {
            id: `notif-${Date.now() + index}`,
            type: 'new_application',
            studentName: student.name,
            internshipTitle: internship.title,
            timestamp: new Date().toISOString(),
            read: false,
          };
        });
        loadedNotifications = newNotifications;
        localStorage.setItem(`notifications_${user.email}`, JSON.stringify(loadedNotifications));
      }

      setNotifications(loadedNotifications);
    }
  }, [user]);

  // Handle outside click for notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    navigate('/login');
    return null;
  }

  const formatCurrency = (amount) => {
    if (!amount) return 'Unpaid';
    return new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(amount);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmitRegistration = (e) => {
    e.preventDefault();
    alert('Company information updated successfully!');
  };

  const handleCreateInternship = () => {
    navigate('/create-internship');
  };

  const handleEditInternship = (id) => {
    navigate(`/edit-internship/${id}`);
  };

  const handleDeleteInternship = (id) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      const updatedInternships = internships.filter(internship => internship.id !== id);
      setInternships(updatedInternships);
      localStorage.setItem(`internships_${user.email}`, JSON.stringify(updatedInternships));

      const allInternships = JSON.parse(localStorage.getItem('allInternships')) || [];
      const updatedAllInternships = allInternships.filter(int => int.id !== id);
      localStorage.setItem('allInternships', JSON.stringify(updatedAllInternships));

      const updatedApplications = { ...applications };
      delete updatedApplications[id];
      setApplications(updatedApplications);
      localStorage.setItem(`applications_${user.email}`, JSON.stringify(updatedApplications));

      alert('Internship deleted successfully!');
    }
  };

  const handleViewApplications = (internshipId) => {
    navigate(`/view-applications/${internshipId}`);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && notifications.some(n => !n.read)) {
      const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updatedNotifications);
      localStorage.setItem(`notifications_${user.email}`, JSON.stringify(updatedNotifications));
    }
  };

  const clearNotification = (id, e) => {
    e.stopPropagation();
    const updatedNotifications = notifications.filter(n => n.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications_${user.email}`, JSON.stringify(updatedNotifications));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem(`notifications_${user.email}`, JSON.stringify([]));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const filteredInternships = internships.filter(internship => {
    const matchesSearch =
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || internship.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case 'new_internship':
        return (
          <>
            <div className="notification-header">
              <span className="status-indicator accepted"></span>
              <h4>New Internship Created</h4>
              <button
                className="clear-notification"
                onClick={(e) => clearNotification(notification.id, e)}
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>
            <p>Your internship "{notification.internshipTitle}" has been created.</p>
          </>
        );
      case 'new_application':
        return (
          <>
            <div className="notification-header">
              <span className="status-indicator accepted"></span>
              <h4>New Application</h4>
              <button
                className="clear-notification"
                onClick={(e) => clearNotification(notification.id, e)}
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>
            <p>
              <strong>{notification.studentName}</strong> has applied to your internship
              "{notification.internshipTitle}".
            </p>
          </>
        );
      case 'application_status':
        return (
          <>
            <div className="notification-header">
              <span className={`status-indicator ${notification.status}`}></span>
              <h4>
                Internship {notification.status === 'accepted' ? 'Accepted' : 'Rejected'}
              </h4>
              <button
                className="clear-notification"
                onClick={(e) => clearNotification(notification.id, e)}
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>
            <p>
              Your internship "{notification.internshipTitle}" has been
              <strong> {notification.status}</strong>.
            </p>
          </>
        );
      default:
        return (
          <>
            <div className="notification-header">
              <span className="status-indicator"></span>
              <h4>Notification</h4>
              <button
                className="clear-notification"
                onClick={(e) => clearNotification(notification.id, e)}
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>
            <p>You have a new notification.</p>
          </>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Company Dashboard</h1>
        <div className="user-info">
          <div className="notification-bell" ref={notificationRef}>
            <div onClick={toggleNotifications}>
              🔔
              {unreadNotificationsCount > 0 && (
                <span className="notification-badge">{unreadNotificationsCount}</span>
              )}
            </div>
            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  {notifications.length > 0 && (
                    <button className="clear-all-btn" onClick={clearAllNotifications}>
                      Clear All
                    </button>
                  )}
                </div>
                {notifications.length > 0 ? (
                  <ul className="notifications-list">
                    {notifications.map(notification => (
                      <li
                        key={notification.id}
                        className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      >
                        <div className="notification-content">
                          {renderNotificationContent(notification)}
                          <span className="notification-time">
                            {new Date(notification.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-notifications">No notifications</p>
                )}
              </div>
            )}
          </div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main>
        <section className="company-info">
          <h2>Update Company Information</h2>
          <form onSubmit={handleSubmitRegistration}>
            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="industry">Industry</label>
              <select
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
              >
                <option value="">Select Industry</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail">Retail</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="companySize">Company Size</label>
              <select
                id="companySize"
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                required
              >
                <option value="">Select Size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501+">501+ employees</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="officialEmail">Official Email</label>
              <input
                type="email"
                id="officialEmail"
                value={officialEmail}
                onChange={(e) => setOfficialEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="companyLogo">Company Logo</label>
              <input
                type="file"
                id="companyLogo"
                onChange={(e) => setCompanyLogo(e.target.files[0])}
                accept="image/*"
              />
            </div>
            <div className="form-group">
              <label htmlFor="taxDocument">Tax Registration Document</label>
              <input
                type="file"
                id="taxDocument"
                onChange={(e) => setTaxDocument(e.target.files[0])}
                accept=".pdf,.doc,.docx"
              />
            </div>
            <button type="submit" className="submit-btn">Update Information</button>
          </form>
        </section>

        <section className="internship-management">
          <div className="section-header">
            <h2>Internship Management</h2>
            <button onClick={handleCreateInternship} className="create-btn">
              Create New Internship
            </button>
          </div>
          <div className="controls">
            <div className="search-control">
              <input
                type="text"
                placeholder="Search internships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-control">
              <label>Filter by Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Pending">Pending Approval</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
          {filteredInternships.length > 0 ? (
            <div className="internship-list">
              {filteredInternships.map((internship) => (
                <div key={internship.id} className="internship-card">
                  <div className="card-header">
                    <h3>{internship.title}</h3>
                    <span className={`status-badge ${internship.status}`}>
                      {internship.status || 'Open'}
                    </span>
                  </div>
                  <div className="card-details">
                    <p><strong>Duration:</strong> {internship.duration}</p>
                    <p><strong>Location:</strong> {internship.location}</p>
                    <p><strong>Compensation:</strong> {formatCurrency(internship.salary)}</p>
                    <p><strong>Deadline:</strong> {new Date(internship.deadline).toLocaleDateString()}</p>
                    <p>
                      <strong>Applications:</strong>
                      <span
                        className="applications-count"
                        onClick={() => handleViewApplications(internship.id)}
                      >
                        {applications[internship.id]?.length || 0}
                      </span>
                    </p>
                  </div>
                  <div className="">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditInternship(internship.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteInternship(internship.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleViewApplications(internship.id)}
                    >
                      View Applications
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-internships">
              {internships.length === 0
                ? 'No internships posted yet. Create your first internship!'
                : 'No internships match your search criteria.'}
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default CompanyDashboard;