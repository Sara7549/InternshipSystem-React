import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/Dashboard.css';

const MyInternships = () => {
const { user } = useContext(AuthContext);
const navigate = useNavigate();
const [internships, setInternships] = useState([]);
const [filter, setFilter] = useState('all');
const [search, setSearch] = useState('');

useEffect(() => {
if (user) {
const saved = localStorage.getItem(`myInternships_${user.email}`);
if (saved) {
setInternships(JSON.parse(saved));
} else {
setInternships([]); // default empty list
}
}
}, [user]);

const filtered = internships.filter(int => {
const matchStatus = filter === 'all' || int.status === filter;
const matchSearch = int.title.toLowerCase().includes(search.toLowerCase()) ||
int.company.toLowerCase().includes(search.toLowerCase());
return matchStatus && matchSearch;
});

if (!user || user.userType !== 'pro-student') {
return <div className="login-container"><p>Unauthorized</p></div>;
}

return (
<div className="dashboard-container">
<header className="dashboard-header">
<h1>My Internships</h1>
<button onClick={() => navigate('/pro-student-dashboard')} className="back-btn">
Back to Dashboard
</button>
</header>

php-template
Copy
Edit
  <main className="dashboard-main">
    <section className="dashboard-card full-width">
      <div className="form-group">
        <input
          type="text"
          placeholder="Search by title or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="current">Current</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {filtered.length > 0 ? (
        <ul className="internship-list">
          {filtered.map((int, index) => (
            <li key={index} className="internship-item">
              <h3>{int.title}</h3>
              <p>Company: {int.company}</p>
              <p>Status: {int.status}</p>
              <p>Start: {int.startDate}</p>
              {int.status === 'completed' && (
                <button className="action-btn" onClick={() => alert('Open report or evaluation')}>
                  View Report / Evaluation
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No internships found.</p>
      )}
    </section>
  </main>
</div>
);
};

export default MyInternships;