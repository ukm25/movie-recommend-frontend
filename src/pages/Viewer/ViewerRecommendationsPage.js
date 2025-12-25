import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const observerTarget = useRef(null);
  const scrollPositionRef = useRef(null);
  const shouldRestoreScroll = useRef(false);
  const limit = 20;

  // Fetch initial recommendations data (on mount and when user changes)
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!currentUser) {
        setLoading(false);
        setRecommendations([]);
        return;
      }
      
      try {
        setLoading(true);
        const result = await movieService.getRecommendations(currentUser.id, limit, 0);
        setRecommendations(result.movies);
        setHasMore(result.hasMore);
        setOffset(result.movies.length);
      } catch (error) {
        console.error('Error fetching initial recommendations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [currentUser?.id]); // Re-fetch when user ID changes

  // Load more recommendations
  const loadMoreRecommendations = useCallback(async () => {
    if (loading || !hasMore || !currentUser) return;

    try {
      setLoading(true);
      // Save current scroll position before updating state (only when appending, not initial load)
      if (recommendations.length > 0) {
        scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop;
        shouldRestoreScroll.current = true;
      }
      
      // Use current offset from state to ensure we get the next batch
      const currentOffset = offset;
      const result = await movieService.getRecommendations(currentUser.id, limit, currentOffset);
      
      if (result.movies.length > 0) {
        // Append new recommendations to existing list
        setRecommendations(prev => [...prev, ...result.movies]);
        setHasMore(result.hasMore);
        // Update offset for next load
        setOffset(currentOffset + result.movies.length);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more recommendations:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset, limit, currentUser, recommendations.length]);

  // Restore scroll position after recommendations are appended
  useEffect(() => {
    if (shouldRestoreScroll.current && scrollPositionRef.current !== null && recommendations.length > 0) {
      // Use setTimeout to ensure DOM has updated
      const timer = setTimeout(() => {
        window.scrollTo(0, scrollPositionRef.current);
        scrollPositionRef.current = null;
        shouldRestoreScroll.current = false;
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [recommendations.length]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreRecommendations();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMoreRecommendations, hasMore, loading]);

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

        {loading && recommendations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Loading recommendations...</p>
          </div>
        )}

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
                  ⭐ {movie.rating || 0}/5
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading indicator and observer target */}
        <div ref={observerTarget} style={{ height: '20px', marginTop: '20px' }}>
          {loading && recommendations.length > 0 && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p>Loading more recommendations...</p>
            </div>
          )}
          {!hasMore && recommendations.length > 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
              <p>No more recommendations to load</p>
            </div>
          )}
        </div>

        {recommendations.length === 0 && !loading && (
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

