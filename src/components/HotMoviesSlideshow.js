import React, { useState, useEffect } from 'react';
import '../styles/HotMoviesSlideshow.css';

const HotMoviesSlideshow = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!movies || movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === movies.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [movies]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="slideshow-container">
      <div className="slideshow-header">
        <h3 className="slideshow-title">🔥 Hot Movies</h3>
        <p className="slideshow-subtitle">High ratings & Latest releases</p>
      </div>

      <div className="slideshow-wrapper">
        <button className="slideshow-nav prev" onClick={goToPrevious}>
          ‹
        </button>

        <div className="slideshow-content">
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className={`slide ${index === currentIndex ? 'active' : ''}`}
            >
              <div className="slide-info">
                <h2 className="slide-movie-title">{movie.title}</h2>
                <div className="slide-movie-details">
                  <span className="slide-year">{movie.year}</span>
                  <span className="slide-rating">⭐ {movie.rating}/10</span>
                </div>
                <div className="slide-genres">
                  {movie.genres.map((genre, idx) => (
                    <span key={idx} className="slide-genre">{genre}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="slideshow-nav next" onClick={goToNext}>
          ›
        </button>
      </div>

      <div className="slideshow-dots">
        {movies.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HotMoviesSlideshow;

