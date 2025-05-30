import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import '../styles/Dashboard.css';

const ReportViewer = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const printableRef = useRef();

  useEffect(() => {
    if (!user) return;
    const saved = JSON.parse(localStorage.getItem(`reports_${user?.email}`)) || [];
    setReports(saved);
    setSelectedReport(saved[0] || null);
  }, [user]);

  const handleDownloadPDF = () => {
    if (!printableRef.current) return;
    html2pdf().from(printableRef.current).set({
      margin: 0.5,
      filename: `${selectedReport.title.replace(/\s+/g, '_')}_Report.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).save();
  };

  const handleEdit = () => {
    navigate('/my-reports', { state: { report: selectedReport } });
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(`Delete report titled "${selectedReport.title}"?`);
    if (!confirmDelete) return;

    const updated = reports.filter(r =>
      !(
        r.company === selectedReport.company &&
        r.internshipTitle === selectedReport.internshipTitle
      )
    );

    localStorage.setItem(`reports_${user?.email}`, JSON.stringify(updated));
    setReports(updated);
    setSelectedReport(updated[0] || null);
    alert('Report deleted.');
  };

  if (!user) {
    return (
      <div className="dashboard-container">
        <h1>Unauthorized</h1>
        <p>Please log in as a PRO student to view reports.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>My Internship Reports</h1>
        <button onClick={() => navigate('/pro-student-dashboard')} className="back-btn">
          Back to Dashboard
        </button>
      </header>

      {reports.length === 0 ? (
        <p style={{ padding: '20px' }}>You have not submitted any reports yet.</p>
      ) : (
        <>
          <section className="dashboard-card full-width">
            <h2>Select a Report</h2>
            <ul className="reports-list">
              {reports.map((report, index) => (
                <li key={index}>
                  <button
                    onClick={() => setSelectedReport(report)}
                    className={`details-btn ${selectedReport === report ? 'active' : ''}`}
                  >
                    {report.title} - {report.company}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {selectedReport && (
            <>
              <section className="dashboard-card full-width" ref={printableRef}>
                <h2>{selectedReport.title}</h2>
                <p><strong>Company:</strong> {selectedReport.company}</p>
                <p><strong>Internship Title:</strong> {selectedReport.internshipTitle}</p>
                <p><strong>Submitted At:</strong> {new Date(selectedReport.submittedAt).toLocaleDateString()}</p>

                <h3>Introduction</h3>
                <p>{selectedReport.intro}</p>

                <h3>Body</h3>
                <p>{selectedReport.body}</p>

                <h3>Helpful Courses</h3>
                <ul>
                  {selectedReport.selectedCourses.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </section>

              {/* These buttons are NOT inside printable area */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                <button onClick={handleDownloadPDF} className="action-btn">Download as PDF</button>
                <button onClick={handleEdit} className="submit-btn">Edit Report</button>
                <button onClick={handleDelete} className="cancel-btn">Delete Report</button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ReportViewer;
