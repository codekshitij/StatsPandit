import React, { useState, useRef, useEffect } from 'react';
import { signInAnonymously, signInWithGoogle, getRedirectResult, createUserProfile } from '../firebase/firebase.js';
import { auth } from '../firebase/firebase.js';

const LandingPage = ({ onGetStarted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    // Auto-play video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }

    // Check for redirect result on component mount
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          // Handle redirect result similar to popup
          const user = result.user;
          
          // Create user profile using createUserProfile function
          await createUserProfile(user, {
            provider: 'google'
          });

          onGetStarted(user);
        }
      } catch (error) {
        console.error('Redirect result error:', error);
        setError('Failed to complete sign in. Please try again.');
      }
    };

    checkRedirectResult();
  }, [onGetStarted]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await signInWithGoogle();
      
      // Only handle result if it's not null (popup succeeded)
      if (result && result.user) {
        const user = result.user;

        // Create user profile using createUserProfile function
        await createUserProfile(user, {
          provider: 'google'
        });

        console.log('Google sign in successful:', user.uid);
        onGetStarted(user);
      }
      // If result is null, it means redirect was used and will be handled in useEffect
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestPlay = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await signInAnonymously(auth);
      console.log('Anonymous sign in successful:', result.user.uid);
      onGetStarted(result.user);
    } catch (error) {
      console.error('Anonymous sign in error:', error);
      
      if (error.code === 'auth/admin-restricted-operation') {
        setError('Guest mode is currently disabled. Please sign in with Google or create an account to continue.');
      } else {
        setError('Failed to start guest session. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    fontFamily: "'Silkscreen', monospace"
  };

  const videoStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: -2
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5))',
    zIndex: -1
  };

  const contentStyle = {
    textAlign: 'center',
    color: '#ffffff',
    zIndex: 1,
    maxWidth: '600px',
    padding: '40px'
  };

  const logoStyle = {
    fontSize: '4rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #00ffff, #ffd700, #ff6b6b)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
    marginBottom: '20px',
    letterSpacing: '3px'
  };

  const taglineStyle = {
    fontSize: '1.5rem',
    color: '#00ffff',
    marginBottom: '40px',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
    letterSpacing: '1px'
  };

  const descriptionStyle = {
    fontSize: '1.1rem',
    color: '#ffffff',
    marginBottom: '50px',
    lineHeight: '1.6',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center'
  };

  const buttonStyle = {
    padding: '18px 40px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontFamily: "'Silkscreen', monospace",
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'all 0.3s ease',
    minWidth: '280px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
    disabled: loading
  };

  const googleButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(45deg, #4285f4, #34a853)',
    color: '#ffffff',
    border: '2px solid #4285f4'
  };

  const guestButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(45deg, #ffd700, #ff8c00)',
    color: '#000000',
    border: '2px solid #ffd700'
  };

  const errorStyle = {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    border: '2px solid #ef4444',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
    color: '#ffffff',
    textAlign: 'center'
  };

  const featureListStyle = {
    textAlign: 'left',
    marginBottom: '30px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '20px',
    borderRadius: '12px',
    border: '2px solid #00ffff'
  };

  const featureItemStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    fontSize: '1rem',
    color: '#ffffff'
  };

  return (
    <div style={containerStyle}>
      {/* Background Video */}
      <video
        ref={videoRef}
        style={videoStyle}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/Whisk_cauajgfjztbimtixltbmmzqtndc2zc05njuyltk.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div style={overlayStyle}></div>

      {/* Main Content */}
      <div style={contentStyle}>
        <h1 style={logoStyle}>STATS PandiT</h1>
        <p style={taglineStyle}>🎮 Ultimate Sports Quiz Challenge </p>
        
        <div style={featureListStyle}>
          <div style={featureItemStyle}>
            <span style={{ marginRight: '10px' }}>🏏</span>
            <span>Test your knowledge across Cricket, Football, Soccer, Tennis & F1</span>
          </div>
          <div style={featureItemStyle}>
            <span style={{ marginRight: '10px' }}>🎯</span>
            <span>Random questions every time for endless challenge</span>
          </div>
          <div style={featureItemStyle}>
            <span style={{ marginRight: '10px' }}>🏆</span>
            <span>Compete on global leaderboards</span>
          </div>
          <div style={featureItemStyle}>
            <span style={{ marginRight: '10px' }}>📊</span>
            <span>Track your progress and quiz history</span>
          </div>
        </div>

        <p style={descriptionStyle}>
          Ready to prove you're the ultimate sports fan? Choose your path and let the games begin!
        </p>

        {error && <div style={errorStyle}>{error}</div>}

        <div style={buttonContainerStyle}>
          <button 
            style={googleButtonStyle}
            onClick={handleGoogleSignIn}
            disabled={loading}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-3px) scale(1.05)';
                e.target.style.boxShadow = '0 12px 30px rgba(66, 133, 244, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
            }}
          >
            {loading ? (
              '⏳ SIGNING IN...'
            ) : (
              <>
                <span>🚀</span>
                <span>SIGN IN WITH GOOGLE</span>
              </>
            )}
          </button>

          <button 
            style={guestButtonStyle}
            onClick={handleGuestPlay}
            disabled={loading}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-3px) scale(1.05)';
                e.target.style.boxShadow = '0 12px 30px rgba(255, 215, 0, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
            }}
          >
            {loading ? (
              '⏳ STARTING...'
            ) : (
              <>
                <span>🎭</span>
                <span>PLAY AS GUEST</span>
              </>
            )}
          </button>
        </div>

        <div style={{ 
          marginTop: '30px', 
          fontSize: '0.9rem', 
          color: '#cccccc',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
        }}>
          💡 Sign in with Google to save your progress and compete on leaderboards!
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
