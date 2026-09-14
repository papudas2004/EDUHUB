// src/component/Unauthorized.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './components.css';

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="edu-card" style={{ textAlign: 'center', marginTop: '10vh' }}>
      <span style={{ fontSize: '4rem', display: 'block', marginBottom: '10px' }}>🔐</span>
      <h2 style={{ color: '#ff1744', marginBottom: '15px' }}>Access Revoked / Unauthorized</h2>
      <p style={{ color: '#ccc', marginBottom: '25px', lineHeight: '1.5' }}>
        Your account level permissions does not possess clearance credentials to enter this administration node module.
      </p>
      <button 
        className="edu-btn-primary" 
        onClick={() => navigate('/')}
        style={{ width: 'auto', padding: '12px 30px' }}
      >
        Return to Portal Main
      </button>
    </div>
  );
}

export default Unauthorized;
