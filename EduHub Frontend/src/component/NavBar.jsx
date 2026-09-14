import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  GraduationCap,
  BookOpen,
  Award,
  Flame,
  Zap,
  HelpCircle,
  FileText,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  Sparkles,
  Layers,
} from "lucide-react";
import "./NavBar.css";

const Navbar = () => {
  const { user, isAuthenticated, logout, switchSimulatorRole } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoleChange = (e) => {
    switchSimulatorRole(e.target.value);
  };

  const isAdmin = user?.role === "admin" || user?.role === "instructor";

  return (
    <header className="saas-navbar-header">
      <div className="saas-nav-container">
        {/* Brand Logo */}
        <Link to="/" className="saas-brand">
          <div className="brand-icon-wrapper">
            <GraduationCap className="brand-logo-icon" />
          </div>
          <div className="brand-text-block">
            <span className="brand-title">
              Edu<span className="text-gradient-primary">Hub</span>
            </span>
            <span className="brand-tagline">EdTech SaaS</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="saas-desktop-nav">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} end>
            Home
          </NavLink>

          <NavLink to="/catalog" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <BookOpen size={16} /> Courses
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                <Layers size={16} /> Dashboard
              </NavLink>

              <NavLink to="/my-learning" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                <GraduationCap size={16} /> My Learning
              </NavLink>

              <NavLink to="/materials" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                <FileText size={16} /> Notes & Materials
              </NavLink>

              <NavLink to="/quizzes" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                <HelpCircle size={16} /> Quizzes
              </NavLink>

              <NavLink to="/certificates" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                <Award size={16} /> Certificates
              </NavLink>

              {isAdmin && (
                <NavLink to="/admin" className={({ isActive }) => `nav-link admin-nav-link ${isActive ? "active" : ""}`}>
                  <Shield size={16} /> Admin Console
                </NavLink>
              )}
            </>
          )}

          {!isAuthenticated && (
            <>
              <NavLink to="/materials" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Materials
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                About
              </NavLink>
              <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Contact
              </NavLink>
            </>
          )}
        </nav>

        {/* Right Actions Block */}
        <div className="saas-nav-actions">
          {/* Quick Role Simulator Switcher */}
          {isAuthenticated && (
            <div className="role-simulator-wrapper" title="Switch role view for interview demonstration">
              <span className="simulator-label">Role:</span>
              <select
                className="role-selector-pill"
                value={user?.role || "student"}
                onChange={handleRoleChange}
              >
                <option value="student">👨‍🎓 Student</option>
                <option value="instructor">👨‍🏫 Instructor</option>
                <option value="admin">🛡️ Admin</option>
              </select>
            </div>
          )}

          {/* Gamification Streak & XP Pills (Student) */}
          {isAuthenticated && (
            <div className="user-gamify-badges">
              <span className="streak-pill" title={`${user?.streak || 5} Day Study Streak!`}>
                <Flame size={14} className="streak-icon" /> {user?.streak || 5}d
              </span>
              <span className="xp-pill" title={`${user?.xp || 240} Total Experience Points`}>
                <Zap size={14} className="xp-icon" /> {user?.xp || 240} XP
              </span>
            </div>
          )}

          {/* Auth Action Buttons */}
          {!isAuthenticated ? (
            <div className="auth-buttons-group">
              <Link to="/login" className="btn-saas btn-saas-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn-saas btn-saas-primary btn-sm">
                Get Started
              </Link>
            </div>
          ) : (
            <div className="user-profile-menu">
              <Link to="/profile" className="avatar-pill" title="View Profile">
                <div className="user-avatar-circle">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="user-firstname">{user?.name?.split(" ")[0] || "Student"}</span>
              </Link>
              <button onClick={logout} className="logout-icon-btn" title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay">
          <nav className="mobile-drawer-links" onClick={() => setMobileMenuOpen(false)}>
            <Link to="/" className="mobile-link">Home</Link>
            <Link to="/catalog" className="mobile-link">Courses Catalog</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="mobile-link">Dashboard</Link>
                <Link to="/my-learning" className="mobile-link">My Learning</Link>
                <Link to="/materials" className="mobile-link">Study Materials & Notes</Link>
                <Link to="/quizzes" className="mobile-link">Quizzes & Assessment</Link>
                <Link to="/certificates" className="mobile-link">Certificates</Link>
                <Link to="/achievements" className="mobile-link">Achievements & Badges</Link>
                <Link to="/profile" className="mobile-link">My Profile</Link>
                {isAdmin && <Link to="/admin" className="mobile-link text-emerald">Admin Console 🛡️</Link>}
                <button onClick={logout} className="mobile-logout-btn">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/materials" className="mobile-link">Materials</Link>
                <Link to="/about" className="mobile-link">About</Link>
                <Link to="/contact" className="mobile-link">Contact</Link>
                <div className="mobile-auth-row">
                  <Link to="/login" className="btn-saas btn-saas-secondary w-100">Sign In</Link>
                  <Link to="/register" className="btn-saas btn-saas-primary w-100">Register</Link>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
