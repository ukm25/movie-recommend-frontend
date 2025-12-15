import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import MovieDetailModal from '../../components/MovieDetailModal';
import movieService from '../../services/movieService';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Viewer.css';

const ViewerRecommendationsPage = () => {
  const { currentUser } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (currentUser) {
        try {
          const recs = await movieService.getRecommendations(currentUser.id);
          setRecommendations(recs);
        } catch (error) {
          console.error('Error fetching recommendations:', error);
          setRecommendations([]);
        }
      }
    };
    fetchRecommendations();
  }, [currentUser]);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <MainLayout>
      <div className="viewer-container">
        <h2 className="page-title">Recommended for You</h2>

        <div className="movies-grid">
          {recommendations.map(movie => (
            <div 
              key={movie.id} 
              className="movie-card"
              onClick={() => handleMovieClick(movie)}
            >
              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-genres">
                  {(movie.genres || []).map((genre, index) => (
                    <span key={index} className="movie-genre">{genre}</span>
                  ))}
                </div>
                <div className="movie-year">{movie.year}</div>
                <div className="movie-rating">
                  ⭐ {movie.rating || 0}/10
                </div>
              </div>
            </div>
          ))}
        </div>

        {recommendations.length === 0 && (
          <p className="no-data">
            No recommendations yet. Start watching movies to get personalized recommendations!
          </p>
        )}

        <MovieDetailModal
          movie={selectedMovie}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </MainLayout>
  );
};

export default ViewerRecommendationsPage;

