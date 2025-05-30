import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import InternshipCycleManager from '../components/InternshipCycleManager';
import {
  FaBell, FaUserGraduate, FaCalendarAlt, FaFileAlt, FaBriefcase,
  FaChalkboardTeacher, FaChartBar, FaBars, FaTimes, FaCog, FaUserShield,
  FaVideo
} from 'react-icons/fa';
import '../styles/ScadDashboard.css';

const ScadDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const cycleRef = useRef(null);
  const [currentCycleDates, setCurrentCycleDates] = useState({
    startDate: '2024-05-15', // Initial value from the current cycle
    endDate: '2024-08-30'    // Initial value from the current cycle
  });
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    capacity: '',
    deadline: '',
    type: 'regular',
  });
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('companies');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  const [statistics] = useState({
    acceptedReports: 42,
    rejectedReports: 15,
    flaggedReports: 6,
    avgReviewTime: '3.4 days',
    topCourses: ['Machine Learning', 'UI/UX Design', 'Marketing Strategy'],
    topRatedCompanies: ['Google', 'EcoWear Collective', 'BuzzNow'],
    topInternshipCompanies: ['Google', 'Dribbble Labs', 'BuzzNow']
  });
  const [notificationsList, setNotificationsList] = useState([
    { id: 1, message: 'New company application: Tech Solutions Inc.', time: '10:30 AM' },
    { id: 2, message: 'Appointment request from student', time: 'Yesterday' },
    { id: 3, message: 'Internship report needs review', time: '2 days ago' },
    { id: 4, message: 'New career workshop scheduled', time: '3 days ago' }
  ]);
  const [readNotifications, setReadNotifications] = useState([]);
  const notificationsRef = useRef(null);
  
  
const handleChange = (e) => {
  const { id, value } = e.target;
  // Extract the property name by removing 'cycle-' prefix
  const propertyName = id.replace('cycle-', '');
  setFormData(prev => ({
    ...prev,
    [propertyName]: value
  }));
};
  const isValidDate = (dateString) => {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    return dateString.match(regEx) !== null;
  };
  const handleSaveDraft = () => {
    console.log("Saving as draft:", formData);
    alert("Cycle saved as draft.");
  };

  const handleCreateCycle = () => {
    console.log("Creating new cycle:", formData);
    alert("Cycle created.");
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      capacity: '',
      deadline: '',
      type: 'regular',
    });
    alert("Form cleared.");
  };

  const handleUpdateDates = () => {
    if (!currentCycleDates.startDate || !currentCycleDates.endDate) {
      alert("Please select both start and end dates");
      return;
    }
    
    if (currentCycleDates.startDate > currentCycleDates.endDate) {
      alert("End date cannot be before start date");
      return;
    }
  
    console.log("Updated cycle dates:", currentCycleDates);
    alert("Current cycle dates updated successfully!");
  };
  const handleNotificationClick = (id) => {
    if (!readNotifications.includes(id)) {
      setReadNotifications(prev => [...prev, id]);
    }
  };
  
  const handleClearNotifications = () => {
    setNotificationsList([]);
    setReadNotifications([]);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    const mockData = [
      { id: 1, name: 'Tech Solutions Inc.', industry: 'Technology', applicationDate: '2023-05-15' },
      { id: 2, name: 'Green Energy Co.', industry: 'Energy', applicationDate: '2023-05-18' },
      { id: 3, name: 'Dribbble Labs', industry: 'Design', applicationDate: '2023-05-20' },
      { id: 4, name: 'BuzzNow', industry: 'Marketing', applicationDate: '2023-05-22' },
      { id: 5, name: 'StudioArch', industry: 'Architecture', applicationDate: '2023-05-24' },
      { id: 6, name: 'EcoWear Collective', industry: 'Fashion', applicationDate: '2023-05-26' },
      { id: 7, name: 'SoundWave Studios', industry: 'Audio Production', applicationDate: '2023-05-28' },
      { id: 8, name: 'PixelPlay Interactive', industry: 'Gaming', applicationDate: '2023-05-30' },
    ];
    setPendingCompanies(mockData);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const scrollToCycleManager = () => {
    if (cycleRef.current) {
      cycleRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApprove = (companyId) => {
    setPendingCompanies(prev => prev.filter(c => c.id !== companyId));
    alert(`Company ${companyId} approved!`);
  };

  const handleReject = (companyId) => {
    setPendingCompanies(prev => prev.filter(c => c.id !== companyId));
    alert(`Company ${companyId} rejected!`);
  };

  const filteredCompanies = pendingCompanies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) &&
    (industryFilter ? c.industry === industryFilter : true)
  );

  // Handle navigation to video call dashboard with specific tab
  const navigateToVideoCallDashboard = (tab) => {
    navigate(`/video-call-dashboard?tab=${tab}`);
  };

  return (
    <div className="dashboard-wrapper">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        {sidebarOpen && (
          <nav className="sidebar-nav">
            <div className="sidebar-header">
              <h3>SCAD Admin</h3>
            </div>
            <div className="sidebar-menu">
              <button onClick={() => navigate('/scad-dashboard')} className="active"><FaChartBar /> Dashboard</button>
              <button onClick={() => navigate('/students')}><FaUserGraduate /> Students</button>
              <button onClick={() => navigate('/video-call-dashboard')}><FaVideo /> Appointments</button>
              <button onClick={() => navigate('/internships-list')}><FaBriefcase /> Internships</button>
              <button onClick={() => navigate('/submitted-reports')}><FaFileAlt /> Reports</button>
              <button onClick={() => navigate('/career-workshops')}><FaChalkboardTeacher /> Workshops</button>
              <button onClick={() => navigate('/internship-insights-report')}><FaFileAlt /> Generate Reports</button>
              <div className="sidebar-divider"></div>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </nav>
        )}
      </aside>

      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>SCAD Office Dashboard</h1>
          <div className="user-info">
            
            <div className="notifications-container" ref={notificationsRef}>
              <button onClick={() => setShowNotifications(!showNotifications)} className="notification-btn">
                <FaBell />
                {notificationsList.length > 0 && <span className="notification-badge">{notificationsList.length}</span>}
              </button>
              {showNotifications && (
                <div className="notifications-dropdown">
                  <h4>Notifications</h4>
                  <button onClick={handleClearNotifications} className="clear-btn">Clear All</button>
                  <ul>
                    {notificationsList.length === 0 ? (
                      <li><p>No notifications</p></li>
                    ) : (
                      notificationsList.map(notification => (
                        <li
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification.id)}
                          style={{
                            fontWeight: readNotifications.includes(notification.id) ? 'normal' : 'bold',
                            color: readNotifications.includes(notification.id) ? 'black' : 'red',
                            cursor: 'pointer'
                          }}
                        >
                          <p>{notification.message}</p>
                          <small>{notification.time}</small>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>

          </div>
        </header>

        <main className="dashboard-main">
          <section className="dashboard-card statistics-card">
            <div className="insights-header">
              <h2><FaChartBar /> Internship Insights</h2>
              
            </div>

            <div className="insights-summary">
              <div className="insight-metric">
                <span className="metric-value">{statistics.acceptedReports + statistics.rejectedReports + statistics.flaggedReports}</span>
                <span className="metric-label">Total Reports</span>
                <span className="metric-trend positive">↑ 12%</span>
              </div>
              <div className="insight-metric">
                <span className="metric-value">84%</span>
                <span className="metric-label">Placement Rate</span>
                <span className="metric-trend positive">↑ 5%</span>
              </div>
              <div className="insight-metric">
                <span className="metric-value">23</span>
                <span className="metric-label">Active Companies</span>
                <span className="metric-trend positive">↑ 3</span>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-box reports-box">
                <div className="stat-icon"><FaFileAlt /></div>
                <div className="stat-info">
                  <h3>{statistics.acceptedReports}</h3>
                  <p>Accepted Reports</p>
                  <div className="progress-bar">
                    <div className="progress" style={{ width: '67%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="stat-box reports-box">
                <div className="stat-icon"><FaFileAlt /></div>
                <div className="stat-info">
                  <h3>{statistics.rejectedReports}</h3>
                  <p>Rejected Reports</p>
                  <div className="progress-bar">
                    <div className="progress rejected" style={{ width: '24%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="stat-box reports-box">
                <div className="stat-icon"><FaFileAlt /></div>
                <div className="stat-info">
                  <h3>{statistics.flaggedReports}</h3>
                  <p>Flagged Reports</p>
                  <div className="progress-bar">
                    <div className="progress flagged" style={{ width: '9%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="stat-box">
                <div className="stat-icon time-icon"><FaCalendarAlt /></div>
                <div className="stat-info">
                  <h3>{statistics.avgReviewTime}</h3>
                  <p>Avg. Review Time</p>
                </div>
              </div>
            </div>

            <div className="insights-categories">
              <div className="category-section">
                <h4>Top Courses</h4>
                <ul className="category-list">
                  {statistics.topCourses.map((course, index) => (
                    <li key={index} className="category-item">
                      <span className="category-name">{course}</span>
                      <span className="category-count">{42 - index * 8}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="category-section">
                <h4>Top Rated Companies</h4>
                <ul className="category-list">
                  {statistics.topRatedCompanies.map((company, index) => (
                    <li key={index} className="category-item">
                      <span className="category-name">{company}</span>
                      <span className="category-rating">{5 - index * 0.2}/5</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="category-section">
                <h4>Most Internships</h4>
                <ul className="category-list">
                  {statistics.topInternshipCompanies.map((company, index) => (
                    <li key={index} className="category-item">
                      <span className="category-name">{company}</span>
                      <span className="category-count">{18 - index * 3}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          
          <section className="dashboard-card cycle-manager-wrapper" ref={cycleRef}>
  <div className="cycle-header">
    <h2><FaCalendarAlt /> Manage Current Internship Cycle</h2>
  </div>

  <div className="cycle-content">
    <div className="cycle-overview">
      <div className="current-cycle">
        <h3>Current Cycle</h3>
        <div className="cycle-card active">
          <div className="cycle-info">
            <div className="cycle-name">Summer 2024</div>
            <div className="cycle-date">{currentCycleDates.startDate} - {currentCycleDates.endDate}</div>
            <div className="cycle-status">Active</div>
          </div>
          <div className="cycle-stats">
            <div className="cycle-stat">
              <span className="stat-number">42</span>
              <span className="stat-label">Interns</span>
            </div>
            <div className="cycle-stat">
              <span className="stat-number">18</span>
              <span className="stat-label">Companies</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="cycle-form">
      <h3>Update Current Cycle Dates</h3>
      <div className="cycle-form-grid">
        <div className="form-group">
          <label htmlFor="current-startDate">Start Date</label>
          <input
            type="date"
            id="current-startDate"
            value={currentCycleDates.startDate}
            onChange={(e) => setCurrentCycleDates(prev => ({
              ...prev,
              startDate: e.target.value
            }))}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="current-endDate">End Date</label>
          <input
            type="date"
            id="current-endDate"
            value={currentCycleDates.endDate}
            onChange={(e) => setCurrentCycleDates(prev => ({
              ...prev,
              endDate: e.target.value
            }))}
            min={currentCycleDates.startDate}
            className="form-control"
          />
        </div>
      </div>

      <div className="cycle-actions-bottom">
      <button className="create-cycle-btn" onClick={handleUpdateDates}>
  Set Dates
</button>
      </div>
    </div>
  </div>
</section>

          <section className="dashboard-card full-width">
            <h2>Pending Company Applications</h2>
            <div className="filter-container">
              <input
                type="text"
                placeholder="Search by company name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Industries</option>
                {[...new Set(pendingCompanies.map(c => c.industry))].map((ind, i) => (
                  <option key={i} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            <div className="applications-list">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map(company => (
                  <div key={company.id} className="application-item">
                    <div>
                      <h3>{company.name}</h3>
                      <p>Industry: {company.industry}</p>
                      <small>Applied on: {company.applicationDate}</small>
                    </div>
                    <div className="action-buttons">
                      <button onClick={() => handleApprove(company.id)} className="approve-btn">Approve</button>
                      <button onClick={() => handleReject(company.id)} className="reject-btn">Reject</button>
                      <button onClick={() => navigate(`/company-details/${company.id}`)} className="details-btn">View Details</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No pending applications</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ScadDashboard;