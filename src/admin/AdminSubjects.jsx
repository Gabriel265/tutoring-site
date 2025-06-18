import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../data/supabaseClient";

const AdminSubjects = () => {
  const { curriculum_id } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [curriculumName, setCurriculumName] = useState("");

  const fetchSubjects = async () => {
    const { data } = await supabase.from("subjects").select("*").eq("curriculum_id", curriculum_id);
    setSubjects(data);
  };

  const fetchCurriculumName = async () => {
    const { data } = await supabase.from("curriculums").select("*").eq("id", curriculum_id).single();
    setCurriculumName(data.name);
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
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Subjects in {curriculumName}</h2>
      <Link to={`/admin/add-subject/${curriculum_id}`} className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700">
        + Add Subject
      </Link>
      <ul className="mt-4 space-y-3">
        {subjects.map((subj) => (
          <li key={subj.id} className="bg-gray-100 p-3 rounded flex justify-between">
            <span>{subj.name}</span>
            <div className="flex gap-2">
              <Link to={`/admin/edit-subject/${subj.id}`} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</Link>
              <button onClick={() => deleteSubject(subj.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSubjects;
