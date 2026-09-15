import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import { toast } from "react-hot-toast";
import DashboardLayout from "../component/DashboardLayout";
import {
  FileText,
  Search,
  Download,
  Bookmark,
  PlusCircle,
  Eye,
  X,
  BookOpen,
  Sparkles,
  Check,
  Tag,
  Share2,
  FileCode,
  Layers,
  ArrowDownToLine
} from "lucide-react";
import {
  DEFAULT_NOTES_CONTENT,
  triggerChromeDirectDownload
} from "../data/defaultNotes";
import "./studyMaterials.css";

function StudyMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookmarkedIds, setBookmarkedIds] = useState(
    JSON.parse(localStorage.getItem("bookmarked_materials") || "[]")
  );

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewNote, setPreviewNote] = useState(null);
  const [submittingNote, setSubmittingNote] = useState(false);

  // New Note Form
  const [newNote, setNewNote] = useState({
    title: "",
    category: "Frontend",
    type: "notes",
    description: "",
    tags: "",
    author: "",
    content: ""
  });

  const fallbackMaterials = [
    {
      _id: "mat-1",
      title: "Comprehensive MERN Stack Placement Guide & Interview Questions",
      category: "Frontend",
      type: "notes",
      description: "150+ high-frequency interview questions covering React 19 hooks, Node.js event loop, MongoDB, and system architecture.",
      size: "6.4 KB",
      downloadsCount: 1420,
      tags: ["React", "Node.js", "Interview", "MCA"],
      isFeatured: true,
      fileName: "MERN_Stack_Placement_Guide.md",
      fileUrl: "/notes/MERN_Stack_Placement_Guide.md",
      author: "Siddharth Roy (Senior Tech Lead)"
    },
    {
      _id: "mat-2",
      title: "Database Management Systems (DBMS) Complete Revision Notes",
      category: "Database",
      type: "notes",
      description: "Detailed notes on SQL vs NoSQL, Indexing, B-Trees, Normalization (1NF to BCNF), and ACID Transactions.",
      size: "6.0 KB",
      downloadsCount: 980,
      tags: ["DBMS", "SQL", "MongoDB", "Normalization"],
      isFeatured: true,
      fileName: "DBMS_Complete_Revision_Notes.md",
      fileUrl: "/notes/DBMS_Complete_Revision_Notes.md",
      author: "Prof. Arvind Sharma (DBMS Lead)"
    },
    {
      _id: "mat-3",
      title: "Data Structures & Algorithms Cheat Sheet (Python & Java)",
      category: "DSA",
      type: "cheatsheet",
      description: "Quick reference formulas, time/space complexities, graph patterns, and dynamic programming state transitions.",
      size: "4.6 KB",
      downloadsCount: 2850,
      tags: ["DSA", "LeetCode", "Algorithms", "Placement"],
      isFeatured: true,
      fileName: "DSA_Cheat_Sheet_Java_Python.md",
      fileUrl: "/notes/DSA_Cheat_Sheet_Java_Python.md",
      author: "Aman Verma (Ex-FAANG)"
    },
    {
      _id: "mat-4",
      title: "Docker, Kubernetes & AWS Cloud DevOps Cheat Sheet",
      category: "Cloud",
      type: "notes",
      description: "Essential Dockerfile syntax, Kubernetes pods/services, EC2 deployment scripts, and CI/CD pipelines.",
      size: "4.4 KB",
      downloadsCount: 760,
      tags: ["Docker", "AWS", "DevOps", "Cloud"],
      isFeatured: false,
      fileName: "DevOps_Cloud_Architecture_Guide.md",
      fileUrl: "/notes/DevOps_Cloud_Architecture_Guide.md",
      author: "Ananya Sen (DevOps Architect)"
    }
  ];

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await apiClient.get("/materials");
        const customLocal = JSON.parse(localStorage.getItem("eduhub_custom_notes") || "[]");
        
        let loaded = [];
        if (res.data && res.data.materials && res.data.materials.length > 0) {
          loaded = res.data.materials;
        } else {
          loaded = fallbackMaterials;
        }

        // Merge custom notes created locally if not already present
        const merged = [...customLocal, ...loaded.filter(m => !customLocal.some(c => c._id === m._id))];
        setMaterials(merged);
      } catch (err) {
        console.warn("Materials loading notice:", err.message);
        const customLocal = JSON.parse(localStorage.getItem("eduhub_custom_notes") || "[]");
        setMaterials([...customLocal, ...fallbackMaterials]);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const categories = ["All", "Frontend", "Backend", "Database", "DSA", "Cloud", "Operating Systems", "Placement"];

  const handleToggleBookmark = (id) => {
    let updated;
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter((item) => item !== id);
      toast.success("Bookmark removed");
    } else {
      updated = [...bookmarkedIds, id];
      toast.success("Saved to bookmarked library! 🔖");
    }
    setBookmarkedIds(updated);
    localStorage.setItem("bookmarked_materials", JSON.stringify(updated));
  };

  /**
   * Directly resolves note content and triggers Chrome browser download
   */
  const handleDownload = async (mat) => {
    let filename = mat.fileName;
    if (!filename) {
      if (mat.title.toLowerCase().includes("mern")) {
        filename = "MERN_Stack_Placement_Guide.md";
      } else if (mat.title.toLowerCase().includes("database") || mat.title.toLowerCase().includes("dbms")) {
        filename = "DBMS_Complete_Revision_Notes.md";
      } else if (mat.title.toLowerCase().includes("algorithm") || mat.title.toLowerCase().includes("dsa")) {
        filename = "DSA_Cheat_Sheet_Java_Python.md";
      } else if (mat.title.toLowerCase().includes("devops") || mat.title.toLowerCase().includes("docker")) {
        filename = "DevOps_Cloud_Architecture_Guide.md";
      } else {
        filename = `${mat.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.md`;
      }
    }

    let content = mat.content;
    if (!content || !content.trim()) {
      if (DEFAULT_NOTES_CONTENT[filename]) {
        content = DEFAULT_NOTES_CONTENT[filename];
      } else {
        try {
          const fetchRes = await fetch(`/notes/${filename}`);
          if (fetchRes.ok) {
            content = await fetchRes.text();
          }
        } catch (err) {
          console.warn("Static file fetch notice:", err);
        }
      }
    }

    if (!content || !content.trim()) {
      content = `# ${mat.title}
**Category:** ${mat.category || "General"}
**Author:** ${mat.author || "EduHub Academic Faculty"}
**Tags:** ${(mat.tags || []).join(", ")}

---

## Overview
${mat.description || "Comprehensive academic study notes prepared for MCA examinations and technical placement interviews."}

## Key Topics & Study Guide
- Core Theoretical Foundations
- Practical Architecture & Industry Patterns
- High-Frequency Placement Interview Questions

*Downloaded directly via EduHub Study Notes Library.*
`;
    }

    // 🚀 Instant direct Chrome file download
    triggerChromeDirectDownload(filename, content);

    // Sync download count with backend
    try {
      const res = await apiClient.post(`/materials/download/${mat._id}`);
      const updatedCount = res.data?.downloadsCount || (mat.downloadsCount || 0) + 1;
      setMaterials((prev) =>
        prev.map((m) =>
          m._id === mat._id ? { ...m, downloadsCount: updatedCount } : m
        )
      );
    } catch {
      setMaterials((prev) =>
        prev.map((m) =>
          m._id === mat._id ? { ...m, downloadsCount: (m.downloadsCount || 0) + 1 } : m
        )
      );
    }

    toast.success(`📥 Direct download started in Chrome: ${filename}`);
  };

  /**
   * Preview a note
   */
  const handleOpenPreview = async (mat) => {
    let filename = mat.fileName;
    if (!filename) {
      if (mat.title.toLowerCase().includes("mern")) filename = "MERN_Stack_Placement_Guide.md";
      else if (mat.title.toLowerCase().includes("dbms") || mat.title.toLowerCase().includes("database")) filename = "DBMS_Complete_Revision_Notes.md";
      else if (mat.title.toLowerCase().includes("dsa") || mat.title.toLowerCase().includes("algorithm")) filename = "DSA_Cheat_Sheet_Java_Python.md";
      else if (mat.title.toLowerCase().includes("devops") || mat.title.toLowerCase().includes("docker")) filename = "DevOps_Cloud_Architecture_Guide.md";
      else filename = `${mat.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.md`;
    }

    let noteContent = mat.content;
    if (!noteContent || !noteContent.trim()) {
      if (DEFAULT_NOTES_CONTENT[filename]) {
        noteContent = DEFAULT_NOTES_CONTENT[filename];
      } else {
        try {
          const fetchRes = await fetch(`/notes/${filename}`);
          if (fetchRes.ok) {
            noteContent = await fetchRes.text();
          }
        } catch {}
      }
    }

    if (!noteContent) {
      noteContent = `# ${mat.title}\n\n${mat.description}\n\n*Prepared by ${mat.author || "EduHub Faculty"}*`;
    }

    setPreviewNote({
      ...mat,
      fileName: filename,
      resolvedContent: noteContent
    });
  };

  /**
   * Handle adding a new custom note
   */
  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!newNote.title.trim()) {
      toast.error("Please enter a note title");
      return;
    }
    if (!newNote.content.trim()) {
      toast.error("Please provide note markdown/text content");
      return;
    }

    setSubmittingNote(true);
    const fileName = `${newNote.title.trim().replace(/[^a-zA-Z0-9_-]/g, "_")}.md`;
    const notePayload = {
      title: newNote.title.trim(),
      category: newNote.category,
      type: "notes",
      description: newNote.description.trim() || `Comprehensive notes on ${newNote.title.trim()}`,
      tags: newNote.tags
        ? newNote.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [newNote.category, "Notes"],
      author: newNote.author.trim() || "Student Contributor",
      content: newNote.content,
      fileName,
      size: `${Math.max(1.2, (newNote.content.length / 1024).toFixed(1))} KB`,
      downloadsCount: 0,
      isFeatured: false
    };

    try {
      const res = await apiClient.post("/materials/create", notePayload);
      const createdItem = res.data?.material || { ...notePayload, _id: `custom-${Date.now()}` };

      // Save to localStorage
      const existing = JSON.parse(localStorage.getItem("eduhub_custom_notes") || "[]");
      localStorage.setItem("eduhub_custom_notes", JSON.stringify([createdItem, ...existing]));

      setMaterials((prev) => [createdItem, ...prev]);
      toast.success(`🎉 Note "${newNote.title}" published! You can now download it directly.`);
      setShowAddModal(false);
      setNewNote({
        title: "",
        category: "Frontend",
        type: "notes",
        description: "",
        tags: "",
        author: "",
        content: ""
      });
    } catch (err) {
      // Local fallback in case of connection drop
      const localItem = { ...notePayload, _id: `local-${Date.now()}` };
      const existing = JSON.parse(localStorage.getItem("eduhub_custom_notes") || "[]");
      localStorage.setItem("eduhub_custom_notes", JSON.stringify([localItem, ...existing]));

      setMaterials((prev) => [localItem, ...prev]);
      toast.success(`🎉 Note "${newNote.title}" saved! Ready for direct download.`);
      setShowAddModal(false);
    } finally {
      setSubmittingNote(false);
    }
  };

  /**
   * Pre-fill note template
   */
  const handleInsertTemplate = () => {
    setNewNote((prev) => ({
      ...prev,
      content: `# ${prev.title || "Topic Name"} — Comprehensive Study Notes
**EduHub MCA Revision Series**
**Author:** ${prev.author || "Student Contributor"}

---

## 1. Core Architectural Concepts
- Concept Definition & Objectives
- Mathematical or Theoretical Foundation
- Key Differences & Trade-offs

## 2. Code Snippets & Implementation Examples
\`\`\`javascript
// Example implementation
function sampleWorkflow() {
  console.log("Efficient algorithm in action");
}
\`\`\`

## 3. High-Frequency Interview Questions
1. **Question 1**: Detailed explanation...
2. **Question 2**: Practical trade-offs...
`
    }));
    toast.success("Template inserted into content area! 📝");
  };

  const filteredMaterials = materials.filter((mat) => {
    const matchesSearch =
      mat.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" ||
      mat.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="materials-saas-page">
        <div className="saas-container">
          {/* Header */}
          <div className="materials-header">
            <div className="materials-header-top-row">
              <span className="saas-badge badge-cyan">Resource Library</span>
              <button
                className="btn-saas btn-saas-primary btn-add-notes"
                onClick={() => setShowAddModal(true)}
              >
                <PlusCircle size={17} /> Add Notes
              </button>
            </div>
            <h1 className="materials-title">Academic Study Materials & Notes</h1>
            <p className="materials-subtitle">
              Curated lecture notes, revision cheat sheets, and interview guides. Click <strong>Download</strong> on any note to download it directly in Chrome.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="materials-controls-card saas-card">
            <div className="controls-row-main">
              <div className="search-input-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by topic, keyword, or technology (e.g. React, Docker, Normalization)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                className="btn-saas btn-saas-secondary btn-quick-add"
                onClick={() => setShowAddModal(true)}
              >
                <PlusCircle size={16} /> Create Custom Note
              </button>
            </div>

            <div className="materials-category-chips">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`mat-chip ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Materials Grid */}
          <div className="materials-grid">
            {filteredMaterials.map((mat) => {
              const isBookmarked = bookmarkedIds.includes(mat._id);
              return (
                <div key={mat._id} className="saas-card material-card">
                  <div className="material-card-top">
                    <div className="type-icon-box">
                      <FileText size={20} className="text-emerald" />
                    </div>
                    <div className="card-top-actions">
                      <button
                        className="preview-btn"
                        onClick={() => handleOpenPreview(mat)}
                        title="Preview Notes"
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        className={`bookmark-btn ${isBookmarked ? "bookmarked" : ""}`}
                        onClick={() => handleToggleBookmark(mat._id)}
                        title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                      >
                        <Bookmark size={17} fill={isBookmarked ? "#10b981" : "none"} />
                      </button>
                    </div>
                  </div>

                  <span className="saas-badge badge-emerald mat-cat-badge">{mat.category}</span>
                  <h3 className="material-title">{mat.title}</h3>
                  <p className="material-desc">{mat.description}</p>

                  {/* Tags */}
                  <div className="material-tags-row">
                    {mat.tags?.map((tag, i) => (
                      <span key={i} className="mat-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Author / Source if available */}
                  {mat.author && (
                    <div className="material-author-row">
                      <span className="author-label">Author:</span> {mat.author}
                    </div>
                  )}

                  <div className="material-footer-row">
                    <div className="material-meta">
                      <span>💾 {mat.size || "3.5 KB"}</span>
                      <span>📥 {mat.downloadsCount || 0} Downloads</span>
                    </div>

                    <div className="material-btn-actions">
                      <button
                        className="btn-saas btn-saas-secondary btn-sm"
                        onClick={() => handleOpenPreview(mat)}
                        title="View note preview"
                      >
                        <Eye size={14} /> Preview
                      </button>
                      <button
                        className="btn-saas btn-saas-primary btn-sm btn-download-chrome"
                        onClick={() => handleDownload(mat)}
                        title="Download directly in Chrome"
                      >
                        <Download size={14} /> Download
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 📝 ADD NOTES MODAL */}
        {showAddModal && (
          <div className="notes-modal-backdrop" onClick={() => setShowAddModal(false)}>
            <div className="notes-modal saas-card" onClick={(e) => e.stopPropagation()}>
              <div className="notes-modal-header">
                <div className="modal-header-text">
                  <div className="modal-icon-badge">
                    <PlusCircle size={22} className="text-cyan" />
                  </div>
                  <div>
                    <h2 className="modal-title">Publish Academic Notes</h2>
                    <p className="modal-subtitle">Add curated study notes for direct student download in Chrome</p>
                  </div>
                </div>
                <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateNote} className="notes-modal-form">
                <div className="form-group">
                  <label className="form-label">Note Title *</label>
                  <input
                    type="text"
                    className="saas-input"
                    placeholder="e.g. Operating Systems: Process Scheduling & Deadlocks Notes"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="saas-input"
                      value={newNote.category}
                      onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Database">Database</option>
                      <option value="DSA">DSA</option>
                      <option value="Cloud">Cloud / DevOps</option>
                      <option value="Operating Systems">Operating Systems</option>
                      <option value="Placement">Placement Preparation</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Author / Contributor</label>
                    <input
                      type="text"
                      className="saas-input"
                      placeholder="e.g. Priya Das (MCA)"
                      value={newNote.author}
                      onChange={(e) => setNewNote({ ...newNote, author: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Short Description</label>
                  <input
                    type="text"
                    className="saas-input"
                    placeholder="Brief 1-line summary of what is covered in these notes..."
                    value={newNote.description}
                    onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="saas-input"
                    placeholder="e.g. OS, CPU Scheduling, Bankers Algorithm, Interview"
                    value={newNote.tags}
                    onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <div className="label-with-action">
                    <label className="form-label">Notes Content (Markdown format) *</label>
                    <button
                      type="button"
                      className="btn-template-insert"
                      onClick={handleInsertTemplate}
                    >
                      <Sparkles size={13} /> Insert MCA Template
                    </button>
                  </div>
                  <textarea
                    className="saas-textarea note-content-textarea"
                    rows={8}
                    placeholder="Type or paste your Markdown notes here (# Heading, ## Section, code blocks, lists)..."
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    required
                  />
                </div>

                <div className="notes-modal-footer">
                  <button
                    type="button"
                    className="btn-saas btn-saas-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-saas btn-saas-primary"
                    disabled={submittingNote}
                  >
                    {submittingNote ? "Publishing..." : "Publish & Save Notes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 👁️ PREVIEW NOTE MODAL */}
        {previewNote && (
          <div className="notes-modal-backdrop" onClick={() => setPreviewNote(null)}>
            <div className="notes-modal preview-modal saas-card" onClick={(e) => e.stopPropagation()}>
              <div className="notes-modal-header">
                <div>
                  <span className="saas-badge badge-emerald">{previewNote.category}</span>
                  <h2 className="modal-title" style={{ marginTop: "0.5rem" }}>{previewNote.title}</h2>
                  <p className="modal-subtitle">
                    {previewNote.author ? `Prepared by: ${previewNote.author}` : "EduHub Academic Faculty"} • {previewNote.size || "4 KB"}
                  </p>
                </div>
                <div className="modal-header-actions">
                  <button
                    className="btn-saas btn-saas-primary btn-sm"
                    onClick={() => {
                      handleDownload(previewNote);
                    }}
                  >
                    <ArrowDownToLine size={15} /> Direct Download
                  </button>
                  <button className="modal-close-btn" onClick={() => setPreviewNote(null)}>
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="note-preview-body">
                <pre className="note-markdown-render">
                  {previewNote.resolvedContent || previewNote.description}
                </pre>
              </div>

              <div className="notes-modal-footer">
                <span className="preview-note-tagline">
                  📥 Direct download saves formatted markdown notes directly into your Chrome downloads folder.
                </span>
                <button
                  type="button"
                  className="btn-saas btn-saas-primary"
                  onClick={() => {
                    handleDownload(previewNote);
                  }}
                >
                  <Download size={15} /> Download in Chrome
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default StudyMaterials;
