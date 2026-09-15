import React from "react";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../component/DashboardLayout";
import {
  Award,
  Flame,
  Zap,
  Star,
  CheckCircle2,
  Lock,
  Trophy,
  Shield,
  Target,
  Sparkles,
  BookOpen,
} from "lucide-react";
import "./achievements.css";

function Achievements() {
  const { user } = useAuth();

  const userXP = user?.xp || 320;
  const userStreak = user?.streak || 7;
  const currentLevel = Math.floor(userXP / 200) + 1;
  const nextLevelXP = currentLevel * 200;
  const levelProgress = Math.round(((userXP % 200) / 200) * 100);

  const allBadges = [
    {
      id: "b1",
      title: "First Course Completed",
      description: "Completed 100% of a technology track curriculum",
      icon: "🏆",
      unlocked: true,
      category: "Milestone",
      date: "Unlocked Sep 2026",
    },
    {
      id: "b2",
      title: "7 Day Study Streak",
      description: "Maintained consecutive learning activity for a full week",
      icon: "🔥",
      unlocked: true,
      category: "Consistency",
      date: "Unlocked Yesterday",
    },
    {
      id: "b3",
      title: "Quiz Master",
      description: "Achieved a 90%+ score on a timed technical assessment",
      icon: "🎯",
      unlocked: true,
      category: "Assessment",
      date: "Unlocked 2 days ago",
    },
    {
      id: "b4",
      title: "Learning Champion",
      description: "Completed 10 or more video lessons and exercises",
      icon: "📚",
      unlocked: true,
      category: "Progress",
      date: "Unlocked Sep 2026",
    },
    {
      id: "b5",
      title: "Notes Scholar",
      description: "Downloaded and revised 4+ technical placement study notes",
      icon: "📑",
      unlocked: true,
      category: "Research",
      date: "Unlocked Sep 2026",
    },
    {
      id: "b6",
      title: "Placement Ready",
      description: "Achieved overall course progress > 80% across MERN & DSA",
      icon: "🚀",
      unlocked: false,
      category: "Career",
      requirement: "Reach 80% overall progress (Current: 68%)",
    },
    {
      id: "b7",
      title: "System Architect",
      description: "Score 100% on Cloud & System Design assessment",
      icon: "🏛️",
      unlocked: false,
      category: "Excellence",
      requirement: "Score 100% on Cloud Assessment",
    },
    {
      id: "b8",
      title: "30 Day Streak Legend",
      description: "Study consecutively for 30 uninterrupted days",
      icon: "⚡",
      unlocked: false,
      category: "Dedication",
      requirement: "Reach 30-day streak (Current: 7 days)",
    },
  ];

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <DashboardLayout>
      <div className="achievements-saas-page">
        <div className="saas-container">
          {/* Header */}
        <div className="achievements-header">
          <span className="saas-badge badge-amber">Gamified Milestones</span>
          <h1 className="achievements-title">Student Achievements & Badges</h1>
          <p className="achievements-subtitle">
            Earn experience points (XP), build your daily streak, and unlock placement-ready credentials as you master course lessons.
          </p>
        </div>

        {/* Level Progression & Streak Hero Banner */}
        <div className="gamify-hero-grid">
          {/* Level Progress Card */}
          <div className="saas-card level-card">
            <div className="level-card-top">
              <div className="level-badge-circle">
                <span>Lv {currentLevel}</span>
              </div>
              <div className="level-info-col">
                <span className="saas-badge badge-emerald">
                  {currentLevel === 1 ? "Junior Developer" : currentLevel === 2 ? "Full-Stack Apprentice" : "Senior Tech Specialist"}
                </span>
                <h2>Level {currentLevel} Master</h2>
                <p>{userXP} Total XP Earned</p>
              </div>
            </div>

            <div className="level-progress-wrapper">
              <div className="progress-labels">
                <span>Next Rank: Level {currentLevel + 1}</span>
                <span className="text-emerald">{userXP} / {nextLevelXP} XP</span>
              </div>
              <div className="saas-progress-track">
                <div
                  className="saas-progress-fill"
                  style={{ width: `${levelProgress}%` }}
                ></div>
              </div>
              <small className="xp-remaining-text">
                {nextLevelXP - userXP} XP needed to reach next tier
              </small>
            </div>
          </div>

          {/* Daily Streak Card */}
          <div className="saas-card streak-card">
            <div className="streak-top">
              <div className="streak-icon-huge">🔥</div>
              <div>
                <h2>{userStreak} Days Streak</h2>
                <p>You're on fire! Keep studying today to maintain your record.</p>
              </div>
            </div>

            <div className="streak-calendar-strip">
              {daysOfWeek.map((day, idx) => (
                <div key={idx} className={`streak-day-box ${idx < userStreak ? "active" : ""}`}>
                  <span className="day-name">{day}</span>
                  <div className="day-dot">
                    {idx < userStreak ? "✓" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Badges Showcase Grid */}
        <div className="badges-section">
          <div className="badges-section-header">
            <h2>🏆 Unlocked Badges ({allBadges.filter((b) => b.unlocked).length} / {allBadges.length})</h2>
            <p>Showcase these milestones on your placement profile and resume.</p>
          </div>

          <div className="badges-grid">
            {allBadges.map((badge) => (
              <div
                key={badge.id}
                className={`saas-card badge-card ${badge.unlocked ? "unlocked" : "locked"}`}
              >
                <div className="badge-card-top">
                  <div className="badge-emoji-box">{badge.icon}</div>
                  <span
                    className={`saas-badge ${
                      badge.unlocked ? "badge-emerald" : "badge-secondary"
                    }`}
                  >
                    {badge.category}
                  </span>
                </div>

                <h3 className="badge-title">{badge.title}</h3>
                <p className="badge-desc">{badge.description}</p>

                <div className="badge-footer">
                  {badge.unlocked ? (
                    <span className="unlocked-text">
                      <CheckCircle2 size={14} className="text-emerald" /> {badge.date}
                    </span>
                  ) : (
                    <span className="locked-text">
                      <Lock size={14} /> {badge.requirement}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}

export default Achievements;
