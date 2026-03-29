import { useEffect, useMemo, useState } from "react";
import { createHire, fetchServices } from "../api";

function HireModal({ professional, isOpen, onClose }) {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!isOpen || !professional?.id) return;
    fetchServices(professional.id)
      .then((list) => {
        setServices(list);
        setSelectedServiceId(list[0]?.id || "");
      })
      .catch(() => {
        setServices([]);
        setSelectedServiceId("");
      });
  }, [isOpen, professional?.id]);

  const selected = useMemo(
    () => services.find((s) => s.id === selectedServiceId) || null,
    [services, selectedServiceId]
  );

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!selectedServiceId) {
      alert("No service selected");
      return;
    }
    try {
      await createHire({ serviceId: selectedServiceId, notes });
      alert("Hire created successfully");
      onClose();
    } catch (err) {
      alert(err.message || "Could not create hire");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Hire {professional.name}</h2>
            <button onClick={onClose} className="text-white text-2xl">X</button>
          </div>
          <p className="text-purple-100 mt-2">{professional.title}</p>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Service</label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title} - {service.priceLabel}
                </option>
              ))}
            </select>
          </div>

          {selected && (
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
              <p className="font-semibold text-gray-800">{selected.title}</p>
              <p className="text-gray-600 text-sm mt-1">{selected.description}</p>
              <p className="text-purple-700 font-bold mt-2">{selected.priceLabel}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Project Note</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional details about your requirement"
              className="w-full h-28 p-4 border-2 border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="px-8 py-6 bg-gray-50 border-t flex gap-4 rounded-b-lg">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleConfirm} className="btn-primary flex-1 bg-gradient-to-r from-green-500 to-emerald-600 border-0">
            Confirm Hire
          </button>
        </div>
      </div>
    </div>
  );
}

export default HireModal;
