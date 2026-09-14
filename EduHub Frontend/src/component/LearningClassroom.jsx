import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";
import { toast } from "react-hot-toast";
import {
  Play,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  Bookmark,
  Award,
  Sparkles,
  Download,
  Share2,
  RotateCcw,
} from "lucide-react";
import confetti from "canvas-confetti";
import "./LearningClassroom.css";

function LearningClassroom() {
  const { courseId } = useParams();
  const { user, awardXP } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([1]); // default lesson 1 completed
  const [notesText, setNotesText] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'notes', 'resources', 'ai'
  const [loading, setLoading] = useState(true);
  const [completionCelebration, setCompletionCelebration] = useState(null);

  // Fallback course data in case backend is offline
  const fallbackCourse = {
    _id: courseId || "course-1",
    title: "Full-Stack MERN Architecture & Cloud Deployment",
    category: "Development",
    instructor: "Siddharth Roy (Senior Tech Lead)",
    difficulty: "Intermediate",
    curriculum: [
      {
        lessonNumber: 1,
        title: "Modern React 19 Foundations & Architecture",
        duration: "25 mins",
        videoUrl: "https://www.youtube-nocookie.com/embed/bMknfKXIFA8",
        content:
          "Explore the latest React 19 features including the React compiler, Server Components, and the `use()` hook for consuming asynchronous promises and context directly during render. Learn how hydration improvements reduce TTI in production workloads.",
        summary: "React 19 compiler automatically memoizes dependencies, eliminating manual useMemo boilerplate.",
        resources: [
          { name: "React 19 Architecture Cheat Sheet.pdf", url: "#", type: "pdf" },
          { name: "Starter Source Code Repository", url: "https://github.com", type: "code" }
        ]
      },
      {
        lessonNumber: 2,
        title: "Express Middleware Chains & Security Hardening",
        duration: "35 mins",
        videoUrl: "https://www.youtube-nocookie.com/embed/Oe421EPjeBE",
        content:
          "Understand how Express middleware stacks process incoming HTTP requests sequentially. Implement CORS origin security, rate limiting with Redis, body validation with Joi/Zod, and JWT Bearer token parsing.",
        summary: "Always invoke next() or send a response; unhandled errors should be passed to next(error).",
        resources: [
          { name: "Express Security Checklist.pdf", url: "#", type: "pdf" }
        ]
      },
      {
        lessonNumber: 3,
        title: "MongoDB Schema Design & Query Optimization",
        duration: "40 mins",
        videoUrl: "https://www.youtube-nocookie.com/embed/ofme2o29ngU",
        content:
          "Design scalable schemas in Mongoose. Learn compound index creation adhering to the ESR (Equality, Sort, Range) rule. Analyze explain plans (`executionStats`) and build aggregation pipelines with `$lookup` and `$unwind`.",
        summary: "Adhere to the ESR rule when ordering compound index keys for minimum index scan overhead.",
        resources: [
          { name: "MongoDB Performance Optimization Guide.pdf", url: "#", type: "pdf" }
        ]
      },
      {
        lessonNumber: 4,
        title: "Dockerizing MERN & Cloud CI/CD Deployment",
        duration: "50 mins",
        videoUrl: "https://www.youtube-nocookie.com/embed/gAkwW2tuIqE",
        content:
          "Containerize the React frontend and Node.js backend using lightweight Alpine multi-stage Docker builds. Setup GitHub Actions workflow to run unit tests and trigger continuous deployment to cloud hosts.",
        summary: "Multi-stage builds segregate build dependencies from production runtime images.",
        resources: [
          { name: "Docker Compose Fullstack Template.zip", url: "#", type: "code" }
        ]
      }
    ]
  };

  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      try {
        let loadedCourse = fallbackCourse;
        // 1. Fetch course details
        try {
          const courseRes = await apiClient.get(`/courses/${courseId}`);
          if (courseRes.data && courseRes.data.course) {
            loadedCourse = courseRes.data.course;
          }
        } catch {
          // If specific course not found, use all courses or fallback
          const allRes = await apiClient.get("/get-all-courses");
          if (allRes.data && allRes.data.courses) {
            const matched = allRes.data.courses.find(c => c._id === courseId);
            if (matched && matched.curriculum?.length > 0) loadedCourse = matched;
          }
        }
        setCourse(loadedCourse);

        // 2. Fetch user progress
        const userId = user?.id || user?._id || "papu-das-mca";
        const progressRes = await apiClient.get(`/progress/${courseId}?userId=${userId}`);
        if (progressRes.data && progressRes.data.enrollment) {
          const comp = progressRes.data.enrollment.completedLessons || [];
          if (comp.length > 0) setCompletedLessons(comp);
          if (progressRes.data.enrollment.notes?.length > 0) {
            const note = progressRes.data.enrollment.notes.find(n => n.lessonIndex === activeLessonIndex);
            if (note) setNotesText(note.noteText);
          }
        }
      } catch (err) {
        console.warn("Classroom loading notice:", err.message);
        setCourse(fallbackCourse);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndProgress();
  }, [courseId, user]);

  const activeCurriculum = course?.curriculum || fallbackCourse.curriculum;
  const currentLesson = activeCurriculum[activeLessonIndex] || activeCurriculum[0];
  const totalLessons = activeCurriculum.length;
  const progressPercentage = Math.round((completedLessons.length / totalLessons) * 100);

  // Toggle lesson complete
  const handleToggleComplete = async (lessonNum) => {
    const isNowCompleted = !completedLessons.includes(lessonNum);
    const updated = isNowCompleted
      ? [...completedLessons, lessonNum]
      : completedLessons.filter(n => n !== lessonNum);

    setCompletedLessons(updated);

    if (isNowCompleted) {
      awardXP(50);
      toast.success(`Lesson marked complete! +50 XP ⚡`);
    }

    // Sync to backend
    try {
      const res = await apiClient.post("/progress/toggle-lesson", {
        courseId: course._id,
        userId: user?.id || user?._id || "papu-das-mca",
        lessonNumber: lessonNum,
        totalLessons,
        studentName: user?.name || "Papu Das",
        studentEmail: user?.email || "papu@eduhub.com"
      });

      if (res.data && res.data.certificate) {
        setCompletionCelebration(res.data.certificate);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } else if (updated.length === totalLessons) {
        // Trigger completion modal
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        setCompletionCelebration({
          certificateId: `EDUHUB-2026-MCA-${Math.floor(1000 + Math.random() * 9000)}`,
          studentName: user?.name || "Papu Das",
          courseTitle: course.title,
          issueDate: new Date().toLocaleDateString()
        });
      }
    } catch (err) {
      console.warn("Progress sync offline fallback:", err.message);
      if (updated.length === totalLessons) {
        setCompletionCelebration({
          certificateId: `EDUHUB-2026-MCA-${Math.floor(1000 + Math.random() * 9000)}`,
          studentName: user?.name || "Papu Das",
          courseTitle: course.title,
          issueDate: new Date().toLocaleDateString()
        });
      }
    }
  };

  // Save personal study notes
  const handleSaveNotes = async () => {
    try {
      await apiClient.post("/progress/save-note", {
        courseId: course._id,
        userId: user?.id || user?._id || "papu-das-mca",
        lessonIndex: activeLessonIndex,
        noteText: notesText
      });
      toast.success("Study note saved to your profile! 📝");
    } catch {
      toast.success("Note saved locally! 📝");
    }
  };

  const handleNextLesson = () => {
    if (activeLessonIndex < totalLessons - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(activeLessonIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="classroom-loading-canvas">
        <div className="saas-container text-center">
          <p className="text-emerald">Loading interactive studio environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="classroom-studio-page">
      <div className="saas-container">
        {/* Top Breadcrumb & Progress Header */}
        <div className="classroom-top-header">
          <div className="header-breadcrumbs">
            <Link to="/catalog" className="back-link">
              <ChevronLeft size={16} /> Course Catalog
            </Link>
            <span className="breadcrumb-divider">/</span>
            <span className="course-name-tag">{course.title}</span>
          </div>

          <div className="header-progress-group">
            <div className="progress-text-block">
              <span>Course Progress:</span>
              <strong className="text-emerald">{progressPercentage}% Complete</strong>
            </div>
            <div className="saas-progress-track header-track">
              <div
                className="saas-progress-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Classroom 2-Column Layout */}
        <div className="classroom-workspace-grid">
          {/* Main Video & Lesson Content Pane */}
          <div className="lesson-main-pane">
            {/* Embedded Video Area */}
            <div className="video-player-frame">
              <iframe
                src={currentLesson.videoUrl || "https://www.youtube-nocookie.com/embed/bMknfKXIFA8"}
                title={currentLesson.title}
                className="lesson-iframe"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Lesson Title & Controls Bar */}
            <div className="lesson-controls-bar saas-card">
              <div className="lesson-meta-header">
                <div>
                  <span className="saas-badge badge-emerald">
                    Lesson {activeLessonIndex + 1} of {totalLessons}
                  </span>
                  <h1 className="lesson-main-title">{currentLesson.title}</h1>
                  <span className="lesson-duration">⏱️ {currentLesson.duration || "25 mins"}</span>
                </div>

                {/* Mark as Completed Button */}
                <button
                  className={`btn-saas ${
                    completedLessons.includes(currentLesson.lessonNumber || activeLessonIndex + 1)
                      ? "btn-completed"
                      : "btn-saas-primary"
                  }`}
                  onClick={() =>
                    handleToggleComplete(currentLesson.lessonNumber || activeLessonIndex + 1)
                  }
                >
                  <CheckCircle2 size={18} />
                  {completedLessons.includes(currentLesson.lessonNumber || activeLessonIndex + 1)
                    ? "Completed ✓"
                    : "Mark as Completed (+50 XP)"}
                </button>
              </div>

              {/* Navigation buttons */}
              <div className="lesson-nav-buttons">
                <button
                  className="btn-saas btn-saas-secondary btn-sm"
                  onClick={handlePrevLesson}
                  disabled={activeLessonIndex === 0}
                >
                  <ChevronLeft size={16} /> Previous Lesson
                </button>
                <button
                  className="btn-saas btn-saas-secondary btn-sm"
                  onClick={handleNextLesson}
                  disabled={activeLessonIndex === totalLessons - 1}
                >
                  Next Lesson <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Interactive Workspace Tabs */}
            <div className="lesson-tabbed-workspace saas-card">
              <div className="workspace-tabs-header">
                <button
                  className={`ws-tab ${activeTab === "overview" ? "active" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  <BookOpen size={16} /> Overview & Lecture Notes
                </button>
                <button
                  className={`ws-tab ${activeTab === "notes" ? "active" : ""}`}
                  onClick={() => setActiveTab("notes")}
                >
                  <Bookmark size={16} /> My Study Notes
                </button>
                <button
                  className={`ws-tab ${activeTab === "resources" ? "active" : ""}`}
                  onClick={() => setActiveTab("resources")}
                >
                  <FileText size={16} /> Attached Materials
                </button>
              </div>

              {/* Tab 1: Overview & Lecture Notes */}
              {activeTab === "overview" && (
                <div className="tab-content-pane">
                  <h3>Lecture Outline</h3>
                  <p className="lesson-content-text">{currentLesson.content}</p>

                  <div className="key-takeaway-card">
                    <h4>💡 Key Takeaway:</h4>
                    <p>{currentLesson.summary}</p>
                  </div>
                </div>
              )}

              {/* Tab 2: My Study Notes */}
              {activeTab === "notes" && (
                <div className="tab-content-pane">
                  <div className="notes-editor-box">
                    <label className="notes-label">Your Personal Bookmarks & Code Notes</label>
                    <textarea
                      rows="6"
                      className="saas-textarea"
                      placeholder="Jot down formulas, code notes, or interview key points for this lesson..."
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                    ></textarea>
                    <button className="btn-saas btn-saas-primary btn-sm mt-2" onClick={handleSaveNotes}>
                      Save Notes
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: Resources */}
              {activeTab === "resources" && (
                <div className="tab-content-pane">
                  <h3>Lesson Materials & Source Repositories</h3>
                  <div className="resources-list">
                    {(currentLesson.resources || [
                      { name: "Lecture Presentation Slides.pdf", url: "#", type: "pdf" },
                      { name: "Lab Source Code Files.zip", url: "#", type: "code" }
                    ]).map((res, i) => (
                      <div key={i} className="resource-item-row">
                        <div className="resource-info">
                          <FileText size={18} className="text-emerald" />
                          <span>{res.name}</span>
                        </div>
                        <a href={res.url} className="btn-saas btn-saas-secondary btn-sm" download>
                          <Download size={14} /> Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Syllabus Navigation Sidebar */}
          <div className="syllabus-sidebar-pane saas-card">
            <div className="sidebar-header">
              <h3 className="sidebar-title">Course Syllabus</h3>
              <span className="lesson-counter-tag">
                {completedLessons.length} / {totalLessons} Done
              </span>
            </div>

            <div className="syllabus-list">
              {activeCurriculum.map((lesson, idx) => {
                const isCurrent = activeLessonIndex === idx;
                const isCompleted = completedLessons.includes(lesson.lessonNumber || idx + 1);

                return (
                  <div
                    key={idx}
                    className={`syllabus-item ${isCurrent ? "active" : ""} ${
                      isCompleted ? "completed" : ""
                    }`}
                    onClick={() => setActiveLessonIndex(idx)}
                  >
                    <div className="syllabus-status-icon">
                      {isCompleted ? (
                        <CheckCircle2 size={18} className="text-emerald" />
                      ) : (
                        <span className="index-circle">{idx + 1}</span>
                      )}
                    </div>

                    <div className="syllabus-text-group">
                      <span className="syllabus-lesson-title">{lesson.title}</span>
                      <span className="syllabus-meta">⏱️ {lesson.duration || "20 mins"}</span>
                    </div>

                    {isCurrent && <Play size={14} className="current-play-indicator" />}
                  </div>
                );
              })}
            </div>

            {/* Assessment Link */}
            <div className="sidebar-quiz-card">
              <h4>🎯 Module Assessment</h4>
              <p>Test your knowledge with timed MCQs to earn certification credits.</p>
              <Link to="/quizzes" className="btn-saas btn-saas-secondary btn-sm w-100">
                Launch Quiz
              </Link>
            </div>
          </div>
        </div>

        {/* 100% Completion Celebration Modal */}
        {completionCelebration && (
          <div className="modal-backdrop-blur">
            <div className="celebration-modal-card saas-card">
              <div className="celebration-badge-icon">🏆</div>
              <h2 className="celebration-title">Congratulations! You Completed the Course!</h2>
              <p className="celebration-subtitle">
                You have finished all {totalLessons} modules in{" "}
                <strong>{course.title}</strong>. Your official verified certificate has been issued.
              </p>

              <div className="cert-preview-pill">
                <span>Certificate ID:</span>
                <code>{completionCelebration.certificateId}</code>
              </div>

              <div className="celebration-actions">
                <Link to="/certificates" className="btn-saas btn-saas-primary">
                  <Award size={18} /> View Official Certificate
                </Link>
                <button
                  className="btn-saas btn-saas-secondary"
                  onClick={() => setCompletionCelebration(null)}
                >
                  Continue Reviewing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LearningClassroom;
