import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Sparkles,
  HelpCircle,
  FileText,
  Award,
  Trophy,
  User,
  Users,
  Layers,
  LogOut,
  Flame,
  Zap,
  ShieldCheck,
  ChevronRight,
  BookmarkCheck,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = ({ isAdminView = false, mobileOpen = false, onCloseMobile = () => {} }) => {
  const { user, logout, switchSimulatorRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const studentLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/catalog", label: "All Courses", icon: BookOpen },
    { to: "/my-learning", label: "My Learning", icon: GraduationCap },
    { to: "/materials", label: "Study Materials & Notes", icon: FileText, badge: "Notes" },
    { to: "/quizzes", label: "Quizzes & Tests", icon: HelpCircle },
    { to: "/certificates", label: "Certificates", icon: Award },
    { to: "/achievements", label: "Achievements", icon: Trophy },
    { to: "/profile", label: "Profile", icon: User },
  ];

  const adminLinks = [
    { to: "/admin", label: "Admin Dashboard", icon: LayoutDashboard },
    { to: "/admin?tab=students", label: "Students", icon: Users },
    { to: "/admin?tab=courses", label: "Courses", icon: BookOpen },
    { to: "/admin?tab=materials", label: "Study Materials", icon: FileText },
    { to: "/admin?tab=quizzes", label: "Quizzes", icon: HelpCircle },
    { to: "/admin?tab=certificates", label: "Certificates", icon: Award },
    { to: "/profile", label: "Profile", icon: User },
  ];

  const currentLinks = isAdminView ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && <div className="sidebar-backdrop" onClick={onCloseMobile} />}

      <aside className={`saas-sidebar ${mobileOpen ? "open" : ""}`}>
        {/* User Mini Profile Card */}
        <div className="sidebar-user-card">
          <div className="sidebar-user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="sidebar-user-meta">
            <h4 className="sidebar-user-name">{user?.name || "Student Member"}</h4>
            <span className="sidebar-user-role">
              {user?.role === "admin" ? "Admin / Faculty" : "MCA Scholar"}
            </span>
          </div>
        </div>

        {/* Gamification Stats Strip */}
        <div className="sidebar-gamify-strip">
          <div className="gamify-stat-pill streak-pill" title="Learning Streak">
            <Flame size={14} className="text-orange" />
            <span>{user?.streak || 5}d Streak</span>
          </div>
          <div className="gamify-stat-pill xp-pill" title="Experience Points">
            <Zap size={14} className="text-amber" />
            <span>{user?.xp || 240} XP</span>
          </div>
        </div>

        {/* Section Label */}
        <div className="sidebar-nav-section-title">
          {isAdminView ? "ADMIN CONSOLE" : "STUDENT NAVIGATION"}
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav-list">
          {currentLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? "active" : ""}`
                }
                end={item.to === "/dashboard" || item.to === "/admin"}
              >
                <Icon size={18} className="sidebar-nav-icon" />
                <span className="sidebar-nav-label">{item.label}</span>
                {item.badge && <span className="sidebar-nav-badge">{item.badge}</span>}
                <ChevronRight size={14} className="sidebar-nav-arrow" />
              </NavLink>
            );
          })}
        </nav>

        {/* Interview Demo Role Switcher */}
        <div className="sidebar-role-toggle-card">
          <div className="role-toggle-header">
            <ShieldCheck size={14} className="text-indigo" />
            <span>Role Switcher (Demo)</span>
          </div>
          <div className="role-toggle-buttons">
            <button
              type="button"
              className={`role-toggle-btn ${user?.role !== "admin" ? "active" : ""}`}
              onClick={() => {
                switchSimulatorRole("student");
                navigate("/dashboard");
              }}
            >
              Student
            </button>
            <button
              type="button"
              className={`role-toggle-btn ${user?.role === "admin" ? "active" : ""}`}
              onClick={() => {
                switchSimulatorRole("admin");
                navigate("/admin");
              }}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Logout Footer */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-logout-btn">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
