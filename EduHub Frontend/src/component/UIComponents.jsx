import React from "react";
import "./UIComponents.css";

export const Badge = ({ children, variant = "primary", className = "", size = "md" }) => {
  return (
    <span className={`saas-badge badge-${variant} badge-${size} ${className}`}>
      {children}
    </span>
  );
};

export const Skeleton = ({ height = "20px", width = "100%", borderRadius = "8px", className = "" }) => {
  return (
    <div
      className={`saas-skeleton-loader ${className}`}
      style={{ height, width, borderRadius }}
    />
  );
};

export const EmptyState = ({ icon: Icon, title, description, actionText, onAction, actionLink: ActionLink }) => {
  return (
    <div className="saas-empty-state">
      <div className="empty-state-icon-wrapper">
        {Icon && <Icon size={36} className="empty-state-icon" />}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="saas-btn saas-btn-primary">
          {actionText}
        </button>
      )}
      {actionText && ActionLink && (
        <ActionLink className="saas-btn saas-btn-primary">
          {actionText}
        </ActionLink>
      )}
    </div>
  );
};

export const ProgressBar = ({ percentage = 0, color = "primary", showLabel = true, height = "8px" }) => {
  const clamped = Math.min(100, Math.max(0, percentage));
  return (
    <div className="saas-progress-wrapper">
      <div className="saas-progress-track" style={{ height }}>
        <div
          className={`saas-progress-fill progress-fill-${color}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && <span className="saas-progress-label">{clamped}%</span>}
    </div>
  );
};
