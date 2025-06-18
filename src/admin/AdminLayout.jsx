// src/admin/AdminLayout.jsx
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../data/supabaseClient";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("adminSession");
    navigate("/admin/login");
  };

  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navLinks = [
    { path: "/admin", label: "Dashboard", icon: "📊" },
    { path: "/admin/tutors", label: "Manage Tutors", icon: "👨‍🏫" },
    { path: "/admin/add-tutor", label: "Add Tutor", icon: "➕" },
    { path: "/admin/curriculums", label: "Manage Curriculums", icon: "📚" },
    { path: "/admin/add-curriculum", label: "Add Curriculum", icon: "📝" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">gratafy</h1>
          <p className="text-slate-400 text-sm">Admin Panel</p>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActiveLink(link.path)
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 mt-auto text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition-all duration-200"
        >
          <span className="text-lg">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-950 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-20 w-3 h-3 bg-blue-400 rotate-45 opacity-20"></div>
          <div className="absolute top-40 left-1/4 w-2 h-2 bg-white rotate-45 opacity-15"></div>
          <div className="absolute bottom-32 right-1/3 w-4 h-4 bg-blue-300 rotate-45 opacity-25"></div>
          <div className="absolute top-1/3 right-20 w-24 h-24 bg-slate-800 rounded-full opacity-30"></div>
          <div className="absolute bottom-1/4 left-20 w-16 h-16 bg-slate-700 rounded-full opacity-40"></div>
        </div>
        
        <div className="relative z-10 p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;