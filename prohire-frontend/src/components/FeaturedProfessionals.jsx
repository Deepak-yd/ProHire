import { useState, useEffect } from "react";
import { fetchProfessionals } from "../api";

function FeaturedProfessionals() {
  const [professionals, setProfessionals] = useState([]);

  useEffect(() => {
    fetchProfessionals()
      .then((data) => setProfessionals(data.slice(0, 3)))
      .catch(console.error);
  }, []);

  return (
    <section className="bg-gray-50 py-16">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-3xl font-bold text-center mb-10">
          Featured Professionals
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {professionals.map((pro) => (
            <div
              key={pro.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            >

              <div className="h-20 w-20 bg-blue-200 rounded-full mb-4"></div>

              <h3 className="text-xl font-semibold">
                {pro.name}
              </h3>

              <p className="text-gray-600">
                {pro.title}
              </p>

              <p className="mt-2 font-semibold text-blue-600">
                {pro.rate}
              </p>

              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                View Profile
              </button>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default FeaturedProfessionals;
