import React, { useEffect, useState } from "react";
import { supabase } from "../data/supabaseClient";

const colors = [
  "from-pink-500 to-red-500",
  "from-purple-500 to-indigo-500",
  "from-green-500 to-emerald-500",
  "from-yellow-500 to-orange-500",
  "from-blue-500 to-cyan-500",
  "from-rose-500 to-pink-500",
  "from-fuchsia-500 to-purple-500",
];

const CurriculumSection = () => {
  const [curriculums, setCurriculums] = useState([]);
  const [subjects, setSubjects] = useState({});
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchCurriculums = async () => {
      const { data, error } = await supabase.from("curriculums").select("*");
      if (data) setCurriculums(data);
    };
    fetchCurriculums();
  }, []);

  const toggleSubjects = async (id) => {
    if (expanded === id) {
      setExpanded(null);
      return;
    }

    if (!subjects[id]) {
      const { data } = await supabase
        .from("subjects")
        .select("*")
        .eq("curriculum_id", id);
      setSubjects((prev) => ({ ...prev, [id]: data }));
    }
    setExpanded(id);
  };

  return (
    <section className="bg-slate-950 py-10">
      <h2 className="text-3xl text-center text-white font-bold mb-6">
        Explore Our Curriculums
      </h2>
      <div className="flex space-x-6 overflow-x-auto px-4 scrollbar-thin scrollbar-thumb-purple-700">
        {curriculums.map((curriculum, i) => (
          <div
            key={curriculum.id}
            className={`min-w-[300px] rounded-xl shadow-xl bg-gradient-to-br ${colors[i % colors.length]} text-white p-6 relative transition-all duration-300 hover:scale-105`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10 rounded-xl"
              style={{ backgroundImage: "url('/images/logo.png')" }}
            ></div>
            <h3 className="text-xl font-bold relative z-10">
              {curriculum.name}
            </h3>
            <p className="text-sm mt-2 relative z-10">
              {curriculum.description}
            </p>
            <button
              onClick={() => toggleSubjects(curriculum.id)}
              className="mt-4 bg-white text-black text-sm px-4 py-1 rounded-full relative z-10 hover:bg-gray-200"
            >
              {expanded === curriculum.id ? "Hide Subjects" : "View Subjects"}
            </button>
            {expanded === curriculum.id && subjects[curriculum.id] && (
              <ul className="mt-4 list-disc list-inside text-sm relative z-10">
                {subjects[curriculum.id].map((sub) => (
                  <li key={sub.id}>{sub.name}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CurriculumSection;
