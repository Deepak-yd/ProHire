function Categories() {

  const categories = [
    { id: 1, name: "Web Development", desc: "Frontend and backend developers" },
    { id: 2, name: "Design", desc: "UI/UX and graphic designers" },
    { id: 3, name: "Marketing", desc: "Digital marketing experts" },
    { id: 4, name: "Writing", desc: "Content and copy writers" }
  ];

  return (
    <section className="bg-white py-16">
      
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-3xl font-bold text-center mb-10">
          Popular Categories
        </h2>

        <div className="grid md:grid-cols-4 gap-6">

          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-6 border rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold">
                {cat.name}
              </h3>

              <p className="text-gray-600 mt-2">
                {cat.desc}
              </p>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default Categories;
