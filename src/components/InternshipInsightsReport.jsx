import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFilePdf, FaArrowLeft, FaPrint, FaChartBar, FaVideo ,FaUserGraduate, FaBriefcase, FaFileAlt, FaChalkboardTeacher, FaSignOutAlt } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';
import '../styles/InternshipInsightsReport.css';

const InternshipInsightsReport = () => {
  const navigate = useNavigate();
  const [statistics] = React.useState({
    acceptedReports: 42,
    rejectedReports: 15,
    flaggedReports: 6,
    avgReviewTime: '3.4 days',
    totalReports: 63,
    placementRate: '84%',
    placementTrend: '↑ 5%',
    companiesCount: 23,
    companyTrend: '↑ 3',
    reportTrend: '↑ 12%',
    topCourses: ['Machine Learning', 'UI/UX Design', 'Marketing Strategy'],
    topRatedCompanies: ['Google', 'EcoWear Collective', 'BuzzNow'],
    topInternshipCompanies: ['Google', 'Dribbble Labs', 'BuzzNow'],
    totalInternships: 128,
    completionRate: '87%',
    satisfactionScore: '4.2/5'
  });

  const handleGeneratePDF = () => {
    const element = document.querySelector('.full-report-content');
  
    const options = {
      margin: 0.5,
      filename: 'Internship_Insights_Report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
  
    html2pdf().set(options).from(element).save();
  };
  

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="report-container">
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
            <button onClick={() => navigate('/submitted-reports')}><FaFileAlt /> Reports</button>
            <button onClick={() => navigate('/career-workshops')}><FaChalkboardTeacher /> Workshops</button>
            <button className="active" onClick={() => navigate('/internship-insights-report')}><FaFileAlt /> Generate Reports</button>
            <div className="sidebar-divider"></div>
            <button className='logout-btn' onClick={() => navigate('/login')}>
              Logout
            </button>
          </div>
          
        </nav>
      </aside>
      

      {/* Main Report Content */}
      <div className="main-content">
        <div className="report-header">
          
          <h1>Internship Insights Report</h1>
          <div className="report-actions">
            <button onClick={handleGeneratePDF} className="action-btn">
              <FaFilePdf /> Download PDF
            </button>
            <button onClick={handlePrint} className="action-btn">
              <FaPrint /> Print Report
            </button>
          </div>
        </div>
<div className="full-report-content">
        <div className="report-content">
          {/* Metrics */}
          <section className="report-section">
            <h2>Key Metrics</h2>
            <div className="metrics-grid">
            <div className="metrics-grid">
            <div className="metric-box">
              <h3>{statistics.totalReports}</h3>
              <p>Total Reports</p>
              <small>{statistics.reportTrend}</small>
            </div>
            <div className="metric-box">
              <h3>{statistics.acceptedReports}</h3>
              <p>Accepted Reports</p>
            </div>
            <div className="metric-box">
              <h3>{statistics.rejectedReports}</h3>
              <p>Rejected Reports</p>
            </div>
            <div className="metric-box">
              <h3>{statistics.flaggedReports}</h3>
              <p>Flagged Reports</p>
            </div>
            <div className="metric-box">
              <h3>{statistics.placementRate}</h3>
              <p>Placement Rate</p>
              <small>{statistics.placementTrend}</small>
            </div>
            <div className="metric-box">
              <h3>{statistics.companiesCount}</h3>
              <p>Active Companies</p>
              <small>{statistics.companyTrend}</small>
            </div>
            <div className="metric-box">
              <h3>{statistics.avgReviewTime}</h3>
              <p>Average Review Time</p>
            </div>
            <div className="metric-box">
              <h3>{statistics.totalInternships}</h3>
              <p>Total Internships</p>
            </div>
            <div className="metric-box">
              <h3>{statistics.completionRate}</h3>
              <p>Completion Rate</p>
            </div>
            <div className="metric-box">
              <h3>{statistics.satisfactionScore}</h3>
              <p>Student Satisfaction</p>
            </div>
          </div>
            </div>
          </section>
          </div>
          {/* Top Performers */}
          <section className="report-section">
            <h2>Top Performers</h2>
            <div className="top-performers">
            <div className="top-performers">
            <div className="top-list">
              <h3>Top Rated Companies</h3>
              <ol>
                {statistics.topRatedCompanies.map((company, index) => (
                  <li key={index}>{company} - {5 - index * 0.2}/5</li>
                ))}
              </ol>
            </div>
            <div className="top-list">
              <h3>Most Internship Opportunities</h3>
              <ol>
                {statistics.topInternshipCompanies.map((company, index) => (
                  <li key={index}>{company} - {18 - index * 3} interns</li>
                ))}
              </ol>
            </div>
            </div>
            </div>
          </section>

          {/* Analysis */}
          <section className="report-section">
            <h2>Analysis</h2>
            <div className="analysis-content">
            <div className="analysis-content">
            <p>
              This internship cycle recorded <strong>{statistics.totalReports}</strong> reports, showing a <strong>{statistics.reportTrend}</strong> increase from the previous period. 
              Placement rate rose to <strong>{statistics.placementRate}</strong> (<em>{statistics.placementTrend}</em>), suggesting a growing alignment between students’ profiles 
              and company requirements.
            </p>
            <p>
              The review process was more efficient, with an average of <strong>{statistics.avgReviewTime}</strong>, contributing to faster decisions. 
              The flagged reports primarily resulted from incomplete documentation and discrepancies in supervisor evaluations.
            </p>
            <p>
              Tech and design-related fields dominated the top courses, led by <strong>{statistics.topCourses[0]}</strong>. 
              <strong> {statistics.topRatedCompanies[0]}</strong> remained the highest-rated company, while <strong>{statistics.topInternshipCompanies[0]}</strong> hosted the largest number of interns.
            </p>
          </div>
            </div>
          </section>
        </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipInsightsReport;
