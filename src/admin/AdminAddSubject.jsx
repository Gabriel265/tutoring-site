import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../data/supabaseClient";
import AdminLayout from "./AdminLayout";

const AdminAddSubject = () => {
  const { curriculum_id } = useParams();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await supabase.from("subjects").insert({ name, curriculum_id });
    navigate(`/admin/subjects/${curriculum_id}`);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-950 relative overflow-hidden">
        {/* Decorative Background Circles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-slate-800 rounded-full opacity-30"></div>
          <div className="absolute bottom-1/3 left-1/6 w-24 h-24 bg-slate-700 rounded-full opacity-40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="bg-slate-900 bg-opacity-80 p-8 rounded-2xl shadow-2xl w-full max-w-xl border border-slate-800">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-2">Add Subject</h2>
              <p className="text-slate-400">Assign a new subject to this curriculum</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Subject Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mathematics"
                  required
                  className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(`/admin/subjects/${curriculum_id}`)}
                  className="flex-1 bg-slate-700 text-white font-semibold py-3 rounded-lg hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-white text-slate-900 font-semibold py-3 rounded-lg hover:bg-blue-50 disabled:opacity-50"
                >
                  {isSubmitting ? "Adding..." : "Add Subject 📚"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAddSubject;
