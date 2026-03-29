import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProfessionalCard from "../components/ProfessionalCard";
import { fetchProfessionals } from "../api";

function Professionals() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [professionals, setProfessionals] = useState([]);

  useEffect(() => {
    fetchProfessionals().then(setProfessionals).catch(console.error);
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(professionals.map((pro) => pro.category).filter(Boolean))],
    [professionals]
  );

  const filteredProfessionals = professionals
    .filter((pro) => {
      const text = `${pro.name} ${pro.title} ${pro.category}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All" || pro.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return Number(a.rate.replace(/[^0-9]/g, "")) - Number(b.rate.replace(/[^0-9]/g, ""));
      if (sortBy === "price-high") return Number(b.rate.replace(/[^0-9]/g, "")) - Number(a.rate.replace(/[^0-9]/g, ""));
      if (sortBy === "rating") return Number(b.rating || 0) - Number(a.rating || 0);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-100 py-8 sm:py-10 relative animate-fade-in overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-orange-400/10 blur-xl animate-pulse-glow z-[-1]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="mb-16 text-center animate-slide-up">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent drop-shadow-2xl mb-6">
            Find Top Professionals
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto animate-fade-in delay-200">
            Discover {filteredProfessionals.length} talented professionals ready to bring your vision to life
          </p>
        </div>

        <div className="mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Search by name, title, or category..."
              className="w-full px-8 sm:px-12 py-6 sm:py-8 text-lg border-2 border-purple-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-purple-400/50 backdrop-blur-xl shadow-2xl hover:shadow-glow transition-all placeholder-gray-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">🔍</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-8">
            <div className="card backdrop-blur-lg bg-white/60 shadow-2xl rounded-3xl p-8 border border-white/40 hover:shadow-glow transition-all">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 animate-slide-up">⚙️ Filters</h3>

              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-700 mb-4">Category</label>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-6 py-4 rounded-2xl transition-all shadow-md hover:shadow-xl hover:scale-102 backdrop-blur ${
                      selectedCategory === cat 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-glow animate-pulse-glow border-2 border-purple-600" 
                        : "bg-white/70 text-gray-800 hover:bg-purple-50 border border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <label className="block text-lg font-semibold text-gray-700 mb-4">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl text-lg backdrop-blur hover:border-purple-300 focus:ring-4 focus:ring-purple-400/50 focus:outline-none shadow-lg transition-all"
                >
                  <option value="recent">Most Recent</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {filteredProfessionals.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProfessionals.map((pro) => (
                  <div key={pro.id} className="group">
                    <ProfessionalCard pro={pro} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center py-24 backdrop-blur-lg bg-white/70 shadow-2xl rounded-3xl animate-fade-in">
                <div className="animate-pulse-glow">
                  <h3 className="text-4xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text">No Professionals Found</h3>
                  <p className="text-2xl text-gray-600 mb-8">Try adjusting your search or filters</p>
                  <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl text-xl font-bold shadow-glow hover:shadow-2xl hover:scale-105 transition-all cursor-pointer">
                    🔄 Clear Filters
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Professionals;
