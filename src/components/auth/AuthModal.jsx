import React, { useState } from 'react';
import SignIn from './SignIn.jsx';
import SignUp from './SignUp.jsx';

const AuthModal = ({ show, onClose, onAuthSuccess }) => {
  const [currentView, setCurrentView] = useState('signin'); // 'signin' or 'signup'

  if (!show) return null;

  const handleSwitchToSignUp = () => {
    setCurrentView('signup');
  };

  const handleSwitchToSignIn = () => {
    setCurrentView('signin');
  };

  const handleAuthSuccess = (user) => {
    onAuthSuccess(user);
    onClose();
  };

  return (
    <>
      {currentView === 'signin' ? (
        <SignIn 
          onClose={onClose}
          onSwitchToSignUp={handleSwitchToSignUp}
          onSignInSuccess={handleAuthSuccess}
        />
      ) : (
        <SignUp 
          onClose={onClose}
          onSwitchToSignIn={handleSwitchToSignIn}
          onSignUpSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
};

export default AuthModal;
