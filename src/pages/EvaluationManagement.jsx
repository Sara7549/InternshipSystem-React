import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import '../styles/EvaluationManagement.css'; // Ensure this CSS file exists

const EvaluationManagement = () => {
  const { id } = useParams(); // Get the internship ID from the route
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState({
    text: '',
    recommendation: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Load the evaluation specific to this internship on component mount or when internshipId changes
  useEffect(() => {
    const savedEvaluation = JSON.parse(localStorage.getItem(`evaluation_${id}`)); // Parse the saved data
    if (savedEvaluation) {
      setEvaluation(savedEvaluation);
      setSubmitted(true); // Mark as submitted if an evaluation exists
    } else {
      // Reset state if no evaluation exists for the current internship
      setEvaluation({ text: '', recommendation: false });
      setSubmitted(false);
    }
  }, [id]); // Runs whenever internshipId changes

  // Handle changes in the form fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEvaluation((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Save the evaluation for this internship
  const handleSave = () => {
    if (!evaluation.text.trim()) {
      setError('Evaluation text is required.');
      return;
    }

    localStorage.setItem(`evaluation_${id}`, JSON.stringify(evaluation)); // Save evaluation with internship ID
    setSubmitted(true);
    setError('');
    alert('Your evaluation has been saved successfully!');
  };

  // Delete the evaluation for this internship
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this evaluation?')) {
      localStorage.removeItem(`evaluation_${id}`); // Remove evaluation from localStorage
      setEvaluation({ text: '', recommendation: false });
      setSubmitted(false);
      alert('Your evaluation has been deleted successfully!');
    }
  };

  // Enable editing of the evaluation
  const handleEdit = () => {
    setSubmitted(false); // Allow editing by enabling the form fields
  };

  return (
    <div className="evaluation-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h1 className="evaluation-title">Evaluate Internship</h1>

      {error && <p className="error">{error}</p>}

      <form className="evaluation-form">
        <div className="form-group">
          <label htmlFor="text">Evaluation:</label>
          <textarea
            id="text"
            name="text"
            value={evaluation.text}
            onChange={handleChange}
            placeholder="Write your evaluation here..."
            className="form-input textarea"
            disabled={submitted}
            rows="4"
          />
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="recommendation"
            name="recommendation"
            checked={evaluation.recommendation}
            onChange={handleChange}
            className="checkbox-input"
            disabled={submitted}
          />
          <label htmlFor="recommendation">I recommend this company to other students</label>
        </div>

        <div className="button-group">
          {!submitted && (
            <button type="button" onClick={handleSave} className="save-btn">
              Save
            </button>
          )}
          {submitted && (
            <>
              <button type="button" onClick={handleEdit} className="edit-btn">
                Edit
              </button>
              <button type="button" onClick={handleDelete} className="delete-btn">
                Delete
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default EvaluationManagement;