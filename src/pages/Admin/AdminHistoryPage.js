import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import movieService from '../../services/movieService';
import { ROLES, ROUTES, API_URL } from '../../constants';
import '../../styles/Admin.css';

const AdminHistoryPage = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [watchHistory, setWatchHistory] = useState([]);
  const [viewers, setViewers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch all users and filter viewers
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/users`);
        const data = await response.json();
        if (data.success) {
          const viewerUsers = data.data.filter(user => user.role === ROLES.VIEWER);
          setViewers(viewerUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchWatchHistory = async () => {
      if (selectedUserId) {
        setLoading(true);
        try {
          const history = await movieService.getUserWatchHistory(selectedUserId);
          setWatchHistory(history);
        } catch (error) {
          console.error('Error fetching watch history:', error);
          setWatchHistory([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchWatchHistory();
  }, [selectedUserId]);

  return (
    <MainLayout>
      <div className="admin-container">
        <div className="admin-header">
          <h2>User Watch History</h2>
          <div className="admin-nav">
            <Link to={ROUTES.ADMIN_HISTORY} className="nav-link active">
              Watch History
            </Link>
            <Link to={ROUTES.ADMIN_TRENDS} className="nav-link">
              Genre Trends
            </Link>
          </div>
        </div>

        <div className="user-selector">
          <label>Select User:</label>
          <select 
            value={selectedUserId || ''} 
            onChange={(e) => setSelectedUserId(Number(e.target.value))}
          >
            <option value="">-- Choose a user --</option>
            {viewers.map(viewer => (
              <option key={viewer.id} value={viewer.id}>
                {viewer.name || viewer.username}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="loading">Loading...</p>}

        {selectedUserId && !loading && (
          <div className="history-table-container">
            {watchHistory.length === 0 ? (
              <p className="no-data">No watch history for this user</p>
            ) : (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Movie Title</th>
                    <th>Genres</th>
                    <th>Watched At</th>
                  </tr>
                </thead>
                <tbody>
                  {watchHistory.map((item, index) => {
                    const genres = item.genres || [item.genre] || [];
                    return (
                      <tr key={index}>
                        <td>{item.movieTitle || item.movie_title}</td>
                        <td>
                          <div className="genre-badges">
                            {genres.map((genre, idx) => (
                              <span key={idx} className="genre-badge">{genre}</span>
                            ))}
                          </div>
                        </td>
                        <td>{new Date(item.watchedAt || item.watched_at).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminHistoryPage;
