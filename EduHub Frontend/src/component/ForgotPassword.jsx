// src/component/ForgotPassword.jsx
import React, { useState } from 'react';
import './components.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleReset = (e) => {
    e.preventDefault();
    alert(`A secured access recovery code has been sent directly to ${email}`);
  };

  return (
    <div className="edu-card">
      <h3 className="edu-title">Account Security Recovery</h3>
      <p style={{ color: '#aaa', margin: '0 0 20px 0', fontSize: '0.95rem' }}>
        Provide your primary login email credential configuration below to verify security details.
      </p>
      <form className="edu-form" onSubmit={handleReset}>
        <input 
          type="email" 
          placeholder="Enter registered email account" 
          className="edu-input" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="edu-btn-primary">Request Recovery Key</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
