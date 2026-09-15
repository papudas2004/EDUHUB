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
import "./dashboard.css"; // Matches your physical file casing exactly

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
          setEnrolledCourses([
            {
              courseId: "course-1",
              title: "Full-Stack MERN Architecture & Cloud Deployment",
              category: "Development",
              difficulty: "Intermediate",
              instructor: "Siddharth Roy (Senior Tech Lead)",
              duration: "45 Hours",
              totalLessons: 4,
              completedLessons: [], // Fixed missing value here
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
              completedLessons: [], // Fixed missing value here
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
              <Link to={`/learn/${continueCourse.courseId}`} className="resume-now-btn">
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

        {/* Core KPI Statistics Cards */}
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
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
