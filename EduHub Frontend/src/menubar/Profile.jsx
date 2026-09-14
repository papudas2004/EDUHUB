import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  Flame,
  Zap,
  Shield,
  Save,
  GraduationCap,
} from "lucide-react";
import "./Profile.css";

function Profile() {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "Papu Das",
    email: user?.email || "papu@eduhub.com",
    phoneno: user?.phoneno || "+91 98765 43210",
    city: user?.city || "Bhubaneswar, Odisha",
    address: user?.address || "MCA Tech Hub, Department of Computer Science",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await apiClient.put("/profile", formData);
      if (res.data && res.data.user) {
        setUser({ ...user, ...res.data.user });
      } else {
        setUser({ ...user, ...formData });
      }
      localStorage.setItem("saved_user_profile", JSON.stringify({ ...user, ...formData }));
      toast.success("Profile updated successfully!");
    } catch {
      setUser({ ...user, ...formData });
      localStorage.setItem("saved_user_profile", JSON.stringify({ ...user, ...formData }));
      toast.success("Profile changes saved locally!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-saas-page">
      <div className="saas-container">
        {/* Profile Banner */}
        <div className="profile-hero-card saas-card">
          <div className="profile-avatar-giant">
            {formData.name ? formData.name.charAt(0).toUpperCase() : "P"}
          </div>

          <div className="profile-hero-meta">
            <div className="hero-name-row">
              <h1>{formData.name}</h1>
              <span className="saas-badge badge-emerald">
                {user?.role ? user.role.toUpperCase() : "STUDENT"}
              </span>
            </div>
            <p className="profile-email-text">{formData.email}</p>
            <p className="profile-degree-text">🎓 Master of Computer Applications (MCA) • Tech Placement Cohort</p>

            <div className="profile-stats-strip">
              <div className="profile-stat-badge">
                <Zap size={15} className="text-emerald" />
                <span>{user?.xp || 320} XP Points</span>
              </div>
              <div className="profile-stat-badge">
                <Flame size={15} className="text-amber" />
                <span>{user?.streak || 7} Days Streak</span>
              </div>
              <div className="profile-stat-badge">
                <Award size={15} className="text-cyan" />
                <span>2 Certificates Earned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form & Credentials Bento */}
        <div className="profile-layout-grid">
          {/* Edit Form */}
          <div className="saas-card edit-profile-card">
            <h3 className="section-title">Personal Profile Details</h3>
            <p className="section-subtitle">Update your personal contact details and portfolio information.</p>

            <form onSubmit={handleSaveProfile} className="profile-form-block mt-3">
              <div>
                <label className="saas-label">Full Name</label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    className="saas-input pl-icon"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="saas-label">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    className="saas-input pl-icon"
                    value={formData.email}
                    disabled
                  />
                </div>
                <small className="text-muted">Email is linked to your academic identity.</small>
              </div>

              <div className="form-row-2">
                <div>
                  <label className="saas-label">Phone Number</label>
                  <div className="input-with-icon">
                    <Phone size={16} className="input-icon" />
                    <input
                      type="text"
                      name="phoneno"
                      className="saas-input pl-icon"
                      value={formData.phoneno}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="saas-label">City / Location</label>
                  <div className="input-with-icon">
                    <MapPin size={16} className="input-icon" />
                    <input
                      type="text"
                      name="city"
                      className="saas-input pl-icon"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="saas-label">Academic / Residential Address</label>
                <textarea
                  rows="3"
                  name="address"
                  className="saas-textarea"
                  value={formData.address}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit" className="btn-saas btn-saas-primary" disabled={saving}>
                <Save size={16} /> {saving ? "Saving Changes..." : "Save Profile Details"}
              </button>
            </form>
          </div>

          {/* Placement Credentials Card */}
          <div className="saas-card placement-meta-card">
            <h3 className="section-title">MCA Placement Readiness</h3>
            <p className="section-subtitle">Track your interview credentials and verified certifications.</p>

            <div className="credentials-summary-list mt-3">
              <div className="cred-item">
                <span className="cred-title">Target Specialization</span>
                <strong>Full-Stack MERN & Cloud Architecture</strong>
              </div>

              <div className="cred-item">
                <span className="cred-title">Verified Certificate ID</span>
                <code>EDUHUB-2026-MCA-7842</code>
              </div>

              <div className="cred-item">
                <span className="cred-title">Curriculum Progress</span>
                <strong className="text-emerald">68% Completed</strong>
              </div>

              <div className="cred-item">
                <span className="cred-title">Placement Assessment Average</span>
                <strong className="text-cyan">86% Mastery</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
