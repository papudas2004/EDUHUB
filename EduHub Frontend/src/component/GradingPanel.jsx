// src/component/GradingPanel.jsx
import React, { useState } from 'react';
import './components.css';

function GradingPanel() {
  // Sample data simulating backend values
  const [submissions, setSubmissions] = useState([
    { id: 1, student: 'Amit Kumar', assignment: 'React Hooks Basics', status: 'Pending' },
    { id: 2, student: 'Neha Sharma', assignment: 'Express Rest API Setup', status: 'Graded' },
    { id: 3, student: 'Rahul Verma', assignment: 'Database Schema Design', status: 'Pending' },
  ]);

  const handleGrade = (id) => {
    setSubmissions(submissions.map(sub => 
      sub.id === id ? { ...sub, status: 'Graded' } : sub
    ));
    alert(`Submission #${id} marked as Graded!`);
  };

  return (
    <div className="edu-table-container">
      <h3 className="edu-title">Instructor Grading Panel</h3>
      <table className="edu-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Assignment Title</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => (
            <tr key={sub.id}>
              <td>{sub.student}</td>
              <td>{sub.assignment}</td>
              <td style={{ color: sub.status === 'Pending' ? '#00b0ff' : '#00e676' }}>
                {sub.status}
              </td>
              <td>
                {sub.status === 'Pending' ? (
                  <button 
                    className="edu-btn-primary" 
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                    onClick={() => handleGrade(sub.id)}
                  >
                    Grade Now
                  </button>
                ) : (
                  <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Complete</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GradingPanel;
