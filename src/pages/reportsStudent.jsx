import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ReportList.css';

const ReportsStudent = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [currentReport, setCurrentReport] = useState({
    id: null,
    title: '',
    introduction: '',
    body: '',
    isFinalized: false,
    isSubmitted: false,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem('student_reports')) || [];
    setReports(storedReports);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentReport((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveReport = () => {
    if (isEditing) {
      const updatedReports = reports.map((report) =>
        report.id === currentReport.id ? currentReport : report
      );
      setReports(updatedReports);
      localStorage.setItem('student_reports', JSON.stringify(updatedReports));
      alert('Report updated successfully!');
    } else {
      const newReport = { ...currentReport, id: Date.now(), isFinalized: false, isSubmitted: false };
      const updatedReports = [...reports, newReport];
      setReports(updatedReports);
      localStorage.setItem('student_reports', JSON.stringify(updatedReports));
      alert('Report created successfully!');
    }
    setCurrentReport({ id: null, title: '', introduction: '', body: '', isFinalized: false, isSubmitted: false });
    setIsEditing(false);
  };

  const handleEditReport = (report) => {
    if (report.isFinalized || report.isSubmitted) {
      alert('This report is finalized or submitted and cannot be edited.');
      return;
    }
    setCurrentReport(report);
    setIsEditing(true);
  };

  const handleDeleteReport = (reportId) => {
    const updatedReports = reports.filter((report) => report.id !== reportId);
    setReports(updatedReports);
    localStorage.setItem('student_reports', JSON.stringify(updatedReports));
    alert('Report deleted successfully!');
  };

  const handleFinalizeReport = (reportId) => {
    const updatedReports = reports.map((report) =>
      report.id === reportId ? { ...report, isFinalized: true } : report
    );
    setReports(updatedReports);
    localStorage.setItem('student_reports', JSON.stringify(updatedReports));
    alert('Report finalized successfully!');
  };

  const handleSubmitReport = (reportId) => {
    const updatedReports = reports.map((report) =>
      report.id === reportId ? { ...report, isSubmitted: true } : report
    );
    setReports(updatedReports);
    localStorage.setItem('student_reports', JSON.stringify(updatedReports));
    alert('Report submitted successfully!');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Manage My Reports</h1>
        <button onClick={() => navigate('/student-dashboard')} className="back-btn">
          Back to Dashboard
        </button>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-card full-width">
          <h2>{isEditing ? 'Edit Report' : 'Create New Report'}</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={currentReport.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Introduction:</label>
              <textarea
                name="introduction"
                value={currentReport.introduction}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>Body:</label>
              <textarea
                name="body"
                value={currentReport.body}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <button type="button" onClick={handleSaveReport} className="submit-btn">
              {isEditing ? 'Update Report' : 'Create Report'}
            </button>
          </form>
        </section>

        <section className="dashboard-card full-width">
          <h2>My Reports</h2>
{reports.length > 0 ? (
  <ul className="reports-list">
    {reports.map((report) => (
      <li key={report.id} className="report-item">
        <h3>{report.title}</h3>
        <p><strong>Introduction:</strong> {report.introduction}</p>
        <p><strong>Body:</strong> {report.body}</p>
        <p><strong>Status:</strong> {report.isSubmitted ? 'Submitted' : report.isFinalized ? 'Finalized' : 'Draft'}</p>
        <div className="report-actions flex items-center space-x-2">
          {!report.isFinalized && !report.isSubmitted && (
            <button
              onClick={() => handleEditReport(report)}
              className="edit-btn bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            >
              Edit
            </button>
          )}
          {!report.isFinalized && !report.isSubmitted && (
            <button
              onClick={() => handleFinalizeReport(report.id)}
              className="submit-btn bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
            >
              Finalize
            </button>
          )}
          {report.isFinalized && !report.isSubmitted && (
            <button
              onClick={() => handleSubmitReport(report.id)}
              className="submit-btn bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
            >
              Submit
            </button>
          )}
        </div>
        <div className="delete-wrapper flex items-center ml-8">
          <button
            onClick={() => handleDeleteReport(report.id)}
            className="delete-btn bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200 font-semibold"
          >
            Delete
          </button>
        </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reports found. Start by creating a new report.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default ReportsStudent;