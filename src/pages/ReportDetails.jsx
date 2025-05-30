import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import '../styles/ReportDetails.css';
import { AuthContext } from '../contexts/AuthContext';
import {
  FaChartBar, FaUserGraduate, FaBriefcase, FaFileAlt,
  FaChalkboardTeacher, FaVideo
} from 'react-icons/fa';

const ReportDetailsPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [clarification, setClarification] = useState('');
  const [clarificationMessage, setClarificationMessage] = useState('');
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
        hasEvaluation: true,
        introduction: 'During my AI internship at Google, I worked with the research team on language models.',
        objectives: 'Gain hands-on experience with machine learning frameworks and understand model training pipelines.',
        tasks: 'Assisted in data preprocessing, evaluated model performance, and wrote automation scripts in Python.',
        outcomes: 'Helped improve model accuracy by 5%, gained knowledge of TensorFlow, and learned best coding practices.',
        conclusion: 'This internship solidified my interest in AI research and prepared me for advanced projects.',
        feedback: 'Excellent dedication and strong analytical skills demonstrated throughout the internship.',
        reportFile: 'https://example.com/reports/alice_johnson_ai_google.pdf'
      },
      {
        id: 2,
        studentName: 'Bob Smith',
        title: 'Design Thinking Report',
        submissionDate: '2025-04-20',
        status: 'Rejected',
        major: 'Graphic Design',
        hasEvaluation: true,
        introduction: 'This report summarizes my experience applying design thinking principles to branding projects.',
        objectives: 'Understand client needs and develop creative solutions using user-centered design.',
        tasks: 'Conducted client interviews, developed wireframes, and collaborated with marketing teams.',
        outcomes: 'Improved prototyping skills and learned to iterate based on user feedback.',
        conclusion: 'Despite challenges, I learned valuable lessons in balancing creativity and usability.',
        feedback: 'Needs improvement on meeting deadlines and clarity of communication.',
        reportFile: 'https://example.com/reports/bob_smith_design_thinking.pdf'
      },
      {
        id: 3,
        studentName: 'Charlie Brown',
        title: 'Architecture Internship Reflection',
        submissionDate: '2025-04-18',
        status: 'Pending',
        major: 'Architecture',
        hasEvaluation: true,
        introduction: 'I participated in designing sustainable urban spaces during my internship.',
        objectives: 'Learn practical urban planning skills and apply sustainability concepts.',
        tasks: 'Drafted zoning plans, created 3D models, and assisted in community meetings.',
        outcomes: 'Gained proficiency with CAD software and deeper understanding of eco-friendly design.',
        conclusion: 'This experience inspired me to focus on green architecture in my future career.',
        feedback: 'Awaiting final supervisor feedback.',
        reportFile: 'https://example.com/reports/charlie_brown_architecture.pdf'
      },
      {
        id: 4,
        studentName: 'Eve White',
        title: 'Social Media Internship Report',
        submissionDate: '2025-04-25',
        status: 'Flagged',
        major: 'Digital Media',
        hasEvaluation: false,
        introduction: 'I created content for various social media campaigns and learned about digital marketing.',
        objectives: 'Enhance storytelling skills and understand audience engagement.',
        tasks: 'Produced videos, wrote scripts, and managed social media calendars.',
        outcomes: 'Increased follower engagement and developed strong editing skills.',
        conclusion: 'Looking forward to applying these skills in future media projects.',
        feedback: 'Documentation incomplete; flagged for missing daily reports.',
        reportFile: 'https://example.com/reports/eve_white_social_media.pdf'
      }
    ];
    
    const found = mockReports.find(r => r.id === parseInt(reportId));
    setReport(found);
  }, [reportId]);

  const handleDownloadPDF = () => {
    const element = document.getElementById('report-content');
    html2pdf().from(element).set({
      margin: 0.5,
      filename: `${report.title.replace(/\s+/g, '_')}_Report.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).save();
  };

  const handleClarificationSubmit = () => {
    if (!clarification.trim()) {
      setClarificationMessage('⚠️ Clarification cannot be empty.');
      return;
    }

    console.log(`Clarification for Report ID ${report.id}:`, clarification);
    setClarificationMessage('✅ Clarification submitted successfully.');
    setClarification('');
  };

  if (!report) return <div className="report-details-container">Loading report details...</div>;

  return (
    <div className="report-details-wrapper">
     
     <aside className="sidebar">
        <nav className="sidebar-nav">
          <div className="sidebar-header">
            <h3>SCAD Admin</h3>
          </div>
          <div className="sidebar-menu">
            <button onClick={() => navigate('/scad-dashboard')}><FaChartBar /> Dashboard</button>
            <button onClick={() => navigate('/students')}><FaUserGraduate /> Students</button>
            <button onClick={() => navigate('/video-call-dashboard')}><FaBriefcase /> Appointments</button>
            <button onClick={() => navigate('/internships-list')}><FaBriefcase /> Internships</button>
            <button onClick={() => navigate('/submitted-reports')} className="active"><FaFileAlt /> Reports</button>
            <button onClick={() => navigate('/career-workshops')}><FaChalkboardTeacher /> Workshops</button>
            <button onClick={() => navigate('/internship-insights-report')}><FaFileAlt /> Generate Reports</button>
            <div className="sidebar-divider"></div>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </nav>
      </aside>


      <main className="report-details-container">
        <div className="action-buttons">
          <button onClick={() => navigate('/submitted-reports')} className="btn secondary">
            ← Back to Reports List
          </button>
          <button onClick={handleDownloadPDF} className="btn primary">
            📥 Download as PDF
          </button>
        </div>

        <div id="report-content" className="report-content">
          <h1 className="report-title">{report.title}</h1>
          <p><strong>Student Name:</strong> {report.studentName}</p>
          <p><strong>Major:</strong> {report.major}</p>
          <p><strong>Status:</strong> {report.status}</p>
          <p><strong>Submission Date:</strong> {report.submissionDate}</p>
          <p><strong>Supervisor:</strong> {report.supervisor}</p>

          {['Introduction', 'Objectives', 'Tasks', 'Outcomes', 'Conclusion', 'Feedback'].map(section => (
            <div className="report-section" key={section}>
              <h2>{section}</h2>
              <p>{report[section.toLowerCase()]}</p>
            </div>
          ))}
        </div>

        {(report.status === 'Rejected' || report.status === 'Flagged') && (
          <div className="clarification-section">
            <h2>Clarification Submission</h2>
            <textarea
              value={clarification}
              onChange={(e) => setClarification(e.target.value)}
              placeholder="Write your clarification here..."
              rows={5}
            />
            <button onClick={handleClarificationSubmit} className="btn primary">
              Submit Clarification
            </button>
            {clarificationMessage && <p className="clarification-message">{clarificationMessage}</p>}
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportDetailsPage;
