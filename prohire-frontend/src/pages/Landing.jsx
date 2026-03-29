import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/useAuth";

function Landing() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { token } = useAuth();

  const toProtected = (path) => {
    navigate(token ? path : "/login");
  };

  const handleSearch = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (search.trim()) {
      navigate(`/professionals?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center min-h-[600px]">
          <div className="animate-slide-up">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-purple-500 bg-opacity-20 text-purple-300 rounded-full text-sm font-semibold">
                Your Professional Hub
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Find and Hire the
              <span className="text-gradient ml-2 sm:ml-3">Right Professional</span>
            </h1>

            <p className="text-xl text-primary-200 mb-8 leading-relaxed">
              Start from home, then sign in to access professionals, services, hires, and messaging.
            </p>

            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-lg shadow-2xl">
                <input
                  type="text"
                  placeholder="Search by skill, service, or professional..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 border-0 focus:outline-none focus:ring-0 px-4 py-3 text-gray-800"
                />
                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 sm:px-8 py-3 rounded-lg"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => toProtected("/professionals")}
                className="btn-primary text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600"
              >
                Find Professionals
              </button>

              <button
                onClick={() => navigate(token ? "/dashboard" : "/register")}
                className="btn-secondary text-lg px-8 py-4 border-2 border-purple-400 text-white hover:bg-purple-600 transition-all"
              >
                {token ? "Open Dashboard" : "Register"}
              </button>
            </div>
          </div>

          <div className="relative h-96 md:h-full flex items-center justify-center animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl opacity-20 blur-3xl"></div>
            <div className="card-elevated w-full h-96 flex flex-col items-center justify-center relative z-10">
              <p className="text-2xl font-bold text-purple-600 mb-2">Role Based Access</p>
              <p className="text-primary-300 text-center px-8">
                Admin, Professional, and User roles see different interfaces and only their permitted content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
