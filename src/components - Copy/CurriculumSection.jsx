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
    <section className="bg-slate-950 py-10">
      <h2 className="text-3xl text-center text-white font-bold mb-6">
        Explore Our Curriculums
      </h2>

      {/* Currency Selector */}
      <div className="text-white text-sm mb-4 px-4 text-right">
        <label className="mr-2">View Prices In:</label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="bg-slate-800 text-white px-2 py-1 rounded"
        >
          {Object.keys(exchangeRates).map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>

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
    <p className="mt-3 relative z-10" style={{ display: 'flex', alignItems: 'center' }}>
  <h1><span className="text-cyan-500 font-medium">{curriculum.name}</span></h1>
  <span className="mx-2">~</span>
  <span className="flex items-center">
    <span>
      {loadingRates ? "Loading..." : convertPrice(curriculum.price)}
    </span>
    <span className="ml-1 text-gray-400 text-sm">per hour</span>
  </span>
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
