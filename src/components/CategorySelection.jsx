import React, { useState } from "react";
import Leaderboard from './Leaderboard.jsx';
import AuthModal from './auth/AuthModal.jsx';
import UserProfile from './auth/UserProfile.jsx';
import { useResponsive } from '../utils/responsive.js';

const localQuizData = {
  cricket: { name: "Cricket", icon: "🏏" },
  american_football: { name: "Football", icon: "🏈" },
  soccer: { name: "Soccer", icon: "⚽" },
  formula1: { name: "Formula 1", icon: "🏎️" },
  tennis: { name: "Tennis", icon: "🎾" },
  nba: { name: "NBA", icon: "🏀", comingSoon: true },
};

const CategorySelection = ({ onSelectCategory, user }) => {
  const { isMobile } = useResponsive();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const containerStyle = {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: isMobile ? '10px 8px' : '40px',
    gap: isMobile ? '10px' : '20px',
    paddingTop: isMobile ? '25px' : '60px',
    position: 'relative'
  };

  const topRowStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isMobile ? '12px' : '30px',
    width: '100%'
  };

  const cardStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    border: '4px solid #00ffff',
    borderRadius: isMobile ? '10px' : '20px',
    padding: isMobile ? '15px 12px' : '40px 30px',
    textAlign: 'center',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 255, 255, 0.3)',
    backdropFilter: 'blur(15px)',
    position: 'relative',
    fontFamily: "'Silkscreen', monospace"
  };

  const sportsCardStyle = {
    ...cardStyle,
    maxWidth: isMobile ? '100%' : '600px',
    width: '100%',
    minHeight: isMobile ? 'auto' : '665px'
  };

  const profileCardStyle = {
    ...cardStyle,
    maxWidth: isMobile ? '100%' : '420px',
    width: '100%',
    height: 'fit-content',
    border: '4px solid #22c55e',
  };

  const challengeCardStyle = {
    ...cardStyle,
    border: '4px solid #ef4444',
    maxWidth: isMobile ? '100%' : '420px',
    width: '100%',
    height: 'fit-content'
  };

  const rightColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '15px' : '20px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: isMobile ? '100%' : 'auto'
  };

  const storyCardStyle = {
    ...cardStyle,
    border: '4px solid #9333ea',
    maxWidth: isMobile ? '100%' : '1050px',
    width: '100%',
    height: 'fit-content',
    textAlign: 'left'
  };

  const titleStyle = {
    fontSize: isMobile ? '1.6rem' : '2.5rem',
    fontWeight: 'bold',
    color: '#fef08a',
    textShadow: '3px 3px 0px #86198f',
    marginBottom: isMobile ? '12px' : '30px',
    letterSpacing: isMobile ? '1px' : '2px'
  };

  const categoryButtonStyle = (isHovered) => ({
    backgroundColor: isHovered ? 'rgba(0, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
    border: `3px solid ${isHovered ? '#00ffff' : '#ffffff'}`,
    borderRadius: '15px',
    padding: isMobile ? '10px 6px' : '20px 15px',
    margin: isMobile ? '3px' : '8px',
    width: isMobile ? '120px' : '180px',
    height: isMobile ? '100px' : '150px',
    color: '#ffffff',
    fontSize: isMobile ? '0.9rem' : '1.1rem',
    fontFamily: "'Silkscreen', monospace",
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isMobile ? '5px' : '8px',
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
      {/* Top Row - Sports and Profile Cards */}
      <div style={topRowStyle}>
        {/* Sports Selection Card */}
        <div style={sportsCardStyle}>
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

        <h1 style={titleStyle}>SELECT SPORT</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '15px' : '20px' }}>
          {/* First row - 3 categories */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: isMobile ? '8px' : '5px', 
            margin: isMobile ? '5px' : '10px',
            flexWrap: isMobile ? 'wrap' : 'nowrap'
          }}>
            {Object.entries(localQuizData).slice(0, 3).map(([key, category]) => (
              <button
                key={key}
                style={{
                  ...categoryButtonStyle(hoveredCard === key),
                  opacity: category.comingSoon ? 0.7 : 1,
                  cursor: category.comingSoon ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={() => setHoveredCard(key)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => category.comingSoon ? null : onSelectCategory(key)}
                disabled={category.comingSoon}
              >
                <span style={iconStyle}>{category.icon}</span>
                <span>{category.name}</span>
                {category.comingSoon && <span style={{fontSize: '0.7rem', color: '#cccccc', marginTop: '5px'}}>Coming Soon</span>}
              </button>
            ))}
          </div>
          
          {/* Second row - 3 categories */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: isMobile ? '8px' : '5px', 
            margin: isMobile ? '5px' : '10px',
            flexWrap: isMobile ? 'wrap' : 'nowrap'
          }}>
            {Object.entries(localQuizData).slice(3, 6).map(([key, category]) => (
              <button
                key={key}
                style={{
                  ...categoryButtonStyle(hoveredCard === key),
                  opacity: category.comingSoon ? 0.7 : 1,
                  cursor: category.comingSoon ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={() => setHoveredCard(key)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => category.comingSoon ? null : onSelectCategory(key)}
                disabled={category.comingSoon}
              >
                <span style={iconStyle}>{category.icon}</span>
                <span>{category.name}</span>
                {category.comingSoon && <span style={{fontSize: '0.7rem', color: '#cccccc', marginTop: '5px'}}>Coming Soon</span>}
              </button>
            ))}
          </div>
        </div>

        <div style={footerStyle}>
          🎮 Pick a sport to start your challenge! 🎮
        </div>
      </div>

      {/* Right Column - Profile Card and Challenge Card */}
      <div style={rightColumnStyle}>
        {/* Profile & Leaderboard Card */}
        <div style={profileCardStyle}>
        {/* Corner decorations */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '20px',
          height: '20px',
          borderLeft: '3px solid #22c55e',
          borderTop: '3px solid #22c55e'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '20px',
          height: '20px',
          borderRight: '3px solid #22c55e',
          borderTop: '3px solid #22c55e'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          width: '20px',
          height: '20px',
          borderLeft: '3px solid #22c55e',
          borderBottom: '3px solid #22c55e'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          width: '20px',
          height: '20px',
          borderRight: '3px solid #22c55e',
          borderBottom: '3px solid #22c55e'
        }}></div>

        <h2 style={{
          ...titleStyle,
          fontSize: '2rem',
          marginBottom: '25px'
        }}>INFO</h2>
        
        <div style={{ display: 'flex', flexDirection: 'row', gap: '15px', alignItems: 'center', justifyContent: 'center' }}>
          {/* User Profile Button */}
          {user ? (
            <button
              style={{
                ...categoryButtonStyle(hoveredCard === 'profile'),
                backgroundColor: hoveredCard === 'profile' ? 
                  (user.isAnonymous ? 'rgba(255, 215, 0, 0.2)' : 'rgba(0, 255, 255, 0.2)') : 
                  (user.isAnonymous ? 'rgba(255, 215, 0, 0.1)' : 'rgba(0, 255, 255, 0.1)'),
                border: `3px solid ${user.isAnonymous ? '#ffd700' : '#00ffff'}`,
                width: '160px',
                height: '140px',
                minWidth: '160px',
                minHeight: '140px'
              }}
              onMouseEnter={() => setHoveredCard('profile')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setShowProfile(true)}
            >
              <span style={{...iconStyle, fontSize: '2rem'}}>{user.isAnonymous ? '🎭' : '👤'}</span>
              <span style={{fontSize: '0.9rem'}}>{user.isAnonymous ? 'Guest Profile' : 'My Profile'}</span>
            </button>
          ) : (
            <button
              style={{
                ...categoryButtonStyle(hoveredCard === 'signin'),
                backgroundColor: hoveredCard === 'signin' ? 'rgba(0, 255, 255, 0.2)' : 'rgba(0, 255, 255, 0.1)',
                border: '3px solid #00ffff',
                width: '160px',
                height: '140px',
                minWidth: '160px',
                minHeight: '140px'
              }}
              onMouseEnter={() => setHoveredCard('signin')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setShowAuth(true)}
            >
              <span style={{...iconStyle, fontSize: '2rem'}}>🔐</span>
              <span style={{fontSize: '0.9rem'}}>Sign In</span>
            </button>
          )}

          {/* Leaderboard Button */}
          <button
            style={{
              ...categoryButtonStyle(hoveredCard === 'leaderboard'),
              backgroundColor: hoveredCard === 'leaderboard' ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 215, 0, 0.1)',
              border: `3px solid ${hoveredCard === 'leaderboard' ? '#ffd700' : '#ffd700'}`,
              width: '160px',
              height: '140px',
              minWidth: '160px',
              minHeight: '140px'
            }}
            onMouseEnter={() => setHoveredCard('leaderboard')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => setShowLeaderboard(true)}
          >
            <span style={{...iconStyle, fontSize: '2rem'}}>🏆</span>
            <span style={{fontSize: '0.9rem'}}>Leaderboard</span>
            <span style={{fontSize: '0.7rem', color: '#cccccc', marginTop: '5px'}}>Coming Soon</span>
          </button>
        </div>
      </div>
      
      {/* Challenge a Friend Card */}
      <div style={challengeCardStyle}>
        {/* Corner decorations */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '20px',
          height: '20px',
          borderLeft: '3px solid #ef4444',
          borderTop: '3px solid #ef4444'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '20px',
          height: '20px',
          borderRight: '3px solid #ef4444',
          borderTop: '3px solid #ef4444'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          width: '20px',
          height: '20px',
          borderLeft: '3px solid #ef4444',
          borderBottom: '3px solid #ef4444'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          width: '20px',
          height: '20px',
          borderRight: '3px solid #ef4444',
          borderBottom: '3px solid #ef4444'
        }}></div>

        <h2 style={{
          ...titleStyle,
          fontSize: '2rem',
          marginBottom: '25px'
        }}>CHALLENGE</h2>
        
        <div style={{ display: 'flex', flexDirection: 'row', gap: '15px', alignItems: 'center', justifyContent: 'center' }}>
          {/* Challenge a Friend Button */}
          <button
            style={{
              ...categoryButtonStyle(hoveredCard === 'challenge'),
              backgroundColor: hoveredCard === 'challenge' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
              border: '3px solid #22c55e',
              width: '160px',
              height: '140px',
              minWidth: '160px',
              minHeight: '140px',
              opacity: 0.7,
              cursor: 'not-allowed'
            }}
            onMouseEnter={() => setHoveredCard('challenge')}
            onMouseLeave={() => setHoveredCard(null)}
            disabled={true}
          >
            <span style={{...iconStyle, fontSize: '2rem'}}>⚔️</span>
            <span style={{fontSize: '0.9rem'}}>Challenge a Friend</span>
            <span style={{fontSize: '0.7rem', color: '#cccccc', marginTop: '5px'}}>Coming Soon</span>
          </button>

          {/* Tournament Button */}
          <button
            style={{
              ...categoryButtonStyle(hoveredCard === 'tournament'),
              backgroundColor: hoveredCard === 'tournament' ? 'rgba(147, 51, 234, 0.2)' : 'rgba(147, 51, 234, 0.1)',
              border: '3px solid #9333ea',
              width: '160px',
              height: '140px',
              minWidth: '160px',
              minHeight: '140px',
              opacity: 0.7,
              cursor: 'not-allowed'
            }}
            onMouseEnter={() => setHoveredCard('tournament')}
            onMouseLeave={() => setHoveredCard(null)}
            disabled={true}
          >
            <span style={{...iconStyle, fontSize: '2rem'}}>🏟️</span>
            <span style={{fontSize: '0.9rem'}}>Tournament</span>
            <span style={{fontSize: '0.7rem', color: '#cccccc', marginTop: '5px'}}>Coming Soon</span>
          </button>
        </div>
      </div>
      
      {/* Close Right Column */}
      </div>
      
      {/* Close Top Row */}
      </div>

      {/* User Story Card */}
      <div style={storyCardStyle}>
        {/* Corner decorations */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '20px',
          height: '20px',
          borderLeft: '3px solid #9333ea',
          borderTop: '3px solid #9333ea'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '20px',
          height: '20px',
          borderRight: '3px solid #9333ea',
          borderTop: '3px solid #9333ea'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          width: '20px',
          height: '20px',
          borderLeft: '3px solid #9333ea',
          borderBottom: '3px solid #9333ea'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          width: '20px',
          height: '20px',
          borderRight: '3px solid #9333ea',
          borderBottom: '3px solid #9333ea'
        }}></div>

        <h2 style={{
          ...titleStyle,
          fontSize: '2rem',
          marginBottom: '25px',
          textAlign: 'center'
        }}>🎯 WHY STATS PANDIT IS SUPER FUN!</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
          gap: isMobile ? '20px' : '30px', 
          alignItems: 'start',
          fontSize: isMobile ? '0.9rem' : '1rem',
          lineHeight: '1.6',
          color: '#ffffff'
        }}>
          {/* Left Column */}
          <div>
            <h3 style={{ color: '#00ffff', marginBottom: '15px', fontSize: '1.2rem' }}>
              🚀 The Ultimate Challenge
            </h3>
            <p style={{ marginBottom: '20px' }}>
              Test your sports knowledge across <strong>Cricket, Football, Soccer, Tennis & F1</strong>. 
              Every question is randomly selected, so no two games are the same!
            </p>
            
            <h3 style={{ color: '#ffd700', marginBottom: '15px', fontSize: '1.2rem' }}>
              🏆 Earn Your Title
            </h3>
            <p style={{ marginBottom: '15px' }}>
              Progress through <strong>6 prestigious titles</strong> based on your correct answers:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '8px' }}><strong>🆕 Rookie Spectator</strong> (0-9 correct)</li>
              <li style={{ marginBottom: '8px' }}><strong>📺 Armchair Analyst</strong> (10-17 correct)</li>
              <li style={{ marginBottom: '8px' }}><strong>🎯 Seasoned Strategist</strong> (18-25 correct)</li>
            </ul>
          </div>
          
          {/* Right Column */}
          <div>
            <ul style={{ paddingLeft: '20px', marginBottom: '20px', marginTop: '52px' }}>
              <li style={{ marginBottom: '8px' }}><strong>⚡ Elite Tactician</strong> (26-33 correct)</li>
              <li style={{ marginBottom: '8px' }}><strong>🧠 Stats Savant</strong> (34-41 correct)</li>
              <li style={{ marginBottom: '8px' }}><strong>👑 The Ultimate Pandit</strong> (42-50 correct)</li>
            </ul>
            
            <h3 style={{ color: '#10b981', marginBottom: '15px', fontSize: '1.2rem' }}>
              📊 Track Your Journey
            </h3>
            <p style={{ marginBottom: '20px' }}>
              Every correct answer counts toward your lifetime total. Watch your title evolve 
              as you master different sports and climb the ranks!
            </p>
            
            <h3 style={{ color: '#ef4444', marginBottom: '15px', fontSize: '1.2rem' }}>
              🎮 Start Your Legacy
            </h3>
            <p>
              Pick a sport above and begin your journey to become <strong>The Ultimate Pandit</strong>. 
              Will you join the legends?
            </p>
          </div>
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
