import React, { useState } from 'react';
import '../styles/InternshipCycleManager.css';

const InternshipCycleManager = () => {
  const [cycle, setCycle] = useState('summer');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');

  const handleSave = () => {
    console.log(`Saved ${cycle} cycle: ${startDate} → ${endDate}`);
    setMessage(`✅ ${cycle.charAt(0).toUpperCase() + cycle.slice(1)} cycle updated.`);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="cycle-manager">
      <h2>Set Internship Cycle Dates</h2>
      <div className="form-group">
        <label>Cycle:</label>
        <select value={cycle} onChange={(e) => setCycle(e.target.value)}>
          <option value="summer">Summer</option>
          <option value="winter">Winter</option>
        </select>
      </div>
      <div className="form-group">
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>
      <div className="form-group">
        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <button className="save-btn" onClick={handleSave}>Save Dates</button>
      {message && <p className="save-message">{message}</p>}
    </div>
  );
};

export default InternshipCycleManager;
