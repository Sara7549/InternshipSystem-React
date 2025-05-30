import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/Dashboard.css';
import '../styles/InternshipsList.css';
import coursesByMajor from './coursesByMajor';
import UploadDocument from './UploadDocument';
import InternshipVideo from "./InternshipVideo";
import '../styles/InternshipVideo.css';


const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();


  const handleApply = (internship) => {
  // Check if the internship is already applied
  if (!appliedInternships.some((applied) => applied.id === internship.id)) {
    // Update the internship state to change the status to 'pending'
    setInternships((prevInternships) =>
      prevInternships.map((int) =>
        int.id === internship.id ? { ...int, status: 'pending' } : int
      )
    );

    // Add the internship to the appliedInternships state
    setAppliedInternships((prevApplied) => [...prevApplied, { ...internship, status: 'pending' }]);
  }
};

  const handleViewDetails = (internshipId) => {
    navigate(`/internship-details-student/${internshipId}`);
  };

  const [profile, setProfile] = useState({
    major: '',
    semester: '',
    interests: '', // Job interests (e.g., "Technology, Marketing")
    activities: '',
  });

  const [internships, setInternships] = useState([
    {
      id: 1,
      title: 'Software Engineer Intern',
      company: 'TechCorp',
      industry: 'Technology',
      duration: '2 months',
      paid: true,
      status: 'available',
      recommendedBy: ['John Doe', 'Alice Smith'],
    },
    {
      id: 2,
      title: 'Marketing Intern',
      company: 'MarketMasters',
      industry: 'Marketing',
      duration: '4 months',
      paid: false,
      status: 'completed',
      recommendedBy: [],
    },
    {
      id: 3,
      title: 'Data Analyst Intern',
      company: 'DataWorld',
      industry: 'Data Analytics',
      duration: '6 months',
      paid: true,
      status: 'available',
      recommendedBy: ['Jane Doe'],
    },
    {
      id: 4,
      title: 'UI/UX Designer Intern',
      company: 'DesignPros',
      industry: 'Design',
      duration: '6 months',
      paid: true,
      status: 'available',
      recommendedBy: [],
    },
    {
      id: 5,
      title: 'Business Analyst Intern',
      company: 'BizAnalytics',
      industry: 'Business',
      duration: '6 months',
      paid: true,
      status: 'available',
      recommendedBy: ['Emily Johnson'],
    },
    {
      id: 6,
      title: 'Graphic Designer Intern',
      company: 'CreativeArts',
      industry: 'Design',
      duration: '4 months',
      paid: false,
      status: 'current',
      recommendedBy: [],
    },
    {
      id: 7,
      title: 'Cybersecurity Intern',
      company: 'SecureTech',
      industry: 'Cybersecurity',
      duration: '4 months',
      paid: true,
      status: 'available',
      recommendedBy: ['Michael Brown'],
    },
    {
      id: 8,
      title: 'Content Writer Intern',
      company: 'WriteNow',
      industry: 'Marketing',
      duration: '2 months',
      paid: false,
      status: 'completed',
      recommendedBy: [],
    },
    {
      id: 9,
      title: 'Machine Learning Intern',
      company: 'FutureAI',
      industry: 'Technology',
      duration: '6 months',
      paid: true,
      status: 'available',
      recommendedBy: ['Sophia Wilson'],
    },
    {
      id: 10,
      title: 'Product Manager Intern',
      company: 'InnovateHub',
      industry: 'Business',
      duration: '4 months',
      paid: true,
      status: 'available',
      recommendedBy: [],
    },
  ]);

  const [appliedInternships, setAppliedInternships] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterDuration, setFilterDuration] = useState('');
  const [filterPaid, setFilterPaid] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Your internship application has been accepted!', date: '2025-05-14T10:30:00' },
    { id: 2, message: 'A new internship opportunity is available for your major.', date: '2025-05-13T14:15:00' },
    { id: 3, message: 'Your report submission has been reviewed.', date: '2025-05-12T09:45:00' },
  ]);
  const [comments, setComments] = useState([
    { id: 1, text: 'Great job on your report! Keep up the good work.', date: '2025-05-10T16:00:00' },
    { id: 2, text: 'Please clarify the second section of your report.', date: '2025-05-09T12:30:00' },
    { id: 3, text: 'Your report has been flagged for missing details.', date: '2025-05-08T08:45:00' },
  ]);
  const [fileName] = useState('Internship_Guide.pdf');
  const [appealMessage, setAppealMessage] = useState('');

  const filteredInternships = internships.filter((internship) => {
    return (
      (internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!filterIndustry || internship.industry === filterIndustry) &&
      (!filterDuration || internship.duration === filterDuration) &&
      (!filterPaid || (filterPaid === 'paid' ? internship.paid : !internship.paid)) &&
      (!filterStatus || internship.status === filterStatus)
    );
  });

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleFilterIndustry = (e) => setFilterIndustry(e.target.value);
  const handleFilterDuration = (e) => setFilterDuration(e.target.value);
  const handleFilterPaid = (e) => setFilterPaid(e.target.value);
  const handleFilterStatus = (e) => setFilterStatus(e.target.value);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (user) {
      const storedProfile = JSON.parse(localStorage.getItem(`profile_${user.email}`));
      if (storedProfile) {
        setProfile(storedProfile);
      } else {
        setProfile({
          major: user.major || 'Not specified',
          semester: user.semester || 'Not specified',
          interests: 'Not specified',
          activities: 'Not specified',
        });
      }
    }
  }, [user]);

// Load selected courses from localStorage when the component mounts
useEffect(() => {
  const savedCourses = JSON.parse(localStorage.getItem("selected_courses")) || [];
  setSelectedCourses(savedCourses);
}, []);

const handleCourseSelection = (course) => {
  const updatedCourses = selectedCourses.includes(course)
    ? selectedCourses.filter((c) => c !== course) // Remove if already selected
    : [...selectedCourses, course]; // Add if not selected

  setSelectedCourses(updatedCourses);
  localStorage.setItem("selected_courses", JSON.stringify(updatedCourses)); // Save to localStorage
};

// Fetch Report Status, Comments, and Notifications
useEffect(() => {
  // Merge dummy data with stored notifications
  const storedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
  const internshipCycleNotifications = [
    {
      id: 100, // Ensure unique IDs for new notifications
      message: "The new internship cycle has just started!",
      date: new Date().toISOString(),
    },
    {
      id: 101,
      message: "The new internship cycle is about to begin. Make sure to prepare your applications!",
      date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Combine stored notifications, cycle notifications, and dummy notifications
  const defaultNotifications = [
    { id: 1, message: 'Your internship application has been accepted!', date: '2025-05-14T10:30:00' },
    { id: 2, message: 'A new internship opportunity is available for your major.', date: '2025-05-13T14:15:00' },
    { id: 3, message: 'Your report submission has been reviewed.', date: '2025-05-12T09:45:00' },
  ];
  setNotifications([...defaultNotifications, ...storedNotifications, ...internshipCycleNotifications]);

  // Merge dummy comments with stored comments
  const storedComments = JSON.parse(localStorage.getItem("report_comments")) || [];
  const defaultComments = [
    { id: 1, text: 'Please clarify the second section of your report.', date: '2025-05-09T12:30:00' },
    { id: 2, text: 'Your report has been flagged for missing details.', date: '2025-05-08T08:45:00' },
  ];
  setComments([...defaultComments, ...storedComments]);
}, []);
// Handle Appeal Submission
const handleAppealSubmit = () => {
  if (appealMessage.trim() === "") {
    alert("Please provide a message for your appeal.");
    return;
  }

  // Mock API call to submit the appeal
  const appeals = JSON.parse(localStorage.getItem("report_appeals")) || [];
  appeals.push({ message: appealMessage, date: new Date().toISOString() });
  localStorage.setItem("report_appeals", JSON.stringify(appeals));

  alert("Your appeal has been submitted.");
  setAppealMessage(""); // Reset appeal message
};

const handleDownload = () => {
  const content = "This is a guide to help you understand the internship process.";
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};



  // Logic for Suggested Companies Based on Interests
  const suggestedCompanies = internships.filter((internship) => {
    if (!profile.interests) return false;

    // Split interests by commas or spaces, and remove extra whitespace
    const interestsArray = profile.interests
      .split(',')
      .map((interest) => interest.trim().toLowerCase());

    // Check if any interest matches the internship industry
    return interestsArray.some((interest) =>
      internship.industry.toLowerCase().includes(interest)
    );
  });

return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="dashboard-main">
        
        {/* My Profile Section */}
        <section className="dashboard-card">
          <h2>My Profile</h2>
          <p><strong>Major:</strong> {profile.major}</p>
          <p><strong>Semester:</strong> {profile.semester}</p>
          <p><strong>Job Interests:</strong> {profile.interests}</p>
          <p><strong>College Activities:</strong> {profile.activities}</p>
          <h3>Previous Internships & Part-Time Jobs:</h3>
          {profile.previousJobs && profile.previousJobs.length > 0 ? (
            <ul>
              {profile.previousJobs.map((job, index) => (
                <li key={index}>
                  <p><strong>Company:</strong> {job.company}</p>
                  <p><strong>Duration:</strong> {job.duration}</p>
                  <p><strong>Responsibilities:</strong> {job.responsibilities}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No previous internships or part-time jobs added yet.</p>
          )}
          <button onClick={() => navigate('/edit-profile-student')} className="action-btn">Edit Profile</button>
        </section>

        {/* Available Courses Section */}
        <section className="dashboard-card">
          <h2>Available Courses for {profile.major}</h2>
          {coursesByMajor[profile.major] && coursesByMajor[profile.major].length > 0 ? (
            <div className="courses-list">
              <h3>Select Courses That Helped You During Your Internship</h3>
              <ul>
                {coursesByMajor[profile.major].map((course) => (
                  <li key={course}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course)}
                        onChange={() => handleCourseSelection(course)}
                      />
                      {course}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No courses available for your major.</p>
          )}
        </section>

        {/* Applied Internships Section */}
        <section className="dashboard-card">
          <h2>Applied Internships</h2>
          <div className="applied-list">
            {appliedInternships.map((application) => (
              <div key={application.id} className="applied-item">
                <h3>{application.title}</h3>
                <p>Company: {application.company}</p>
                <p>Status: {application.status}</p>
                <button onClick={() => navigate(`/internship-details-student/${application.id}`)} className="details-btn">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </section>

       {/* Notifications Section */}
        <section className="dashboard-card">
          <h2>Notifications</h2>
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <p>{notification.message}</p>
                  <small>{new Date(notification.date).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications yet.</p>
          )}
        </section>

        {/* Submit Reports Section */}
        <section className="dashboard-card">
          <h2>Submit Reports</h2>
          <button onClick={() => navigate('/reportsStudent')} className="action-btn">Manage My Reports</button>
        </section>

         {/* Report Comments Section */}
        <section className="dashboard-card">
          <h2>Report Comments</h2>
          {comments.length > 0 ? (
            <ul>
              {comments.map((comment) => (
                <li key={comment.id}>
                  <p>{comment.text}</p>
                  <small>{new Date(comment.date).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments provided.</p>
          )}
        </section>


        {/* Appeal Report Section */}
        <section className="dashboard-card">
          <h2>Appeal Report</h2>
          <textarea
            value={appealMessage}
            onChange={(e) => setAppealMessage(e.target.value)}
            placeholder="Write your appeal message here..."
            rows={4}
            style={{ width: "100%" }}
          />
          <button onClick={handleAppealSubmit} className="action-btn">Submit Appeal</button>
        </section>

        {/* Upload Documents Section */}
        <section className="dashboard-card">
          <UploadDocument />
        </section>
        
        {/* Download Documents Section */}
        <section className="dashboard-card full-width">
          <h2>Download Documents</h2>
          <p>Here you can download the internship guide to help you understand the workflow.</p>
          <button onClick={handleDownload} className="action-btn">
            Download {fileName}
          </button>
        </section>

       <section className="dashboard-card full-width">
  <h2>Suggested Companies</h2>
  {suggestedCompanies.length > 0 ? (
    <div className="suggested-list">
      {suggestedCompanies.map((internship) => (
        <div key={internship.id} className="suggested-item">
          <h3>{internship.company}</h3>
          <p>Industry: {internship.industry}</p>
          {internship.recommendedBy.length > 0 && (
            <p>Recommended by: {internship.recommendedBy.join(', ')}</p>
          )}
          <div className="internship-actions">
            <button
              onClick={() => handleApply(internship)}
              className="apply-btn"
              disabled={internship.status === 'pending'}
            >
              {internship.status === 'pending' ? 'Applied' : 'Apply'}
            </button>
            <button
              onClick={() => navigate(`/internship-details-student/${internship.id}`)}
              className="details-btn"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p>No suggested companies based on your interests.</p>
  )}
</section>

        {/* Internship Video Section */}
        <section className="dashboard-card full-width">
          <div className="internship-video">
            <InternshipVideo major={profile.major} />
          </div>
        </section>

        {/* Available Internships Section */}
        <section className="dashboard-card full-width">
          <h2>Available Internships</h2>
          <div className="filter-container">
            <input
              type="text"
              placeholder="Search by company or job title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <select value={filterIndustry} onChange={(e) => setFilterIndustry(e.target.value)} className="filter-select">
              <option value="">All Industries</option>
              {Array.from(new Set(internships.map((int) => int.industry))).map((industry, index) => (
                <option key={index} value={industry}>{industry}</option>
              ))}
            </select>
            <select value={filterDuration} onChange={(e) => setFilterDuration(e.target.value)} className="filter-select">
              <option value="">All Durations</option>
              {Array.from(new Set(internships.map((int) => int.duration))).map((duration, index) => (
                <option key={index} value={duration}>{duration}</option>
              ))}
            </select>
            <select value={filterPaid} onChange={(e) => setFilterPaid(e.target.value)} className="filter-select">
              <option value="">All</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
          <div className="internships-list">
            {filteredInternships.length > 0 ? (
              filteredInternships.map((internship) => (
                <div key={internship.id} className="internship-card">
                  <h3 className="internship-title">{internship.title}</h3>
                  <p className="internship-company">{internship.company}</p>
                  <p className="internship-duration">Duration: {internship.duration}</p>
                  <p className="internship-industry">Industry: {internship.industry}</p>
                  <p className="internship-paid">{internship.paid ? 'Paid' : 'Unpaid'}</p>
                  <div className="internship-actions">
                    <button onClick={() => handleApply(internship)} className="apply-btn" disabled={appliedInternships.some((applied) => applied.id === internship.id)}>
                      {appliedInternships.some((applied) => applied.id === internship.id) ? 'Applied' : 'Apply'}
                    </button>
                    <button onClick={() => handleViewDetails(internship.id)} className="details-btn">View Details</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No internships available matching your criteria</p>
            )}
          </div>
        </section>

        {/* My Past and Present Internships */}
        <section className="dashboard-card full-width">
          <h2>Past and Present Internships</h2>
          <div className="internships-list">
            {filteredInternships
              .filter((internship) => internship.status === 'current' || internship.status === 'completed')
              .map((internship) => (
                <div key={internship.id} className="internship-card">
                  <h3 className="internship-title">{internship.title}</h3>
                  <p><strong>Company:</strong> {internship.company}</p>
                  <p><strong>Duration:</strong> {internship.duration}</p>
                  <p><strong>Industry:</strong> {internship.industry}</p>
                  <p><strong>Status:</strong> {internship.status === 'current' ? 'Current Intern' : 'Completed Internship'}</p>
                  {internship.status === 'completed' && (
                    <button onClick={() => navigate(`/internship/${internship.id}/evaluation`)} className="action-btn">Evaluate Internship</button>
                  )}
                </div>
              ))
            }
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;