import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import movieService from '../../services/movieService';
import { ROLES, ROUTES, API_URL } from '../../constants';
import '../../styles/Admin.css';

const AdminTrendsPage = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [genrePreferences, setGenrePreferences] = useState([]);
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
    const fetchGenrePreferences = async () => {
      if (selectedUserId) {
        setLoading(true);
        try {
          const preferences = await movieService.getUserGenrePreferences(selectedUserId);
          setGenrePreferences(preferences);
        } catch (error) {
          console.error('Error fetching genre preferences:', error);
          setGenrePreferences([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchGenrePreferences();
  }, [selectedUserId]);

  const getBarWidth = (count) => {
    if (genrePreferences.length === 0) return 0;
    const maxCount = Math.max(...genrePreferences.map(g => g.count));
    return (count / maxCount) * 100;
  };

  return (
    <MainLayout>
      <div className="admin-container">
        <div className="admin-header">
          <h2>Genre Trends</h2>
          <div className="admin-nav">
            <Link to={ROUTES.ADMIN_HISTORY} className="nav-link">
              Watch History
            </Link>
            <Link to={ROUTES.ADMIN_TRENDS} className="nav-link active">
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
          <div className="trends-container">
            {genrePreferences.length === 0 ? (
              <p className="no-data">No viewing data for this user</p>
            ) : (
              <div className="genre-chart">
                {genrePreferences.map((item, index) => (
                  <div key={index} className="genre-bar-container">
                    <div className="genre-label">
                      <span className="genre-name">{item.genre}</span>
                      <span className="genre-count">{item.count} movies</span>
                    </div>
                    <div className="genre-bar-wrapper">
                      <div 
                        className="genre-bar"
                        style={{ width: `${getBarWidth(item.count)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminTrendsPage;
