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
    <section className="bg-slate-950 text-white py-12 px-4 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Our Tutors</h1>
        <p className="text-lg text-gray-400">Meet our qualified instructors</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tutors.map((tutor) => (
          <div
            key={tutor.id}
            onClick={() => setSelectedTutor(tutor)}
            className="bg-slate-800 rounded-lg shadow hover:shadow-lg transition p-4 cursor-pointer"
          >
            <img
              src={tutor.profile_picture}
              alt={tutor.name}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold text-white">{tutor.name}</h3>
            <p className="text-sm text-gray-300">{tutor.qualification}</p>
          </div>
        ))}
      </div>

      {selectedTutor && (
        <TutorModal
          tutor={selectedTutor}
          onClose={() => setSelectedTutor(null)}
        />
      )}
    </section>
  );
};

export default Tutors;
