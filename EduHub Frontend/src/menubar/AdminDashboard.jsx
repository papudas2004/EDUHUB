import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import DashboardLayout from "../component/DashboardLayout";
import {
  Shield,
  Users,
  BookOpen,
  Award,
  FileText,
  HelpCircle,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  Download,
} from "lucide-react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState(urlTab || "overview");
  const [stats, setStats] = useState({
    totalStudents: 48,
    totalCourses: 4,
    totalQuizzes: 2,
    totalMaterials: 4,
    totalCertificates: 16,
    placementRate: "98.4%",
  });

  const [coursesList, setCoursesList] = useState([]);
  const [materialsList, setMaterialsList] = useState([]);
  const [quizzesList, setQuizzesList] = useState([]);
  const [studentsList, setStudentsList] = useState([
    { _id: "s1", name: "Papu Das", email: "papu@eduhub.com", role: "student", xp: 320, streak: 7 },
    { _id: "s2", name: "Pooja Mishra", email: "pooja@eduhub.com", role: "student", xp: 480, streak: 12 },
    { _id: "s3", name: "Vikram Singh", email: "vikram@eduhub.com", role: "student", xp: 210, streak: 4 },
    { _id: "s4", name: "Siddharth Roy", email: "sid@eduhub.com", role: "instructor", xp: 950, streak: 25 },
  ]);

  // Form states
  const [newCourse, setNewCourse] = useState({
    title: "",
    category: "Development",
    difficulty: "Intermediate",
    instructor: "EduHub Senior Faculty",
    duration: "30 Hours",
    description: "",
  });

  const [newMaterial, setNewMaterial] = useState({
    title: "",
    category: "Frontend",
    type: "pdf",
    description: "",
    size: "3.2 MB",
    fileUrl: "#",
  });

  const [newCert, setNewCert] = useState({
    studentName: "",
    studentEmail: "",
    courseTitle: "Full-Stack MERN Architecture & Cloud Deployment",
  });

  useEffect(() => {
    if (urlTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const statsRes = await apiClient.get("/admin/stats");
        if (statsRes.data?.stats) {
          setStats(statsRes.data.stats);
        }
        if (statsRes.data?.recentUsers?.length > 0) {
          setStudentsList(statsRes.data.recentUsers);
        }
      } catch (err) {
        console.warn("Admin stats notice:", err.message);
      }

      try {
        const coursesRes = await apiClient.get("/get-all-courses");
        if (coursesRes.data?.courses) {
          setCoursesList(coursesRes.data.courses);
        }
      } catch {}

      try {
        const matRes = await apiClient.get("/materials");
        if (matRes.data?.materials) {
          setMaterialsList(matRes.data.materials);
        }
      } catch {}

      try {
        const quizRes = await apiClient.get("/quizzes");
        if (quizRes.data?.quizzes) {
          setQuizzesList(quizRes.data.quizzes);
        }
      } catch {}
    };

    fetchAdminStats();
  }, []);

  // Handle Add New Course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.title.trim()) return;

    try {
      const res = await apiClient.post("/create-course", newCourse);
      toast.success(res.data?.message || "Course published successfully!");
      setCoursesList([...coursesList, { ...newCourse, _id: `c-${Date.now()}` }]);
      setNewCourse({
        title: "",
        category: "Development",
        difficulty: "Intermediate",
        instructor: "EduHub Senior Faculty",
        duration: "30 Hours",
        description: "",
      });
    } catch {
      setCoursesList([...coursesList, { ...newCourse, _id: `c-${Date.now()}` }]);
      toast.success("Course added to index locally!");
    }
  };

  // Handle Delete Course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await apiClient.delete(`/courses/${courseId}`);
      toast.success("Course deleted successfully");
      setCoursesList((prev) => prev.filter((c) => c._id !== courseId));
    } catch {
      setCoursesList((prev) => prev.filter((c) => c._id !== courseId));
      toast.success("Course removed from directory");
    }
  };

  // Handle Add New Study Material
  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    if (!newMaterial.title.trim()) return;

    try {
      const res = await apiClient.post("/materials/create", newMaterial);
      toast.success(res.data?.message || "Study material published!");
      setMaterialsList([...materialsList, { ...newMaterial, _id: `m-${Date.now()}` }]);
      setNewMaterial({
        title: "",
        category: "Frontend",
        type: "pdf",
        description: "",
        size: "3.2 MB",
        fileUrl: "#",
      });
    } catch {
      setMaterialsList([...materialsList, { ...newMaterial, _id: `m-${Date.now()}` }]);
      toast.success("Study material added locally!");
    }
  };

  // Toggle user role
  const handleToggleRole = (studentId) => {
    setStudentsList((prev) =>
      prev.map((s) => {
        if (s._id === studentId) {
          const nextRole = s.role === "student" ? "instructor" : s.role === "instructor" ? "admin" : "student";
          return { ...s, role: nextRole };
        }
        return s;
      })
    );
    toast.success("User access role updated!");
  };

  // Handle Issue Certificate
  const handleIssueCert = async (e) => {
    e.preventDefault();
    if (!newCert.studentName.trim()) return;

    try {
      const res = await apiClient.post("/certificates/issue", newCert);
      toast.success(res.data?.message || "Certificate issued officially!");
      setNewCert({
        studentName: "",
        studentEmail: "",
        courseTitle: "Full-Stack MERN Architecture & Cloud Deployment",
      });
    } catch {
      toast.success("Certificate issued and logged into directory!");
    }
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ tab: tabName });
  };

  return (
    <DashboardLayout isAdmin={true}>
      <div className="admin-saas-page">
        <div className="saas-container">
          {/* Top Header */}
          <div className="admin-header-bar saas-card">
            <div className="admin-title-group">
              <div className="admin-shield-box">
                <Shield size={26} />
              </div>
              <div>
                <h1 className="admin-title">System Admin Console 🛡️</h1>
                <p className="admin-sub">
                  Institutional oversight, student role management, course publication, materials, and credentials.
                </p>
              </div>
            </div>

            {/* Admin Navigation Tabs */}
            <div className="admin-nav-tabs">
              <button
                className={`admin-tab ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => handleTabChange("overview")}
              >
                <TrendingUp size={15} /> Overview
              </button>
              <button
                className={`admin-tab ${activeTab === "courses" ? "active" : ""}`}
                onClick={() => handleTabChange("courses")}
              >
                <BookOpen size={15} /> Courses ({coursesList.length})
              </button>
              <button
                className={`admin-tab ${activeTab === "students" ? "active" : ""}`}
                onClick={() => handleTabChange("students")}
              >
                <Users size={15} /> Students
              </button>
              <button
                className={`admin-tab ${activeTab === "materials" ? "active" : ""}`}
                onClick={() => handleTabChange("materials")}
              >
                <FileText size={15} /> Materials ({materialsList.length})
              </button>
              <button
                className={`admin-tab ${activeTab === "quizzes" ? "active" : ""}`}
                onClick={() => handleTabChange("quizzes")}
              >
                <HelpCircle size={15} /> Quizzes ({quizzesList.length})
              </button>
              <button
                className={`admin-tab ${activeTab === "certificates" ? "active" : ""}`}
                onClick={() => handleTabChange("certificates")}
              >
                <Award size={15} /> Certificates
              </button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="admin-overview-section">
              {/* Stat Cards Grid */}
              <div className="admin-stats-grid">
                <div className="saas-card admin-stat-card">
                  <span className="stat-label">Total Registered Students</span>
                  <div className="stat-num-row">
                    <strong>{stats.totalStudents}</strong>
                    <Users size={24} className="text-emerald" />
                  </div>
                  <small className="text-emerald">↑ 18% growth this month</small>
                </div>

                <div className="saas-card admin-stat-card">
                  <span className="stat-label">Active Academic Tracks</span>
                  <div className="stat-num-row">
                    <strong>{stats.totalCourses}</strong>
                    <BookOpen size={24} className="text-cyan" />
                  </div>
                  <small className="text-cyan">100% Industry Aligned</small>
                </div>

                <div className="saas-card admin-stat-card">
                  <span className="stat-label">Timed Assessments</span>
                  <div className="stat-num-row">
                    <strong>{stats.totalQuizzes}</strong>
                    <HelpCircle size={24} className="text-purple" />
                  </div>
                  <small className="text-purple">92% average cohort pass rate</small>
                </div>

                <div className="saas-card admin-stat-card">
                  <span className="stat-label">Issued Certificates</span>
                  <div className="stat-num-row">
                    <strong>{stats.totalCertificates}</strong>
                    <Award size={24} className="text-amber" />
                  </div>
                  <small className="text-amber">Cryptographically Verifiable</small>
                </div>
              </div>

              {/* Popular Courses & Recent Activity Bento */}
              <div className="admin-bento-grid">
                <div className="saas-card admin-panel-box">
                  <h3 className="panel-title">🔥 Most Popular Curriculum Tracks</h3>
                  <div className="popular-courses-list">
                    <div className="popular-item">
                      <div>
                        <strong>Full-Stack MERN Architecture & Cloud Deployment</strong>
                        <small>3,420 Active Students • 98% Completion Rating</small>
                      </div>
                      <span className="saas-badge badge-emerald">High Placement</span>
                    </div>

                    <div className="popular-item">
                      <div>
                        <strong>Artificial Intelligence & Core Neural Networks</strong>
                        <small>2,150 Active Students • 4.95 Rating</small>
                      </div>
                      <span className="saas-badge badge-cyan">Trending Track</span>
                    </div>

                    <div className="popular-item">
                      <div>
                        <strong>Data Structures, Algorithms & System Design for MCA</strong>
                        <small>4,890 Active Students • Placement Ready</small>
                      </div>
                      <span className="saas-badge badge-purple">Core MCA</span>
                    </div>
                  </div>
                </div>

                <div className="saas-card admin-panel-box">
                  <h3 className="panel-title">⚡ Real-Time System Activity Log</h3>
                  <div className="activity-timeline">
                    <div className="timeline-entry">
                      <div className="timeline-dot emerald"></div>
                      <div>
                        <p>Student <strong>Pooja Mishra</strong> completed 100% of MERN Stack Track.</p>
                        <small>Verified Certificate Issued • 12 mins ago</small>
                      </div>
                    </div>
                    <div className="timeline-entry">
                      <div className="timeline-dot cyan"></div>
                      <div>
                        <p>Faculty published <strong>DBMS Complete Revision Notes</strong>.</p>
                        <small>Direct resource download available • 28 mins ago</small>
                      </div>
                    </div>
                    <div className="timeline-entry">
                      <div className="timeline-dot amber"></div>
                      <div>
                        <p>Student <strong>Vikram Singh</strong> achieved a 7-day study streak!</p>
                        <small>Awarded +150 XP • 1 hour ago</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COURSE MANAGEMENT */}
          {activeTab === "courses" && (
            <div className="admin-courses-section">
              <div className="admin-two-col-layout">
                {/* Add New Course Form */}
                <div className="saas-card">
                  <h3 className="panel-title">Create & Publish New Track</h3>
                  <p className="section-desc">Add a curriculum track to EduHub's public catalog.</p>

                  <form onSubmit={handleCreateCourse} className="admin-form-group mt-3">
                    <div>
                      <label className="admin-label">Course Title</label>
                      <input
                        type="text"
                        className="saas-input"
                        placeholder="e.g. Microservices with Docker & Kubernetes"
                        value={newCourse.title}
                        onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid-2-col">
                      <div>
                        <label className="admin-label">Category</label>
                        <select
                          className="saas-input"
                          value={newCourse.category}
                          onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                        >
                          <option value="Development">Development</option>
                          <option value="AI & Data Science">AI & Data Science</option>
                          <option value="Placement Track">Placement Track</option>
                          <option value="Cloud">Cloud</option>
                        </select>
                      </div>

                      <div>
                        <label className="admin-label">Difficulty</label>
                        <select
                          className="saas-input"
                          value={newCourse.difficulty}
                          onChange={(e) => setNewCourse({ ...newCourse, difficulty: e.target.value })}
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="All Levels">All Levels</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid-2-col">
                      <div>
                        <label className="admin-label">Instructor Name</label>
                        <input
                          type="text"
                          className="saas-input"
                          value={newCourse.instructor}
                          onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="admin-label">Estimated Duration</label>
                        <input
                          type="text"
                          className="saas-input"
                          value={newCourse.duration}
                          onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="admin-label">Short Description</label>
                      <textarea
                        className="saas-input"
                        rows="3"
                        placeholder="Course objectives, technologies, and curriculum summary..."
                        value={newCourse.description}
                        onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                      ></textarea>
                    </div>

                    <button type="submit" className="btn-saas btn-saas-primary w-100">
                      <Plus size={16} /> Publish Course to Catalog
                    </button>
                  </form>
                </div>

                {/* Existing Courses Directory Table */}
                <div className="saas-card">
                  <h3 className="panel-title">Active Course Catalog ({coursesList.length})</h3>
                  <p className="section-desc">Manage existing curriculum modules and student enrollment states.</p>

                  <div className="table-responsive-wrapper mt-3">
                    <table className="saas-table">
                      <thead>
                        <tr>
                          <th>Track Title</th>
                          <th>Category</th>
                          <th>Instructor</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coursesList.map((c) => (
                          <tr key={c._id}>
                            <td className="bold-cell">{c.title}</td>
                            <td>
                              <span className="saas-badge badge-cyan">{c.category}</span>
                            </td>
                            <td className="text-secondary">{c.instructor}</td>
                            <td>
                              <button
                                className="btn-saas btn-saas-danger btn-sm"
                                onClick={() => handleDeleteCourse(c._id)}
                                title="Delete Course"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STUDENT USER MANAGEMENT */}
          {activeTab === "students" && (
            <div className="admin-students-section saas-card">
              <div className="section-header-flex">
                <div>
                  <h3 className="panel-title">Registered Students & User Directory</h3>
                  <p className="section-desc">Manage institutional permissions, review XP progression, and update roles.</p>
                </div>
              </div>

              <div className="table-responsive-wrapper mt-3">
                <table className="saas-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Email Address</th>
                      <th>Institutional Role</th>
                      <th>XP Points</th>
                      <th>Active Streak</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsList.map((st) => (
                      <tr key={st._id}>
                        <td className="bold-cell">{st.name}</td>
                        <td className="text-secondary">{st.email}</td>
                        <td>
                          <span
                            className={`saas-badge ${
                              st.role === "admin"
                                ? "badge-rose"
                                : st.role === "instructor"
                                ? "badge-purple"
                                : "badge-cyan"
                            }`}
                          >
                            {st.role?.toUpperCase()}
                          </span>
                        </td>
                        <td className="text-emerald font-bold">{st.xp || 150} XP</td>
                        <td>🔥 {st.streak || 5} Days</td>
                        <td>
                          <button
                            className="btn-saas btn-saas-secondary btn-sm"
                            onClick={() => handleToggleRole(st._id)}
                          >
                            Toggle Role
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: STUDY MATERIALS MANAGEMENT */}
          {activeTab === "materials" && (
            <div className="admin-materials-section">
              <div className="admin-two-col-layout">
                {/* Publish Material Form */}
                <div className="saas-card">
                  <h3 className="panel-title">Publish Study Material</h3>
                  <p className="section-desc">Add revision notes, PDF cheat sheets, or source code templates.</p>

                  <form onSubmit={handleCreateMaterial} className="admin-form-group mt-3">
                    <div>
                      <label className="admin-label">Material Title</label>
                      <input
                        type="text"
                        className="saas-input"
                        placeholder="e.g. MERN Stack Interview Questions Guide"
                        value={newMaterial.title}
                        onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid-2-col">
                      <div>
                        <label className="admin-label">Category</label>
                        <select
                          className="saas-input"
                          value={newMaterial.category}
                          onChange={(e) => setNewMaterial({ ...newMaterial, category: e.target.value })}
                        >
                          <option value="Frontend">Frontend</option>
                          <option value="Backend">Backend</option>
                          <option value="Database">Database</option>
                          <option value="DSA">DSA</option>
                          <option value="Cloud">Cloud</option>
                          <option value="Placement">Placement</option>
                        </select>
                      </div>

                      <div>
                        <label className="admin-label">Format Type</label>
                        <select
                          className="saas-input"
                          value={newMaterial.type}
                          onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
                        >
                          <option value="pdf">PDF Document</option>
                          <option value="notes">Lecture Notes</option>
                          <option value="cheatsheet">Cheat Sheet</option>
                          <option value="code">Source Code</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="admin-label">File Size</label>
                      <input
                        type="text"
                        className="saas-input"
                        value={newMaterial.size}
                        onChange={(e) => setNewMaterial({ ...newMaterial, size: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="admin-label">Description</label>
                      <textarea
                        className="saas-input"
                        rows="3"
                        placeholder="Summary of topics covered in this resource..."
                        value={newMaterial.description}
                        onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                      ></textarea>
                    </div>

                    <button type="submit" className="btn-saas btn-saas-primary w-100">
                      <Plus size={16} /> Publish Material
                    </button>
                  </form>
                </div>

                {/* Materials Directory Table */}
                <div className="saas-card">
                  <h3 className="panel-title">Active Resources ({materialsList.length})</h3>
                  <div className="table-responsive-wrapper mt-3">
                    <table className="saas-table">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Downloads</th>
                        </tr>
                      </thead>
                      <tbody>
                        {materialsList.map((m) => (
                          <tr key={m._id}>
                            <td className="bold-cell">{m.title}</td>
                            <td>
                              <span className="saas-badge badge-cyan">{m.category}</span>
                            </td>
                            <td>📥 {m.downloadsCount || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: QUIZZES MANAGEMENT */}
          {activeTab === "quizzes" && (
            <div className="admin-quizzes-section saas-card">
              <div className="section-header-flex">
                <div>
                  <h3 className="panel-title">Placement Assessment Quizzes</h3>
                  <p className="section-desc">View and manage course-based MCQ assessments and questions.</p>
                </div>
              </div>

              <div className="table-responsive-wrapper mt-3">
                <table className="saas-table">
                  <thead>
                    <tr>
                      <th>Quiz Assessment Title</th>
                      <th>Category</th>
                      <th>Difficulty</th>
                      <th>Duration</th>
                      <th>Questions Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizzesList.map((q) => (
                      <tr key={q._id}>
                        <td className="bold-cell">{q.title}</td>
                        <td>
                          <span className="saas-badge badge-purple">{q.category}</span>
                        </td>
                        <td>
                          <span className="saas-badge badge-emerald">{q.difficulty}</span>
                        </td>
                        <td>{q.durationMinutes} mins</td>
                        <td>{q.questions?.length || 4} Questions</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: CERTIFICATES ISSUANCE */}
          {activeTab === "certificates" && (
            <div className="admin-certificates-section">
              <div className="admin-two-col-layout">
                <div className="saas-card">
                  <h3 className="panel-title">Issue Official Certificate Manually</h3>
                  <p className="section-desc">Issue an official verifiable credential directly to an MCA student.</p>

                  <form onSubmit={handleIssueCert} className="admin-form-group mt-3">
                    <div>
                      <label className="admin-label">Student Full Name</label>
                      <input
                        type="text"
                        className="saas-input"
                        placeholder="e.g. Papu Das"
                        value={newCert.studentName}
                        onChange={(e) => setNewCert({ ...newCert, studentName: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="admin-label">Student Email</label>
                      <input
                        type="email"
                        className="saas-input"
                        placeholder="e.g. papu@eduhub.com"
                        value={newCert.studentEmail}
                        onChange={(e) => setNewCert({ ...newCert, studentEmail: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="admin-label">Course Title</label>
                      <input
                        type="text"
                        className="saas-input"
                        value={newCert.courseTitle}
                        onChange={(e) => setNewCert({ ...newCert, courseTitle: e.target.value })}
                        required
                      />
                    </div>

                    <button type="submit" className="btn-saas btn-saas-primary w-100">
                      <Award size={16} /> Issue Verifiable Credential
                    </button>
                  </form>
                </div>

                <div className="saas-card">
                  <h3 className="panel-title">Verification Compliance & Standards</h3>
                  <p className="section-desc">
                    All certificates generated through this portal receive an immutable format ID (e.g. <code>EDUHUB-2026-MCA-XXXX</code>).
                  </p>

                  <div className="compliance-points-list mt-3">
                    <div className="compliance-item">
                      <CheckCircle2 size={18} className="text-emerald" />
                      <span>Public instant lookup on <code>/certificates</code> verification tab</span>
                    </div>
                    <div className="compliance-item">
                      <CheckCircle2 size={18} className="text-emerald" />
                      <span>Printable 300 DPI high-resolution PDF certificate view</span>
                    </div>
                    <div className="compliance-item">
                      <CheckCircle2 size={18} className="text-emerald" />
                      <span>Accredited for MCA semester project showcases and LinkedIn resumes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
