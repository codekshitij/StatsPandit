import React, { useState } from "react";
import Leaderboard from './Leaderboard.jsx';
import AuthModal from './auth/AuthModal.jsx';
import UserProfile from './auth/UserProfile.jsx';

const localQuizData = {
  cricket: { name: "Cricket", icon: "🏏" },
  football: { name: "Football (US)", icon: "🏈" },
  soccer: { name: "Soccer", icon: "⚽" },
  formula1: { name: "Formula 1", icon: "🏎️" },
  tennis: { name: "Tennis", icon: "🎾" },
};

const CategorySelection = ({ onSelectCategory, user }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const containerStyle = {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px'
  };

  const cardStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    border: '4px solid #00ffff',
    borderRadius: '20px',
    padding: '40px 30px',
    maxWidth: '700px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 255, 255, 0.3)',
    backdropFilter: 'blur(15px)',
    position: 'relative',
    fontFamily: "'Silkscreen', monospace"
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#fef08a',
    textShadow: '3px 3px 0px #86198f',
    marginBottom: '30px',
    letterSpacing: '2px'
  };

  const categoryButtonStyle = (isHovered) => ({
    backgroundColor: isHovered ? 'rgba(0, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
    border: `3px solid ${isHovered ? '#00ffff' : '#ffffff'}`,
    borderRadius: '15px',
    padding: '20px 15px',
    margin: '8px',
    width: '180px',
    height: '150px',
    color: '#ffffff',
    fontSize: '1.1rem',
    fontFamily: "'Silkscreen', monospace",
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transform: isHovered ? 'translateY(-5px) scale(1.05)' : 'translateY(0) scale(1)',
    boxShadow: isHovered ? '0 10px 25px rgba(0, 255, 255, 0.4)' : '0 4px 10px rgba(0, 0, 0, 0.3)'
  });

  const iconStyle = {
    fontSize: '2.5rem',
    marginBottom: '5px'
  };

  const footerStyle = {
    marginTop: '30px',
    fontSize: '0.9rem',
    color: '#00ffff',
    fontFamily: "'Silkscreen', monospace"
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Corner decorations */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '20px',
          height: '20px',
          borderLeft: '3px solid #00ffff',
          borderTop: '3px solid #00ffff'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '20px',
          height: '20px',
          borderRight: '3px solid #00ffff',
          borderTop: '3px solid #00ffff'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          width: '20px',
          height: '20px',
          borderLeft: '3px solid #00ffff',
          borderBottom: '3px solid #00ffff'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          width: '20px',
          height: '20px',
          borderRight: '3px solid #00ffff',
          borderBottom: '3px solid #00ffff'
        }}></div>

        {/* Auth/Profile Button - Removed from top, moved to bottom */}

        <h1 style={titleStyle}>SELECT GAME</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* First row - 3 categories */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', margin:'10px' }}>
            {Object.entries(localQuizData).slice(0, 3).map(([key, category]) => (
              <button
                key={key}
                style={categoryButtonStyle(hoveredCard === key)}
                onMouseEnter={() => setHoveredCard(key)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => onSelectCategory(key)}
              >
                <span style={iconStyle}>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
          
          {/* Second row - 2 categories */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0' }}>
            {Object.entries(localQuizData).slice(3, 5).map(([key, category]) => (
              <button
                key={key}
                style={categoryButtonStyle(hoveredCard === key)}
                onMouseEnter={() => setHoveredCard(key)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => onSelectCategory(key)}
              >
                <span style={iconStyle}>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
          
          {/* Leaderboard and Profile/Auth Buttons - same row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
            <button
              style={{
                ...categoryButtonStyle(hoveredCard === 'leaderboard'),
                backgroundColor: hoveredCard === 'leaderboard' ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 215, 0, 0.1)',
                border: `3px solid ${hoveredCard === 'leaderboard' ? '#ffd700' : '#ffd700'}`,
                width: '180px'
              }}
              onMouseEnter={() => setHoveredCard('leaderboard')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setShowLeaderboard(true)}
            >
              <span style={iconStyle}>🏆</span>
              <span>Leaderboard</span>
            </button>
            
            {user ? (
              <button
                style={{
                  ...categoryButtonStyle(hoveredCard === 'profile'),
                  backgroundColor: hoveredCard === 'profile' ? 
                    (user.isAnonymous ? 'rgba(255, 215, 0, 0.2)' : 'rgba(0, 255, 255, 0.2)') : 
                    (user.isAnonymous ? 'rgba(255, 215, 0, 0.1)' : 'rgba(0, 255, 255, 0.1)'),
                  border: `3px solid ${user.isAnonymous ? '#ffd700' : '#00ffff'}`,
                  width: '180px'
                }}
                onMouseEnter={() => setHoveredCard('profile')}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setShowProfile(true)}
              >
                <span style={iconStyle}>{user.isAnonymous ? '🎭' : '👤'}</span>
                <span>{user.isAnonymous ? 'Guest' : 'Profile'}</span>
              </button>
            ) : (
              <button
                style={{
                  ...categoryButtonStyle(hoveredCard === 'signin'),
                  backgroundColor: hoveredCard === 'signin' ? 'rgba(0, 255, 255, 0.2)' : 'rgba(0, 255, 255, 0.1)',
                  border: '3px solid #00ffff',
                  width: '180px'
                }}
                onMouseEnter={() => setHoveredCard('signin')}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setShowAuth(true)}
              >
                <span style={iconStyle}>🔐</span>
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        <div style={footerStyle}>
          🎮 Pick a category to start! 🎮
        </div>
      </div>
      
      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <Leaderboard 
          onClose={() => setShowLeaderboard(false)}
        />
      )}
      
      {/* Auth Modal */}
      {showAuth && (
        <AuthModal 
          show={showAuth}
          onClose={() => setShowAuth(false)}
          onAuthSuccess={() => {
            setShowAuth(false);
            // The user state will be updated by the auth listener in App.jsx
          }}
        />
      )}
      
      {/* User Profile Modal */}
      {showProfile && user && (
        <UserProfile 
          user={user}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
};

export default CategorySelection;
