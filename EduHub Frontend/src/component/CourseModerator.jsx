// src/component/CourseModerator.jsx
import React, { useState } from 'react';
import './components.css';

function CourseModerator() {
  const [courses, setCourses] = useState([
    { id: 101, title: 'Fullstack Web Development with Vite', author: 'Prof. Roy', status: 'Awaiting Approval' },
    { id: 102, title: 'Machine Learning Fundamentals', author: 'Dr. Neha', status: 'Awaiting Approval' },
  ]);

  const handleApprove = (id) => {
    setCourses(courses.filter(course => course.id !== id));
    alert(`Course #${id} has been published successfully onto EduHub search indexes.`);
  };

  return (
    <div className="edu-table-container">
      <h3 className="edu-title">Content Moderation Queue</h3>
      <table className="edu-table">
        <thead>
          <tr>
            <th>Course Context</th>
            <th>Instructor</th>
            <th>Status Check</th>
            <th>Decision Path</th>
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', color: '#aaa' }}>All incoming content verified and clean.</td>
            </tr>
          ) : (
            courses.map((course) => (
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{course.author}</td>
                <td style={{ color: '#ffb300' }}>{course.status}</td>
                <td>
                  <button 
                    className="edu-btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                    onClick={() => handleApprove(course.id)}
                  >
                    Approve Content
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CourseModerator;
