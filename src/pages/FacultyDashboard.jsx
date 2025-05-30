import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import jsPDF from 'jspdf';
import '../styles/FacultyDashboard.css';

const FacultyDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    cycles: { accepted: 12, rejected: 3, flagged: 2 },
    averageReviewTime: "3.2 days",
    topCourses: ["CSEN401", "CSEN402", "DSGN201"],
    topRatedCompanies: [
      { name: "Google", rating: 4.9 },
      { name: "Microsoft", rating: 4.7 },
      { name: "Amazon", rating: 4.6 },
    ],
    topInternshipCompanies: [
      { name: "Tech Corp", count: 5 },
      { name: "Electro Inc", count: 4 },
      { name: "Designify", count: 3 },
    ]
  });

  const [reports, setReports] = useState([]);
  const [filterMajor, setFilterMajor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [clarificationOpen, setClarificationOpen] = useState({});
  const [clarificationError, setClarificationError] = useState({});
  const [clarificationSuccess, setClarificationSuccess] = useState({});

  useEffect(() => {
    const mockReports = [
      {
        id: 1,
        studentName: 'Alice Johnson',
        major: 'Computer Science',
        status: 'Pending',
        company: 'Google',
        title: 'Software Engineering Intern',
        description: 'Developed web applications using React and Node.js',
        submissionDate: '2025-05-01',
        hoursCompleted: 120,
        startDate: '2025-02-01',
        endDate: '2025-04-01',
        supervisor: 'Dr. Emily zhang',
        clarification: ''
      },
      {
        id: 2,
        studentName: 'Bob Smith',
        major: 'Graphical Designer',
        status: 'Accepted',
        company: 'Dribble Labs',
        title: 'Hardware Design Intern',
        description: 'Designed and prototyped innovative hardware components utilizing cutting-edge design principles.',
        submissionDate: '2025-04-28',
        hoursCompleted: 150,
        startDate: '2025-01-15',
        endDate: '2025-03-15',
        supervisor: 'Miss Luara Trent',
        clarification: ''
      },
      {
        id: 3,
        studentName: 'Charlie Brown',
        major: 'Architecture',
        status: 'Rejected',
        company: 'Archa Space',
        title: 'Data Analyst Intern',
        description: 'Conducted in-depth data analysis to support architectural projects and proposals.',
        submissionDate: '2025-04-20',
        hoursCompleted: 114,
        startDate: '2025-01-10',
        endDate: '2025-03-30',
        supervisor: 'eng. Marco Saed',
        clarification: ''
      }
    ];
    setReports(mockReports);
  }, []);

  // Authorization check
  if (!user || user.userType !== 'faculty') {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <h2>Unauthorized Access</h2>
          <p>You are not authorized to access the Faculty Dashboard. Please log in as a faculty member.</p>
          <button
            onClick={() => navigate('/login')}
            className="logout-btn"
            aria-label="Return to login"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  const filteredReports = reports.filter(report => (
    (filterMajor === '' || report.major === filterMajor) &&
    (filterStatus === '' || report.status === filterStatus)
  ));

  const updateReportStatus = (reportId, newStatus) => {
    const prevStatus = reports.find(r => r.id === reportId).status;
    setReports(reports.map(report =>
      report.id === reportId ? { ...report, status: newStatus } : report
    ));
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport({ ...selectedReport, status: newStatus });
    }
    setStats(prev => {
      const newStats = { ...prev.cycles };
      if (prevStatus !== newStatus) {
        newStats[prevStatus.toLowerCase()] = Math.max(0, newStats[prevStatus.toLowerCase()] - 1);
        newStats[newStatus.toLowerCase()] = (newStats[newStatus.toLowerCase()] || 0) + 1;
      }
      return { ...prev, cycles: newStats };
    });
  };

  const downloadReportAsPDF = (report) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Internship Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Student: ${report.studentName}`, 20, 30);
    doc.text(`Major: ${report.major}`, 20, 40);
    doc.text(`Status: ${report.status}`, 20, 50);
    doc.text(`Company: ${report.company}`, 20, 60);
    doc.text(`Title: ${report.title}`, 20, 70);
    doc.text(`Supervisor: ${report.supervisor}`, 20, 80);
    doc.text('Description:', 20, 90);
    const splitDescription = doc.splitTextToSize(report.description, 170);
    doc.text(splitDescription, 20, 100);
    doc.text(`Submission Date: ${report.submissionDate}`, 20, 120);
    doc.text(`Start Date: ${report.startDate}`, 20, 130);
    doc.text(`End Date: ${report.endDate}`, 20, 140);
    doc.text(`Hours Completed: ${report.hoursCompleted}`, 20, 150);
    if (report.clarification) {
      doc.text('Clarification:', 20, 160);
      const splitClarification = doc.splitTextToSize(report.clarification, 170);
      doc.text(splitClarification, 20, 170);
    }
    doc.save(`Internship_Report_${report.studentName}.pdf`);
  };

  const downloadStatsReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Faculty Dashboard Statistics Report', 20, 20);
    doc.setFontSize(12);
    doc.text('Cycle Statistics:', 20, 30);
    doc.text(`Accepted: ${stats.cycles.accepted}`, 20, 40);
    doc.text(`Rejected: ${stats.cycles.rejected}`, 20, 50);
    doc.text(`Flagged: ${stats.cycles.flagged}`, 20, 60);
    doc.text(`Average Review Time: ${stats.averageReviewTime}`, 20, 70);
    doc.text('Top Courses:', 20, 80);
    stats.topCourses.forEach((course, index) => {
      doc.text(`- ${course}`, 30, 90 + index * 10);
    });
    doc.text('Top-Rated Companies:', 20, 120);
    stats.topRatedCompanies.forEach((company, index) => {
      doc.text(`- ${company.name} (${company.rating}★)`, 30, 130 + index * 10);
    });
    doc.text('Top Internship Companies:', 20, 160);
    stats.topInternshipCompanies.forEach((company, index) => {
      doc.text(`- ${company.name} (${company.count} internships)`, 30, 170 + index * 10);
    });
    doc.save('Faculty_Dashboard_Stats.pdf');
  };

  const toggleClarification = (reportId) => {
    setClarificationOpen(prev => ({
      ...prev,
      [reportId]: !prev[reportId]
    }));
  };

  const submitClarification = (reportId, clarification) => {
    if (!clarification.trim()) {
      setClarificationError(prev => ({ ...prev, [reportId]: 'Clarification cannot be empty' }));
      return;
    }
    setClarificationError(prev => ({ ...prev, [reportId]: '' }));
    setReports(reports.map(report =>
      report.id === reportId ? { ...report, clarification } : report
    ));
    setClarificationSuccess(prev => ({ ...prev, [reportId]: 'Clarification submitted successfully' }));
    setTimeout(() => {
      setClarificationSuccess(prev => ({ ...prev, [reportId]: '' }));
    }, 3000);
  };

  const handleClarificationSubmit = (reportId) => {
    const updatedReports = reports.map((report) =>
      report.id === reportId ? { ...report, clarification: '' } : report
    );
    setReports(updatedReports);
    alert('Clarification submitted successfully!');
  };

  const resetFilters = () => {
    setFilterMajor('');
    setFilterStatus('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const uniqueMajors = [...new Set(reports.map(report => report.major))];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Faculty Dashboard</h1>
        <div className="header-controls">
          <div className="user-info">
            <p>Department: {user.department || 'Not specified'}</p>
          </div>
          {/* <div className="controls">
            <div className="filter-control">
              <label htmlFor="major-filter">Major</label>
              <select
                id="major-filter"
                value={filterMajor}
                onChange={(e) => setFilterMajor(e.target.value)}
                aria-label="Filter by major"
              >
                <option value="">All Majors</option>
                {uniqueMajors.map(major => (
                  <option key={major} value={major}>{major}</option>
                ))}
              </select>
            </div>
            <div className="filter-control">
              <label htmlFor="status-filter">Status</label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Flagged">Flagged</option>
              </select>
            </div> */}
            <button
              onClick={handleLogout}
              className="logout-btn"
              aria-label="Sign out"
            >
              Logout
            </button>
          {/* </div> */}
        </div>
      </header>

      <main className="dashboard-main">
        <section className="stats-overview">
          <div className="stats-header">
            <h2>Statistics Overview</h2>
            <div className="stats-controls">
              <button
                onClick={downloadStatsReport}
                className="download-stats-btn"
                aria-label="Download statistics report"
              >
                Generate Report
              </button>
            </div>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <strong>Accepted</strong>
              <div>{stats.cycles.accepted}</div>
            </div>
            <div className="stat-card">
              <strong>Rejected</strong>
              <div>{stats.cycles.rejected}</div>
            </div>
            <div className="stat-card">
              <strong>Flagged</strong>
              <div>{stats.cycles.flagged}</div>
            </div>
            <div className="stat-card">
              <strong>Avg Review</strong>
              <div>{stats.averageReviewTime}</div>
            </div>
            <div className="stat-card">
              <strong>Top Courses</strong>
              <ul>
                {stats.topCourses.map(course => (
                  <li key={course}>{course}</li>
                ))}
              </ul>
            </div>
            <div className="stat-card">
              <strong>Top-Rated Companies</strong>
              <ul>
                {stats.topRatedCompanies.map(c => (
                  <li key={c.name}>{c.name} ({c.rating}★)</li>
                ))}
              </ul>
            </div>
            <div className="stat-card">
              <strong>Most Internships</strong>
              <ul>
                {stats.topInternshipCompanies.map(c => (
                  <li key={c.name}>{c.name} ({c.count})</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

       <section className="reports-section">
  <div className="section-header">
    <h2>Internship Reports</h2>
    <div className="filter-controls">
      <div className="filter-group">
        <label>Filter by Major:</label>
        <select
          value={filterMajor}
          onChange={(e) => setFilterMajor(e.target.value)}
        >
          <option value="">All Majors</option>
          {uniqueMajors.map(major => (
            <option key={major} value={major}>{major}</option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label>Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
          <option value="Flagged">Flagged</option>
        </select>
      </div>
      <button onClick={resetFilters} className="reset-btn">
        Clear Filters
      </button>
    </div>
  </div>

  <div className="reports-grid">
    {filteredReports.length > 0 ? (
      filteredReports.map(report => (
        <div key={report.id} className="report-card">
          <div className="report-header">
            <h3>{report.studentName}</h3>
            <span className={`status-badge ${report.status.toLowerCase()}`}>
              {report.status}
            </span>
          </div>
          <div className="report-details">
            <p><strong>Major:</strong> {report.major}</p>
            <p><strong>Company:</strong> {report.company}</p>
            <p><strong>Position:</strong> {report.title}</p>
            <p><strong>Submitted:</strong> {report.submissionDate}</p>
          </div>
          <div className="report-actions">
            <select
              value={report.status}
              onChange={(e) => updateReportStatus(report.id, e.target.value)}
              className="status-select"
            >
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
              <option value="Flagged">Flagged</option>
            </select>
            <div className="action-buttons">
  <button
    className="details-btn"
    onClick={() => setSelectedReport(report)}
  >
    Details
  </button>
  <button
    className="evaluation-btn"
    onClick={() => navigate(`/faculty-evaluation-report/${report.id}`)}
  >
    View Evaluation Report
  </button>
  <button
    className="download-btn"
    onClick={() => downloadReportAsPDF(report)}
  >
   Download Internship Report
  </button>
</div>
            {(report.status === 'Flagged' || report.status === 'Rejected') && (
              <div className="clarification-section">
                <button
                  onClick={() => toggleClarification(report.id)}
                  className="clarification-btn"
                >
                  {clarificationOpen[report.id] ? 'Cancel' : 'Add Clarification'}
                </button>
                {clarificationOpen[report.id] && (
                  <div className="clarification-box">
                    <textarea
                      value={report.clarification || ''}
                      onChange={(e) => {
                        setReports(reports.map(r =>
                          r.id === report.id ? { ...r, clarification: e.target.value } : r
                        ));
                      }}
                      placeholder="Enter clarification note..."
                    />
                    <div className="clarification-footer">
                      {clarificationError[report.id] && (
                        <div className="error-message">{clarificationError[report.id]}</div>
                      )}
                     <button
                      className="submit-btn"
                      onClick={() => handleClarificationSubmit(report.id)}
                    >
                      Submit Clarification
                    </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))
    ) : (
      <div className="no-reports">
        <p>No reports match the current filters</p>
        <button onClick={resetFilters} className="reset-btn">
          Clear Filters
        </button>
      </div>
    )}
  </div>
</section>

        {selectedReport && (
          <div className="modal">
            <div className="modal-content">
              <button
                className="modal-close"
                onClick={() => setSelectedReport(null)}
                aria-label="Close modal"
              >
                ×
              </button>
              <h2>{selectedReport.title}</h2>
              <div className="modal-details">
                <p><strong>Student:</strong> {selectedReport.studentName}</p>
                <p><strong>Major:</strong> {selectedReport.major}</p>
                <p><strong>Company:</strong> {selectedReport.company}</p>
                <p>
                  <strong>Status:</strong> 
                  <span className={`status-badge ${selectedReport.status.toLowerCase()}`}>{selectedReport.status}</span>
                </p>
                <div className="status-control">
                  <label htmlFor="modal-status">Update Status</label>
                  <select
                    id="modal-status"
                    value={selectedReport.status}
                    onChange={(e) => updateReportStatus(selectedReport.id, e.target.value)}
                    aria-label="Update status"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Flagged">Flagged</option>
                  </select>
                </div>
                <p><strong>Description:</strong> {selectedReport.description}</p>
                <p><strong>Submission Date:</strong> {selectedReport.submissionDate}</p>
                <p><strong>Start Date:</strong> {selectedReport.startDate}</p>
                <p><strong>End Date:</strong> {selectedReport.endDate}</p>
                <p><strong>Supervisor:</strong> {selectedReport.supervisor}</p>
                <p><strong>Hours Completed:</strong> {selectedReport.hoursCompleted}</p>
                {selectedReport.clarification && (
                  <p><strong>Clarification:</strong> {selectedReport.clarification}</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="download-btn"
                  onClick={() => downloadReportAsPDF(selectedReport)}
                  aria-label="Download PDF"
                >
                  Download PDF
                </button>
                <button
                  className="secondary-btn"
                  onClick={() => setSelectedReport(null)}
                  aria-label="Close"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FacultyDashboard;