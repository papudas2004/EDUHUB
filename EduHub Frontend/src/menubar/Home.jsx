import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
  ArrowRight,
  Flame,
  Zap,
  Star,
  Users,
  Briefcase,
  Play,
  Terminal,
  ShieldCheck,
  ChevronRight,
  FileText,
} from "lucide-react";
import "./home.css";

const Home = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const sampleCourses = [
    {
      id: "course-1",
      title: "Full-Stack MERN Architecture & Cloud Deployment",
      category: "development",
      instructor: "Siddharth Roy (Senior Tech Lead)",
      level: "Intermediate",
      duration: "45 Hours",
      lessonsCount: 28,
      rating: 4.9,
      students: 3420,
      description: "Master React 19, Node.js, Express, MongoDB Atlas, Docker containers, and AWS CI/CD pipelines.",
      badge: "Placement Track",
    },
    {
      id: "course-2",
      title: "Artificial Intelligence & Core Neural Networks",
      category: "ai",
      instructor: "Dr. Ananya Sen (AI Researcher)",
      level: "Advanced",
      duration: "38 Hours",
      lessonsCount: 22,
      rating: 4.95,
      students: 2150,
      description: "Hands-on PyTorch, LLM fine-tuning, RAG pipelines, prompt engineering, and production AI agents.",
      badge: "Trending ⚡",
    },
    {
      id: "course-3",
      title: "Data Structures, Algorithms & System Design for MCA",
      category: "placement",
      instructor: "Vikram Malhotra (Ex-FAANG)",
      level: "All Levels",
      duration: "60 Hours",
      lessonsCount: 40,
      rating: 4.88,
      students: 4890,
      description: "Ace campus placements with 250+ curated LeetCode problems, high-level and low-level system designs.",
      badge: "High Placement Rate",
    },
    {
      id: "course-4",
      title: "Cloud Infrastructure & Microservices on AWS",
      category: "cloud",
      instructor: "Neha Sharma (Cloud Architect)",
      level: "Intermediate",
      duration: "32 Hours",
      lessonsCount: 18,
      rating: 4.85,
      students: 1940,
      description: "Kubernetes, Serverless Lambdas, Redis caching, Kafka message queues, and API Gateway security.",
      badge: "Industry Standard",
    },
  ];

  const filteredCourses =
    activeCategory === "all"
      ? sampleCourses
      : sampleCourses.filter((c) => c.category === activeCategory);

  return (
    <div className="home-saas-canvas">
      {/* 1. HERO SECTION */}
      <section className="hero-saas-section">
        <div className="hero-glow-blob top-left"></div>
        <div className="hero-glow-blob bottom-right"></div>

        <div className="saas-container hero-content-container">
          <div className="hero-badge-pill">
            <Sparkles size={15} className="text-emerald" />
            <span>The Modern EdTech Platform for MCA & Software Engineers</span>
          </div>

          <h1 className="hero-headline">
            EduHub — Learn Smarter, <br />
            <span className="text-gradient-primary">Track Progress</span>, and{" "}
            <span className="text-gradient-purple">Achieve More.</span>
          </h1>

          <p className="hero-description">
            A comprehensive, SaaS-grade learning ecosystem built for ambitious developers.
            Master industry-aligned courses, practice with real-time timed quizzes, download
            comprehensive placement revision notes, and earn verified credentials for your portfolio.
          </p>

          <div className="hero-cta-group">
            <Link to="/catalog" className="btn-saas btn-saas-primary btn-hero">
              <BookOpen size={18} /> Explore Courses
              <ArrowRight size={16} />
            </Link>
            <Link to="/materials" className="btn-saas btn-saas-secondary btn-hero">
              <FileText size={18} className="text-cyan" /> Placement Notes & Guides
            </Link>
          </div>

          {/* Social Proof Stats Counter */}
          <div className="hero-metrics-strip">
            <div className="metric-item">
              <span className="metric-number">15,000+</span>
              <span className="metric-label">Active Learners</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-number">98.4%</span>
              <span className="metric-label">MCA Placement Rate</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-number">120+</span>
              <span className="metric-label">Curated Modules</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-number">4.9 / 5</span>
              <span className="metric-label">Student Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION / FEATURE BENTO GRID */}
      <section className="features-bento-section">
        <div className="saas-container">
          <div className="section-header-center">
            <span className="saas-badge badge-emerald">Why Choose EduHub</span>
            <h2 className="section-title">Engineered For Rapid Career Acceleration</h2>
            <p className="section-subtitle">
              Everything you need to master modern computer science concepts, stay accountable, and prepare for top tier job offers.
            </p>
          </div>

          <div className="bento-grid">
            {/* Bento Card 1: Academic Notes & Resource Library */}
            <div className="bento-card bento-span-2 ai-bento-highlight">
              <div className="bento-icon-box cyan">
                <FileText size={28} />
              </div>
              <div className="bento-content">
                <span className="saas-badge badge-cyan">Resource Library</span>
                <h3>Comprehensive Study Notes & Placement Guides</h3>
                <p>
                  Curated revision cheat sheets, formula handbooks, and interview guides across MERN Stack, DBMS, DSA, and Cloud Architecture with direct 1-click Chrome downloads.
                </p>
                <div className="ai-sample-pill">
                  <Terminal size={14} className="text-muted" />
                  <code>"Direct download MERN, DBMS, and DSA Placement Guides"</code>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Interactive Tracking */}
            <div className="bento-card">
              <div className="bento-icon-box emerald">
                <CheckCircle2 size={26} />
              </div>
              <h3>Persistent Progress</h3>
              <p>
                Track lesson completions, bookmark key lecture notes, and resume right where you left off from your student dashboard.
              </p>
            </div>

            {/* Bento Card 3: Assessments & Quizzes */}
            <div className="bento-card">
              <div className="bento-icon-box purple">
                <Zap size={26} />
              </div>
              <h3>Timed Quizzes & Analytics</h3>
              <p>
                Practice topic-wise MCQs with live timers, instant scoring, accuracy metrics, and in-depth answer explanations.
              </p>
            </div>

            {/* Bento Card 4: Gamification & Streaks */}
            <div className="bento-card">
              <div className="bento-icon-box amber">
                <Flame size={26} />
              </div>
              <h3>Streaks & XP Gamification</h3>
              <p>
                Stay motivated with daily learning streaks, unlockable badges, and level advancement as you complete modules.
              </p>
            </div>

            {/* Bento Card 5: Verified Certificates */}
            <div className="bento-card bento-span-2">
              <div className="bento-icon-box indigo">
                <Award size={28} />
              </div>
              <div className="bento-content">
                <span className="saas-badge badge-indigo">Placement Ready</span>
                <h3>Industry-Recognized Certificates</h3>
                <p>
                  Complete courses to earn verifiable digital certificates equipped with unique verification IDs, official EduHub credentials, and instant sharing options for resumes and LinkedIn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COURSES SECTION */}
      <section className="featured-courses-section">
        <div className="saas-container">
          <div className="section-header-flex">
            <div>
              <span className="saas-badge badge-emerald">Course Catalog</span>
              <h2 className="section-title">Explore High-Impact Tech Tracks</h2>
            </div>
            <Link to="/catalog" className="btn-saas btn-saas-secondary">
              View All Courses <ChevronRight size={16} />
            </Link>
          </div>

          {/* Category Filter Tabs */}
          <div className="course-tabs-filter">
            <button
              className={`filter-tab ${activeCategory === "all" ? "active" : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              All Tracks
            </button>
            <button
              className={`filter-tab ${activeCategory === "development" ? "active" : ""}`}
              onClick={() => setActiveCategory("development")}
            >
              Full-Stack MERN
            </button>
            <button
              className={`filter-tab ${activeCategory === "ai" ? "active" : ""}`}
              onClick={() => setActiveCategory("ai")}
            >
              AI & Data Science
            </button>
            <button
              className={`filter-tab ${activeCategory === "placement" ? "active" : ""}`}
              onClick={() => setActiveCategory("placement")}
            >
              DSA & Placement
            </button>
            <button
              className={`filter-tab ${activeCategory === "cloud" ? "active" : ""}`}
              onClick={() => setActiveCategory("cloud")}
            >
              Cloud & DevOps
            </button>
          </div>

          {/* Courses Cards Grid */}
          <div className="courses-showcase-grid">
            {filteredCourses.map((course) => (
              <div key={course.id} className="saas-card course-saas-card">
                <div className="course-card-top">
                  <span className="saas-badge badge-emerald">{course.badge}</span>
                  <div className="course-rating">
                    <Star size={14} className="star-icon" fill="#f59e0b" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                <h3 className="course-card-title">{course.title}</h3>
                <p className="course-card-desc">{course.description}</p>

                <div className="course-meta-tags">
                  <span>⏱️ {course.duration}</span>
                  <span>📖 {course.lessonsCount} Lessons</span>
                  <span>⚡ {course.level}</span>
                </div>

                <div className="course-card-footer">
                  <div className="instructor-info">
                    <div className="instructor-avatar">{course.instructor.charAt(0)}</div>
                    <span className="instructor-name">{course.instructor}</span>
                  </div>
                  <Link to="/catalog" className="btn-saas btn-saas-primary btn-sm">
                    View Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PLACEMENT & MCA READY PROMISE BANNER */}
      <section className="cta-banner-section">
        <div className="saas-container">
          <div className="cta-banner-card">
            <div className="cta-banner-content">
              <span className="saas-badge badge-cyan">MCA Placement Accelerator</span>
              <h2>Ready to Build Your Placement Portfolio?</h2>
              <p>
                Join thousands of students mastering modern web development, algorithms, and AI.
                Get immediate access to course materials, practice quizzes, and an intelligent AI mentor.
              </p>
              <div className="cta-actions">
                <Link to="/register" className="btn-saas btn-saas-primary btn-hero">
                  Create Free Student Account <ArrowRight size={16} />
                </Link>
                <Link to="/dashboard" className="btn-saas btn-saas-secondary btn-hero">
                  Open Student Console
                </Link>
              </div>
            </div>
            <div className="cta-banner-visual">
              <div className="achievement-badge-card">
                <Award size={36} className="text-emerald" />
                <div>
                  <h4>Verified Certificate</h4>
                  <p>Accredited EduHub Certification</p>
                </div>
              </div>
              <div className="achievement-badge-card">
                <Briefcase size={36} className="text-cyan" />
                <div>
                  <h4>Campus Placements</h4>
                  <p>FAANG & Tech Startup Ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
