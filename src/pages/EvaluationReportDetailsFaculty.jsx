import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import '../styles/EvaluationReportDetails.css';
import {
  FaChartBar, FaUserGraduate, FaBriefcase, FaFileAlt,
  FaChalkboardTeacher, FaVideo,FaSignOutAlt
} from 'react-icons/fa';

const EvaluationReportDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState(null);

  useEffect(() => {
    const mockEvaluations = [
      {
        id: 1,
        studentName: 'Alice Johnson',
        major: 'Computer Science',
        companyName: 'Google',
        supervisorName: 'Dr. Emily Zhang',
        startDate: '2025-02-01',
        endDate: '2025-04-01',
        score: 95,
        comments: 'Alice demonstrated excellent technical skills and teamwork. She was an asset to the AI research team.'
      },
      {
        id: 2,
        studentName: 'Bob Smith',
        major: 'Graphic Design',
        companyName: 'Dribbble Labs',
        supervisorName: 'Ms. Laura Trent',
        startDate: '2025-01-15',
        endDate: '2025-03-15',
        score: 68,
        comments: 'Bob had creative ideas but occasionally missed deadlines. Improvement needed in time management.'
      },
      {
        id: 3,
        studentName: 'Charlie Brown',
        major: 'Architecture',
        companyName: 'ArchaSpace',
        supervisorName: 'Eng. Marco Saeed',
        startDate: '2025-01-10',
        endDate: '2025-03-30',
        score: 88,
        comments: 'Charlie was proactive and contributed valuable insights to urban design projects.'
      }
    ];

    const found = mockEvaluations.find((evalReport) => evalReport.id === parseInt(id));
    setEvaluation(found);
  }, [id]);

  const handleDownloadPDF = () => {
    const element = document.getElementById('evaluation-report-content');
    html2pdf().from(element).set({
      margin: 0.5,
      filename: `${evaluation.studentName.replace(/\s+/g, '_')}_Evaluation_Report.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).save();
  };

  if (!evaluation) {
    return <div className="evaluation-container">Loading evaluation report...</div>;
  }

  return (
    <div className="evaluation-wrapper">
      <main className="evaluation-container">
        <div className="action-buttons">
          <button onClick={() => navigate('/faculty-dashboard')} className="btn secondary">
            ← Back to DashBoard
          </button>
          
          <button onClick={handleDownloadPDF} className="btn primary">
            📥 Download as PDF
          </button>
        </div>

        <div id="evaluation-report-content" className="evaluation-report-content">
          <h1 className="evaluation-title">Evaluation Report</h1>

          <div className="evaluation-section">
            <p><strong>Student Name:</strong> {evaluation.studentName}</p>
            <p><strong>Major:</strong> {evaluation.major}</p>
            <p><strong>Company Name:</strong> {evaluation.companyName}</p>
            <p><strong>Supervisor Name:</strong> {evaluation.supervisorName}</p>
            <p><strong>Internship Duration:</strong> {evaluation.startDate} → {evaluation.endDate}</p>
            <p><strong>Performance Score:</strong> {evaluation.score}/100</p>
          </div>

          <div className="evaluation-section">
            <h3>Supervisor Comments</h3>
            <p>{evaluation.comments}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EvaluationReportDetails;
