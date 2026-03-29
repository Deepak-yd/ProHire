import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HireModal from "./HireModal";

function ProfessionalCard({ pro }) {
  const navigate = useNavigate();
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < Math.round(Number(rating || 0)) ? "text-yellow-400 text-lg" : "text-gray-300 text-lg"}>
          *
        </span>
      ))}
    </div>
  );

  return (
    <>
      <div className="group card overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300">
        <div className="relative mb-4 -mx-6 -mt-6 h-24 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400" />

        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">{pro.name}</h3>
          <p className="text-purple-600 font-semibold text-sm">{pro.title}</p>

          <div className="flex items-center justify-between">
            {renderStars(pro.rating)}
            <span className="text-xs text-gray-500 font-semibold">{pro.rating || 0} ({pro.reviewCount || 0})</span>
          </div>

          <p className="text-gray-500 text-sm">{pro.location}</p>
          <p className="text-xs text-gray-500">Category: {pro.category}</p>

          <div className="pt-2 border-t border-gray-200">
            <p className="text-2xl font-bold text-purple-600">{pro.rate}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button onClick={() => navigate(`/profile?professionalId=${pro.id}`)} className="w-full btn-secondary text-center">
            View Profile
          </button>
          <button onClick={() => setIsHireModalOpen(true)} className="w-full btn-primary text-center bg-gradient-to-r from-green-500 to-emerald-600 border-0">
            Hire Now
          </button>
        </div>
      </div>

      <HireModal professional={pro} isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} />
    </>
  );
}

export default ProfessionalCard;
