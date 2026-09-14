import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Mail, Globe, Code, Sparkles } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="saas-footer-wrapper">
      <div className="saas-container">
        <div className="saas-footer-grid">
          {/* Brand & Mission */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand-logo">
              <div className="footer-icon-box">
                <GraduationCap size={22} className="text-emerald" />
              </div>
              <span className="footer-brand-title">
                Edu<span className="text-gradient-primary">Hub</span>
              </span>
            </Link>
            <p className="footer-tagline-text">
              "EduHub — Learn Smarter, Track Progress, and Achieve More."
            </p>
            <p className="footer-mission-text">
              Designed & engineered as an advanced MERN educational operating system for MCA placement portfolios.
            </p>
            <div className="footer-social-links">
              <a href="https://github.com/papudas2004" target="_blank" rel="noreferrer" className="social-icon" aria-label="GitHub">
                <Code size={18} />
              </a>
              <a href="https://eduhub.app" target="_blank" rel="noreferrer" className="social-icon" aria-label="Website">
                <Globe size={18} />
              </a>
              <a href="mailto:support@eduhub.com" className="social-icon" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Learning Links */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Learning Hub</h4>
            <ul className="footer-list">
              <li><Link to="/catalog">Course Catalog</Link></li>
              <li><Link to="/my-learning">My Enrolled Courses</Link></li>
              <li><Link to="/quizzes">Assessment Quizzes</Link></li>
              <li><Link to="/materials">Study Materials & Notes</Link></li>
              <li><Link to="/certificates">Earned Certificates</Link></li>
            </ul>
          </div>

          {/* Platform & Student Portal */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Student Portal</h4>
            <ul className="footer-list">
              <li><Link to="/dashboard">Student Dashboard</Link></li>
              <li><Link to="/achievements">XP & Streak Badges</Link></li>
              <li><Link to="/tasks">Academic Tasks Tracker</Link></li>
              <li><Link to="/grades">Grades & Matrix</Link></li>
              <li><Link to="/profile">Profile Settings</Link></li>
            </ul>
          </div>

          {/* Institutional / Portfolio */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Project & Tech</h4>
            <ul className="footer-list">
              <li><Link to="/about">About EduHub Architecture</Link></li>
              <li><Link to="/services">Services & Curriculum</Link></li>
              <li><Link to="/contact">Contact Administration</Link></li>
              <li><Link to="/Contact-List">Institutional Directory</Link></li>
              <li><Link to="/admin">Admin Console 🛡️</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="saas-footer-bottom">
          <p className="copyright-text">
            © {currentYear} <strong>EduHub</strong>. Designed for MCA Placement Excellence.
          </p>
          <div className="footer-meta-pill">
            <Sparkles size={13} className="text-emerald" />
            <span>MERN Stack + Google Gemini AI Powered</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
