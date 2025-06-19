import React, { useEffect, useState } from "react";
import { supabase } from "../data/supabaseClient";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout"; // Assuming you have this layout component

const AdminCurriculums = () => {
  const [curriculums, setCurriculums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchCurriculums = async () => {
    setLoading(true);
    const { data } = await supabase.from("curriculums").select("*").order("id");
    setCurriculums(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCurriculums();
  }, []);

  const archiveCurriculum = async (id) => {
    await supabase.from("curriculums").update({ archived: true }).eq("id", id);
    fetchCurriculums();
  };

  const deleteCurriculum = async (id) => {
    await supabase.from("curriculums").delete().eq("id", id);
    fetchCurriculums();
  };

  // Format price for display
  const formatPrice = (price) => {
    if (!price) return "Free";
    return `MWK ${parseFloat(price).toLocaleString()}`;
  };

  // Filter curriculums based on search and status
  const filteredCurriculums = curriculums.filter(curr => {
    const matchesSearch = curr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (curr.description && curr.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && !curr.archived) ||
      (filterStatus === "archived" && curr.archived);
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Curriculum Management</h2>
          <p className="text-slate-400">Manage and monitor all curriculums in the system</p>
        </div>

        {/* Controls */}
        <div className="bg-slate-900 bg-opacity-80 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search curriculums..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 px-4 py-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
              >
                <option value="all">All Curriculums</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>

              <Link
                to="/admin/add-curriculum"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Curriculum
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{curriculums.filter(c => !c.archived).length}</div>
              <div className="text-slate-400 text-sm">Active Curriculums</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{curriculums.filter(c => c.archived).length}</div>
              <div className="text-slate-400 text-sm">Archived</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{curriculums.filter(c => !c.price || c.price === 0).length}</div>
              <div className="text-slate-400 text-sm">Free Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{curriculums.length}</div>
              <div className="text-slate-400 text-sm">Total Curriculums</div>
            </div>
          </div>
        </div>

        {/* Curriculums List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="bg-slate-900 bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl border border-slate-800">
              <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-400 text-center">Loading curriculums...</p>
            </div>
          </div>
        ) : filteredCurriculums.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-slate-900 bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl border border-slate-800 max-w-md mx-auto">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-white mb-2">No curriculums found</h3>
              <p className="text-slate-400 mb-6">
                {searchTerm || filterStatus !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first curriculum."}
              </p>
              {!searchTerm && filterStatus === "all" && (
                <Link
                  to="/admin/add-curriculum"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 inline-flex items-center gap-2 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add First Curriculum
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredCurriculums.map((curr, index) => (
              <div
                key={curr.id}
                className={`bg-gradient-to-br from-slate-900 to-slate-800 bg-opacity-90 backdrop-blur-sm border border-slate-700 p-6 rounded-2xl transition-all duration-300 hover:shadow-xl hover:border-purple-500/50 relative group transform hover:-translate-y-1 ${
                  curr.archived ? "opacity-60" : ""
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: "fadeInUp 0.5s ease-out forwards"
                }}
              >
               {/* Action Buttons - Top Right */}
<div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">

  {/* Edit Button */}
  <div className="relative">
    <Link
      to={`/admin/edit-curriculum/${curr.id}`}
      state={{ curriculum: curr }}
      className="peer w-9 h-9 bg-slate-800/80 hover:bg-blue-600 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-blue-500/25 backdrop-blur-sm"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </Link>
    <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900/90 text-white text-xs rounded-lg whitespace-nowrap opacity-0 peer-hover:opacity-100 transition-opacity duration-200 pointer-events-none backdrop-blur-sm">
      Edit Curriculum
    </div>
  </div>

  {/* Subjects Button */}
  <div className="relative">
    <Link
      to={`/admin/subjects/${curr.id}`}
      state={{ curriculum: curr }}
      className="peer w-9 h-9 bg-slate-800/80 hover:bg-green-600 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-green-500/25 backdrop-blur-sm"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </Link>
    <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900/90 text-white text-xs rounded-lg whitespace-nowrap opacity-0 peer-hover:opacity-100 transition-opacity duration-200 pointer-events-none backdrop-blur-sm">
      Manage Subjects
    </div>
  </div>

  {/* Archive Button */}
  {!curr.archived && (
    <div className="relative">
      <button
        onClick={() => archiveCurriculum(curr.id)}
        className="peer w-9 h-9 bg-slate-800/80 hover:bg-yellow-600 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-yellow-500/25 backdrop-blur-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l4 4 4-4" />
        </svg>
      </button>
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900/90 text-white text-xs rounded-lg whitespace-nowrap opacity-0 peer-hover:opacity-100 transition-opacity duration-200 pointer-events-none backdrop-blur-sm">
        Archive Curriculum
      </div>
    </div>
  )}

  {/* Delete Button */}
  <div className="relative">
    <button
      onClick={() => deleteCurriculum(curr.id)}
      className="peer w-9 h-9 bg-slate-800/80 hover:bg-red-600 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-red-500/25 backdrop-blur-sm"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
    <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900/90 text-white text-xs rounded-lg whitespace-nowrap opacity-0 peer-hover:opacity-100 transition-opacity duration-200 pointer-events-none backdrop-blur-sm">
      Delete Curriculum
    </div>
  </div>
</div>


                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center text-white text-3xl border-2 border-purple-500/30 flex-shrink-0 shadow-lg">
                    📚
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-2 pr-24 sm:pr-40"> {/* Add right padding for buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <h3 className="font-bold text-2xl text-white truncate flex-1">{curr.name}</h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          !curr.price || curr.price === 0 
                            ? "bg-green-600/20 text-green-400 border border-green-500/30" 
                            : "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                        }`}>
                          {formatPrice(curr.price)}
                        </span>
                        {curr.archived && (
                          <span className="bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold border border-yellow-500/30">
                            ARCHIVED
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${curr.archived ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                        <span className="text-slate-400 text-sm font-medium">
                          {curr.archived ? "Archived" : "Active"}
                        </span>
                      </div>
                      {curr.created_at && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-slate-400 text-sm">
                            Created {new Date(curr.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {curr.description && (
                      <div className="bg-slate-800/50 rounded-lg p-4 mt-3 border border-slate-700/50">
                        <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">{curr.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminCurriculums;