import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";
import DashboardLayout from "../component/DashboardLayout";
import {
  BookOpen,
  Award,
  Flame,
  Zap,
  CheckCircle2,
  Clock,
  Play,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileText,
  TrendingUp,
  BarChart3,
  Star,
  ShieldCheck,
  ChevronRight,
  GraduationCap,
  Trophy,
} from "lucide-react";
import "./Dashboard.css";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userId = user?._id || user?.id || "student-default";

        // 1. Fetch Enrolled Courses
        const myLearningRes = await apiClient.get(`/my-learning/${userId}`).catch(() => null);
        if (myLearningRes?.data?.success && myLearningRes.data.myLearning?.length > 0) {
          setEnrolledCourses(myLearningRes.data.myLearning);
        } else {
          // Default enrolled course for showcase
          setEnrolledCourses([
            {
              courseId: "course-1",
              title: "Full-Stack MERN Architecture & Cloud Deployment",
              category: "Development",
              difficulty: "Intermediate",
              instructor: "Siddharth Roy (Senior Tech Lead)",
              duration: "45 Hours",
              totalLessons: 4,
              completedLessons: [1, 2, 3],
              progressPercentage: 75,
              lastLessonTitle: "Dockerizing MERN & Cloud CI/CD Pipelines",
              isCompleted: false,
            },
            {
              courseId: "course-2",
              title: "Artificial Intelligence & Core Neural Networks",
              category: "AI & Data Science",
              difficulty: "Advanced",
              instructor: "Dr. Ananya Sen (AI Researcher)",
              duration: "38 Hours",
              totalLessons: 3,
              completedLessons: [1, 2],
              progressPercentage: 66,
              lastLessonTitle: "Building RAG with Vector Embeddings",
              isCompleted: false,
            },
          ]);
        }

        // 2. Fetch Catalog for Recommended Courses
        const catalogRes = await apiClient.get("/get-all-courses").catch(() => null);
        if (catalogRes?.data?.courses?.length > 0) {
          setRecommendedCourses(catalogRes.data.courses);
        }

        // 3. Fetch Quiz History
        const quizRes = await apiClient.get(`/quizzes/history/${userId}`).catch(() => null);
        if (quizRes?.data?.attempts?.length > 0) {
          setQuizHistory(quizRes.data.attempts);
        } else {
          setQuizHistory([
            {
              quizTitle: "React 19 & Frontend Engineering Assessment",
              score: 80,
              accuracy: 80,
              totalQuestions: 5,
              correctAnswers: 4,
              createdAt: new Date().toISOString(),
            },
          ]);
        }
      } catch (err) {
        console.warn("Dashboard hydration warning:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Active continue learning course
  const continueCourse = enrolledCourses[0] || {
    courseId: "course-1",
    title: "Full-Stack MERN Architecture & Cloud Deployment",
    progressPercentage: 72,
    lastLessonTitle: "Dockerizing MERN & Cloud CI/CD Pipelines",
    instructor: "Siddharth Roy",
  };

  const totalLessonsDone = enrolledCourses.reduce(
    (acc, curr) => acc + (curr.completedLessons?.length || 0),
    0
  );

  const averageProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce((acc, curr) => acc + (curr.progressPercentage || 0), 0) /
            enrolledCourses.length
        )
      : 72;

  const latestQuiz = quizHistory[0] || {
    quizTitle: "React 19 & Frontend Engineering Assessment",
    accuracy: 80,
    score: 80,
  };

  return (
    <DashboardLayout>
      <div className="dashboard-content-wrapper">
        {/* Personalized Welcome Banner */}
        <div className="welcome-saas-header">
          <div className="welcome-text-col">
            <span className="welcome-tagline">STUDENT LEARNING DASHBOARD</span>
            <h1 className="welcome-greeting">
              Welcome back 👋 {user?.name || "MCA Scholar"}
            </h1>
            <p className="welcome-subtext">
              Track your placement preparations, master full-stack concepts, and achieve your technical career goals.
            </p>
          </div>

          <div className="welcome-quick-actions">
            <Link to="/materials" className="quick-ai-btn">
              <FileText size={16} className="text-cyan" />
              <span>Study Notes & Guides</span>
            </Link>
            <Link to="/catalog" className="quick-explore-btn">
              <BookOpen size={16} />
              <span>Explore Courses</span>
            </Link>
          </div>
        </div>

        {/* Hero "Continue Learning" Highlight Card */}
        <div className="continue-learning-hero-card">
          <div className="continue-card-content">
            <div className="continue-badge-pill">
              <Play size={12} className="fill-current" />
              <span>CONTINUE LEARNING</span>
            </div>

            <h2 className="continue-course-title">{continueCourse.title}</h2>
            <p className="continue-lesson-title">
              Current Lesson: <strong>{continueCourse.lastLessonTitle || "Express Middleware Chains & Security"}</strong>
            </p>

            <div className="continue-progress-block">
              <div className="continue-progress-labels">
                <span>Overall Progress</span>
                <span className="continue-percent-highlight">
                  {continueCourse.progressPercentage || 72}%
                </span>
              </div>
              <div className="continue-progress-track">
                <div
                  className="continue-progress-fill"
                  style={{ width: `${continueCourse.progressPercentage || 72}%` }}
                />
              </div>
            </div>

            <div className="continue-action-row">
              <Link
                to={`/learn/${continueCourse.courseId}`}
                className="resume-now-btn"
              >
                <Play size={18} />
                <span>Resume Learning</span>
              </Link>
              <Link to="/my-learning" className="view-all-enrolled-link">
                View All Enrolled ({enrolledCourses.length}) <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="continue-card-visual">
            <div className="visual-circle-accent">
              <GraduationCap size={72} className="visual-cap-icon" />
            </div>
          </div>
        </div>

        {/* 4 Core KPI Statistics Cards */}
        <div className="kpi-stats-grid">
          <div className="kpi-card">
            <div className="kpi-icon-box progress-icon-box">
              <TrendingUp size={22} />
            </div>
            <div className="kpi-data">
              <span className="kpi-label">Overall Progress</span>
              <h3 className="kpi-value">{averageProgress}%</h3>
              <span className="kpi-meta">{totalLessonsDone} lessons completed</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-box streak-icon-box">
              <Flame size={22} />
            </div>
            <div className="kpi-data">
              <span className="kpi-label">Learning Streak</span>
              <h3 className="kpi-value">{user?.streak || 7} Days</h3>
              <span className="kpi-meta text-orange">🔥 Consistent active learner</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-box xp-icon-box">
              <Zap size={22} />
            </div>
            <div className="kpi-data">
              <span className="kpi-label">Experience Points</span>
              <h3 className="kpi-value">{user?.xp || 340} XP</h3>
              <span className="kpi-meta text-amber">⚡ Level {Math.floor((user?.xp || 340) / 200) + 1} Apprentice</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-box cert-icon-box">
              <Award size={22} />
            </div>
            <div className="kpi-data">
              <span className="kpi-label">Certificates Earned</span>
              <h3 className="kpi-value">
                {enrolledCourses.filter((c) => c.isCompleted || c.progressPercentage === 100).length || 1}
              </h3>
              <Link to="/certificates" className="kpi-link">
                View Credentials <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Mid Grid: My Courses + Quiz Performance */}
        <div className="dashboard-columns-layout">
          {/* Left Column: Enrolled Courses */}
          <div className="dashboard-left-col">
            <div className="section-title-bar">
              <div className="title-with-icon">
                <BookOpen size={20} className="text-indigo" />
                <h3 className="section-main-title">Enrolled Courses</h3>
              </div>
              <Link to="/my-learning" className="section-more-link">
                See all <ChevronRight size={14} />
              </Link>
            </div>

            <div className="enrolled-courses-vertical-list">
              {enrolledCourses.map((course, idx) => (
                <div key={idx} className="enrolled-course-item">
                  <div className="enrolled-item-main">
                    <div className="course-cat-tag">{course.category || "Development"}</div>
                    <h4 className="enrolled-item-title">{course.title}</h4>
                    <span className="enrolled-item-instructor">By {course.instructor}</span>

                    <div className="enrolled-item-progress-row">
                      <div className="item-progress-track">
                        <div
                          className={`item-progress-fill ${course.progressPercentage === 100 ? "finished" : ""}`}
                          style={{ width: `${course.progressPercentage || 0}%` }}
                        />
                      </div>
                      <span className="item-progress-number">
                        {course.progressPercentage || 0}%
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/learn/${course.courseId}`}
                    className="item-resume-btn"
                  >
                    <Play size={16} />
                  </Link>
                </div>
              ))}
            </div>

            {/* Recommended Courses Section */}
            <div className="section-title-bar recommended-margin">
              <div className="title-with-icon">
                <Sparkles size={20} className="text-cyan" />
                <h3 className="section-main-title">Recommended For You</h3>
              </div>
              <Link to="/catalog" className="section-more-link">
                Browse catalog <ChevronRight size={14} />
              </Link>
            </div>

            <div className="recommended-grid">
              {recommendedCourses.slice(0, 2).map((rec, idx) => (
                <div key={idx} className="recommended-course-card">
                  <div className="rec-badge-row">
                    <span className="rec-category">{rec.category}</span>
                    <span className="rec-rating">
                      <Star size={12} className="fill-amber text-amber" /> {rec.rating || 4.9}
                    </span>
                  </div>
                  <h4 className="rec-title">{rec.title}</h4>
                  <p className="rec-desc">{rec.description?.substring(0, 85)}...</p>
                  <div className="rec-bottom">
                    <span className="rec-duration">
                      <Clock size={12} /> {rec.duration || "40h"}
                    </span>
                    <Link to={`/courses/${rec._id}`} className="rec-view-btn">
                      Details <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Quiz Performance & Achievements */}
          <div className="dashboard-right-col">
            {/* Quiz Performance Widget */}
            <div className="dashboard-widget-card">
              <div className="widget-header">
                <div className="title-with-icon">
                  <HelpCircle size={18} className="text-purple" />
                  <h4 className="widget-title">Quiz Performance</h4>
                </div>
                <Link to="/quizzes" className="widget-more-link">
                  Test Knowledge
                </Link>
              </div>

              <div className="quiz-metric-row">
                <div className="quiz-circle-metric">
                  <span className="metric-big">{latestQuiz.accuracy}%</span>
                  <span className="metric-sub">Accuracy</span>
                </div>
                <div className="quiz-meta-info">
                  <h5 className="latest-quiz-name">{latestQuiz.quizTitle}</h5>
                  <p className="latest-quiz-summary">
                    {latestQuiz.correctAnswers || 4} of {latestQuiz.totalQuestions || 5} questions answered correctly.
                  </p>
                  <span className="quiz-strength-pill">Strong in React 19 & State</span>
                </div>
              </div>

              <Link to="/quizzes" className="take-quiz-action-btn">
                <span>Start New Placement Assessment</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Achievements & Badges Widget */}
            <div className="dashboard-widget-card">
              <div className="widget-header">
                <div className="title-with-icon">
                  <Trophy size={18} className="text-amber" />
                  <h4 className="widget-title">Earned Badges</h4>
                </div>
                <Link to="/achievements" className="widget-more-link">
                  View all
                </Link>
              </div>

              <div className="badges-compact-list">
                <div className="badge-compact-item unlocked">
                  <span className="badge-emoji">🔥</span>
                  <div className="badge-meta">
                    <h5 className="badge-name">7 Day Streak</h5>
                    <span className="badge-desc">7 consecutive days of active study</span>
                  </div>
                  <CheckCircle2 size={16} className="text-emerald" />
                </div>

                <div className="badge-compact-item unlocked">
                  <span className="badge-emoji">📚</span>
                  <div className="badge-meta">
                    <h5 className="badge-name">Learning Champion</h5>
                    <span className="badge-desc">Completed 10+ lessons</span>
                  </div>
                  <CheckCircle2 size={16} className="text-emerald" />
                </div>

                <div className="badge-compact-item in-progress">
                  <span className="badge-emoji">🎯</span>
                  <div className="badge-meta">
                    <h5 className="badge-name">Quiz Master</h5>
                    <span className="badge-desc">Score 100% on 3 assessments</span>
                  </div>
                  <span className="badge-status-pill">1/3</span>
                </div>
              </div>
            </div>

            {/* Placement Study Notes Callout */}
            <div className="ai-assistant-card-promo">
              <div className="ai-promo-icon-box">
                <FileText size={24} className="text-cyan" />
              </div>
              <h4 className="ai-promo-title">Placement Study Notes</h4>
              <p className="ai-promo-desc">
                Download revision cheat sheets, formula handbooks, and interview guides directly to your browser.
              </p>
              <Link to="/materials" className="ai-promo-btn">
                <span>Browse & Download Notes</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
