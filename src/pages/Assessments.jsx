import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/Dashboard.css';

// Assessments component for pro-student users
const Assessments = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State for assessments and posted scores
  const [assessments, setAssessments] = useState([
    { id: 1, title: 'React Fundamentals', completed: false, score: null },
    { id: 2, title: 'UI/UX Design Basics', completed: false, score: null },
    { id: 3, title: 'Technical Communication', completed: false, score: null },
  ]);
  const [postedScores, setPostedScores] = useState(() => {
    return JSON.parse(localStorage.getItem(`assessment_scores_${user?.id}`)) || [];
  });

  // Validate user role
  // useEffect(() => {
  //   if (!user || user.role !== 'pro-student') {
  //     navigate('/unauthorized');
  //   }
  // }, [user, navigate]);

  // Sync posted scores with localStorage
  useEffect(() => {
    localStorage.setItem(`assessment_scores_${user?.id}`, JSON.stringify(postedScores));
  }, [postedScores, user?.id]);

  // Handle taking an assessment
  const handleTakeAssessment = (id) => {
    const randomScore = Math.floor(Math.random() * 41) + 60; // Score between 60–100
    const updated = assessments.map((a) =>
      a.id === id ? { ...a, completed: true, score: randomScore } : a
    );
    setAssessments(updated);
  };

  // Handle posting score to profile
  const handlePostScoreToProfile = (title, score) => {
    const updated = [...postedScores.filter((a) => a.title !== title), { title, score }];
    setPostedScores(updated);
    alert(`✅ Score for "${title}" (${score}%) posted to your profile!`);
  };

  // Check if score is posted
  const isScorePosted = (title) => {
    return postedScores.some((s) => s.title === title);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Online Assessments</h1>
        <div className="user-info">
          <span>{user?.name} (PRO Student)</span>
          <button
            onClick={() => navigate('/pro-student-dashboard')}
            className="back-btn"
            aria-label="Back to dashboard"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {assessments.length === 0 ? (
          <p>No assessments available.</p>
        ) : (
          assessments.map((assessment) => (
            <div key={assessment.id} className="dashboard-card">
              <h2>{assessment.title}</h2>
              {assessment.completed ? (
                <>
                  <p>Your Score: {assessment.score}%</p>
                  {isScorePosted(assessment.title) ? (
                    <p className="status-badge accepted">✅ Posted to Profile</p>
                  ) : (
                    <button
                      onClick={() => handlePostScoreToProfile(assessment.title, assessment.score)}
                      className="action-btn"
                      aria-label={`Post ${assessment.title} score to profile`}
                    >
                      Post Score to Profile
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => handleTakeAssessment(assessment.id)}
                  className="action-btn"
                  aria-label={`Take ${assessment.title} assessment`}
                >
                  Take Assessment
                </button>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default Assessments;

