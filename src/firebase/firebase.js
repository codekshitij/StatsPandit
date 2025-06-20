// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInAnonymously, 
  signInWithCustomToken,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  collectionGroup,
  addDoc, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  query,
  where,
  orderBy,
  limit 
} from 'firebase/firestore';

// Your web app's Firebase configuration
// Using environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (optional)
export const analytics = getAnalytics(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Enhanced Google Sign-In function with fallback
export const signInWithGoogle = async () => {
  try {
    // Try popup first
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.log('Popup error:', error.code);
    if (
      error.code === 'auth/popup-blocked' || 
      error.code === 'auth/popup-closed-by-user' ||
      error.code === 'auth/unauthorized-domain' ||
      error.message.includes('COOP') ||
      error.message.includes('Cross-Origin-Opener-Policy')
    ) {
      // Fallback to redirect if popup is blocked or COOP issues
      console.log('Popup blocked or COOP issue, falling back to redirect...');
      await signInWithRedirect(auth, googleProvider);
      return null; // Result will be handled by getRedirectResult
    }
    throw error;
  }
};

// Function to handle redirect result
export const handleGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    return result;
  } catch (error) {
    console.error('Redirect result error:', error);
    throw error;
  }
};

// Export auth functions
export {
  onAuthStateChanged,
  signInAnonymously,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut
};

// Export Firestore functions
export {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit
};

// Utility functions for your quiz app
export const saveQuizResult = async (userId, quizData) => {
  try {
    console.log('� Saving quiz result for user:', userId);
    console.log('📊 Quiz data to save:', quizData);
    
    const dataToSave = {
      category: quizData.category,
      score: quizData.score,
      correct: quizData.correct,
      incorrect: quizData.incorrect,
      hints: quizData.hints,
      timestamp: new Date(),
      questionsAnswered: quizData.questionsAnswered || 0
    };
    
    console.log('💾 Final data being saved:', dataToSave);
    
    // Save to user's subcollection: users/{userId}/quizResults
    const docRef = await addDoc(collection(db, 'users', userId, 'quizResults'), dataToSave);
    console.log('✅ Quiz result saved with ID:', docRef.id);
    
    // Update user's highest score and total games played
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const currentHighest = userData.highestScore || 0;
      const newHighest = Math.max(currentHighest, quizData.score);
      
      await updateDoc(userDocRef, {
        highestScore: newHighest,
        totalGamesPlayed: (userData.totalGamesPlayed || 0) + 1,
        gamesPlayed: (userData.gamesPlayed || 0) + 1, // Keep for backward compatibility
        lastPlayedAt: new Date()
      });
      
      console.log(`🏆 Updated user stats: highest score ${currentHighest} → ${newHighest}`);
    }
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Error saving quiz result:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error code:', error.code);
    throw error;
  }
};

export const getUserQuizHistory = async (userId) => {
  try {
    console.log('📊 Fetching quiz history for user:', userId);
    
    // Query the user's subcollection: users/{userId}/quizResults
    const q = query(
      collection(db, 'users', userId, 'quizResults'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
    
    const querySnapshot = await getDocs(q);
    const history = [];
    console.log('📊 Query snapshot size:', querySnapshot.size);
    
    querySnapshot.forEach((doc) => {
      const data = { id: doc.id, ...doc.data() };
      console.log('📊 Quiz result:', data);
      history.push(data);
    });
    
    console.log('📊 Total history items:', history.length);
    return history;
  } catch (error) {
    console.error('❌ Error getting quiz history:', error);
    throw error;
  }
};

export const getLeaderboard = async () => {
  try {
    console.log('🏆 Fetching leaderboard based on highest scores');
    
    // Query users to get their highest scores
    let q = query(
      collection(db, 'users'),
      orderBy('highestScore', 'desc'),
      limit(10)
    );
    
    const querySnapshot = await getDocs(q);
    const leaderboard = [];
    console.log('🏆 Users query snapshot size:', querySnapshot.size);
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.highestScore > 0) { // Only include users who have played games
        leaderboard.push({
          id: doc.id,
          userId: doc.id,
          nickname: userData.nickname || userData.username || 'Anonymous Player',
          username: userData.username || 'Anonymous Player',
          highestScore: userData.highestScore || 0,
          totalGamesPlayed: userData.totalGamesPlayed || 0,
          photoURL: userData.photoURL || null
        });
      }
    });
    
    console.log('🏆 Final leaderboard (by highest scores):', leaderboard);
    return leaderboard;
  } catch (error) {
    console.error('❌ Error getting leaderboard:', error);
    throw error;
  }
};

// Function to create or update user profile
export const createUserProfile = async (user, additionalData = {}) => {
  if (!user || !user.uid) return;
  
  try {
    console.log('🔄 Creating/updating user profile for:', user.uid);
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // For Google users, don't set a default nickname to force nickname setup
      // For email users, use the provided nickname
      let nickname = '';
      let needsNicknameSetup = false;
      
      if (additionalData.provider === 'google') {
        // Google users need to set up their nickname
        nickname = ''; // Leave empty to force nickname setup
        needsNicknameSetup = true;
      } else if (additionalData.provider === 'email') {
        // Email users should have provided a nickname during signup
        nickname = additionalData.nickname || 'Player';
        needsNicknameSetup = false;
      } else {
        // Anonymous users get a default nickname
        nickname = 'Guest Player';
        needsNicknameSetup = false;
      }

      const userData = {
        username: user.displayName || additionalData.username || 'User',
        nickname: nickname,
        email: user.email || additionalData.email || '',
        photoURL: user.photoURL || additionalData.photoURL || '',
        provider: additionalData.provider || 'unknown',
        needsNicknameSetup: needsNicknameSetup,
        createdAt: new Date(),
        gamesPlayed: 0,
        highestScore: 0, // Track personal best score
        totalGamesPlayed: 0,
        ...additionalData
      };
      
      await setDoc(userDocRef, userData);
      console.log('✅ User profile created successfully:', userData);
      return userData;
    } else {
      console.log('ℹ️ User profile already exists');
      return userDoc.data();
    }
  } catch (error) {
    console.error('❌ Error creating user profile:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error code:', error.code);
    throw error;
  }
};

// Update user nickname
export const updateUserNickname = async (userId, nickname) => {
  try {
    console.log('✏️ Updating nickname for user:', userId, 'to:', nickname);
    
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      nickname: nickname,
      needsNicknameSetup: false, // Clear the setup flag
      updatedAt: new Date()
    });
    
    console.log('✅ Nickname updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Error updating nickname:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      console.log('👤 No user profile found for:', userId);
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting user profile:', error);
    throw error;
  }
};

// Test function to check Firestore connectivity
export const testFirestoreConnection = async () => {
  try {
    console.log('🔍 Testing Firestore connection...');
    
    // Test reading from users collection
    const usersQuery = query(collection(db, 'users'), limit(1));
    const usersSnapshot = await getDocs(usersQuery);
    console.log('✅ Users collection accessible. Documents found:', usersSnapshot.size);
    
    // Test reading from quizResults subcollections using collection group
    const resultsQuery = query(collectionGroup(db, 'quizResults'), limit(1));
    const resultsSnapshot = await getDocs(resultsQuery);
    console.log('✅ QuizResults subcollections accessible. Documents found:', resultsSnapshot.size);
    
    resultsSnapshot.forEach((doc) => {
      console.log('📄 Sample quiz result:', doc.id, doc.data());
      console.log('📄 User ID from path:', doc.ref.parent.parent.id);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Firestore connection test failed:', error);
    return false;
  }
};

// Test function to create a sample quiz result for debugging
export const testQuizResultSave = async (userId) => {
  try {
    console.log('🧪 Testing quiz result save for user:', userId);
    
    const testData = {
      category: 'test',
      score: 100,
      correct: 1,
      incorrect: 0,
      hints: 0,
      questionsAnswered: 1
    };
    
    const resultId = await saveQuizResult(userId, testData);
    console.log('✅ Test quiz result saved successfully:', resultId);
    
    // Try to read it back
    const history = await getUserQuizHistory(userId);
    console.log('📊 User quiz history after test save:', history);
    
    return true;
  } catch (error) {
    console.error('❌ Test quiz result save failed:', error);
    return false;
  }
};

export default app;
