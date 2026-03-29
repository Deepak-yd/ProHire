import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDashboardMetrics, fetchHires } from "../api";
import { useAuth } from "../context/useAuth";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [hires, setHires] = useState([]);

  useEffect(() => {
    fetchDashboardMetrics().then(setMetrics).catch(console.error);
    fetchHires().then(setHires).catch(() => setHires([]));
  }, []);

  const cards = useMemo(() => {
    if (!metrics || !user) return [];
    if (user.role === "professional") {
      return [
        { label: "Active Projects", value: metrics.activeProjects },
        { label: "Completed", value: metrics.completedProjects },
        { label: "Services", value: metrics.services },
        { label: "Earnings", value: `$${metrics.earnings}` },
      ];
    }
    if (user.role === "admin") {
      return [
        { label: "Users", value: metrics.totalUsers },
        { label: "Professionals", value: metrics.totalProfessionals },
        { label: "Services", value: metrics.totalServices },
        { label: "Revenue", value: `$${metrics.totalRevenue}` },
      ];
    }
    return [
      { label: "Active Hires", value: metrics.activeHires },
      { label: "Completed", value: metrics.completedHires },
      { label: "Total Spent", value: `$${metrics.totalSpent}` },
      { label: "Messages", value: metrics.messages },
    ];
  }, [metrics, user]);

  const roleActions = useMemo(() => {
    if (user?.role === "admin") {
      return [
        { label: "Open Admin Panel", to: "/admin" },
        { label: "Manage Profile", to: "/profile" },
        { label: "Connections", to: "/connections" },
      ];
    }
    if (user?.role === "professional") {
      return [
        { label: "Manage Services", to: "/profile" },
        { label: "View Messages", to: "/messages" },
        { label: "Connections", to: "/connections" },
      ];
    }
    return [
      { label: "Browse Professionals", to: "/professionals" },
      { label: "View Hires", to: "/hires" },
      { label: "Connections", to: "/connections" },
    ];
  }, [user?.role]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 p-8 backdrop-blur-sm relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 animate-fade-in">Dashboard</h1>
          <p className="text-gray-700 mt-2">Role: {user?.role}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card) => (
            <div key={card.label} className="card shadow-card-hover hover:animate-glow hover:shadow-glow">
              <p className="text-sm text-gray-700">{card.label}</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {roleActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.to)}
              className="card text-left hover:shadow-xl transition-all duration-350 hover:animate-bounce-light hover:shadow-glow"
            >
              <p className="text-lg font-semibold text-gray-800">{action.label}</p>
            </button>
          ))}
        </div>

        <div className="card shadow-card-hover">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          {hires.length === 0 ? (
            <p className="text-gray-700">No activity yet.</p>
          ) : (
            <div className="space-y-3">
              {hires.slice(0, 5).map((hire) => (
                <div key={hire.id} className="p-4 rounded-lg border flex justify-between items-center hover:shadow-md transition hover:animate-pulse-glow">
                  <div>
                    <p className="font-semibold text-gray-800">{hire.serviceTitle}</p>
                    <p className="text-sm text-gray-700">{hire.professionalName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-700">{hire.status}</p>
                    <p className="font-semibold text-purple-700">{hire.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
