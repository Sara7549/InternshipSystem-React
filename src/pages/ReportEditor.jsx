import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Dashboard.css';

const ReportEditor = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const internship = location.state?.internship || null;
  const editingReport = location.state?.report || null;

  const [report, setReport] = useState({
    title: '',
    intro: '',
    body: '',
    selectedCourses: [],
    company: '',
    internshipTitle: '',
    submittedAt: null
  });

  const availableCourses = ['Data Structures', 'UX Design', 'Algorithms', 'Digital Marketing', 'Project Management'];

  useEffect(() => {
    if (!user) return navigate('/login');

    if (editingReport) {
      setReport(editingReport);
    } else if (internship) {
      setReport(prev => ({
        ...prev,
        company: internship.company,
        internshipTitle: internship.title
      }));
    }
  }, [user, internship, editingReport, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport({ ...report, [name]: value });
  };

  const handleCourseSelect = (course) => {
    setReport((prev) => ({
      ...prev,
      selectedCourses: prev.selectedCourses.includes(course)
        ? prev.selectedCourses.filter((c) => c !== course)
        : [...prev.selectedCourses, course]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storageKey = `reports_${user?.email}`;
    const existing = JSON.parse(localStorage.getItem(storageKey)) || [];

    const uniqueKey = `${report.company}_${report.internshipTitle}`.toLowerCase().replace(/\s+/g, '_');

    // Replace existing or add new
    const updated = existing.filter(r => {
      const key = `${r.company}_${r.internshipTitle}`.toLowerCase().replace(/\s+/g, '_');
      return key !== uniqueKey;
    });

    updated.push({
      ...report,
      submittedAt: new Date().toISOString()
    });

    localStorage.setItem(storageKey, JSON.stringify(updated));
    alert('Report saved.');
    navigate('/pro-student-dashboard');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>{editingReport ? 'Edit Report' : 'Submit Internship Report'}</h1>
        <button onClick={() => navigate('/pro-student-dashboard')} className="back-btn">
          Back to Dashboard
        </button>
      </header>

      <form className="dashboard-card full-width" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Company Name</label>
          <input name="company" value={report.company} disabled />
        </div>

        <div className="form-group">
          <label>Internship Title</label>
          <input name="internshipTitle" value={report.internshipTitle} disabled />
        </div>

        <div className="form-group">
          <label>Report Title</label>
          <input name="title" value={report.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Introduction</label>
          <textarea name="intro" value={report.intro} onChange={handleChange} rows="3" required />
        </div>

        <div className="form-group">
          <label>Body</label>
          <textarea name="body" value={report.body} onChange={handleChange} rows="6" required />
        </div>

        <div className="form-group">
          <label>Courses That Helped</label>
          <div className="multi-checkbox">
            {availableCourses.map((course) => (
              <label key={course}>
                <input
                  type="checkbox"
                  checked={report.selectedCourses.includes(course)}
                  onChange={() => handleCourseSelect(course)}
                />
                {course}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-btn">
          {editingReport ? 'Update Report' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportEditor;
