import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/EvaluationForm.css';

const CompanyEvaluationForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const { student, internship, existingEvaluation } = location.state || {};
  
  const [formData, setFormData] = useState({
    technicalSkills: existingEvaluation?.technicalSkills || 'Average',
    communicationSkills: existingEvaluation?.communicationSkills || 'Average',
    teamwork: existingEvaluation?.teamwork || 'Average',
    punctuality: existingEvaluation?.punctuality || 'Average',
    overallPerformance: existingEvaluation?.overallPerformance || 'Average',
    comments: existingEvaluation?.comments || '',
    recommendForHire: existingEvaluation?.recommendForHire || false,
    evaluationDate: existingEvaluation?.evaluationDate || new Date().toISOString(),
  });

  useEffect(() => {
    if (!user || user.userType !== 'company') {
      navigate('/login');
      return;
    }

    if (!student || student.status !== 'Internship Complete') {
      alert('Evaluations can only be created for students who have completed their internship.');
      navigate('/company-dashboard');
      return;
    }

    // Load existing evaluation if it exists
    const evaluationsKey = `evaluations_${user.email}`;
    const savedEvaluations = JSON.parse(localStorage.getItem(evaluationsKey)) || {};
    const studentEvaluation = savedEvaluations[student.id];

    if (studentEvaluation) {
      setFormData(studentEvaluation);
    }
  }, [user, student, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.comments.trim()) {
      alert('Please provide comments for the evaluation.');
      return;
    }

    const evaluationsKey = `evaluations_${user.email}`;
    const evaluations = JSON.parse(localStorage.getItem(evaluationsKey)) || {};
    
    evaluations[student.id] = {
      ...formData,
      studentId: student.id,
      studentName: student.name,
      internshipId: internship.id,
      internshipTitle: internship.title,
      evaluationDate: new Date().toISOString(),
    };

    localStorage.setItem(evaluationsKey, JSON.stringify(evaluations));
    alert(`Evaluation ${existingEvaluation ? 'updated' : 'created'} successfully!`);
    navigate('/view-applications');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this evaluation?')) {
      const evaluationsKey = `evaluations_${user.email}`;
      const evaluations = JSON.parse(localStorage.getItem(evaluationsKey)) || {};
      delete evaluations[student.id];
      localStorage.setItem(evaluationsKey, JSON.stringify(evaluations));
      alert('Evaluation deleted successfully!');
      navigate('view-applications');
    }
  };

  const ratingOptions = ['Poor', 'Below Average', 'Average', 'Good', 'Excellent'];

  if (!student) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          No student selected. Please go back and select a student to evaluate.
          <button onClick={() => navigate('/view-applications')} className="back-btn">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>{existingEvaluation ? 'Edit Evaluation' : 'Create Evaluation'}</h1>
        <button onClick={() => navigate('/company-dashboard')} className="back-btn">
          ← Back
        </button>
      </header>

      <form onSubmit={handleSubmit} className="dashboard-card">
        <h3>
          Evaluating: {student.name} ({student.university})
        </h3>
        <h4>
          Internship: {internship?.title || 'Unknown Internship'}
        </h4>

        {[
          { name: 'technicalSkills', label: 'Technical Skills' },
          { name: 'communicationSkills', label: 'Communication Skills' },
          { name: 'teamwork', label: 'Teamwork' },
          { name: 'punctuality', label: 'Punctuality' },
          { name: 'overallPerformance', label: 'Overall Performance' },
        ].map(({ name, label }) => (
          <div key={name} className="form-group">
            <label htmlFor={name}>{label}</label>
            <select
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
            >
              {ratingOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div className="form-group">
          <label htmlFor="comments">Comments</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="recommendForHire"
              checked={formData.recommendForHire}
              onChange={handleChange}
            />
            Recommend for Hire
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {existingEvaluation ? 'Update Evaluation' : 'Submit Evaluation'}
          </button>
          {existingEvaluation && (
            <button
              type="button"
              onClick={handleDelete}
              className="delete-btn"
            >
              Delete Evaluation
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CompanyEvaluationForm;