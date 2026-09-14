import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setErrorMessage(result.message || "Invalid email or password");
    }
  };

  return (
    <div className="saas-auth-page">
      <div className="auth-card-container saas-card">
        <div className="auth-header-block">
          <div className="auth-logo-badge">
            <GraduationCap size={28} className="text-emerald" />
          </div>
          <h1 className="auth-heading">Welcome Back to EduHub</h1>
          <p className="auth-subtext">Sign in to your student dashboard, courses, and AI study assistant.</p>
        </div>

        {errorMessage && <div className="form-error-alert">{errorMessage}</div>}

        <form onSubmit={handleLoginSubmit} className="auth-form-body">
          <div className="auth-field-group">
            <label className="auth-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                className="saas-input pl-icon"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-field-group">
            <div className="field-label-split">
              <label className="auth-label">Password</label>
              <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
            </div>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                className="saas-input pl-icon"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-saas btn-saas-primary w-100 mt-2" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In to EduHub"} <ArrowRight size={16} />
          </button>
        </form>

        <div className="demo-credentials-hint">
          <Sparkles size={14} className="text-emerald" />
          <span>Demo tip: Enter any email to test or register a new account.</span>
        </div>

        <div className="auth-card-footer">
          <p>
            Don't have an account yet? <Link to="/register" className="auth-action-link">Register Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
