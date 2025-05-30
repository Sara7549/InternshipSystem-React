import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/Dashboard.css';

const ProStudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for dashboard data
  const [notifications, setNotifications] = useState([]);
  const [profileViews, setProfileViews] = useState([]);
  const [assessmentScores, setAssessmentScores] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Static data (replace with API calls in production)
  const proFeatures = [
    'Priority internship matching',
    'Exclusive company events',
    'Resume review sessions',
    'Mentorship program access',
    'Premium job alerts',
  ];

  const exclusiveInternships = [
    { id: 1, title: 'AI Research Intern', company: 'Future Tech Labs', deadline: '2025-07-10' },
    { id: 2, title: 'UX Design Lead Intern', company: 'Creative Digital', deadline: '2025-07-15' },
  ];

  const suggestedCompanies = [
    { id: 1, name: 'Innovatech', industry: 'Technology' },
    { id: 2, name: 'EcoBuild Ltd.', industry: 'Construction' },
    { id: 3, name: 'HealthPlus', industry: 'Healthcare' },
  ];

  const internships = [
    { id: '1', title: 'Software Engineer Intern', company: 'TechCorp', status: 'current', duration: 3 },
    { id: '2', title: 'Marketing Intern', company: 'MarketMasters', status: 'completed', duration: 3 },
    { id: '3', title: 'Data Analyst Intern', company: 'DataWorld', status: 'completed', duration: 3 },
  ];

  const majors = [
    {
      name: 'Computer Science',
      semesters: 8,
      courses: ['Algorithms', 'Data Structures', 'AI', 'Operating Systems'],
      videoUrl: 'https://www.youtube.com/embed/gfDE2a7MKjA',
    },
    {
      name: 'Design',
      semesters: 8,
      courses: ['Typography', 'UX/UI', 'Motion Graphics'],
      videoUrl: 'https://www.youtube.com/embed/Ovj4hFxko7c',
    },
    {
      name: 'Business Administration',
      semesters: 8,
      courses: ['Finance 101', 'Microeconomics', 'Business Ethics'],
      videoUrl: 'https://www.youtube.com/embed/GLk7-imcjiI',
    },
    {
      name: 'Mechanical Engineering',
      semesters: 8,
      courses: ['Thermodynamics', 'Fluid Mechanics', 'Materials Science'],
      videoUrl: 'https://www.youtube.com/embed/Y5KD77hB6PM',
    },
  ];

  // Authorization & loading
  useEffect(() => {
    if (user) {
      setIsLoading(false);
      if (user.userType !== 'pro-student') {
        navigate('/unauthorized');
      }
    } else {
      const authCheckTimer = setTimeout(() => {
        if (!user) {
          navigate('/login', { state: { message: 'Please log in to access your dashboard' } });
        }
      }, 1000);
      return () => clearTimeout(authCheckTimer);
    }
  }, [user, navigate]);

  // Load notifications, profile views, and assessment scores
  useEffect(() => {
    if (!user) return;

    const notificationKey = `notifications_${user.id}`;
    let storedNotifs = JSON.parse(localStorage.getItem(notificationKey)) || [];

    // Internship cycle notification
    if (!storedNotifs.some(n => n.message.includes('internship cycle'))) {
      storedNotifs.push({
        id: Date.now() + 1,
        message: '🚀 A new internship cycle has started! Apply now!',
        date: new Date().toLocaleString(),
      });
    }

    localStorage.setItem(notificationKey, JSON.stringify(storedNotifs));
    setNotifications(storedNotifs);

    // Profile views
    const viewsKey = `views_${user.id}`;
    const storedViews = localStorage.getItem(viewsKey);
    if (!storedViews) {
      const simulatedViews = ['TechCorp', 'MarketMasters', 'Designify', 'GreenBuild Inc.', 'BuzzNow Media'];
      localStorage.setItem(viewsKey, JSON.stringify(simulatedViews));
      setProfileViews(simulatedViews);
    } else {
      setProfileViews(JSON.parse(storedViews));
    }

    // Assessment scores
    const scoresKey = `assessment_scores_${user.email}`;
    const scores = JSON.parse(localStorage.getItem(scoresKey)) || [];
    setAssessmentScores(scores);
    
  }, [user]);

  // Filter internships
  const filteredInternships = internships.filter((internship) => {
    return (
      (internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterStatus === '' || internship.status === filterStatus)
    );
  });

  // Completed months count
  const completedMonths = internships
    .filter((i) => i.status === 'completed')
    .reduce((total, i) => total + (i.duration || 0), 0);

  // Selected major info
  const selectedMajor = user?.major ? majors.find((m) => m.name === user.major) : null;

  // Handlers
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fix handleApply: accept internship object and save application properly
  const handleApply = (internship) => {
    if (!internship) return alert('Applied.');

    // New application object
    const newApplication = {
      internshipId: internship.id,
      internshipTitle: internship.title,
      company: internship.company,
      applicant: user.name,
      status: 'Pending',  // initial status
      submittedDate: new Date().toISOString()
    };

    // Fetch existing applications
    const existingApps = JSON.parse(localStorage.getItem('applications') || '[]');

    // Check duplicates
    const duplicate = existingApps.find(app =>
      app.applicant === user.name &&
      app.internshipId === internship.id
    );
    if (duplicate) {
      return alert('You have already applied to this internship.');
    }

    // Save new applications list
    const updatedApps = [...existingApps, newApplication];
    localStorage.setItem('applications', JSON.stringify(updatedApps));

    alert(`Applied to premium internship: ${internship.title}`);

    // Optionally, you can update local state or provide feedback here
  };

  // Navigate to evaluation
  const handleNavigateToEvaluation = (internship) => {
    navigate(`/internship/${internship.id}/evaluation2`, { state: { internship } });
  };

  // Navigate to company details with state preservation
  const handleCompanyDetails = (companyId) => {
    sessionStorage.setItem('dashboardReturnState', JSON.stringify({
      searchQuery,
      filterStatus
    }));
    navigate(`/company-details-pro/${companyId}`);
  };

  // Restore dashboard state on mount
  useEffect(() => {
    const savedState = sessionStorage.getItem('dashboardReturnState');
    if (savedState) {
      const { searchQuery: savedQuery, filterStatus: savedFilter } = JSON.parse(savedState);
      setSearchQuery(savedQuery || '');
      setFilterStatus(savedFilter || '');
      sessionStorage.removeItem('dashboardReturnState');
    }
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="dashboard-container loading">
        <h2>Loading your dashboard...</h2>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>
          PRO Student Dashboard{' '}
          {completedMonths >= 3 && <span className="status-badge accepted">🏅 PRO</span>}
        </h1>
        <div className="user-info">
          <span>Welcome, {user.name}</span>
          <button onClick={handleLogout} className="logout-btn" aria-label="Log out">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">

        {/* Notifications */}
        {notifications.length > 0 && (
          <section
            className="dashboard-card full-width"
            style={{ background: '#fff9db', borderLeft: '6px solid #ffc107' }}
          >
            <h3>Notifications</h3>
            <ul>
              {notifications.map((notif) => (
                <li key={notif.id} style={{ marginBottom: '10px' }}>
                  <p>{notif.message}</p>
                  <small>{notif.date}</small>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* My Profile */}
        <section className="dashboard-card">
          <h2>My Profile</h2>
          <p>
            <strong>Major:</strong> {user.major || 'Not specified'}
          </p>
          <p>
            <strong>Semester:</strong> {user.semester || 'Not specified'}
          </p>
          <p><strong>Job Interests:</strong> {user.jobInterests || 'Not specified'}</p>
          <p><strong>Previous Experience:</strong> {user.previousExperience || 'Not specified'}</p>
          <p><strong>College Activities:</strong> {user.collegeActivities || 'Not specified'}</p>

          {assessmentScores.length > 0 && (
            <div>
              <h4>🧠 Assessment Scores</h4>
              <ul>
                {assessmentScores.map((score, idx) => (
                  <li key={idx}>
                    {score.title}: {score.score}%
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => navigate('/edit-profile')}
            className="action-btn"
            aria-label="Edit profile"
          >
            Edit Profile
          </button>
        </section>

        {/* PRO Benefits */}
        <section className="dashboard-card">
          <h2>PRO Benefits</h2>
          <ul className="pro-features" role="list">
            {proFeatures.map((feature, index) => (
              <li key={index} role="listitem">
                {feature}
              </li>
            ))}
          </ul>
        </section>

        {/* Profile Views */}
        <section className="dashboard-card">
          <h2>Companies That Viewed My Profile</h2>
          {profileViews.length > 0 ? (
            <ul className="majors-list" role="list">
              {profileViews.map((company, index) => (
                <li key={index} role="listitem">
                  👀 {company}
                </li>
              ))}
            </ul>
          ) : (
            <p>No companies have viewed your profile yet.</p>
          )}
        </section>

        {/* Suggested Companies */}
        <section className="dashboard-card">
          <h2>Suggested Companies</h2>
          <div className="suggested-list">
            {suggestedCompanies.map((company) => (
              <div key={company.id} className="suggested-item">
                <h3>{company.name}</h3>
                <p>Industry: {company.industry}</p>
                <button
                  onClick={() => handleCompanyDetails(company.id)}
                  className="details-btn"
                  aria-label={`View details for ${company.name}`}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Exclusive Internships */}
        <section className="dashboard-card full-width">
          <h2>Exclusive Internships</h2>
          <div className="suggested-list">
            {exclusiveInternships.map((internship) => (
              <div key={internship.id} className="suggested-item">
                <div>
                  <h3>{internship.title} (PRO Exclusive)</h3>
                  <p>Company: {internship.company}</p>
                  <small>Application Deadline: {internship.deadline}</small>
                </div>
                <button
                  onClick={() => handleApply(internship)}
                  className="apply-btn"
                  aria-label={`Apply to ${internship.title}`}
                  disabled={new Date(internship.deadline) < new Date()}
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* My Internships */}
        <section className="dashboard-card full-width">
          <h2>My Internships</h2>
          <input
            type="text"
            placeholder="Search by job title or company"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Search internships"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
            aria-label="Filter by internship status"
          >
            <option value="">All</option>
            <option value="current">Current Internships</option>
            <option value="completed">Completed Internships</option>
          </select>
          <div className="internship-list">
            {filteredInternships.length > 0 ? (
              filteredInternships.map((internship) => (
                <div key={internship.id} className="internship-item">
                  <h3>{internship.title}</h3>
                  <p>
                    <strong>Company:</strong> {internship.company}
                  </p>
                  <p>
                    <strong>Status:</strong> {internship.status}
                  </p>
                  {internship.status === 'completed' && (
                    <div className="button-group">
                      <button
                        onClick={() => handleNavigateToEvaluation(internship)}
                        className="action-btn"
                        aria-label={`Evaluate ${internship.title}`}
                      >
                        Evaluate Internship
                      </button>
                      <button
                        onClick={() => navigate(`/internship/${internship.id}/reportpro`, { state: { internship } })}
                        className="action-btn"
                        aria-label={`Write report for ${internship.title}`}
                      >
                        Write Report
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No internships match your criteria.</p>
            )}
          </div>
        </section>

        {/* Internship Reports */}
        <section className="dashboard-card">
          <h2>Internship Reports</h2>
          <button
            onClick={() => navigate('/view-report')}
            className="action-btn"
            aria-label="Manage reports"
          >
            Manage Reports
          </button>
        </section>

        {/* Career Workshops */}
        <section className="dashboard-card">
          <h2>Career Workshops</h2>
          <button
            onClick={() => navigate('/workshops')}
            className="action-btn"
            aria-label="View career workshops"
          >
            View Workshops
          </button>
        </section>

        {/* Internship Listings */}
        <section className="dashboard-card">
          <h2>Internship Listings</h2>
          <button
            onClick={() => navigate('/internships')}
            className="action-btn"
            aria-label="Browse internships"
          >
            Browse Internships
          </button>
        </section>

        {/* My Applications */}
        <section className="dashboard-card">
          <h2>My Applications</h2>
          <button
            onClick={() => navigate('/my-applications')}
            className="action-btn"
            aria-label="View application status"
          >
            View Status
          </button>
        </section>

        {/* Online Assessments */}
        <section className="dashboard-card">
          <h2>Online Assessments</h2>
          <button
            onClick={() => navigate('/assessments')}
            className="action-btn"
            aria-label="Start assessment"
          >
            Start Assessment
          </button>
        </section>

        {/* Career Coaching */}
        <section className="dashboard-card">
          <h2>Career Coaching</h2>
          <button
            onClick={() => navigate('/schedule-session')}
            className="action-btn"
            aria-label="Schedule coaching session"
          >
            Schedule Session
          </button>
        </section>

        {/* Internship Evaluations
        <section className="dashboard-card">
          <h2>Internship Evaluations</h2>
          <button
            onClick={() => navigate('/view-evaluation')}
            className="action-btn"
            aria-label="View evaluations"
          >
            View Evaluations
          </button>
        </section>*/ }

        {/* Available Majors */}
        <section className="dashboard-card full-width">
          <h2>Available Majors and Semesters</h2>
          <ul className="majors-list" role="list">
            {majors.map((major, index) => (
              <li key={index} role="listitem">
                <strong>{major.name}:</strong> {major.semesters} semesters
              </li>
            ))}
          </ul>
        </section>

        {/* Major-Specific Content */}
        {selectedMajor && (
          <>
            <section className="dashboard-card full-width">
              <h2>Courses in {selectedMajor.name}</h2>
              <ul className="majors-list" role="list">
                {selectedMajor.courses.map((course, idx) => (
                  <li key={idx} role="listitem">
                    {course}
                  </li>
                ))}
              </ul>
            </section>

            <section className="dashboard-card full-width">
              <h2>Internships That Count Toward {selectedMajor.name}</h2>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={selectedMajor.videoUrl}
                  title={`Information about internships for ${selectedMajor.name}`}
                  allow="accelerometer; encrypted-media; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                  }}
                />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default ProStudentDashboard;