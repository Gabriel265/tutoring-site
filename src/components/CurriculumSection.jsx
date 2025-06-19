import React, { useEffect, useState } from "react";
import { supabase } from "../data/supabaseClient";

const colors = [
  "from-[#F6C992] to-[#D396A6]", // Seashell to Garnet
  "from-[#30525C] to-[#5484A4]", // Afternoon to Blue
  "from-[#ACCOD3] to-[#09A1A1]", // Purple to Teal
  "from-[#F6C992] to-[#09A1A1]", // Seashell to Teal
  "from-[#D396A6] to-[#ACCOD3]", // Garnet to Purple
  "from-[#5484A4] to-[#30525C]", // Blue to Afternoon
  "from-[#09A1A1] to-[#F6C992]", // Teal to Seashell
];

const CurriculumSection = () => {
  const [curriculums, setCurriculums] = useState([]);
  const [subjects, setSubjects] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [currency, setCurrency] = useState("MWK");
  const [exchangeRates, setExchangeRates] = useState({ MWK: 1 });
  const [loadingRates, setLoadingRates] = useState(true);

  useEffect(() => {
    const fetchCurriculums = async () => {
      const { data } = await supabase.from("curriculums").select("*");
      if (data) setCurriculums(data);
    };
    fetchCurriculums();
  }, []);

  useEffect(() => {
    const fetchRates = async () => {
      setLoadingRates(true);
      try {
        const apiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/${apiKey}/latest/MWK`
        );
        const data = await res.json();
        setExchangeRates(data.conversion_rates);
      } catch (err) {
        console.error("Error fetching exchange rates", err);
      } finally {
        setLoadingRates(false);
      }
    };
    fetchRates();
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

  const convertPrice = (priceMWK) => {
    const rate = exchangeRates[currency] || 1;
    const converted = (priceMWK * rate).toFixed(2);
    return currency === "MWK"
      ? `${priceMWK.toLocaleString()} MWK`
      : `${converted} ${currency}`;
  };

  return (
    <section id="curriculum"className="relative bg-gradient-to-b from-[#0A1A24] via-[#30525C] to-[#0A1A24] pb-[1px] py-12 px-4" >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl text-center font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#F6C992] to-[#D396A6]">
          Explore Our Curriculums & Subjects
        </h2>

        {/* Currency Selector */}
        <div className="flex justify-end mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 inline-flex items-center">
            <label className="mr-2 text-[#F6C992] font-medium">View Prices In:</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-white/20 text-white px-3 py-1 rounded-md border border-[#5484A4] focus:outline-none focus:ring-2 focus:ring-[#ACCOD3]"
            >
              {Object.keys(exchangeRates).map((cur) => (
                <option key={cur} value={cur} className="bg-[#30525C]">
                  {cur}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#ACCOD3] scrollbar-track-[#30525C]/30">
          {curriculums.map((curriculum, i) => (
            <div
              key={curriculum.id}
              className={`min-w-[300px] rounded-2xl shadow-lg bg-gradient-to-br ${colors[i % colors.length]} text-white p-6 relative transition-all duration-300 hover:scale-[1.02] flex flex-col`}
            >
              <div className="absolute inset-0 bg-[url('/images/logo.png')] bg-cover bg-center opacity-5 rounded-2xl" />
              
              <div className="flex-grow relative z-10">
                <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-md">
                  {curriculum.name}
                </h3>
                
                <div className="flex items-center mb-4">
                  <span className="text-lg font-semibold mr-1">
                    {loadingRates ? (
                      <span className="inline-block h-5 w-20 bg-white/20 rounded animate-pulse" />
                    ) : (
                      convertPrice(curriculum.price)
                    )}
                  </span>
                  <span className="text-sm opacity-80">per hour</span>
                </div>
              </div>

              <button
                onClick={() => toggleSubjects(curriculum.id)}
                className="mt-auto w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 relative z-10"
              >
                {expanded === curriculum.id ? "Hide Subjects" : "View Subjects"}
              </button>

              {expanded === curriculum.id && subjects[curriculum.id] && (
                <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 relative z-10 animate-fadeIn">
                  <h4 className="font-medium mb-2 text-[#F6C992]">Subjects Offered:</h4>
                  <ul className="space-y-1">
                    {subjects[curriculum.id].map((sub) => (
                      <li key={sub.id} className="flex items-center">
                        <span className="w-2 h-2 bg-[#09A1A1] rounded-full mr-2" />
                        {sub.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;