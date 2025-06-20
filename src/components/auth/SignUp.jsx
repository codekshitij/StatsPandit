import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInAnonymously, signInWithGoogle, createUserProfile } from '../../firebase/firebase.js';
import { auth } from '../../firebase/firebase.js';

const SignUp = ({ onClose, onSwitchToSignIn, onSignUpSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Please enter a username');
      return false;
    }
    if (!formData.nickname.trim()) {
      setError('Please enter a nickname for the leaderboard');
      return false;
    }
    if (formData.nickname.trim().length < 2) {
      setError('Nickname must be at least 2 characters');
      return false;
    }
    if (formData.nickname.trim().length > 20) {
      setError('Nickname must be 20 characters or less');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter an email');
      return false;
    }
    if (!formData.password) {
      setError('Please enter a password');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create user account
      const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      console.log('✅ User account created:', result.user.uid);
      
      // Save user profile to Firestore using createUserProfile function
      const profile = await createUserProfile(result.user, {
        username: formData.username,
        nickname: formData.nickname,
        provider: 'email'
      });
      console.log('✅ User profile created:', profile);

      console.log('📝 Signup complete - calling onSignUpSuccess');
      onSignUpSuccess(result.user);
      onClose();
    } catch (error) {
      console.error('Sign up error:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
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

        console.log('Google sign up successful:', user.uid);
        onSignUpSuccess(user);
        onClose();
      }
      // If result is null, it means redirect was used and will be handled by parent component
    } catch (error) {
      console.error('Google sign up error:', error);
      setError('Failed to sign up with Google');
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
      onSignUpSuccess(result.user);
      onClose();
    } catch (error) {
      console.error('Anonymous sign in error:', error);
      setError('Failed to sign in anonymously');
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later';
      default:
        return 'Account creation failed. Please try again';
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
    position: 'relative',
    maxHeight: '90vh',
    overflow: 'auto'
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
    outline: 'none',
    boxSizing: 'border-box'
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
        
        <h2 style={titleStyle}>🚀 SIGN UP</h2>
        
        {error && <div style={errorStyle}>{error}</div>}
        
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            style={inputStyle}
            disabled={loading}
          />
          
          <input
            type="text"
            name="nickname"
            placeholder="Nickname (for leaderboard)"
            value={formData.nickname}
            onChange={handleInputChange}
            style={inputStyle}
            disabled={loading}
            maxLength={20}
          />
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            style={inputStyle}
            disabled={loading}
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleInputChange}
            style={inputStyle}
            disabled={loading}
          />
          
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            style={inputStyle}
            disabled={loading}
          />
          
          <button 
            type="submit" 
            style={primaryButtonStyle}
            disabled={loading}
          >
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>
        
        <button 
          onClick={handleGoogleSignUp}
          style={{
            ...buttonStyle,
            backgroundColor: '#4285f4',
            color: '#ffffff',
            border: '2px solid #4285f4',
            marginBottom: '15px'
          }}
          disabled={loading}
        >
          🚀 SIGN UP WITH GOOGLE
        </button>
        
        <button 
          onClick={handleAnonymousSignIn}
          style={anonymousButtonStyle}
          disabled={loading}
        >
          🎭 PLAY AS GUEST
        </button>
        
        <button 
          onClick={onSwitchToSignIn}
          style={secondaryButtonStyle}
          disabled={loading}
        >
          SIGN IN
        </button>
        
        <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <span style={linkStyle} onClick={onSwitchToSignIn}>
            Sign in here
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
