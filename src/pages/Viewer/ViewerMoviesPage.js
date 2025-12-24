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
  const [userRatings, setUserRatings] = useState(new Map()); // Map<movieId, rating>
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const observerTarget = useRef(null);
  const limit = 20;
  const isInitialMount = useRef(true);

  // Fetch initial movies data (on mount and when user changes)
  useEffect(() => {
    const fetchInitialData = async () => {
      // Only fetch once on initial mount, or when user changes
      if (!isInitialMount.current && !currentUser) return;
      
      try {
        setLoading(true);
        const userId = currentUser?.id || null;
        const result = await movieService.getAllMovies(limit, 0, userId);
        setMovies(result.movies);
        setHasMore(result.hasMore);
        setOffset(result.movies.length);

        // Update watchedMovies from API response
        const watchedSet = new Set();
        result.movies.forEach(movie => {
          if (movie.isWatched) {
            watchedSet.add(movie.id);
          }
        });
        setWatchedMovies(watchedSet);

        // Only fetch hot movies on initial mount
        if (isInitialMount.current) {
        const hot = await movieService.getHotMovies();
        setHotMovies(hot);
          isInitialMount.current = false;
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [currentUser?.id]); // Re-fetch when user ID changes

  // Fetch watch history when user changes
  useEffect(() => {
    const fetchWatchHistory = async () => {
      if (currentUser) {
        try {
          const history = await movieService.getUserWatchHistory(currentUser.id);
          setWatchedMovies(new Set(history.map(h => h.movieId || h.movie_id)));
        } catch (error) {
          console.error('Error fetching watch history:', error);
        }
      } else {
        setWatchedMovies(new Set());
      }
    };
    fetchWatchHistory();
  }, [currentUser]);

  // Load more movies
  const loadMoreMovies = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      // Use current offset from state to ensure we get the next batch
      const currentOffset = offset;
      const userId = currentUser?.id || null;
      const result = await movieService.getAllMovies(limit, currentOffset, userId);
      
      if (result.movies.length > 0) {
        // Append new movies to existing list
        setMovies(prev => [...prev, ...result.movies]);
        setHasMore(result.hasMore);
        // Update offset for next load
        setOffset(currentOffset + result.movies.length);
        
        // Update watchedMovies from new movies
        setWatchedMovies(prev => {
          const newSet = new Set(prev);
          result.movies.forEach(movie => {
            if (movie.isWatched) {
              newSet.add(movie.id);
            }
          });
          return newSet;
        });
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more movies:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset, limit, currentUser]);

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

  const handleMovieClick = async (movie, e) => {
    e.stopPropagation();
    setSelectedMovie(movie);
    setIsModalOpen(true);
    
    // Fetch user rating for this movie
    if (currentUser) {
      try {
        const rating = await movieService.getUserRating(currentUser.id, movie.id);
        if (rating !== null) {
          setUserRatings(prev => new Map(prev).set(movie.id, rating));
        }
      } catch (error) {
        console.error('Error fetching user rating:', error);
      }
    }
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

  const handleRateMovie = async (rating) => {
    if (!currentUser || !selectedMovie) return;
    
    try {
      await movieService.addOrUpdateRating(currentUser.id, selectedMovie.id, rating);
      setUserRatings(prev => new Map(prev).set(selectedMovie.id, rating));
      alert('Đã đánh giá phim thành công');
    } catch (error) {
      console.error('Error rating movie:', error);
      alert('Có lỗi xảy ra khi đánh giá phim. Vui lòng thử lại.');
    }
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
                    ⭐ {movie.rating || 0}/5
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
          userRating={selectedMovie ? userRatings.get(selectedMovie.id) : null}
          onRateMovie={handleRateMovie}
          currentUser={currentUser}
        />
      </div>
    </MainLayout>
  );
};

export default ViewerMoviesPage;
