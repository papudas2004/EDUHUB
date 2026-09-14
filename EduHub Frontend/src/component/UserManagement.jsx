// src/component/UserManagement.jsx
import React, { useState } from 'react';
import './components.css';

function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Siddharth Roy', email: 'sid@eduhub.com', role: 'Instructor' },
    { id: 2, name: 'Pooja Mishra', email: 'pooja@eduhub.com', role: 'Student' },
    { id: 3, name: 'Vikram Singh', email: 'vikram@eduhub.com', role: 'Student' },
  ]);

  const handleRoleChange = (id) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, role: user.role === 'Student' ? 'Instructor' : 'Student' } : user
    ));
  };

  return (
    <div className="edu-table-container">
      <h3 className="edu-title">User Account Administration</h3>
      <table className="edu-table">
        <thead>
          <tr>
            <th>User Account</th>
            <th>Email Reference</th>
            <th>Current Role</th>
            <th>Access Control</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button 
                  className="edu-btn-primary" 
                  style={{ 
                    padding: '6px 12px', 
                    fontSize: '0.85rem',
                    background: 'linear-gradient(135deg, #ff1744 0%, #b71c1c 100%)' // Red warning accent
                  }}
                  onClick={() => handleRoleChange(user.id)}
                >
                  Toggle Role
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
