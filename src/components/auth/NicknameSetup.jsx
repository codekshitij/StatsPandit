import React, { useState } from 'react';
import { updateUserNickname } from '../../firebase/firebase.js';

const NicknameSetup = ({ user, onComplete, onSkip }) => {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    setLoading(true);
    setError('');

    try {
      await updateUserNickname(user.uid, nickname.trim());
      console.log('✅ Nickname set successfully:', nickname);
      onComplete(nickname.trim());
    } catch (error) {
      console.error('❌ Error setting nickname:', error);
      setError('Failed to set nickname. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
    maxWidth: '500px',
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 255, 255, 0.3)',
    backdropFilter: 'blur(15px)',
    position: 'relative'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#fef08a',
    textShadow: '2px 2px 0px #86198f',
    marginBottom: '30px',
    letterSpacing: '1px'
  };

  const inputStyle = {
    width: '100%',
    padding: '15px',
    fontSize: '1.2rem',
    textAlign: 'center',
    border: '3px solid #00ffff',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    fontFamily: "'Silkscreen', monospace",
    marginBottom: '20px',
    outline: 'none'
  };

  const buttonStyle = {
    backgroundColor: '#00ffff',
    color: '#000000',
    border: '3px solid #00ffff',
    borderRadius: '12px',
    padding: '15px 30px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: "'Silkscreen', monospace",
    textTransform: 'uppercase',
    margin: '10px',
    transition: 'all 0.3s ease'
  };

  const skipButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: '3px solid #ffffff'
  };

  const errorStyle = {
    color: '#ef4444',
    fontSize: '1rem',
    marginBottom: '20px'
  };

  return (
    <div style={containerStyle}>
      <div style={modalStyle}>
        <h2 style={titleStyle}>🎮 Choose Your Nickname</h2>
        
        <p style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '25px', lineHeight: '1.5' }}>
          Set a cool nickname that will appear on the leaderboard!
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter your nickname..."
            style={inputStyle}
            maxLength={20}
            disabled={loading}
          />
          
          {error && <div style={errorStyle}>{error}</div>}
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <button
              type="submit"
              style={buttonStyle}
              disabled={loading || !nickname.trim()}
            >
              {loading ? 'SETTING...' : '✅ SET NICKNAME'}
            </button>
            
            <button
              type="button"
              onClick={onSkip}
              style={skipButtonStyle}
              disabled={loading}
            >
              ⏭️ SKIP FOR NOW
            </button>
          </div>
        </form>
        
        <p style={{ color: '#cccccc', fontSize: '0.9rem', marginTop: '20px' }}>
          You can change this later in your profile
        </p>
      </div>
    </div>
  );
};

export default NicknameSetup;
