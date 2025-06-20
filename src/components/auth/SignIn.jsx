import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInAnonymously, signInWithGoogle, createUserProfile } from '../../firebase/firebase.js';
import { auth } from '../../firebase/firebase.js';

const SignIn = ({ onClose, onSwitchToSignUp, onSignInSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signInWithEmailAndPassword(email, password);
      console.log('User signed in:', result.user.uid);
      onSignInSuccess(result.user);
      onClose();
    } catch (error) {
      console.error('Sign in error:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await signInAnonymously(auth);
      console.log('Anonymous sign in:', result.user.uid);
      onSignInSuccess(result.user);
      onClose();
    } catch (error) {
      console.error('Anonymous sign in error:', error);
      setError('Failed to sign in anonymously');
    } finally {
      setLoading(false);
    }
  };

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
        onSignInSuccess(user);
        onClose();
      }
      // If result is null, it means redirect was used and will be handled by parent component
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      default:
        return 'Sign in failed. Please try again';
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
    maxWidth: '400px',
    width: '90%',
    color: '#ffffff',
    position: 'relative'
  };

  const titleStyle = {
    fontSize: '2rem',
    color: '#00ffff',
    textAlign: 'center',
    marginBottom: '30px',
    textShadow: '2px 2px 0px #000000'
  };

  const inputStyle = {
    width: '100%',
    padding: '15px',
    marginBottom: '15px',
    fontSize: '1rem',
    border: '2px solid #00ffff',
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#ffffff',
    fontFamily: "'Silkscreen', monospace",
    outline: 'none'
  };

  const buttonStyle = {
    width: '100%',
    padding: '15px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '15px',
    fontFamily: "'Silkscreen', monospace",
    textTransform: 'uppercase',
    transition: 'all 0.3s ease'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#00ffff',
    color: '#000000',
    border: '2px solid #00ffff'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: '#00ffff',
    border: '2px solid #00ffff'
  };

  const anonymousButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ffd700',
    color: '#000000',
    border: '2px solid #ffd700'
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

  const errorStyle = {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    border: '2px solid #ef4444',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    color: '#ef4444',
    textAlign: 'center'
  };

  const linkStyle = {
    color: '#00ffff',
    cursor: 'pointer',
    textDecoration: 'underline'
  };

  return (
    <div style={containerStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={onClose}>×</button>
        
        <h2 style={titleStyle}>🎮 SIGN IN</h2>
        
        {error && <div style={errorStyle}>{error}</div>}
        
        <form onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            disabled={loading}
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            disabled={loading}
          />
          
          <button 
            type="submit" 
            style={primaryButtonStyle}
            disabled={loading}
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
        
        <button 
          onClick={handleGoogleSignIn}
          style={{
            ...buttonStyle,
            backgroundColor: '#4285f4',
            color: '#ffffff',
            border: '2px solid #4285f4',
            marginBottom: '15px'
          }}
          disabled={loading}
        >
          🚀 SIGN IN WITH GOOGLE
        </button>
        
        <button 
          onClick={handleAnonymousSignIn}
          style={anonymousButtonStyle}
          disabled={loading}
        >
          🎭 PLAY AS GUEST
        </button>
        
        <button 
          onClick={onSwitchToSignUp}
          style={secondaryButtonStyle}
          disabled={loading}
        >
          CREATE ACCOUNT
        </button>
        
        <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <span style={linkStyle} onClick={onSwitchToSignUp}>
            Sign up here
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
