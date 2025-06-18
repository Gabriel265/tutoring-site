import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { supabase } from "../data/supabaseClient";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ tutors: 0, curriculums: 0, subjects: 0 });
  const [recentTutors, setRecentTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [archivedTutors, setArchivedTutors] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch counts
        const tutors = await supabase.from("tutors").select("*", { count: "exact", head: true });
        const curriculums = await supabase.from("curriculums").select("*", { count: "exact", head: true });
        const subjects = await supabase.from("subjects").select("*", { count: "exact", head: true });
        
        // Fetch archived tutors count
        const archivedCount = await supabase
          .from("tutors")
          .select("*", { count: "exact", head: true })
          .eq("archived", true);

        // Fetch recent tutors
        const recentTutorsData = await supabase
          .from("tutors")
          .select("id, full_name, qualification, photo_url, created_at, archived")
          .order("created_at", { ascending: false })
          .limit(5);

        setCounts({
          tutors: tutors.count || 0,
          curriculums: curriculums.count || 0,
          subjects: subjects.count || 0,
        });

        setArchivedTutors(archivedCount.count || 0);
        setRecentTutors(recentTutorsData.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const statsCards = [
    {
      title: "Total Tutors",
      value: counts.tutors,
      icon: "👨‍🏫",
      color: "blue",
      description: "Active tutors in system",
      link: "/admin/tutors"
    },
    {
      title: "Curriculums",
      value: counts.curriculums,
      icon: "📚",
      color: "green",
      description: "Available curriculums",
      link: "/admin/curriculums"
    },
    {
      title: "Subjects",
      value: counts.subjects,
      icon: "📖",
      color: "purple",
      description: "Subject categories",
      link: "/admin/subjects"
    },
    {
      title: "Archived",
      value: archivedTutors,
      icon: "📦",
      color: "yellow",
      description: "Archived tutors",
      link: "/admin/tutors"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-600 bg-opacity-20 text-blue-400 border-blue-600",
      green: "bg-green-600 bg-opacity-20 text-green-400 border-green-600",
      purple: "bg-purple-600 bg-opacity-20 text-purple-400 border-purple-600",
      yellow: "bg-yellow-600 bg-opacity-20 text-yellow-400 border-yellow-600"
    };
    return colors[color] || colors.blue;
  };

  return (
    <AdminLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Welcome back! Here's what's happening with your tutoring platform.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="bg-slate-900 bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl border border-slate-800">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-400 text-center">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsCards.map((card, index) => (
                <Link
                  key={card.title}
                  to={card.link}
                  className="group bg-slate-900 bg-opacity-80 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl hover:bg-opacity-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards"
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${getColorClasses(card.color)} border border-opacity-30`}>
                      {card.icon}
                    </div>
                    <svg
                      className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="mb-2">
                    <div className="text-3xl font-bold text-white mb-1">{card.value}</div>
                    <div className="text-slate-400 text-sm">{card.description}</div>
                  </div>
                  <div className="text-lg font-semibold text-slate-300 group-hover:text-white transition-colors duration-200">
                    {card.title}
                  </div>
                </Link>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Tutors */}
              <div className="lg:col-span-2">
                <div className="bg-slate-900 bg-opacity-80 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Recent Tutors</h3>
                      <p className="text-slate-400 text-sm">Latest additions to your platform</p>
                    </div>
                    <Link
                      to="/admin/tutors"
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                    >
                      View All →
                    </Link>
                  </div>

                  {recentTutors.length > 0 ? (
                    <div className="space-y-4">
                      {recentTutors.map((tutor, index) => (
                        <div
                          key={tutor.id}
                          className="flex items-center gap-4 p-4 bg-slate-800 bg-opacity-50 rounded-xl border border-slate-700 hover:bg-opacity-80 transition-all duration-200"
                          style={{
                            animationDelay: `${(index + 4) * 100}ms`,
                            animation: "fadeInUp 0.6s ease-out forwards"
                          }}
                        >
                          {tutor.photo_url ? (
                            <img
                              src={tutor.photo_url}
                              alt={tutor.full_name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-slate-600"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-slate-400">
                              👨‍🏫
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-white">{tutor.full_name}</h4>
                              {tutor.archived && (
                                <span className="bg-yellow-600 bg-opacity-20 text-yellow-400 px-2 py-1 rounded text-xs">
                                  ARCHIVED
                                </span>
                              )}
                            </div>
                            <p className="text-slate-400 text-sm">{tutor.qualification}</p>
                          </div>
                          <div className="text-slate-500 text-sm">
                            {formatDate(tutor.created_at)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">👨‍🏫</div>
                      <p className="text-slate-400 mb-4">No tutors added yet</p>
                      <Link
                        to="/admin/add-tutor"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 inline-flex items-center gap-2"
                      >
                        <span>➕</span>
                        Add First Tutor
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <div className="bg-slate-900 bg-opacity-80 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link
                      to="/admin/add-tutor"
                      className="flex items-center gap-3 p-3 bg-slate-800 bg-opacity-50 rounded-lg hover:bg-opacity-80 transition-all duration-200 text-white group"
                    >
                      <span className="text-lg">➕</span>
                      <span className="font-medium">Add New Tutor</span>
                      <svg className="w-4 h-4 ml-auto text-slate-600 group-hover:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <Link
                      to="/admin/add-curriculum"
                      className="flex items-center gap-3 p-3 bg-slate-800 bg-opacity-50 rounded-lg hover:bg-opacity-80 transition-all duration-200 text-white group"
                    >
                      <span className="text-lg">📝</span>
                      <span className="font-medium">Add Curriculum</span>
                      <svg className="w-4 h-4 ml-auto text-slate-600 group-hover:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <Link
                      to="/admin/tutors"
                      className="flex items-center gap-3 p-3 bg-slate-800 bg-opacity-50 rounded-lg hover:bg-opacity-80 transition-all duration-200 text-white group"
                    >
                      <span className="text-lg">👥</span>
                      <span className="font-medium">Manage Tutors</span>
                      <svg className="w-4 h-4 ml-auto text-slate-600 group-hover:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* System Status */}
                <div className="bg-slate-900 bg-opacity-80 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-white mb-4">System Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Database</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-green-400 text-sm">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Storage</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-green-400 text-sm">Active</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Authentication</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-green-400 text-sm">Secure</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminDashboard;