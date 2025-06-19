import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../data/supabaseClient";
import AdminLayout from "./AdminLayout";

const AdminSubjects = () => {
  const { curriculum_id } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [curriculumName, setCurriculumName] = useState("");
  const navigate = useNavigate();

  const fetchSubjects = async () => {
    const { data } = await supabase
      .from("subjects")
      .select("*")
      .eq("curriculum_id", curriculum_id);
    setSubjects(data || []);
  };

  const fetchCurriculumName = async () => {
    const { data } = await supabase
      .from("curriculums")
      .select("*")
      .eq("id", curriculum_id)
      .single();
    setCurriculumName(data?.name || "");
  };

  const deleteSubject = async (id) => {
    await supabase.from("subjects").delete().eq("id", id);
    fetchSubjects();
  };

  useEffect(() => {
    fetchSubjects();
    fetchCurriculumName();
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-950 relative overflow-hidden p-6">
        {/* Decorative Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-slate-800 rounded-full opacity-30"></div>
          <div className="absolute bottom-1/3 left-1/6 w-24 h-24 bg-slate-700 rounded-full opacity-40"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-4xl font-bold text-white mb-1">
                Subjects in {curriculumName}
              </h2>
              <p className="text-slate-400">Manage all subjects under this curriculum</p>
            </div>
            <Link
              to={`/admin/add-subject/${curriculum_id}`}
              className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-500 transition"
            >
              + Add Subject
            </Link>
          </div>

          {/* Subjects List */}
          <ul className="space-y-4">
            {subjects.map((subj) => (
              <li
                key={subj.id}
                className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center justify-between"
              >
                <span className="text-white font-medium">{subj.name}</span>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      navigate(`/admin/edit-subject/${subj.id}`, {
                        state: { name: subj.name },
                      })
                    }
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-1.5 rounded-lg text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteSubject(subj.id)}
                    className="bg-red-700 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {subjects.length === 0 && (
              <li className="text-slate-400 italic text-center py-8">No subjects found.</li>
            )}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSubjects;
