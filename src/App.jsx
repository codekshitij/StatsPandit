import React, { useState, useEffect } from 'react';
import CategorySelection from './components/CategorySelection.jsx';
import Quiz from './components/Quiz.jsx';
import FinalScore from './components/FinalScore.jsx';
import LandingPage from './components/LandingPage.jsx';
import NicknameSetup from './components/auth/NicknameSetup.jsx';
import './App.css'; // Import the stylesheet

import { auth, onAuthStateChanged, getUserProfile } from './firebase/firebase.js'; 
function App() {
    const [screen, setScreen] = useState('landing'); // 'landing', 'category', 'quiz', 'score', 'nickname'
    const [categoryKey, setCategoryKey] = useState(null);
    const [finalStats, setFinalStats] = useState(null);
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [needsNickname, setNeedsNickname] = useState(false);

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
                    
                    // Only auto-redirect if we're still on the landing page
                    // This prevents interfering with manual navigation
                    if (screen === 'landing') {
                        if (profile && profile.needsNicknameSetup) {
                            console.log('🏷️ User needs nickname setup');
                            setNeedsNickname(true);
                            setScreen('nickname');
                        } else {
                            console.log('✅ User ready for categories');
                            setScreen('category');
                        }
                    }
                } catch (error) {
                    console.error('❌ Error fetching user profile:', error);
                    // Fallback to category if profile fetch fails
                    if (screen === 'landing') {
                        setScreen('category');
                    }
                }
            } else {
                // User signed out
                setUser(null);
                setUserProfile(null);
                setNeedsNickname(false);
                console.log('👋 User signed out');
                setScreen('landing');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [screen]); // Only depend on screen to prevent unnecessary calls

    const handleGetStarted = async (authenticatedUser) => {
        console.log('🚀 handleGetStarted called for user:', authenticatedUser.uid);
        
        // The auth state change handler will take care of redirecting
        // We just need to ensure the user is set
        setUser(authenticatedUser);
        
        // Get the latest profile to determine next steps
        try {
            const profile = await getUserProfile(authenticatedUser.uid);
            setUserProfile(profile);
            console.log('📋 Fresh profile loaded:', profile);
            
            if (profile && profile.needsNicknameSetup) {
                console.log('🏷️ Redirecting to nickname setup');
                setNeedsNickname(true);
                setScreen('nickname');
            } else {
                console.log('✅ Redirecting to category selection');
                setScreen('category');
            }
        } catch (error) {
            console.error('❌ Error in handleGetStarted:', error);
            // Fallback to category
            setScreen('category');
        }
    };

    const handleNicknameComplete = async (nickname) => {
        console.log('🏷️ Nickname set:', nickname);
        setNeedsNickname(false);
        setScreen('category');
        
        // Refresh user profile to get updated data
        if (user) {
            try {
                const updatedProfile = await getUserProfile(user.uid);
                setUserProfile(updatedProfile);
                console.log('📋 Profile refreshed after nickname update:', updatedProfile);
            } catch (error) {
                console.error('❌ Error refreshing profile:', error);
            }
        }
    };

    const handleNicknameSkip = () => {
        console.log('Nickname setup skipped');
        setNeedsNickname(false);
        setScreen('category');
    };

    const handleCategorySelect = (key) => {
        setCategoryKey(key);
        setScreen('quiz');
    };

    const handleQuizComplete = (stats) => {
        setFinalStats(stats);
        setScreen('score');
    };

    const handlePlayAgain = () => {
        setScreen('category');
        setCategoryKey(null);
        setFinalStats(null);
    };
    
    const backgroundImages = {
        category: '/src/assets/Whisk_60686ed10b.jpg',
        quiz: '/src/assets/Whisk_21fcb08b54.jpg',
        score: '/src/assets/Whisk_756f4e755d.jpg',


    };

    const appStyle = {
        backgroundImage: `url(${backgroundImages[screen]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'auto',
    };

    const renderScreen = () => {
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

        switch (screen) {
            case 'landing': return <LandingPage onGetStarted={handleGetStarted} />;
            case 'nickname': return <NicknameSetup user={user} onComplete={handleNicknameComplete} onSkip={handleNicknameSkip} />;
            case 'quiz': return <Quiz categoryKey={categoryKey} onQuizComplete={handleQuizComplete} user={user} />;
            case 'score': return <FinalScore stats={finalStats} onPlayAgain={handlePlayAgain} user={user} />;
            default: return <CategorySelection onSelectCategory={handleCategorySelect} user={user} />;
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full" style={appStyle}>
            <div className="w-full h-full flex items-center justify-center p-4">
                <div className="w-full max-w-4xl mx-auto">
                    {renderScreen()}
                </div>
            </div>
        </div>
    );
}

export default App;
