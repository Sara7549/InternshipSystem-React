// NOUR
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/SubmittedReports.css';
import {
  FaUserGraduate, FaFileAlt, FaBriefcase,
  FaChalkboardTeacher, FaChartBar, FaVideo
} from 'react-icons/fa';

const SubmittedReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [majorFilter, setMajorFilter] = useState('all');
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const mockReports = [
      {
        id: 1,
        studentName: 'Alice Johnson',
        title: 'AI Internship at Google',
        submissionDate: '2025-04-15',
        status: 'Accepted',
        major: 'Computer Science',
        hasEvaluation: true
      },
      {
        id: 2,
        studentName: 'Bob Smith',
        title: 'Design Thinking Report',
        submissionDate: '2025-04-20',
        status: 'Rejected',
        major: 'Graphic Design',
        hasEvaluation: true
      },
      {
        id: 3,
        studentName: 'Charlie Brown',
        title: 'Architecture Internship Reflection',
        submissionDate: '2025-04-18',
        status: 'Pending',
        major: 'Architecture',
        hasEvaluation: true
      },
      {
        id: 4,
        studentName: 'Eve White',
        title: 'Social Media Internship Report',
        submissionDate: '2025-04-25',
        status: 'Flagged',
        major: 'Digital Media',
        hasEvaluation: false
      }
    ];

    setTimeout(() => {
      try {
        setReports(mockReports);
        setFilteredReports(mockReports);
        setLoading(false);
      } catch (err) {
        setError('Failed to load reports.');
        setLoading(false);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = reports.filter((report) => {
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      const matchesMajor = majorFilter === 'all' || report.major === majorFilter;
      return matchesStatus && matchesMajor;
    });
    setFilteredReports(filtered);
  }, [statusFilter, majorFilter, reports]);

  const uniqueMajors = [...new Set(reports.map(r => r.major))];

  if (loading) return <div className="reports-loading">Loading reports...</div>;
  if (error) return <div className="reports-error">{error}</div>;

  return (
    <div className="reports-page">
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <div className="sidebar-header">
            <h3>SCAD Admin</h3>
          </div>
          <div className="sidebar-menu">
            <button onClick={() => navigate('/scad-dashboard')}><FaChartBar /> Dashboard</button>
            <button onClick={() => navigate('/students')}><FaUserGraduate /> Students</button>
            <button onClick={() => navigate('/video-call-dashboard')}><FaVideo /> Appointments</button>
            <button onClick={() => navigate('/internships-list')}><FaBriefcase /> Internships</button>
            <button onClick={() => navigate('/submitted-reports')} className="active"><FaFileAlt /> Reports</button>
            <button onClick={() => navigate('/career-workshops')}><FaChalkboardTeacher /> Workshops</button>
            <button onClick={() => navigate('/internship-insights-report')}><FaFileAlt /> Generate Reports</button>
            <div className="sidebar-divider"></div>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </nav>
      </aside>

      <main className="reports-main">
      

        <h1 className="reports-title">Submitted Reports</h1>

        <div className="filters-container">
          <div className="filter-group">
            <label>Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="Pending">Pending</option>
              <option value="Flagged">Flagged</option>
              <option value="Rejected">Rejected</option>
              <option value="Accepted">Accepted</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Major:</label>
            <select value={majorFilter} onChange={(e) => setMajorFilter(e.target.value)}>
              <option value="all">All</option>
              {uniqueMajors.map((major, idx) => (
                <option key={idx} value={major}>{major}</option>
              ))}
            </select>
          </div>
        </div>

        <table className="reports-table">
          <thead>
            <tr className="table-header">
              <th>Student Name</th>
              <th>Major</th>
              <th>Report Title</th>
              <th>Submission Date</th>
              <th>Status</th>
              <th>Internship Report</th>
              <th>Evaluation Report</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id}>
                <td>{report.studentName}</td>
                <td>{report.major}</td>
                <td>{report.title}</td>
                <td>{report.submissionDate}</td>
                <td>{report.status}</td>
                <td>
                  <button
                    onClick={() => navigate(`/submitted-reports/${report.id}`)}
                    className="view-report-button"
                  >
                    View
                  </button>
                </td>
                <td>
                  {report.hasEvaluation ? (
                    <button
                      onClick={() => navigate(`/evaluation-report/${report.id}`)}
                      className="view-report-button"
                    >
                      View
                    </button>
                  ) : (
                    <span style={{ color: '#999' }}>Not Available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default SubmittedReportsPage;
