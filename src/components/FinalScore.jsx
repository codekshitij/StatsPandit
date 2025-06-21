import React, { useState, useEffect } from "react";
import { SiCashapp } from 'react-icons/si';

const FinalScore = ({ stats, onPlayAgain }) => {
  const [hoveredButton, setHoveredButton] = useState(false);
  const [hoveredStatBox, setHoveredStatBox] = useState(null);
  const [showCoffeeModal, setShowCoffeeModal] = useState(false);
  
  const totalAnswered = stats.correct + stats.incorrect;
  const accuracy = totalAnswered > 0 ? Math.round((stats.correct / totalAnswered) * 100) : 0;

  // Show coffee modal after 2 seconds, hide after 15 seconds
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowCoffeeModal(true);
    }, 2000);

    const hideTimer = setTimeout(() => {
      setShowCoffeeModal(false);
    }, 17000); // 2 + 15 seconds

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

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
    fontSize: '3.5rem',
    fontWeight: 'bold',
    color: '#fef08a',
    textShadow: '4px 4px 0px #86198f, 8px 8px 0px rgba(134, 25, 143, 0.3)',
    marginBottom: '40px',
    letterSpacing: '2px'
  };

  const scoreContainerStyle = {
    backgroundColor: 'rgba(255, 255, 0, 0.1)',
    border: '4px solid #fef08a',
    borderRadius: '15px',
    padding: '30px',
    marginBottom: '40px',
    boxShadow: '0 0 20px rgba(254, 240, 138, 0.3)'
  };

  const scoreStyle = {
    fontSize: '4rem',
    fontWeight: 'bold',
    color: '#fef08a',
    textShadow: '2px 2px 0px #86198f',
    fontFamily: "'Silkscreen', monospace"
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '40px'
  };

  const statCardStyle = (borderColor, bgColor, boxId) => {
    const isHovered = hoveredStatBox === boxId;
    return {
      backgroundColor: isHovered ? bgColor.replace('0.2', '0.4') : bgColor,
      border: `3px solid ${borderColor}`,
      borderRadius: '12px',
      padding: '20px',
      backdropFilter: 'blur(10px)',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      transform: isHovered ? 'translateY(-8px) scale(1.05)' : 'translateY(0) scale(1)',
      boxShadow: isHovered 
        ? `0 15px 35px rgba(0, 0, 0, 0.5), 0 0 25px ${borderColor}, 0 0 50px ${borderColor}40`
        : '0 4px 15px rgba(0, 0, 0, 0.3)',
      filter: isHovered ? 'brightness(1.3)' : 'brightness(1)'
    };
  };

  const statValueStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    fontFamily: "'Silkscreen', monospace",
    marginTop: '10px'
  };

  const statLabelStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontFamily: "'Silkscreen', monospace"
  };

  const playAgainButtonStyle = {
    backgroundColor: hoveredButton ? '#ffd700' : '#ffff00',
    color: '#000000',
    border: '4px solid #000000',
    borderRadius: '15px',
    padding: '20px 40px',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: hoveredButton ? 'translateY(-5px) scale(1.05)' : 'translateY(0) scale(1)',
    boxShadow: hoveredButton ? '0 15px 30px rgba(255, 215, 0, 0.4)' : '0 8px 20px rgba(0, 0, 0, 0.3)',
    fontFamily: "'Silkscreen', monospace",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    margin: '0 auto'
  };

  const performanceMessageStyle = (bgColor, borderColor, textColor) => ({
    backgroundColor: bgColor,
    border: `3px solid ${borderColor}`,
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '30px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: textColor,
    fontFamily: "'Silkscreen', monospace"
  });

  const getPerformanceMessage = () => {
    if (accuracy >= 80) {
      return {
        message: '🏆 EXCELLENT PERFORMANCE!',
        style: performanceMessageStyle('rgba(34, 197, 94, 0.2)', '#22c55e', '#22c55e')
      };
    } else if (accuracy >= 60) {
      return {
        message: '👍 GOOD JOB!',
        style: performanceMessageStyle('rgba(59, 130, 246, 0.2)', '#3b82f6', '#3b82f6')
      };
    } else {
      return {
        message: '💪 KEEP PRACTICING!',
        style: performanceMessageStyle('rgba(249, 115, 22, 0.2)', '#f97316', '#f97316')
      };
    }
  };

  const performance = getPerformanceMessage();

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

        {/* Title */}
        <h2 style={titleStyle}>GAME OVER!</h2>

        {/* Score display */}
        <div style={scoreContainerStyle}>
          <div style={{ color: '#00ffff', fontSize: '1.7rem', marginBottom: '15px', fontFamily: "'Silkscreen', monospace" }}>
            FINAL SCORE
          </div>
          <div style={scoreStyle}>{stats.score.toLocaleString()}</div>
        </div>

        {/* Stats grid */}
        <div style={statsGridStyle}>
          <div 
            style={statCardStyle('#22c55e', 'rgba(34, 197, 94, 0.2)', 'correct')}
            onMouseEnter={() => setHoveredStatBox('correct')}
            onMouseLeave={() => setHoveredStatBox(null)}
          >
            <div style={{ ...statLabelStyle, color: '#22c55e' }}>
               CORRECT
            </div>
            <div style={{ ...statValueStyle, color: '#22c55e' }}>
              {stats.correct}
            </div>
          </div>
          
          <div 
            style={statCardStyle('#00ffff', 'rgba(0, 255, 255, 0.2)', 'accuracy')}
            onMouseEnter={() => setHoveredStatBox('accuracy')}
            onMouseLeave={() => setHoveredStatBox(null)}
          >
            <div style={{ ...statLabelStyle, color: '#00ffff' }}>
               ACCURACY
            </div>
            <div style={{ ...statValueStyle, color: '#00ffff' }}>
              {accuracy}%
            </div>
          </div>
          
          <div 
            style={statCardStyle('#ef4444', 'rgba(239, 68, 68, 0.2)', 'incorrect')}
            onMouseEnter={() => setHoveredStatBox('incorrect')}
            onMouseLeave={() => setHoveredStatBox(null)}
          >
            <div style={{ ...statLabelStyle, color: '#ef4444' }}>
               INCORRECT
            </div>
            <div style={{ ...statValueStyle, color: '#ef4444' }}>
              {stats.incorrect}
            </div>
          </div>
          
          <div 
            style={statCardStyle('#f59e0b', 'rgba(245, 158, 11, 0.2)', 'hints')}
            onMouseEnter={() => setHoveredStatBox('hints')}
            onMouseLeave={() => setHoveredStatBox(null)}
          >
            <div style={{ ...statLabelStyle, color: '#f59e0b' }}>
               HINTS USED
            </div>
            <div style={{ ...statValueStyle, color: '#f59e0b' }}>
              {stats.hints}
            </div>
          </div>
        </div>

        {/* Performance message */}
        <div style={performance.style}>
          {performance.message}
        </div>

        {/* Play again button */}
        <button 
          onClick={onPlayAgain}
          onMouseEnter={() => setHoveredButton(true)}
          onMouseLeave={() => setHoveredButton(false)}
          style={playAgainButtonStyle}
        >
          <span>🎮</span>
          <span>PLAY AGAIN</span>
          <span>🎮</span>
        </button>
      </div>

      {/* Coffee Modal */}
      {showCoffeeModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.5s ease-in-out'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCoffeeModal(false);
            }
          }}
        >
          <div 
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              border: '3px solid #ffd700',
              borderRadius: '15px',
              padding: '2rem',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.3)',
            fontFamily: "'Silkscreen', monospace",
            animation: 'slideIn 0.5s ease-out'
          }}>
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCoffeeModal(false);
              }}
              style={{
                position: 'absolute',
                top: '10px',
                right: '15px',
                background: 'none',
                border: 'none',
                color: '#ffd700',
                fontSize: '1.5rem',
                cursor: 'pointer',
                lineHeight: 1,
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.color = '#fff';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.target.style.color = '#ffd700';
                e.target.style.transform = 'scale(1)';
              }}
            >
              ×
            </button>

            {/* Shimmer effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent)',
              animation: 'shimmer 3s ease-in-out infinite',
              borderRadius: '15px'
            }}></div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{
                margin: 0,
                fontSize: '1.2rem',
                color: '#ffd700',
                fontWeight: 'bold',
                marginBottom: '1rem',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
              }}>
                🎉 Great Job! ☕
              </h3>
              
              <p style={{
                margin: 0,
                fontSize: '0.9rem',
                color: '#cbd5e0',
                marginBottom: '1.5rem',
                lineHeight: 1.5
              }}>
                Enjoyed the quiz? Support the development of more awesome quizzes!
              </p>
              
              <a 
                href="https://cash.app/$kshitij27" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                  color: '#000',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  border: '2px solid #ffd700'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 5px 15px rgba(255, 215, 0, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <SiCashapp style={{ fontSize: '1.2rem', color: '#000' }} />
                <span>Buy me a coffee</span>
              </a>
              
              <p style={{
                margin: 0,
                fontSize: '0.7rem',
                color: '#9ca3af',
                marginTop: '1rem'
              }}>
                This modal will close automatically in a few seconds
              </p>
            </div>

            {/* Animation styles */}
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              
              @keyframes slideIn {
                from { 
                  transform: translateY(-50px) scale(0.9); 
                  opacity: 0; 
                }
                to { 
                  transform: translateY(0) scale(1); 
                  opacity: 1; 
                }
              }
              
              @keyframes shimmer {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(100%); }
                100% { transform: translateX(100%); }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalScore;
