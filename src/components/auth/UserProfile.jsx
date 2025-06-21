import React, { useState, useEffect } from 'react';
import { signOut, getUserQuizHistory, getUserProfile, auth } from '../../firebase/firebase.js';
import { getTitleByScore, getNextTitle, getTitleProgress } from '../../utils/titleSystem.js';

const UserProfile = ({ user, onClose }) => {
  const [userHistory, setUserHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        try {
          console.log('👤 UserProfile: Fetching data for user ID:', user.uid);
          
          // Fetch user profile and quiz history in parallel
          const [profile, history] = await Promise.all([
            getUserProfile(user.uid),
            getUserQuizHistory(user.uid)
          ]);
          
          setUserProfile(profile);
          setUserHistory(history);
        } catch (error) {
          console.error('❌ UserProfile: Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
    marginBottom: '10px',
    textShadow: '2px 2px 0px #000000'
  };

  const userInfoStyle = {
    fontSize: '1rem',
    color: '#ffffff',
    marginBottom: '10px'
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '20px',
    right: '15px',
    color: '#ffffff',
    border: 'none',
    width: '45px',
    height: '60px',
    fontSize: '2rem',
    cursor: 'pointer',
    fontFamily: "'Silkscreen', monospace"
  };

  const signOutButtonStyle = {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: '2px solid #dc2626',
    borderRadius: '8px',
    padding: '15px 30px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: "'Silkscreen', monospace",
    textTransform: 'uppercase',
    transition: 'all 0.3s ease',
    marginTop: '20px'
  };

  const historyStyle = {
    marginTop: '20px'
  };

  const historyItemStyle = {
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    padding: '15px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const isAnonymous = user?.isAnonymous;

  return (
    <div style={containerStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={onClose}>×</button>
        
        <div style={headerStyle}>
          <div style={titleStyle}>👤 USER PROFILE</div>
          <div style={userInfoStyle}>
            {isAnonymous ? (
              <>
                <div>🎭 Guest Player</div>
                <div style={{ fontSize: '0.9rem', color: '#cccccc' }}>
                  Create an account to save your progress!
                </div>
              </>
            ) : (
              <>
                <div>👋 {userProfile?.nickname || 'Loading...'}</div>
                {userProfile?.highestScore > 0 && (
                  <div style={{ fontSize: '0.9rem', color: '#fef08a', marginTop: '5px' }}>
                    🏆 Personal Best: {userProfile.highestScore.toLocaleString()}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* User Title Section */}
        {!isAnonymous && userProfile && (
          <div style={{
            marginTop: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            border: '3px solid #ffd700',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#ffd700', marginBottom: '15px', fontSize: '1.2rem' }}>
              🏆 YOUR PANDIT TITLE
            </h3>
            
            {(() => {
              const totalCorrect = userProfile.totalCorrectAnswers || 0;
              const currentTitle = getTitleByScore(totalCorrect);
              const nextTitle = getNextTitle(totalCorrect);
              const progress = getTitleProgress(totalCorrect);
              
              return (
                <div>
                  {/* Current Title */}
                  <div style={{
                    backgroundColor: currentTitle.bgColor,
                    border: `2px solid ${currentTitle.borderColor}`,
                    borderRadius: '10px',
                    padding: '15px',
                    marginBottom: '15px'
                  }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>
                      {currentTitle.badge} <span style={{ color: currentTitle.textColor, fontWeight: 'bold' }}>
                        {currentTitle.title}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#cccccc' }}>
                      {currentTitle.description}
                    </div>
                  </div>
                  
                  {/* Progress Info */}
                  <div style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '10px' }}>
                    📊 Total Correct Answers: <span style={{ color: '#fef08a', fontWeight: 'bold' }}>{totalCorrect}</span>
                  </div>
                  
                  {/* Next Title Preview */}
                  {nextTitle && (
                    <div style={{ fontSize: '0.9rem', color: '#cccccc' }}>
                      🎯 Next Title: <span style={{ color: nextTitle.textColor }}>{nextTitle.title}</span>
                      <br />
                      ({progress.answersNeeded} more correct answers needed)
                    </div>
                  )}
                  
                  {/* Progress Bar */}
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    height: '8px',
                    marginTop: '15px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      backgroundColor: currentTitle.color,
                      height: '100%',
                      width: `${Math.min(progress.progress || 0, 100)}%`,
                      borderRadius: '10px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        <div style={historyStyle}>
          <h3 style={{ color: '#00ffff', marginBottom: '15px' }}>📊 Quiz History</h3>
          
          {loading ? (
            <div style={{ textAlign: 'center', fontSize: '1.1rem', color: '#00ffff' }}>
              Loading your quiz history...
            </div>
          ) : userHistory.length === 0 ? (
            <div style={{ textAlign: 'center', fontSize: '1rem', color: '#ffffff' }}>
              No quiz history yet. Start playing to see your scores!
            </div>
          ) : (
            userHistory.map((quiz, index) => (
              <div key={quiz.id || index} style={historyItemStyle}>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                    {quiz.category?.toUpperCase() || 'Unknown'}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#cccccc' }}>
                    {formatDate(quiz.timestamp)} • {quiz.correct || 0}✓ {quiz.incorrect || 0}✗
                  </div>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fef08a' }}>
                  {(quiz.score || 0).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={handleSignOut}
            style={signOutButtonStyle}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#ef4444';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#dc2626';
            }}
          >
            {isAnonymous ? '🚪 EXIT GUEST MODE' : '🚪 SIGN OUT'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
