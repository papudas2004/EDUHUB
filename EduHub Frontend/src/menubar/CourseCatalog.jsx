import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import {
  BookOpen,
  Search,
  Filter,
  Clock,
  Star,
  Play,
  CheckCircle2,
  Sparkles,
  Users,
  ChevronRight,
  X,
  Award,
} from "lucide-react";
import "./courseCatalog.css";

function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [activeCourseModal, setActiveCourseModal] = useState(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await apiClient.get("/get-all-courses");
        if (res.data && res.data.courses && res.data.courses.length > 0) {
          setCourses(res.data.courses);
        } else {
          // Fallback courses
          setCourses([
            {
              _id: "course-1",
              title: "Full-Stack MERN Architecture & Cloud Deployment",
              category: "Development",
              difficulty: "Intermediate",
              instructor: "Siddharth Roy (Senior Tech Lead)",
              duration: "45 Hours",
              rating: 4.9,
              studentsCount: 3420,
              description: "Master React 19, Node.js, Express, MongoDB Atlas, Docker containers, and AWS CI/CD pipelines.",
              whatYouWillLearn: [
                "Architect production-grade MERN web applications with modular MVC structure",
                "Implement JWT Authentication, secure cookie storage, and RBAC",
                "Optimize MongoDB indexing, aggregation pipelines, and schema designs",
                "Deploy applications to AWS EC2, S3, and automated GitHub Actions"
              ],
              curriculum: [
                { lessonNumber: 1, title: "Modern React 19 Foundations & Architecture", duration: "25 mins" },
                { lessonNumber: 2, title: "Express Middleware Chains & Security Hardening", duration: "35 mins" },
                { lessonNumber: 3, title: "MongoDB Schema Design & Query Optimization", duration: "40 mins" },
                { lessonNumber: 4, title: "Dockerizing MERN & Cloud CI/CD Pipelines", duration: "50 mins" }
              ]
            },
            {
              _id: "course-2",
              title: "Artificial Intelligence & Core Neural Networks",
              category: "AI & Data Science",
              difficulty: "Advanced",
              instructor: "Dr. Ananya Sen (AI Researcher)",
              duration: "38 Hours",
              rating: 4.95,
              studentsCount: 2150,
              description: "Hands-on PyTorch, LLM fine-tuning, RAG pipelines, prompt engineering, and production AI agents.",
              whatYouWillLearn: [
                "Understand mathematical foundations of Gradient Descent and Backprop",
                "Build and train Convolutional & Recurrent Neural Networks in PyTorch",
                "Implement Retrieval-Augmented Generation (RAG) with Vector Databases",
                "Integrate LLMs securely into production web applications"
              ],
              curriculum: [
                { lessonNumber: 1, title: "Neural Network Architecture & Backprop", duration: "30 mins" },
                { lessonNumber: 2, title: "Transformers & Attention Mechanism", duration: "45 mins" },
                { lessonNumber: 3, title: "Building RAG with Vector Embeddings", duration: "40 mins" }
              ]
            },
            {
              _id: "course-3",
              title: "Data Structures, Algorithms & System Design for MCA",
              category: "Placement Track",
              difficulty: "All Levels",
              instructor: "Vikram Malhotra (Ex-FAANG)",
              duration: "60 Hours",
              rating: 4.88,
              studentsCount: 4890,
              description: "Ace campus placements with 250+ curated LeetCode problems, high-level and low-level system designs.",
              whatYouWillLearn: [
                "Master complex graph algorithms, dynamic programming, and heaps",
                "Design scalable systems handling 100k+ concurrent requests",
                "Crush coding rounds of Microsoft, Amazon, Google, and top startups",
                "Learn behavioral interview techniques and resume optimization"
              ],
              curriculum: [
                { lessonNumber: 1, title: "Two Pointers & Sliding Window Mastery", duration: "35 mins" },
                { lessonNumber: 2, title: "Binary Trees, BSTs & Trie Architectures", duration: "45 mins" },
                { lessonNumber: 3, title: "High-Level System Design: Designing EduHub", duration: "55 mins" }
              ]
            }
          ]);
        }
      } catch (error) {
        console.warn("Catalog loading notice:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  const categories = ["All", "Development", "AI & Data Science", "Placement Track", "Cloud"];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      course.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesDifficulty =
      selectedDifficulty === "All" ||
      course.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="catalog-saas-page">
      <div className="saas-container">
        {/* Header Title Section */}
        <div className="catalog-header">
          <span className="saas-badge badge-emerald">Curated Curriculum</span>
          <h1 className="catalog-title">Explore Academic Tracks & Courses</h1>
          <p className="catalog-subtitle">
            Master full-stack engineering, artificial intelligence, and campus placement prep with interactive labs and video masterclasses.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="catalog-controls-card saas-card">
          <div className="search-input-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search courses by topic, skill, or instructor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className="filter-chips-row">
            <div className="category-chips">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-chip ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="difficulty-select-box">
              <select
                className="difficulty-select"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="catalog-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="saas-card skeleton-card">
                <div className="skeleton" style={{ height: "24px", width: "30%", marginBottom: "1rem" }}></div>
                <div className="skeleton" style={{ height: "28px", width: "85%", marginBottom: "1rem" }}></div>
                <div className="skeleton" style={{ height: "60px", width: "100%", marginBottom: "1.5rem" }}></div>
                <div className="skeleton" style={{ height: "40px", width: "100%" }}></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No matching courses found</h3>
            <p className="empty-state-desc">
              Try adjusting your search keywords or switching category filters to discover other available tracks.
            </p>
            <button
              className="btn-saas btn-saas-secondary"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedDifficulty("All");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && filteredCourses.length > 0 && (
          <div className="catalog-grid">
            {filteredCourses.map((course) => (
              <div key={course._id} className="saas-card course-catalog-card">
                <div className="catalog-card-header">
                  <span className="saas-badge badge-emerald">{course.category}</span>
                  <div className="course-rating">
                    <Star size={14} fill="#f59e0b" className="text-amber" />
                    <span>{course.rating || 4.9}</span>
                  </div>
                </div>

                <h3 className="course-card-title">{course.title}</h3>
                <p className="course-card-description">{course.description}</p>

                <div className="course-meta-tags">
                  <span>⏱️ {course.duration || "35 Hours"}</span>
                  <span>📖 {course.curriculum?.length || 4} Lessons</span>
                  <span>⚡ {course.difficulty || "Intermediate"}</span>
                </div>

                {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                  <div className="curriculum-preview-points">
                    <span className="points-heading">What you'll master:</span>
                    <ul>
                      {course.whatYouWillLearn.slice(0, 2).map((pt, i) => (
                        <li key={i}>
                          <CheckCircle2 size={13} className="text-emerald shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="catalog-card-footer">
                  <Link
                    to={`/courses/${course._id}`}
                    className="btn-saas btn-saas-secondary btn-sm"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/learn/${course._id}`}
                    className="btn-saas btn-saas-primary btn-sm"
                  >
                    <Play size={14} /> Start Learning
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Course Syllabus Modal */}
        {activeCourseModal && (
          <div className="modal-backdrop-blur" onClick={() => setActiveCourseModal(null)}>
            <div className="course-modal-card saas-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="saas-badge badge-cyan">{activeCourseModal.category}</span>
                  <h2 className="modal-title">{activeCourseModal.title}</h2>
                  <p className="modal-instructor">Taught by {activeCourseModal.instructor}</p>
                </div>
                <button className="modal-close-btn" onClick={() => setActiveCourseModal(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div className="modal-section">
                  <h4>Course Overview</h4>
                  <p>{activeCourseModal.description}</p>
                </div>

                {activeCourseModal.whatYouWillLearn && (
                  <div className="modal-section">
                    <h4>Key Learning Outcomes</h4>
                    <div className="outcomes-grid">
                      {activeCourseModal.whatYouWillLearn.map((outcome, idx) => (
                        <div key={idx} className="outcome-item">
                          <CheckCircle2 size={16} className="text-emerald" />
                          <span>{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="modal-section">
                  <h4>Curriculum Breakdown ({activeCourseModal.curriculum?.length || 4} Modules)</h4>
                  <div className="curriculum-list-modal">
                    {(activeCourseModal.curriculum || [
                      { lessonNumber: 1, title: "Foundations & Environment Setup", duration: "25 mins" },
                      { lessonNumber: 2, title: "Core Architecture & Data Flow", duration: "35 mins" },
                      { lessonNumber: 3, title: "Advanced Patterns & Optimization", duration: "40 mins" },
                      { lessonNumber: 4, title: "Production Deployment & Certification", duration: "45 mins" }
                    ]).map((lesson, idx) => (
                      <div key={idx} className="curriculum-lesson-row">
                        <span className="lesson-num">{idx + 1}</span>
                        <div className="lesson-info">
                          <strong>{lesson.title}</strong>
                          <small>⏱️ {lesson.duration}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn-saas btn-saas-secondary"
                  onClick={() => setActiveCourseModal(null)}
                >
                  Close
                </button>
                <Link
                  to={`/learn/${activeCourseModal._id}`}
                  className="btn-saas btn-saas-primary"
                  onClick={() => setActiveCourseModal(null)}
                >
                  <Play size={16} /> Start This Course Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseCatalog;
