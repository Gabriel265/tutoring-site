import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../data/supabaseClient";
import AdminLayout from "./AdminLayout";

const AdminEditSubject = () => {
  const { id } = useParams();
  const location = useLocation();
  const [name, setName] = useState(location?.state?.name || "");
  const [curriculumId, setCurriculumId] = useState(null);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!name) {
      const fetchSubject = async () => {
        const { data } = await supabase.from("subjects").select("*").eq("id", id).single();
        if (data) {
          setName(data.name);
          setCurriculumId(data.curriculum_id);
        }
      };
      fetchSubject();
    }
  }, [id, name]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from("subjects").update({ name }).eq("id", id);

    if (error) {
      alert("Error updating subject.");
      setIsSubmitting(false);
      return;
    }

    navigate(`/admin/subjects/${curriculumId}`);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-950 relative overflow-hidden p-6">
        {/* Decorative background circles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-slate-800 rounded-full opacity-30"></div>
          <div className="absolute bottom-1/4 left-1/6 w-24 h-24 bg-slate-700 rounded-full opacity-40"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="bg-slate-900 bg-opacity-90 p-8 rounded-2xl shadow-2xl w-full max-w-xl border border-slate-800">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-2">Edit Subject</h2>
              <p className="text-slate-400">Make changes to this subject's name</p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Subject Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter subject name"
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(`/admin/subjects/${curriculumId}`)}
                  className="flex-1 bg-slate-700 text-white font-semibold py-3 rounded-lg hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-400 disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Update Subject ✏️"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEditSubject;
