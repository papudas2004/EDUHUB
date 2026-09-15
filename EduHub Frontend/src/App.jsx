// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

// Layout Components (Fixed folder matching case: 'component')
import Footer from "./component/Footer";
import Navbar from "./component/NavBar";
import ProtectedRoute from "./component/ProtectedRoute";
import AdminRoute from "./component/AdminRoute";

// Public & Information Pages (Fixed folder matching case: 'menubar')
import Home from "./menubar/Home";
import AboutUs from "./menubar/About";
import Services from "./menubar/Services";
import Contact from "./menubar/Contact";
import Contactlist from "./menubar/ContactList";
import ContactDetails from "./menubar/ContactDetails";
import UpdateContact from "./menubar/UpdateContact";
import Login from "./component/login";
import Register from "./component/Register";
import ForgotPassword from "./component/ForgotPassword";
import Unauthorized from "./component/Unauthorized";

// Core Student & Learning System Pages
import Dashboard from "./menubar/Dashboard";
import CourseCatalog from "./menubar/CourseCatalog";
import CourseDetails from "./menubar/CourseDetails";
import MyLearning from "./menubar/MyLearning";
import LearningClassroom from "./component/LearningClassroom";
import Quizzes from "./menubar/Quizzes";
import StudyMaterials from "./menubar/StudyMaterials";
import Certificates from "./menubar/Certificates";
import Achievements from "./menubar/Achievements";
import Profile from "./menubar/Profile";

// Academic Tracking Pages (Preserved)
import TaskTracker from "./menubar/TaskTracker";
import GradeView from "./menubar/GradeView";

// Admin Console
import AdminDashboard from "./menubar/AdminDashboard";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-canvas-container">
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#162033",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              },
            }}
          />

          <Navbar />

          <main className="app-content-area">
            <Routes>
              {/* Landing & Public Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/catalog" element={<CourseCatalog />} />
              <Route path="/courses/:id" element={<CourseDetails />} />
              <Route path="/materials" element={<StudyMaterials />} />

              {/* Student Learning Operating System (Protected) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-learning"
                element={
                  <ProtectedRoute>
                    <MyLearning />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learn/:courseId"
                element={
                  <ProtectedRoute>
                    <LearningClassroom />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-tutor"
                element={<Navigate to="/materials" replace />}
              />
              <Route
                path="/quizzes"
                element={
                  <ProtectedRoute>
                    <Quizzes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/certificates"
                element={
                  <ProtectedRoute>
                    <Certificates />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/achievements"
                element={
                  <ProtectedRoute>
                    <Achievements />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Preserved Academic Trackers */}
              <Route path="/tasks" element={<TaskTracker />} />
              <Route path="/grades" element={<GradeView />} />
              <Route path="/contact-list" element={<Contactlist />} />
              <Route path="/contact-by-id/:id" element={<ContactDetails />} />
              <Route path="/update-contact/:id" element={<UpdateContact />} />

              {/* Admin Console (Admin Only) */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              {/* Authentication */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
