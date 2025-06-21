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
    // Removed backgroundColor - let video show through
  };

  const videoStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 1 // Changed from -2 to 1 to be visible
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5))',
    zIndex: 2 // Changed from -1 to 2 to be above video
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: 'column', // Stack vertically
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: '#ffffff',
    zIndex: 3, // Changed from 1 to 3 to be above overlay
    maxWidth: '1000px',
    padding: '40px',
    gap: '0',
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'row', // Side by side
    gap: '20px',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10px'
  };

  const logoStyle = {
    fontSize: '5rem',
    fontWeight: 'bold',
    // Refined gradient for high contrast and impact
    background: 'linear-gradient(45deg, #FF4E00, #FFC837)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    // Softer shadow for a cleaner "lift" off the page
    textShadow: '3px 3px 6px rgba(0, 0, 0, 0.6)',
    marginBottom: '20px',
    letterSpacing: '3px'
  };

  const taglineStyle = {
    fontSize: '1.5rem',
    color: '#FFC837',
    marginBottom: '40px',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
    letterSpacing: '1px'
  };

  const descriptionStyle = {
    fontSize: '1.1rem',
    color: '#B0C4DE',
    marginBottom: '50px',
    lineHeight: '1.6',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
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
    background: 'linear-gradient(45deg, #FF4E00, #FFC837)',
    color: '#000000',
    border: '2px solid #ffd700'
  };

  const errorStyle = {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    border: '2px solid #ef4444',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
    color: '#B0C4DE',
    textAlign: 'center'
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
        onError={(e) => console.error('Video failed to load:', e)}
        onLoadStart={() => console.log('Video loading started')}
        onCanPlay={() => console.log('Video can play')}
      >
        <source src="/Whisk_cauajgfjztbimtixltbmmzqtndc2zc05njuyltk.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div style={overlayStyle}></div>

      {/* Main Content */}
      <div style={contentStyle}>
        <h1 style={logoStyle}>
          <span style={{ whiteSpace: 'nowrap' }}>STATS PANDIT</span>
        </h1>
        <p style={taglineStyle}>🎮 Ultimate Sports Quiz Challenge </p>
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
