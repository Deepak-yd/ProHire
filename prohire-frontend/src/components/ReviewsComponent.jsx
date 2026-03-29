function ReviewsComponent({ reviews }) {
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => (
          <div
            key={review.id}
            className="card border-l-4 border-l-purple-500 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-gray-800">{review.user}</h4>
                <p className="text-sm text-gray-700">Verified Client</p>
              </div>
              {renderStars(parseInt(review.rating))}
            </div>
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            <div className="mt-4 flex gap-2">
              <button className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition">
                👍 Helpful
              </button>
              <button className="text-sm px-3 py-1 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition">
                Report
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No reviews yet</p>
        </div>
      )}
    </div>
  );
}

export default ReviewsComponent;
