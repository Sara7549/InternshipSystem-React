import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/EvaluationForm.css';

const StudentEvaluationForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const internship = location.state?.internship;

  const [submitted, setSubmitted] = useState(false);
  const [evaluation, setEvaluation] = useState({
    company: '',
    internshipTitle: '',
    rating: '',
    recommend: false,
    comments: ''
  });

  useEffect(() => {
    if (!user || user.userType !== 'pro-student') {
      navigate('/login');
      return;
    }

    if (!internship || internship.status !== 'completed') {
      alert('Only students who completed the internship can evaluate.');
      navigate('/pro-student-dashboard');
      return;
    }

    setEvaluation((prev) => ({
      ...prev,
      company: internship.company,
      internshipTitle: internship.title
    }));
  }, [internship, user, navigate]);

  const key = `evaluations_${user?.email}`;
  const entryKey = `${evaluation.company}_${evaluation.internshipTitle}`.toLowerCase().replace(/\s+/g, '_');

  useEffect(() => {
    const allEvaluations = JSON.parse(localStorage.getItem(key)) || [];
    const exists = allEvaluations.find(
      (e) => `${e.company}_${e.internshipTitle}`.toLowerCase().replace(/\s+/g, '_') === entryKey
    );
    if (exists) {
      setEvaluation(exists);
      setSubmitted(true);
    }
  }, [entryKey, key]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEvaluation((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allEvaluations = JSON.parse(localStorage.getItem(key)) || [];

    const duplicate = allEvaluations.find(
      (e) => `${e.company}_${e.internshipTitle}`.toLowerCase().replace(/\s+/g, '_') === entryKey
    );
    if (duplicate) {
      alert('You have already submitted an evaluation for this internship.');
      return;
    }

    const newEval = { ...evaluation, date: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify([...allEvaluations, newEval]));
    alert('Evaluation submitted!');
    setSubmitted(true);
  };

  const handleDelete = () => {
    const allEvaluations = JSON.parse(localStorage.getItem(key)) || [];
    const updated = allEvaluations.filter(
      (e) => `${e.company}_${e.internshipTitle}`.toLowerCase().replace(/\s+/g, '_') !== entryKey
    );
    localStorage.setItem(key, JSON.stringify(updated));
    alert('Evaluation deleted.');
    setEvaluation({
      company: internship.company,
      internshipTitle: internship.title,
      rating: '',
      recommend: false,
      comments: ''
    });
    setSubmitted(false);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Evaluate Internship</h1>
        <button onClick={() => navigate('/pro-student-dashboard')} className="back-btn">
          Back to Dashboard
        </button>
      </header>

      <form className="dashboard-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Company Name</label>
          <input name="company" value={evaluation.company} readOnly disabled />
        </div>
        <div className="form-group">
          <label>Internship Title</label>
          <input name="internshipTitle" value={evaluation.internshipTitle} readOnly disabled />
        </div>
        <div className="form-group">
          <label>Rating</label>
          <select name="rating" value={evaluation.rating} onChange={handleChange} required disabled={submitted}>
            <option value="">Select...</option>
            <option value="1">1 - Poor</option>
            <option value="2">2 - Okay</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Great</option>
            <option value="5">5 - Excellent</option>
          </select>
        </div>
        <div className="form-group checkbox">
          <input
            type="checkbox"
            id="recommend"
            name="recommend"
            checked={evaluation.recommend}
            onChange={handleChange}
            disabled={submitted}
          />
          <label htmlFor="recommend">I recommend this company to other students</label>
        </div>
        <div className="form-group">
          <label>Comments</label>
          <textarea
            name="comments"
            value={evaluation.comments}
            onChange={handleChange}
            rows="4"
            disabled={submitted}
          />
        </div>

        {!submitted && (
          <button type="submit" className="submit-btn">Submit Evaluation</button>
        )}
        {submitted && (
          <button type="button" onClick={handleDelete} className="cancel-btn">Delete Evaluation</button>
        )}
      </form>
    </div>
  );
};

export default StudentEvaluationForm;