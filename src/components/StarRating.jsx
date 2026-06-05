import React, { useState } from 'react';

function StarRating({ rating = 0, totalRatings = 0, productId, onRate, readonly = false }) {
  const [hovered, setHovered] = useState(0);
  const [userRating, setUserRating] = useState(0);

  const handleRate = async (star) => {
    if (readonly) return;
    setUserRating(star);
    if (onRate) onRate(star);
  };

  const displayRating = hovered || userRating || rating;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRate(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={`text-2xl transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <span className={star <= displayRating ? 'text-yellow-400' : 'text-gray-300'}>
              ★
            </span>
          </button>
        ))}
      </div>
      <span className="text-sm text-gray-500">
        {rating > 0 ? `${rating} (${totalRatings} ${totalRatings === 1 ? 'review' : 'reviews'})` : 'No ratings yet'}
      </span>
    </div>
  );
}

export default StarRating;