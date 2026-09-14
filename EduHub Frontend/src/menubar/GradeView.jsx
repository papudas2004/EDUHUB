import React from "react";
import "./GradeView.css"; // 🚀 FIXED: Changed from GradesView.css to GradeView.css

const GradeView = () => {
  const academicReports = [
    { id: 1, subject: 'Full-Stack MERN Development', component: 'Mid-Term Project Submission', score: '88/100', weight: '30%', grade: 'A' },
    { id: 2, subject: 'Database Management Systems', component: 'SQL & Query Design Lab Assessment', score: '45/50', weight: '15%', grade: 'A+' },
    { id: 3, subject: 'Introduction to Cloud Computing', component: 'Cloud Architecture Final Examination', score: '72/100', weight: '50%', grade: 'B+' },
    { id: 4, subject: 'UI/UX Design Fundamentals', component: 'Figma Dynamic Prototype Showcase', score: '94/100', weight: '40%', grade: 'O' }
  ];

  return (
    <div className="grades-container">
      <div className="grades-header">
        <h1>Academic Performance Matrix</h1>
        <p>Review comprehensive grading components, weights, and verified subject feedback metrics.</p>
      </div>

      <div className="gpa-summary-card">
        <div className="gpa-block">
          <span className="gpa-value">8.92</span>
          <span className="gpa-label">Current CGPA</span>
        </div>
        <div className="gpa-block">
          <span className="gpa-value">4 / 4</span>
          <span className="gpa-label">Active Modules Passed</span>
        </div>
      </div>

      <div className="table-responsive">
        <table className="grades-table">
          <thead>
            <tr>
              <th>Subject Stream</th>
              <th>Evaluation Component</th>
              <th>Score Secured</th>
              <th>Course Weight</th>
              <th>Final Grade</th>
            </tr>
          </thead>
          <tbody>
            {academicReports.map(report => (
              <tr key={report.id}>
                <td className="bold-cell">{report.subject}</td>
                <td>{report.component}</td>
                <td className="score-cell">{report.score}</td>
                <td>{report.weight}</td>
                <td><span className={`grade-tag g-${report.grade.toLowerCase().replace('+', 'p')}`}>{report.grade}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradeView;
