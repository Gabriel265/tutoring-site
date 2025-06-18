import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../data/supabaseClient";

const AdminEditSubject = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [curriculumId, setCurriculumId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubject = async () => {
      const { data } = await supabase.from("subjects").select("*").eq("id", id).single();
      setName(data.name);
      setCurriculumId(data.curriculum_id);
    };
    fetchSubject();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await supabase.from("subjects").update({ name }).eq("id", id);
    navigate(`/admin/subjects/${curriculumId}`);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Edit Subject</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          placeholder="Subject Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-4 py-2 rounded w-full"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
          Update Subject
        </button>
      </form>
    </div>
  );
};

export default AdminEditSubject;
