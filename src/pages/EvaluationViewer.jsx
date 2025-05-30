import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import '../styles/Dashboard.css';

const EvaluationViewer = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`evaluations_${user?.email}`)) || [];
    setEvaluations(saved);
  }, [user]);

  const handleDownload = (evaluation, index) => {
    const content = document.getElementById(`evaluation-${index}`);
    if (!content) return;

    html2pdf().from(content).set({
      margin: 0.5,
      filename: `${evaluation.company.replace(/\s+/g, '_')}_${evaluation.internshipTitle.replace(/\s+/g, '_')}_Evaluation.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).save();
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>My Internship Evaluations</h1>
        <button onClick={() => navigate('/pro-student-dashboard')} className="back-btn">
          Back to Dashboard
        </button>
      </header>

      {evaluations.length === 0 ? (
        <p style={{ padding: '20px' }}>You haven't submitted any evaluations yet.</p>
      ) : (
        <section className="dashboard-card full-width">
          <h2>Submitted Evaluations</h2>
          {evaluations.map((evalItem, index) => (
            <div key={index} className="internship-item" style={{ position: 'relative', border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
              <div id={`evaluation-${index}`}>
                <h3>{evalItem.internshipTitle}</h3>
                <p><strong>Company:</strong> {evalItem.company}</p>
                <p><strong>Rating:</strong> {evalItem.rating} / 5</p>
                <p><strong>Recommended:</strong> {evalItem.recommend ? 'Yes' : 'No'}</p>
                <p><strong>Comments:</strong> {evalItem.comments}</p>
                <p><strong>Date:</strong> {new Date(evalItem.date).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => handleDownload(evalItem, index)}
                className="action-btn"
                style={{ marginTop: '10px' }}
              >
                📥 Download as PDF
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default EvaluationViewer;
