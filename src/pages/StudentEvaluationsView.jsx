//SAMA
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/StudentEvaluations.css';

const StudentEvaluationsView = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [evaluations, setEvaluations] = useState({});
  const [companyEmails, setCompanyEmails] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user || user.userType !== 'scad') {
      navigate('/login');
      return;
    }

    setLoading(true);

    const companyIds = [];
    const companyEmailMap = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('evaluations_') || key.startsWith('interns_')) {
        const companyId = key.replace(/^(evaluations_|interns_)/, '');
        if (!companyIds.includes(companyId)) {
          companyIds.push(companyId);
          companyEmailMap[companyId] = companyId;
        }
      }
    }

    let allInterns = [];
    companyIds.forEach(companyId => {
      const companyInterns = JSON.parse(localStorage.getItem(`interns_${companyId}`)) || [];
      allInterns = [
        ...allInterns,
        ...companyInterns.map(intern => ({
          ...intern,
          companyId
        }))
      ];
    });

    let allEvaluations = {};
    companyIds.forEach(companyId => {
      const companyEvaluations = JSON.parse(localStorage.getItem(`evaluations_${companyId}`)) || {};
      Object.entries(companyEvaluations).forEach(([studentId, evaluation]) => {
        allEvaluations[studentId] = { ...evaluation, companyId };
      });
    });

    setStudents(allInterns);
    setEvaluations(allEvaluations);
    setCompanyEmails(companyEmailMap);
    setLoading(false);
  }, [user, navigate]);

  const filteredStudents = students.filter(student => {
    const hasEvaluation = !!evaluations[student.id];
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'evaluated' && hasEvaluation) ||
      (statusFilter === 'not-evaluated' && !hasEvaluation && student.status === 'Internship Complete');
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.internshipTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleViewEvaluation = student => {
    setSelectedStudent(student);
  };

  const handleCloseDetails = () => {
    setSelectedStudent(null);
  };

  const getRatingClass = rating => {
    switch (rating) {
      case 'Excellent':
        return 'rating-excellent';
      case 'Good':
        return 'rating-good';
      case 'Average':
        return 'rating-average';
      case 'Below Average':
        return 'rating-below-average';
      case 'Poor':
        return 'rating-poor';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading students and evaluations...</p>
      </div>
    );
  }

  if (!user || user.userType !== 'scad') {
    return null;
  }

  return (
    <div className="evaluations-container">
      <header className="evaluations-header">
        <h1>Student Internship Evaluations</h1>
        <p className="scad-only-note">SCAD Office Only - Confidential</p>
      </header>

      <div className="filter-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or position..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <i className="search-icon">🔍</i>
        </div>

        <div className="status-filters">
          <button
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Students
          </button>
          <button
            className={`filter-btn ${statusFilter === 'evaluated' ? 'active' : ''}`}
            onClick={() => setStatusFilter('evaluated')}
          >
            With Evaluation
          </button>
          <button
            className={`filter-btn ${statusFilter === 'not-evaluated' ? 'active' : ''}`}
            onClick={() => setStatusFilter('not-evaluated')}
          >
            Need Evaluation
          </button>
        </div>
      </div>

      <div className="content-area">
        <div className="students-list">
          <h2>Completed Internships</h2>
          {filteredStudents.length > 0 ? (
            <table className="students-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Internship Position</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Evaluation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr
                    key={student.id}
                    className={selectedStudent?.id === student.id ? 'selected-row' : ''}
                  >
                    <td>{student.name}</td>
                    <td>{student.internshipTitle}</td>
                    <td>{companyEmails[student.companyId] || 'Unknown'}</td>
                    <td>
                      <span className={`status-badge ${student.status.toLowerCase().replace(' ', '-')}`}>
                        {student.status}
                      </span>
                    </td>
                    <td>
                      {student.status === 'Internship Complete' ? (
                        evaluations[student.id] ? (
                          <span className="evaluation-indicator has-evaluation">Completed</span>
                        ) : (
                          <span className="evaluation-indicator no-evaluation">Pending</span>
                        )
                      ) : (
                        <span className="evaluation-indicator not-eligible">Not Eligible</span>
                      )}
                    </td>
                    <td>
                      {evaluations[student.id] && (
                        <button className="view-btn" onClick={() => handleViewEvaluation(student)}>
                          View Evaluation
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-results">No students match your search criteria.</p>
          )}
        </div>

        <div className={`evaluation-details ${selectedStudent ? 'active' : ''}`}>
          {selectedStudent && evaluations[selectedStudent.id] && (
            <>
              <div className="details-header">
                <h2>Evaluation Details</h2>
                <button className="close-btn" onClick={handleCloseDetails}>
                  ×
                </button>
              </div>

              <div className="details-content">
                <div className="student-header">
                  <h3>{selectedStudent.name}</h3>
                  <p className="position">{selectedStudent.internshipTitle}</p>
                  <p className="company">
                    Company: {companyEmails[selectedStudent.companyId] || 'Unknown'}
                  </p>
                </div>

                <div className="dates-section">
                  <p>
                    <strong>Internship Period:</strong>
                  </p>
                  <p>Started: {new Date(selectedStudent.startDate).toLocaleDateString()}</p>
                  <p>Completed: {new Date(selectedStudent.completionDate).toLocaleDateString()}</p>
                  <p>
                    <strong>Evaluation Date:</strong>{' '}
                    {new Date(evaluations[selectedStudent.id].evaluationDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="ratings-section">
                  <h4>Performance Ratings</h4>
                  <div className="ratings-grid">
                    <div className="rating-item">
                      <span className="rating-label">Technical Skills</span>
                      <span
                        className={`rating-value ${getRatingClass(
                          evaluations[selectedStudent.id].technicalSkills
                        )}`}
                      >
                        {evaluations[selectedStudent.id].technicalSkills}
                      </span>
                    </div>
                    <div className="rating-item">
                      <span className="rating-label">Communication</span>
                      <span
                        className={`rating-value ${getRatingClass(
                          evaluations[selectedStudent.id].communicationSkills
                        )}`}
                      >
                        {evaluations[selectedStudent.id].communicationSkills}
                      </span>
                    </div>
                    <div className="rating-item">
                      <span className="rating-label">Teamwork</span>
                      <span
                        className={`rating-value ${getRatingClass(
                          evaluations[selectedStudent.id].teamwork
                        )}`}
                      >
                        {evaluations[selectedStudent.id].teamwork}
                      </span>
                    </div>
                    <div className="rating-item">
                      <span className="rating-label">Punctuality</span>
                      <span
                        className={`rating-value ${getRatingClass(
                          evaluations[selectedStudent.id].punctuality
                        )}`}
                      >
                        {evaluations[selectedStudent.id].punctuality}
                      </span>
                    </div>
                    <div className="rating-item">
                      <span className="rating-label">Overall Performance</span>
                      <span
                        className={`rating-value ${getRatingClass(
                          evaluations[selectedStudent.id].overallPerformance
                        )}`}
                      >
                        {evaluations[selectedStudent.id].overallPerformance}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="comments-section">
                  <h4>Employer Comments</h4>
                  <div className="comments-content">
                    {evaluations[selectedStudent.id].comments || 'No comments provided.'}
                  </div>
                </div>

                <div className="recommendation-section">
                  <h4>Recommendation Status</h4>
                  <div
                    className={`recommendation ${
                      evaluations[selectedStudent.id].recommendForHire
                        ? 'recommended'
                        : 'not-recommended'
                    }`}
                  >
                    {evaluations[selectedStudent.id].recommendForHire
                      ? 'Recommended for Hire'
                      : 'Not Recommended for Hire'}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentEvaluationsView;