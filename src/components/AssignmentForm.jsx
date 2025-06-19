import React, { useEffect, useState } from "react";

const AssignmentForm = () => {
  const [type, setType] = useState("assignment");
  const [wordCount, setWordCount] = useState("");
  const [pages, setPages] = useState("");
  const [currency, setCurrency] = useState("MWK");
  const [exchangeRates, setExchangeRates] = useState({ MWK: 1 });
  const [loadingRates, setLoadingRates] = useState(true);

  const computedPages = pages || Math.ceil((wordCount || 0) / 250);
  const priceMWK = computedPages * 5000;
  const selectedRate = exchangeRates[currency] || 1;
  const convertedPrice = (priceMWK * selectedRate).toFixed(2);

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
        setLoadingRates(false);
      } catch (err) {
        console.error("Error fetching exchange rates", err);
        setLoadingRates(false);
      }
    };

    fetchRates();
  }, []);

  return (
    <section id="writing" className="relative bg-gradient-to-b from-[#0A1A24] via-[#30525C] to-[#0A1A24] pb-[1px] py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-[#F6C992] to-[#D396A6]">
          Calculate Academic Writing Pricing
        </h2>

        <form className="bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg p-8 space-y-8 border border-white/10">
          {/* Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#F6C992]">
              Type of Work
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-[#5484A4]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#ACCOD3] transition-all duration-200"
            >
              <option value="assignment" className="bg-[#30525C]">Assignment</option>
              <option value="report" className="bg-[#30525C]">Report</option>
            </select>
          </div>

          {/* Word Count & Pages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#F6C992]">
                Word Count
              </label>
              <input
                type="number"
                value={wordCount}
                onChange={(e) => {
                  setWordCount(e.target.value);
                  setPages("");
                }}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-[#5484A4]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#ACCOD3] transition-all duration-200"
                placeholder="Enter word count"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#F6C992]">
                Pages
              </label>
              <input
                type="number"
                value={pages}
                onChange={(e) => {
                  setPages(e.target.value);
                  setWordCount("");
                }}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-[#5484A4]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#ACCOD3] transition-all duration-200"
                placeholder="Enter page count"
              />
            </div>
          </div>

          {/* Currency Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#F6C992]">
              Display Price In
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-[#5484A4]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#ACCOD3] transition-all duration-200"
            >
              {Object.keys(exchangeRates).map((cur) => (
                <option key={cur} value={cur} className="bg-[#30525C]">
                  {cur}
                </option>
              ))}
            </select>
          </div>

          {/* Price Display */}
          <div className="bg-gradient-to-r from-[#30525C]/50 to-[#09A1A1]/30 p-6 rounded-xl border border-[#5484A4]/30">
            <div className="text-xl font-semibold text-center text-white">
              {loadingRates ? (
                <div className="animate-pulse">Loading prices...</div>
              ) : (
                <>
                  Total Price:{" "}
                  <span className="text-[#F6C992]">
                    {currency === "MWK"
                      ? `${priceMWK.toLocaleString()} MWK`
                      : `${convertedPrice} ${currency}`}
                  </span>
                </>
              )}
            </div>
            {currency !== "MWK" && !loadingRates && (
              <p className="text-sm mt-3 text-center text-[#ACCOD3]">
                Approximately {priceMWK.toLocaleString()} MWK
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default AssignmentForm;