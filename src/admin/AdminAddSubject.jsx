import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../data/supabaseClient";

const AdminAddSubject = () => {
  const { curriculum_id } = useParams();
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.from("subjects").insert({ name, curriculum_id });
    navigate(`/admin/subjects/${curriculum_id}`);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Add Subject</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Subject Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-4 py-2 rounded w-full"
          required
        />
        <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700">
          Add Subject
        </button>
      </form>
    </div>
  );
};

export default AdminAddSubject;
