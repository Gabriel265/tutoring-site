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
    <section id="tutors" className="relative bg-gradient-to-b from-[#0A1A24] via-[#30525C] to-[#0A1A24] pb-[1px] text-white py-16 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#F6C992] to-[#D396A6]">
            Our Tutors
          </h1>
          <p className="text-lg text-[#ACCOD3]">
            Meet our qualified instructors
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {tutors.map((tutor) => (
            <div
              key={tutor.id}
              onClick={() => setSelectedTutor(tutor)}
              className="bg-white/5 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-white/10 hover:border-[#ACCOD3]/30 group"
            >
              <div className="relative overflow-hidden rounded-lg mb-5 h-48">
                <img
                  src={tutor.profile_picture}
                  alt={tutor.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#30525C]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-sm font-medium">
                    View Profile
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">
                {tutor.name}
              </h3>
              <p className="text-[#F6C992] text-sm">{tutor.qualification}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {tutor.subjects?.slice(0, 3).map((subject, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 rounded-full bg-[#09A1A1]/20 text-[#09A1A1]"
                  >
                    {subject}
                  </span>
                ))}
                {tutor.subjects?.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-[#D396A6]/20 text-[#D396A6]">
                    +{tutor.subjects.length - 3} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
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