import React, { useState, useEffect, useRef, useCallback } from 'react';
import MainLayout from '../../layouts/MainLayout';
import HotMoviesSlideshow from '../../components/HotMoviesSlideshow';
import MovieDetailModal from '../../components/MovieDetailModal';
import movieService from '../../services/movieService';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Viewer.css';

const ViewerMoviesPage = () => {
  const { currentUser } = useAuth();
  const [movies, setMovies] = useState([]);
  const [hotMovies, setHotMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState(new Set());
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const observerTarget = useRef(null);
  const limit = 20;

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await movieService.getAllMovies(limit, 0);
        setMovies(result.movies);
        setHasMore(result.hasMore);
        setOffset(result.movies.length);

        const hot = await movieService.getHotMovies();
        setHotMovies(hot);

        if (currentUser) {
          const history = await movieService.getUserWatchHistory(currentUser.id);
          setWatchedMovies(new Set(history.map(h => h.movieId || h.movie_id)));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  // Load more movies
  const loadMoreMovies = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const result = await movieService.getAllMovies(limit, offset);
      
      if (result.movies.length > 0) {
        setMovies(prev => [...prev, ...result.movies]);
        setHasMore(result.hasMore);
        setOffset(prev => prev + result.movies.length);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more movies:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreMovies();
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
  }, [loadMoreMovies, hasMore, loading]);

  const handleMovieClick = (movie, e) => {
    e.stopPropagation();
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleMarkAsWatched = async (movieId) => {
    if (currentUser && !watchedMovies.has(movieId)) {
      try {
        await movieService.addToWatchHistory(currentUser.id, movieId);
        setWatchedMovies(prev => new Set([...prev, movieId]));
      } catch (error) {
        console.error('Error adding to watch history:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <MainLayout>
      <div className="viewer-container">
        <HotMoviesSlideshow movies={hotMovies} />

        <h2 className="page-title">All Movies</h2>

        {loading && movies.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Loading movies...</p>
          </div>
        )}

        <div className="movies-grid">
          {movies.map(movie => {
            const isWatched = watchedMovies.has(movie.id);
            return (
              <div 
                key={movie.id} 
                className={`movie-card ${isWatched ? 'watched' : ''}`}
                onClick={(e) => handleMovieClick(movie, e)}
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
                  {isWatched && (
                    <div className="watched-badge">✓ Watched</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Loading indicator and observer target */}
        <div ref={observerTarget} style={{ height: '20px', marginTop: '20px' }}>
          {loading && movies.length > 0 && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p>Loading more movies...</p>
            </div>
          )}
          {!hasMore && movies.length > 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
              <p>No more movies to load</p>
            </div>
          )}
        </div>

        <MovieDetailModal
          movie={selectedMovie}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onMarkAsWatched={handleMarkAsWatched}
          isWatched={selectedMovie ? watchedMovies.has(selectedMovie.id) : false}
        />
      </div>
    </MainLayout>
  );
};

export default ViewerMoviesPage;
