import React from "react";

const FinalScore = ({ stats, onPlayAgain }) => {
  const [hoveredButton, setHoveredButton] = React.useState(false);
  const [hoveredStatBox, setHoveredStatBox] = React.useState(null);
  const totalAnswered = stats.correct + stats.incorrect;
  const accuracy = totalAnswered > 0 ? Math.round((stats.correct / totalAnswered) * 100) : 0;

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
    </div>
  );
};

export default FinalScore;
