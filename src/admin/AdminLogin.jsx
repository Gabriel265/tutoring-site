// src/admin/AdminLogin.jsx
import React, { useState } from "react";
import { supabase } from "../data/supabaseClient";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      localStorage.setItem("adminSession", "true");
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-400 rotate-45 opacity-30"></div>
        <div className="absolute top-32 right-32 w-3 h-3 bg-white rotate-45 opacity-20"></div>
        <div className="absolute bottom-40 left-40 w-2 h-2 bg-blue-300 rotate-45 opacity-25"></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-slate-800 rounded-full opacity-30"></div>
        <div className="absolute bottom-1/3 left-1/6 w-24 h-24 bg-slate-700 rounded-full opacity-40"></div>
        <div className="absolute top-1/2 right-1/6 w-16 h-40 bg-slate-800 rounded-full opacity-30 rotate-45"></div>
        <div className="absolute bottom-1/4 right-1/3 w-20 h-60 bg-slate-700 rounded-full opacity-20 -rotate-12"></div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 bg-slate-900 bg-opacity-80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-96 border border-slate-800">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Kayce Tutoring</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="hello@samuelmay.co"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-400 px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors duration-200 focus:outline-none"
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-slate-900 font-semibold py-3 px-4 rounded-lg hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            LOG IN 🔓
          </button>

          <div className="text-center">
            <a href="#" className="text-slate-400 text-sm hover:text-blue-400 transition-colors duration-200">
              FORGOT YOUR PASSWORD?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;