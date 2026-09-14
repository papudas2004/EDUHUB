import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, Mail, Lock, User, Phone, MapPin, ArrowRight } from "lucide-react";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneno: "",
    city: "",
    address: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      navigate("/login");
    } else {
      setErrorMessage(result.message || "Registration failed");
    }
  };

  return (
    <div className="saas-auth-page">
      <div className="auth-card-container saas-card">
        <div className="auth-header-block">
          <div className="auth-logo-badge">
            <GraduationCap size={28} className="text-emerald" />
          </div>
          <h1 className="auth-heading">Create Your EduHub Account</h1>
          <p className="auth-subtext">Join the MCA placement platform to access curated courses & study notes.</p>
        </div>

        {errorMessage && <div className="form-error-alert">{errorMessage}</div>}

        <form onSubmit={handleRegisterSubmit} className="auth-form-body">
          <div className="auth-field-group">
            <label className="auth-label">Full Name</label>
            <div className="input-with-icon">
              <User size={16} className="input-icon" />
              <input
                type="text"
                name="name"
                className="saas-input pl-icon"
                placeholder="e.g. Papu Das"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-field-group">
            <label className="auth-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                name="email"
                className="saas-input pl-icon"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-field-group">
            <label className="auth-label">Password</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                name="password"
                className="saas-input pl-icon"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="auth-field-group">
              <label className="auth-label">Phone Number</label>
              <div className="input-with-icon">
                <Phone size={16} className="input-icon" />
                <input
                  type="text"
                  name="phoneno"
                  className="saas-input pl-icon"
                  placeholder="10-digit number"
                  value={formData.phoneno}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="auth-field-group">
              <label className="auth-label">City</label>
              <div className="input-with-icon">
                <MapPin size={16} className="input-icon" />
                <input
                  type="text"
                  name="city"
                  className="saas-input pl-icon"
                  placeholder="Your city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-saas btn-saas-primary w-100 mt-2" disabled={loading}>
            {loading ? "Creating Account..." : "Complete Registration"} <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-card-footer">
          <p>
            Already have an account? <Link to="/login" className="auth-action-link">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
