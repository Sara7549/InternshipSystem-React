import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
  FaBell, FaUserGraduate, FaCalendarAlt, FaFileAlt, FaBriefcase,
  FaChalkboardTeacher, FaChartBar, FaBars, FaTimes, FaCog, FaUserShield,
  FaVideo
} from 'react-icons/fa';
import '../styles/InternshipsList.css'

const ScadInternships = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [paidFilter, setPaidFilter] = useState('');


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
<aside className="sidebar">
  <nav className="sidebar-nav">
    <div className="sidebar-header">
      <h3>SCAD Admin</h3>
    </div>
    <div className="sidebar-menu">
      <button onClick={() => navigate('/scad-dashboard')} ><FaChartBar /> Dashboard</button>
      <button onClick={() => navigate('/students')}><FaUserGraduate /> Students</button>
      <button onClick={() => navigate('/video-call-dashboard')}><FaVideo /> Appointments</button>
      <button onClick={() => navigate('/internships-list')} className="active"><FaBriefcase /> Internships</button>
      <button onClick={() => navigate('/submitted-reports')}><FaFileAlt /> Reports</button>
      <button onClick={() => navigate('/career-workshops')}><FaChalkboardTeacher /> Workshops</button>
      <button onClick={() => navigate('/internship-insights-report')}><FaFileAlt /> Generate Reports</button>
      <div className="sidebar-divider"></div>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  </nav>
</aside>
      <main className="dashboard-main dashboard-main-internshipslist">
        
        <section className="dashboard-card full-width">
        <div className="header-container">
  <div className="header-title-container">
    <h2>Available Internships</h2>
  </div>
</div>
          
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
                    <button 
                      onClick={() => handleViewDetails(internship.id)} 
                      className="details-btn"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No internships available matching your criteria</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ScadInternships;