import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHires, updateHire } from "../api";
import { useAuth } from "../context/useAuth";

function MyHires() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState("All");
  const [hires, setHires] = useState([]);

  const load = () => fetchHires().then(setHires).catch(console.error);

  useEffect(() => {
    load();
  }, []);

  const filteredHires = useMemo(
    () => hires.filter((hire) => filterStatus === "All" || hire.status === filterStatus),
    [hires, filterStatus]
  );

  const handleComplete = async (hire) => {
    try {
      await updateHire(hire.id, { status: "Completed", progress: 100 });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRate = async (hire) => {
    const value = Number(window.prompt("Rate from 1 to 5", "5"));
    if (!value || value < 1 || value > 5) return;
    try {
      await updateHire(hire.id, { rating: value });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const statusConfig = {
    All: "bg-gradient-to-r from-gray-500 to-gray-600",
    Active: "bg-gradient-to-r from-blue-500 to-indigo-500",
    Completed: "bg-gradient-to-r from-green-500 to-emerald-500",
    Pending: "bg-gradient-to-r from-orange-500 to-red-500",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 py-12 relative animate-fade-in overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-teal-400/10 blur-3xl animate-pulse-glow z-[-1]"></div>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent drop-shadow-2xl mb-6">
            {user?.role === "professional" ? "🎯 Assigned Work" : "💼 My Hires"}
          </h1>
          <p className="text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed animate-fade-in delay-300">
            Track project status, monitor progress, and manage your hires with ease
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-16">
          {["All", "Active", "Completed", "Pending"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-8 py-4 rounded-2xl font-bold text-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 backdrop-blur-sm border-2 ${statusConfig[status] || "bg-gray-400"} text-white min-w-[140px] focus:outline-none focus:ring-4 focus:ring-white/50 animate-bounce-light ${
                filterStatus === status ? "ring-4 ring-white/50 scale-105 shadow-glow" : "hover:animate-pulse-glow"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {filteredHires.length > 0 ? (
          <div className="space-y-8">
            {filteredHires.map((hire) => (
              <div key={hire.id} className="card backdrop-blur-lg bg-white/70 shadow-2xl rounded-3xl border border-white/40 p-8 hover:shadow-glow hover:scale-[1.02] transition-all duration-500 group">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 items-center">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800 group-hover:text-green-700 mb-2 animate-slide-up">{hire.serviceTitle}</h3>
                    <p className="text-xl text-gray-600 font-semibold">{hire.professionalName}</p>
                    {hire.notes && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-semibold text-blue-800 mb-1">Project Notes:</p>
                        <p className="text-sm text-blue-700">{hire.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-lg text-gray-500 mb-2">Status</p>
                    <span className={`inline-block px-6 py-3 rounded-full font-bold text-xl capitalize shadow-lg ${
                      hire.status === "Completed" ? "bg-green-400 text-white" : hire.status === "Active" ? "bg-blue-400 text-white" : "bg-orange-400 text-white"
                    } animate-pulse-glow`}>
                      {hire.status}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-lg text-gray-500 mb-2">Progress</p>
                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-inner animate-pulse-glow group-hover:animate-spin-slow">
                      <span className="text-2xl font-bold text-gray-700">{hire.progress}%</span>
                    </div>
                  </div>
                  <div className="text-center lg:text-right">
                    <p className="text-lg text-gray-500 mb-2">Amount</p>
                    <p className="text-3xl font-bold text-emerald-600 drop-shadow-lg animate-slide-up">{hire.amount}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end pt-4 sm:pt-0">
                    <button 
                      onClick={() => navigate("/messages")} 
                      className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-bold hover:shadow-glow hover:scale-105 shadow-lg transition-all text-lg"
                    >
                      💬 Message
                    </button>
                    {user?.role !== "professional" && hire.status !== "Completed" && (
                      <button 
                        onClick={() => handleComplete(hire)} 
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all text-lg animate-pulse-glow"
                      >
                        ✅ Complete
                      </button>
                    )}
                    {user?.role !== "professional" && hire.status === "Completed" && !hire.rating && (
                      <button 
                        onClick={() => handleRate(hire)} 
                        className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold shadow-lg hover:shadow-glow hover:scale-105 transition-all text-lg"
                      >
                        ⭐ Rate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card backdrop-blur-xl bg-white/80 shadow-2xl text-center py-32 rounded-3xl animate-fade-in">
            <div className="animate-pulse-glow">
              <h3 className="text-5xl font-bold text-gray-500 mb-8 bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text">No Records Found</h3>
              <p className="text-2xl text-gray-500 mb-12">Your projects list is empty</p>
              <button 
                onClick={() => navigate("/professionals")} 
                className="px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl text-2xl font-bold shadow-2xl hover:shadow-glow hover:scale-110 transition-all duration-300 animate-bounce-light"
              >
                Browse Professionals 👥
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyHires;
