import React, { useEffect, useState } from "react";
import { supabase } from "../data/supabaseClient";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";

const AdminTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, archived

  const fetchTutors = async () => {
    const { data, error } = await supabase
      .from("tutors")
      .select("*")
      .order("id", { ascending: false });
    if (!error) setTutors(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  const archiveTutor = async (id) => {
    await supabase.from("tutors").update({ archived: true }).eq("id", id);
    fetchTutors();
  };

  const deleteTutor = async (id, profilePicture) => {
    if (window.confirm("Are you sure you want to delete this tutor? This action cannot be undone.")) {
      // Delete photo from storage if it exists
      if (profilePicture) {
        const fileName = profilePicture.split("/").pop();
        await supabase.storage.from("tutor-photos").remove([fileName]);
      }
      await supabase.from("tutors").delete().eq("id", id);
      fetchTutors();
    }
  };

  const filteredTutors = tutors.filter((tutor) => {
  const name = tutor.name || "";
  const qualification = tutor.qualification || "";
  
  const matchesSearch =
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    qualification.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesFilter = filterStatus === "all" || 
                       (filterStatus === "active" && !tutor.archived) ||
                       (filterStatus === "archived" && tutor.archived);
  return matchesSearch && matchesFilter;
});

  const toggleDropdown = (tutorId) => {
    setOpenDropdown(openDropdown === tutorId ? null : tutorId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Tutor Management</h2>
          <p className="text-slate-400">Manage and monitor all tutors in the system</p>
        </div>

        {/* Controls */}
        <div className="bg-slate-900 bg-opacity-80 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tutors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 px-4 py-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                className="bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="all">All Tutors</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>

              <Link
                to="/admin/add-tutor"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>➕</span>
                Add Tutor
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{tutors.filter(t => !t.archived).length}</div>
              <div className="text-slate-400 text-sm">Active Tutors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{tutors.filter(t => t.archived).length}</div>
              <div className="text-slate-400 text-sm">Archived</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{tutors.length}</div>
              <div className="text-slate-400 text-sm">Total Tutors</div>
            </div>
          </div>
        </div>

        {/* Tutors List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="bg-slate-900 bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl border border-slate-800">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-400 text-center">Loading tutors...</p>
            </div>
          </div>
        ) : filteredTutors.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-slate-900 bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl border border-slate-800 max-w-md mx-auto">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <h3 className="text-xl font-semibold text-white mb-2">No tutors found</h3>
              <p className="text-slate-400 mb-6">
                {searchTerm || filterStatus !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first tutor."}
              </p>
              {!searchTerm && filterStatus === "all" && (
                <Link
                  to="/admin/add-tutor"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 inline-flex items-center gap-2"
                >
                  <span>➕</span>
                  Add First Tutor
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTutors.map((tutor, index) => (
              <div
                key={tutor.id}
                className={`bg-slate-900 bg-opacity-80 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl transition-all duration-200 hover:bg-opacity-100 relative group ${
                  tutor.archived ? "opacity-75" : ""
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: "fadeInUp 0.5s ease-out forwards"
                }}
              >
               {/* Action Buttons - Top Right */}
<div className="absolute top-3 right-3 hidden sm:flex gap-1">
  {/* Edit Button */}
  <div className="relative">
    <Link
      to={`/admin/edit-tutor/${tutor.id}`}
      className="peer w-8 h-8 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </Link>
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 peer-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
      Edit Tutor
    </div>
  </div>

  {/* Archive Button */}
  {!tutor.archived && (
    <div className="relative">
      <button
        onClick={() => archiveTutor(tutor.id)}
        className="peer w-8 h-8 bg-slate-800 hover:bg-yellow-600 text-slate-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l4 4 4-4m0 10l-4-4-4 4" />
        </svg>
      </button>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 peer-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Archive Tutor
      </div>
    </div>
  )}

  {/* Delete Button */}
  <div className="relative">
    <button
      onClick={() => deleteTutor(tutor.id, tutor.profile_picture)}
      className="peer w-8 h-8 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 peer-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
      Delete Tutor
    </div>
  </div>
</div>

{/* Mobile Action Menu */}
<div className="sm:hidden absolute top-3 right-3">
  <details className="relative">
    <summary className="w-8 h-8 bg-slate-800 text-white rounded-lg flex items-center justify-center cursor-pointer list-none">
      ⋮
    </summary>
    <div className="absolute right-0 mt-2 w-36 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10">
      <Link
        to={`/admin/edit-tutor/${tutor.id}`}
        className="block px-4 py-2 text-sm text-white hover:bg-blue-600"
      >
        Edit
      </Link>
      {!tutor.archived && (
        <button
          onClick={() => archiveTutor(tutor.id)}
          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-yellow-600"
        >
          Archive
        </button>
      )}
      <button
        onClick={() => deleteTutor(tutor.id, tutor.profile_picture)}
        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  </details>
</div>



                <div className="flex items-start gap-4">
                  {/* Profile Picture */}
                  {tutor.profile_picture ? (
                    <img
                      src={tutor.profile_picture}
                      alt={tutor.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-slate-700 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 text-2xl border-2 border-slate-700 flex-shrink-0">
                      👨‍🏫
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-xl text-white truncate">{tutor.name}</h3>
                      {tutor.archived && (
                        <span className="bg-yellow-600 bg-opacity-20 text-yellow-400 px-2 py-1 rounded text-xs font-medium flex-shrink-0">
                          ARCHIVED
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 mb-2 truncate">{tutor.qualification}</p>
                    {tutor.bio && (
                      <p className="text-slate-300 text-sm line-clamp-2">{tutor.bio}</p>
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminTutors;