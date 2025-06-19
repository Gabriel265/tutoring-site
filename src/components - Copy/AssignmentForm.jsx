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
    <section id="assignments" className="bg-slate-950 text-white py-12 px-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-purple-300">
        Calculate Academic Writing Pricing
      </h2>

      <form className="max-w-xl mx-auto bg-slate-800 rounded-xl shadow-xl p-6 space-y-6">
        {/* Type */}
        <div>
          <label className="block text-sm mb-1 text-slate-300">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white"
          >
            <option value="assignment">Assignment</option>
            <option value="report">Report</option>
          </select>
        </div>

        {/* Word Count & Pages */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full">
            <label className="block text-sm text-slate-300 mb-1">
              Word Count
            </label>
            <input
              type="number"
              value={wordCount}
              onChange={(e) => {
                setWordCount(e.target.value);
                setPages("");
              }}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm text-slate-300 mb-1">Pages</label>
            <input
              type="number"
              value={pages}
              onChange={(e) => {
                setPages(e.target.value);
                setWordCount("");
              }}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white"
            />
          </div>
        </div>

        {/* Currency Selector */}
        <div>
          <label className="block text-sm text-slate-300 mb-1">
            Display Price In
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white"
          >
            {Object.keys(exchangeRates).map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </div>

        {/* Price Display */}
        <div className="bg-slate-700 p-4 rounded-lg text-slate-100">
          <div className="text-lg font-semibold text-center">
            Total Price:{" "}
            <span className="text-green-400">
              {currency === "MWK"
                ? `${priceMWK.toLocaleString()} MWK`
                : `${convertedPrice} ${currency}`}
            </span>
          </div>
          {currency !== "MWK" && (
            <p className="text-xs mt-2 text-slate-400 text-center">
              ~ {priceMWK.toLocaleString()} MWK
            </p>
          )}
        </div>
      </form>
    </section>
  );
};

export default AssignmentForm;
