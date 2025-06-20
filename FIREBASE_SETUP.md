# Firebase Integration Setup Instructions

## 🔥 Firebase Setup Complete!

Your quiz application now has Firebase integration with the following features:

### ✅ **Features Added:**
1. **Anonymous Authentication** - Users are automatically signed in
2. **Quiz Result Storage** - All quiz results saved to Firestore
3. **Leaderboard** - View top scores by category or overall
4. **Real-time Data** - Results are stored and retrieved in real-time

### 🚀 **Next Steps to Complete Setup:**

#### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name (e.g., "gameover-quiz")
4. Enable Google Analytics (optional)
5. Click "Create project"

#### 2. Enable Authentication
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Anonymous** authentication
3. Click "Save"

#### 3. Create Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

#### 4. Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add a web app
4. Enter app nickname (e.g., "quiz-app")
5. Copy the Firebase configuration object

#### 5. Update Environment Variables
Replace the values in `.env` file with your actual Firebase config:

```env
VITE_FIREBASE_API_KEY=your-actual-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-actual-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
VITE_FIREBASE_APP_ID=your-actual-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

#### 6. Update Firestore Rules (Optional)
For production, update Firestore rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to leaderboard for everyone
    match /quizResults/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 🎮 **New Features in Your App:**

#### **Leaderboard Button**
- Added to the main category selection screen
- Shows top 10 scores overall or by category
- Real-time updates when new scores are posted

#### **Automatic Score Saving**
- Quiz results are automatically saved when user finishes
- Includes category, score, correct/incorrect answers, and hints used
- Anonymous user ID tracks scores without requiring login

#### **Enhanced Quiz Experience**
- Loading states while connecting to Firebase
- Error handling for network issues
- User feedback when scores are saved

### 🔧 **Files Modified:**
- `src/firebase/firebase.js` - Firebase configuration and utility functions
- `src/App.jsx` - Added authentication and user management
- `src/components/Quiz.jsx` - Added score saving to Firebase
- `src/components/CategorySelection.jsx` - Added leaderboard button
- `src/components/Leaderboard.jsx` - New leaderboard component
- `.env` - Environment variables for Firebase config

### 🚨 **Security Notes:**
- Never commit your `.env` file to version control
- The Firebase config in `.env` is safe to expose in client-side code
- Consider adding Firestore security rules for production use
- Anonymous authentication is enabled for easy onboarding

### 🎯 **Testing:**
1. Start your development server: `npm run dev`
2. Play a quiz and finish it
3. Check Firebase Console > Firestore to see saved results
4. Click the Leaderboard button to view scores
5. Try multiple categories to test category filtering

Your quiz app now has full Firebase integration! 🎉
