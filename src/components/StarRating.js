import React, { useState } from 'react';
import '../styles/StarRating.css';

const StarRating = ({ value, onChange, readOnly = false, maxStars = 5 }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (rating) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating) => {
    if (!readOnly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(0);
    }
  };

  const displayValue = hoverValue || value || 0;

  return (
    <div className="star-rating">
      <div className="star-rating-label">Your Rating:</div>
      <div className="stars-container">
        {Array.from({ length: maxStars }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayValue;
          
          return (
            <span
              key={starValue}
              className={`star ${isFilled ? 'filled' : ''} ${readOnly ? 'readonly' : 'clickable'}`}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
            >
              ⭐
            </span>
          );
        })}
      </div>
      {value && (
        <span className="rating-value">{value}/5</span>
      )}
    </div>
  );
};

export default StarRating;

