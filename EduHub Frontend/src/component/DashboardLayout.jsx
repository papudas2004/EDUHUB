import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import "./DashboardLayout.css";

const DashboardLayout = ({ children, isAdmin = false }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="dashboard-shell">
      <Sidebar
        isAdminView={isAdmin}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="dashboard-main-area">
        {/* Mobile Sidebar Toggle Strip */}
        <div className="mobile-sidebar-toggle-bar">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="mobile-sidebar-toggle-btn"
            aria-label="Open Navigation Menu"
          >
            <Menu size={20} />
            <span>Navigation Menu</span>
          </button>
        </div>

        <div className="dashboard-inner-content">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
