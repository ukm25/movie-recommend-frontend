import React from 'react';
import '../styles/MovieDetailModal.css';

const MovieDetailModal = ({ movie, isOpen, onClose, onMarkAsWatched, isWatched }) => {
  if (!isOpen || !movie) return null;

  const handleBackdropClick = (e) => {
    if (e.target.className === 'modal-backdrop') {
      onClose();
    }
  };

  const handleMarkAsWatched = () => {
    if (onMarkAsWatched && !isWatched) {
      onMarkAsWatched(movie.id);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <h2 className="modal-title">{movie.title}</h2>
          <div className="modal-meta">
            <span className="modal-year">{movie.year}</span>
            <span className="modal-rating">⭐ {movie.rating}/10</span>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-genres">
            {(movie.genres || []).map((genre, index) => (
              <span key={index} className="modal-genre-badge">{genre}</span>
            ))}
          </div>

          <div className="modal-description">
            <h3>Description</h3>
            <p>
              {movie.description || `${movie.title} is a critically acclaimed ${(movie.genres && movie.genres[0]) ? movie.genres[0].toLowerCase() : 'film'} film released in ${movie.year}. With an impressive rating of ${movie.rating || 0}/10, this movie has captivated audiences worldwide with its compelling storytelling and outstanding performances.`}
            </p>
          </div>

          <div className="modal-stats">
            <div className="stat-item">
              <span className="stat-label">Release Year</span>
              <span className="stat-value">{movie.year}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Rating</span>
              <span className="stat-value">{movie.rating}/10</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Genres</span>
              <span className="stat-value">{(movie.genres || []).length}</span>
            </div>
          </div>

          {isWatched !== undefined && (
            <div className="modal-actions">
              {isWatched ? (
                <div className="watched-indicator">
                  <span className="checkmark">✓</span> Already Watched
                </div>
              ) : (
                <button className="btn-watch" onClick={handleMarkAsWatched}>
                  Mark as Watched
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;

