// Movie service for handling movie data and recommendations
import { API_URL } from '../constants';

class MovieService {
  constructor() {
    this.apiUrl = API_URL;
  }

  // Helper method to make API calls
  async fetchAPI(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  }

  // Helper method for POST requests
  async postAPI(endpoint, body) {
    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('API POST error:', error);
      throw error;
    }
  }

  // Get all movies (with pagination)
  async getAllMovies(limit = 20, offset = 0) {
    try {
      const response = await fetch(`${this.apiUrl}/movies?limit=${limit}&offset=${offset}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        movies: data.success ? data.data : [],
        hasMore: data.hasMore || false,
        limit: data.limit || limit,
        offset: data.offset || offset
      };
    } catch (error) {
      console.error('Error fetching all movies:', error);
      return { movies: [], hasMore: false, limit, offset };
    }
  }

  // Add to watch history
  async addToWatchHistory(userId, movieId) {
    try {
      return await this.postAPI('/watch-history', { userId, movieId });
    } catch (error) {
      console.error('Error adding to watch history:', error);
      throw error;
    }
  }

  // Get user watch history
  async getUserWatchHistory(userId) {
    try {
      return await this.fetchAPI(`/watch-history/user/${userId}`);
    } catch (error) {
      console.error('Error fetching user watch history:', error);
      return [];
    }
  }

  // Get user genre preferences
  async getUserGenrePreferences(userId) {
    try {
      return await this.fetchAPI(`/watch-history/user/${userId}/preferences`);
    } catch (error) {
      console.error('Error fetching user genre preferences:', error);
      return [];
    }
  }

  // Get recommendations for a user
  async getRecommendations(userId, limit = 10) {
    try {
      return await this.fetchAPI(`/recommendations/user/${userId}?limit=${limit}`);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  }

  // Get hot movies
  async getHotMovies(limit = 10) {
    try {
      return await this.fetchAPI(`/movies/hot/list?limit=${limit}`);
    } catch (error) {
      console.error('Error fetching hot movies:', error);
      return [];
    }
  }
}

const movieService = new MovieService();
export default movieService;
