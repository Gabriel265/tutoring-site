// App.jsx
import { Analytics } from "@vercel/analytics/next"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";

import Hero from "./components/Hero";
import Tutors from "./components/Tutors";
import Navbar from "./components/Navbar";
import CurriculumSection from "./components/CurriculumSection";
import AssignmentForm from "./components/AssignmentForm";
import Footer from "./components/Footer";

// Admin Pages
import AdminDashboard from "./admin/AdminDashboard";
import AdminTutors from "./admin/AdminTutors";
import AdminAddTutor from "./admin/AdminAddTutor";
import AdminEditTutor from "./admin/AdminEditTutor";
import AdminCurriculums from "./admin/AdminCurriculums";
import AdminAddCurriculum from "./admin/AdminAddCurriculum";
import AdminEditCurriculum from "./admin/AdminEditCurriculum";
import AdminSubjects from "./admin/AdminSubjects";
import AdminAddSubject from "./admin/AdminAddSubject";
import AdminEditSubject from "./admin/AdminEditSubject";
import AdminLogin from "./admin/AdminLogin";
import AdminProtectedRoute from "./admin/AdminProtectedRoute";

// Optional: Main site layout
function MainApp() {
  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 min-h-screen text-gray-900">
      <Navbar />
      <Hero />
      <CurriculumSection />
      <AssignmentForm />
      <Tutors />
      <Footer />
    </div>
  );
}

// Actual App with routing
function App() {
  return (
    <Router>
      <Routes>
        {/* Public site */}
        <Route path="/" element={<MainApp />} />

        {/* Admin Login (no auth required) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Pages */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/tutors"
          element={
            <AdminProtectedRoute>
              <AdminTutors />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/add-tutor"
          element={
            <AdminProtectedRoute>
              <AdminAddTutor />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-tutor/:id"
          element={
            <AdminProtectedRoute>
              <AdminEditTutor />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/curriculums"
          element={
            <AdminProtectedRoute>
              <AdminCurriculums />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/add-curriculum"
          element={
            <AdminProtectedRoute>
              <AdminAddCurriculum />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-curriculum/:id"
          element={
            <AdminProtectedRoute>
              <AdminEditCurriculum />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/subjects/:curriculum_id"
          element={
            <AdminProtectedRoute>
              <AdminSubjects />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/add-subject/:curriculum_id"
          element={
            <AdminProtectedRoute>
              <AdminAddSubject />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-subject/:id"
          element={
            <AdminProtectedRoute>
              <AdminEditSubject />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
