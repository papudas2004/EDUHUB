import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./About.css";

const About = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="about-container">
      {/* 1. Minimalist Header Banner */}
      <header className="about-header">
        <span className="section-badge">Our Mission</span>
        <h1 className="about-title">Revolutionizing Education</h1>
        <p className="about-subtitle">
          We bridge the gap between traditional learning and modern tech skills to prepare students for top-tier industry careers.
        </p>
      </header>

      {/* 2. Classic Dual Column Mission Section */}
      <section className="about-grid">
        <div className="about-image-side">
          {/* ✅ EMBEDDED INLINE ARTWORK: Cannot be blocked by CORS or network connections */}
          <div className="story-img-fallback">
            <svg viewBox="0 0 200 150" xmlns="http://w3.org" className="fallback-svg">
              <rect width="100%" height="100%" fill="#1e293b" rx="12"/>
              <circle cx="100" cy="65" r="25" fill="#10b981" opacity="0.8"/>
              <path d="M60 120 C 60 95, 140 95, 140 120" stroke="#10b981" strokeWidth="8" strokeLinecap="round" fill="none"/>
              <rect x="75" y="115" width="50" height="30" rx="3" fill="#3b82f6" opacity="0.9"/>
              <line x1="85" y1="125" x2="115" y2="125" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
              <line x1="90" y1="133" x2="110" y2="133" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
              <text x="100" y="25" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="1">STUDENT HUB</text>
            </svg>
          </div>
          <div className="image-accent-glow"></div>
        </div>

        <div className="about-text-side">
          <h2>Empowering Students Globally</h2>
          <p>
            Founded with a vision to make high-quality, practical learning universally accessible, our platform combines comprehensive online video lectures with guided physical placement resources.
          </p>
          <p>
            We believe that learning isn't just about reading code or passing exams—it's about building projects that matter, receiving authentic critique, and securing career independence.
          </p>
          <div className="story-cta">
            <Link to="/services" className="cta-link-button">
              View Our Curriculum <span className="arrow-icon">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Live Metrics / Performance Counter Grid */}
      <section className="metrics-bar">
        <div className="metric-item">
          <span className="metric-number">15K+</span>
          <span className="metric-label">Enrolled Alumni</span>
        </div>
        <div className="metric-item">
          <span className="metric-number">94%</span>
          <span className="metric-label">Placement Success Rate</span>
        </div>
        <div className="metric-item">
          <span className="metric-number">120+</span>
          <span className="metric-label">Industry Mentors</span>
        </div>
        <div className="metric-item">
          <span className="metric-number">4.8★</span>
          <span className="metric-label">Average Review</span>
        </div>
      </section>

      {/* 4. Deep Grid Core Values with Bottom Actions */}
      <section className="values-section">
        <h2 className="values-main-title">Our Core Foundations</h2>
        
        <div className="values-grid">
          <div className="value-card">
            <span className="value-index">01</span>
            <h3>Industry Alignment</h3>
            <p>Our study syllabi are continuously adjusted alongside hiring partners to ensure you learn relevant skills.</p>
          </div>
          <div className="value-card">
            <span className="value-index">02</span>
            <h3>Mentorship First</h3>
            <p>Never get stuck alone. Access scheduled daily interactive code reviews and mock career interviews.</p>
          </div>
          <div className="value-card">
            <span className="value-index">03</span>
            <h3>Absolute Accessibility</h3>
            <p>Flexible scheduling and cloud-accessible digital resources built to work smoothly on any device.</p>
          </div>
        </div>

        {/* Bottom Conversion Box Section */}
        <div className="about-footer-conversion">
          <h3>Ready to advance your career trajectory?</h3>
          <div className="conversion-actions">
            <Link to="/register" className="about-btn-action primary-action">
              Create Free Account
            </Link>
            <Link to="/contact" className="about-btn-action secondary-action">
              Speak With an Advisor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
