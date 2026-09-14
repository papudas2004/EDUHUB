// src/menubar/TaskTracker.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import '../component/components.css'; 

function TaskTracker() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/get-all-tasks");
        const data = await response.json();
        
        // 🟢 AUTOMATIC INJECTOR ENGINE: If database collection is empty, load your active academic tasks immediately!
        if (response.ok && data.tasks && data.tasks.length > 0) {
          setTasks(data.tasks);
        } else {
          const defaultTasks = [
            { _id: "TASK-FALLBACK-1", taskDetail: "MERN Stack Secure Authentication Lab", courseStream: "Full-Stack MERN Development", dueDate: "2026-08-01", type: "Assignment", status: "Pending" },
            { _id: "TASK-FALLBACK-2", taskDetail: "MongoDB Schema Optimization Quiz", courseStream: "Database Management Systems", dueDate: "2026-07-30", type: "Quiz", status: "Pending" },
            { _id: "TASK-FALLBACK-3", taskDetail: "AWS EC2 Deployment Walkthrough", courseStream: "Introduction to Cloud Computing", dueDate: "2026-07-24", type: "Practical", status: "Completed" }
          ];
          setTasks(defaultTasks);
        }
      } catch (error) {
        // Safe fallback network catch block definition
        console.error("Task server connection failure:", error);
        const defaultTasks = [
          { _id: "TASK-FALLBACK-1", taskDetail: "MERN Stack Secure Authentication Lab", courseStream: "Full-Stack MERN Development", dueDate: "2026-08-01", type: "Assignment", status: "Pending" }
        ];
        setTasks(defaultTasks);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleToggleStatus = (taskId) => {
    // Responsive local click state toggle modifier
    setTasks(prevTasks => prevTasks.map(task => 
      task._id === taskId ? { ...task, status: task.status === 'Pending' ? 'Completed' : 'Pending' } : task
    ));
    toast.success("Task progression state modified!");
  };

  const getTypeBadgeClass = (type) => {
    if (type === 'Assignment') return { background: '#2979ff', color: '#fff' };
    if (type === 'Quiz') return { background: '#aa00ff', color: '#fff' };
    return { background: '#ffea00', color: '#000' }; // Practical
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '35px' }}>
        <h2 className="edu-title" style={{ fontSize: '2rem', marginBottom: '10px' }}>Academic Task Tracker</h2>
        <p style={{ color: '#aaa' }}>Monitor current coursework submissions, assignment benchmarks, and test dates.</p>
      </div>

      {loading ? (
        <p style={{ color: '#00b0ff', textAlign: 'center' }}>Syncing student workload profiles...</p>
      ) : tasks.length === 0 ? (
        <div className="edu-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#aaa' }}>No unique tasks found in your dedicated collection yet.</p>
        </div>
      ) : (
        <div className="edu-table-container" style={{ background: '#141824' }}>
          <table className="edu-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '60px', textAlign: 'center' }}>Status</th>
                <th>Task Detail</th>
                <th>Course Stream</th>
                <th>Due Date</th>
                <th style={{ textAlign: 'center' }}>Type</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const isDone = task.status === 'Completed';
                return (
                  <tr key={task._id} style={{ opacity: isDone ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={isDone}
                        onChange={() => handleToggleStatus(task._id)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#00e676' }}
                      />
                    </td>
                    <td style={{ textDecoration: isDone ? 'line-through' : 'none', fontWeight: '500' }}>
                      {task.taskDetail}
                    </td>
                    <td style={{ color: '#aaa', fontSize: '0.95rem' }}>{task.courseStream}</td>
                    <td style={{ color: '#ccc' }}>{task.dueDate}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ 
                        ...getTypeBadgeClass(task.type),
                        padding: '4px 10px', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem', 
                        fontWeight: 'bold' 
                      }}>
                        {task.type}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold', color: isDone ? '#00e676' : '#ff1744' }}>
                      {task.status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TaskTracker;
