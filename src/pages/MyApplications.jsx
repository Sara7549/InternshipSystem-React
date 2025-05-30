import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/Dashboard.css';
import '../styles/InternshipsList.css';

const MyApplications = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);

  const navigate = useNavigate(); 
  useEffect(() => {
    if (!user) return;

    const storedApps = JSON.parse(localStorage.getItem('applications') || '[]');

    // Filter apps where applicant name or email matches logged-in user
    const userApps = storedApps.filter(app => 
      app.applicant === user.name || app.email === user.email
    );

    setApplications(userApps);
  }, [user]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>My Internship Applications</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={() => navigate('/pro-student-dashboard')} className="back-btn">Back to Dashboard</button>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-card full-width">
          <h2>Applications Summary</h2>
          {applications.length === 0 ? (
            <p>You haven't applied to any internships yet.</p>
          ) : (
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Internship Title</th>
                  <th>Company</th>
                  <th>Applied On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr key={index}>
                    <td>{app.internshipTitle || 'N/A'}</td>
                    <td>{app.company || 'N/A'}</td>
                    <td>{new Date(app.submittedDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${app.status.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
};

export default MyApplications;
