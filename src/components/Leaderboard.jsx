import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../firebase/firebase.js';

const Leaderboard = ({ onClose, currentCategory = null }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory || 'all');

  const categories = [
    { key: 'all', label: 'All Categories' },
    { key: 'cricket', label: 'Cricket' },
    { key: 'football', label: 'American Football' },
    { key: 'soccer', label: 'Soccer' },
    { key: 'formula-1', label: 'Formula 1' },
    { key: 'tennis', label: 'Tennis' }
  ];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await getLeaderboard(selectedCategory === 'all' ? null : selectedCategory);
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedCategory]);

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    fontFamily: "'Silkscreen', monospace"
  };

  const modalStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    border: '4px solid #00ffff',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
    color: '#ffffff',
    position: 'relative'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px',
    borderBottom: '3px solid #00ffff',
    paddingBottom: '20px'
  };

  const titleStyle = {
    fontSize: '2rem',
    color: '#00ffff',
    marginBottom: '20px',
    textShadow: '2px 2px 0px #000000'
  };

  const categorySelectStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#ffffff',
    border: '2px solid #00ffff',
    borderRadius: '8px',
    padding: '10px',
    fontSize: '1rem',
    fontFamily: "'Silkscreen', monospace",
    outline: 'none'
  };

  const leaderboardStyle = {
    marginBottom: '30px'
  };

  const entryStyle = (index) => ({
    backgroundColor: index < 3 ? 'rgba(255, 215, 0, 0.2)' : 'rgba(0, 255, 255, 0.1)',
    border: index < 3 ? '2px solid #ffd700' : '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    padding: '15px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  });

  const rankStyle = (index) => ({
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: index < 3 ? '#ffd700' : '#00ffff',
    minWidth: '40px'
  });

  const scoreStyle = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#fef08a'
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    fontFamily: "'Silkscreen', monospace"
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div style={containerStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={onClose}>×</button>
        
        <div style={headerStyle}>
          <div style={titleStyle}>🏆 LEADERBOARD 🏆</div>
          
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={categorySelectStyle}
          >
            {categories.map(cat => (
              <option key={cat.key} value={cat.key}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div style={leaderboardStyle}>
          {loading ? (
            <div style={{ textAlign: 'center', fontSize: '1.2rem', color: '#00ffff' }}>
              Loading leaderboard...
            </div>
          ) : leaderboard.length === 0 ? (
            <div style={{ textAlign: 'center', fontSize: '1.1rem', color: '#ffffff' }}>
              No scores available yet. Be the first to play!
            </div>
          ) : (
            leaderboard.map((entry, index) => (
              <div key={entry.id} style={entryStyle(index)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={rankStyle(index)}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                  <div>
                    <div style={{ fontSize: '1rem', color: '#ffffff' }}>
                      {entry.category ? entry.category.toUpperCase() : 'Unknown'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#cccccc' }}>
                      {formatDate(entry.timestamp)} • {entry.correct || 0}✓ {entry.incorrect || 0}✗
                    </div>
                  </div>
                </div>
                <div style={scoreStyle}>
                  {(entry.score || 0).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
