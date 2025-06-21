import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import CategorySelection from './components/CategorySelection.jsx';
import Quiz from './components/Quiz.jsx';
import FinalScore from './components/FinalScore.jsx';
import LandingPage from './components/LandingPage.jsx';
import NicknameSetup from './components/auth/NicknameSetup.jsx';
import Footer from './components/Footer.jsx';
import './App.css'; // Import the stylesheet

import { auth, onAuthStateChanged, getUserProfile } from './firebase/firebase.js';

// Route wrapper components
const LandingRoute = ({ user, userProfile }) => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    if (user) {
      if (!userProfile?.nickname) {
        navigate('/nickname');
      } else {
        navigate('/categories');
      }
    } else {
      navigate('/categories');
    }
  };
  
  return <LandingPage onGetStarted={handleGetStarted} />;
};

const NicknameRoute = ({ user, userProfile }) => {
  const navigate = useNavigate();
  
  // Redirect if already has nickname or not authenticated
  if (!user || userProfile?.nickname) {
    return <Navigate to="/categories" replace />;
  }
  
  const handleComplete = () => {
    navigate('/categories');
  };
  
  const handleSkip = () => {
    navigate('/categories');
  };
  
  return <NicknameSetup user={user} onComplete={handleComplete} onSkip={handleSkip} />;
};

const CategoriesRoute = ({ user }) => {
  const navigate = useNavigate();
  
  const handleSelectCategory = (categoryKey) => {
    navigate(`/quiz?category=${categoryKey}`);
  };
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  return <CategorySelection onSelectCategory={handleSelectCategory} onGoHome={handleGoHome} user={user} />;
};

const QuizRoute = ({ user }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryKey = searchParams.get('category');
  
  if (!categoryKey) {
    return <Navigate to="/categories" replace />;
  }
  
  const handleQuizComplete = (stats) => {
    const params = new URLSearchParams({
      score: stats.score,
      correct: stats.correct,
      incorrect: stats.incorrect,
      category: stats.category
    });
    navigate(`/score?${params.toString()}`);
  };
  
  return <Quiz categoryKey={categoryKey} onQuizComplete={handleQuizComplete} user={user} />;
};

const ScoreRoute = ({ user }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const score = searchParams.get('score');
  const correct = searchParams.get('correct');
  const incorrect = searchParams.get('incorrect');
  const category = searchParams.get('category');
  
  if (!score || !correct || !incorrect || !category) {
    return <Navigate to="/categories" replace />;
  }
  
  const stats = {
    score: parseInt(score),
    correct: parseInt(correct),
    incorrect: parseInt(incorrect),
    category
  };
  
  const handlePlayAgain = () => {
    navigate('/categories');
  };
  
  return <FinalScore stats={stats} onPlayAgain={handlePlayAgain} user={user} />;
};

// Background wrapper component
const BackgroundWrapper = ({ children }) => {
  const location = useLocation();
  
  const backgroundImages = {
    '/categories': '/Whisk_60686ed10b.jpg',
    '/quiz': '/Whisk_21fcb08b54.jpg',
    '/score': '/Whisk_756f4e755d.jpg',
    '/nickname': '/Whisk_1c60743c3b.jpg'
  };

  const isLandingPage = location.pathname === '/';
  const backgroundImage = backgroundImages[location.pathname];

  const appStyle = {
    backgroundImage: !isLandingPage && backgroundImage ? `url(${backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    width: '100vw',
  };

  return (
    <div className="flex flex-col min-h-screen w-full" style={appStyle}>
      <div className="flex-1 flex items-center justify-center p-4 pb-24">
        <div className="w-full max-w-4xl mx-auto">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}; 
function App() {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize Firebase Auth
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log('🔄 Auth state changed:', user ? user.uid : 'No user');
            
            if (user) {
                setUser(user);
                
                // Get user profile to determine next steps
                try {
                    const profile = await getUserProfile(user.uid);
                    setUserProfile(profile);
                    console.log('👤 User profile loaded:', profile);
                } catch (error) {
                    console.error('❌ Error fetching user profile:', error);
                }
            } else {
                // User signed out
                setUser(null);
                setUserProfile(null);
                console.log('👋 User signed out');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    border: '4px solid #00ffff',
                    borderRadius: '20px',
                    padding: '40px',
                    textAlign: 'center',
                    color: '#ffffff',
                    fontFamily: "'Silkscreen', monospace"
                }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
                        Initializing Game...
                    </div>
                    <div>🎮 Getting ready for quiz action!</div>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <BackgroundWrapper>
                <Routes>
                    <Route path="/" element={<LandingRoute user={user} userProfile={userProfile} />} />
                    <Route path="/nickname" element={<NicknameRoute user={user} userProfile={userProfile} />} />
                    <Route path="/categories" element={<CategoriesRoute user={user} />} />
                    <Route path="/quiz" element={<QuizRoute user={user} />} />
                    <Route path="/score" element={<ScoreRoute user={user} />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BackgroundWrapper>
        </Router>
    );
}

export default App;
