import React, { useState } from 'react';

const ReportManagement = ({ internshipId }) => {
  const [report, setReport] = useState({
    title: '',
    introduction: '',
    body: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    localStorage.setItem(`report_${internshipId}`, JSON.stringify(report));
    alert('Report saved successfully!');
  };

  const handleDelete = () => {
    localStorage.removeItem(`report_${internshipId}`);
    alert('Report deleted successfully!');
  };

  return (
    <div>
      <h1>Manage Internship Report</h1>
      <form>
        <label>
          Title:
          <input type="text" name="title" value={report.title} onChange={handleChange} />
        </label>
        <label>
          Introduction:
          <textarea name="introduction" value={report.introduction} onChange={handleChange}></textarea>
        </label>
        <label>
          Body:
          <textarea name="body" value={report.body} onChange={handleChange}></textarea>
        </label>
        <button type="button" onClick={handleSave}>
          Save
        </button>
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      </form>
    </div>
  );
};

export default ReportManagement;