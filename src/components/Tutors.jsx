import React, { useEffect, useState } from "react";
import TutorModal from "./TutorModal";
import { supabase } from "../data/supabaseClient";

const Tutors = () => {
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);

  useEffect(() => {
    const fetchTutors = async () => {
      const { data, error } = await supabase.from("tutors").select("*");
      if (error) console.error("Error fetching tutors:", error);
      else setTutors(data);
    };

    fetchTutors();
  }, []);

  return (
    <section id="tutors" className="bg-black text-white py-12 px-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-purple-400">
        Meet Our Featured Tutors
      </h2>
      <div className="overflow-x-auto whitespace-nowrap flex gap-6 pb-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-purple-900">
        {tutors.map((tutor) => (
          <div
            key={tutor.id}
            onClick={() => setSelectedTutor(tutor)}
            className="min-w-[220px] bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900 rounded-xl p-5 text-center shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300"
          >
            <img
              src={tutor.profile_picture}
              alt={tutor.name}
              className="rounded-full w-24 h-24 mx-auto mb-3 border-4 border-white shadow-lg"
            />
            <h3 className="text-lg font-bold">{tutor.name}</h3>
            <p className="text-sm text-purple-200">{tutor.qualification}</p>
          </div>
        ))}
      </div>

      {selectedTutor && (
        <TutorModal tutor={selectedTutor} onClose={() => setSelectedTutor(null)} />
      )}
    </section>
  );
};

export default Tutors;
