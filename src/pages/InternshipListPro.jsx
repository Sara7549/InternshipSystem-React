import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/Dashboard.css';
import '../styles/InternshipsList.css';

const InternshipListingPro = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [paidFilter, setPaidFilter] = useState('');

  // Application modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [certFile, setCertFile] = useState(null);

  useEffect(() => {
    const mockInternships = [
      { 
        id: 1, company: 'Tech Solutions Inc.', jobTitle: 'Software Developer Intern',
        industry: 'Technology', duration: '3 months', compensation: '$1500/month', isPaid: true, deadline: '2023-06-30'
      },
      { 
        id: 2, company: 'Green Energy Co.', jobTitle: 'Sustainability Analyst Intern',
        industry: 'Energy', duration: '6 months', compensation: '$1200/month', isPaid: true, deadline: '2023-07-15'
      },
      { 
        id: 3, company: 'Creative Design Studio', jobTitle: 'UX/UI Design Intern',
        industry: 'Design', duration: '3 months', compensation: '$1000/month', isPaid: true, deadline: '2023-06-25'
      },
      { 
        id: 4, company: 'Global Marketing Group', jobTitle: 'Digital Marketing Intern',
        industry: 'Marketing', duration: '4 months', compensation: '$0', isPaid: false, deadline: '2023-07-05'
      },
      { 
        id: 5, company: 'Architectural Innovations', jobTitle: 'Architectural Visualization Intern',
        industry: 'Architecture', duration: '6 months', compensation: '$1600/month', isPaid: true, deadline: '2023-08-10'
      },
      { 
        id: 6, company: 'Fashion Forward', jobTitle: 'Fashion Design Intern',
        industry: 'Fashion', duration: '3 months', compensation: 'Unpaid', isPaid: false, deadline: '2023-06-20'
      },
      { 
        id: 7, company: 'Sound Studios', jobTitle: 'Sound Design Intern',
        industry: 'Audio Production', duration: '4 months', compensation: '$1250/month', isPaid: true, deadline: '2023-07-30'
      },
      { 
        id: 8, company: 'Interactive Media Labs', jobTitle: 'Game Development Intern',
        industry: 'Gaming', duration: '6 months', compensation: '$1800/month', isPaid: true, deadline: '2023-08-15'
      }
    ];

    setInternships(mockInternships);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewDetails = (internshipId) => {
    navigate(`/internship-details/${internshipId}`);
  };

  const handleApplyClick = (internship) => {
    setSelectedInternship(internship);
    setShowModal(true);
    setCoverLetter('');
    setCvFile(null);
    setCertFile(null);
  };

  const handleApplySubmit = () => {
    const newApp = {
      internshipId: selectedInternship.id,
      internshipTitle: selectedInternship.jobTitle,
      company: selectedInternship.company,
      applicant: user.name,
      coverLetter,
      cvFile,
      certFile,
      status: 'Pending',
      submittedDate: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('applications') || '[]');
    localStorage.setItem('applications', JSON.stringify([...existing, newApp]));

    alert('Application submitted successfully!');
    setShowModal(false);
  };

  const industries = [...new Set(internships.map(i => i.industry))];
  const durations = [...new Set(internships.map(i => i.duration))];

  const filteredInternships = internships.filter(internship =>
    (internship.company.toLowerCase().includes(search.toLowerCase()) ||
      internship.jobTitle.toLowerCase().includes(search.toLowerCase())) &&
    (industryFilter ? internship.industry === industryFilter : true) &&
    (durationFilter ? internship.duration === durationFilter : true) &&
    (paidFilter === ''
      ? true
      : paidFilter === 'paid'
      ? internship.isPaid
      : !internship.isPaid)
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>SCAD Internships</h1>
        <div className="user-info">
          <span>Welcome, {user.name}</span>
          <button onClick={() => navigate('/pro-student-dashboard')} className="back-btn">Back to Dashboard</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-card full-width">
          <h2>Available Internships</h2>
          <div className="filter-container">
            <input
              type="text"
              placeholder="Search by company or job title"
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
              {industries.map((ind, i) => (
                <option key={i} value={ind}>{ind}</option>
              ))}
            </select>
            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Durations</option>
              {durations.map((dur, i) => (
                <option key={i} value={dur}>{dur}</option>
              ))}
            </select>
            <select
              value={paidFilter}
              onChange={(e) => setPaidFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          <div className="internships-list">
            {filteredInternships.length > 0 ? (
              filteredInternships.map(internship => (
                <div key={internship.id} className="internship-card">
                  <h3 className="internship-title">{internship.jobTitle}</h3>
                  <p className="internship-company">{internship.company}</p>
                  <p className="internship-duration">Duration: {internship.duration}</p>
                  <p className="internship-compensation">
                    {internship.isPaid ? internship.compensation : 'Unpaid'}
                  </p>
                  <p className="internship-deadline">Deadline: {internship.deadline}</p>
                  <div className="internship-actions">
                    <button onClick={() => handleApplyClick(internship)} className="apply-btn">Apply</button>
                    <button onClick={() => handleViewDetails(internship.id)} className="details-btn">View Details</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No internships available matching your criteria</p>
            )}
          </div>
        </section>
      </main>

      {/* Application Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Apply for {selectedInternship.jobTitle}</h2>
            <textarea
              placeholder="Write your cover letter here..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              style={{ width: '100%', marginBottom: '10px' }}
            />
            <div style={{ marginBottom: '10px' }}>
              <label>Upload CV: <input type="file" onChange={(e) => setCvFile(e.target.files[0]?.name)} /></label>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Upload Certificate: <input type="file" onChange={(e) => setCertFile(e.target.files[0]?.name)} /></label>
            </div>
            <div className="modal-actions">
              <button onClick={handleApplySubmit} className="submit-btn">Submit Application</button>
              <button onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipListingPro;