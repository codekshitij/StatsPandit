# 🏆 Stats Pandit - The Ultimate Sports Quiz Experience

> Test your sports knowledge across Cricket, Football, Soccer, Tennis & Formula 1 with our interactive quiz platform!

![Stats Pandit](https://img.shields.io/badge/Stats-Pandit-00ffff?style=for-the-badge&logo=sports&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## 🎯 Features

### 🚀 Core Gameplay
- **Random Question Selection**: Every quiz is unique with randomly selected questions
- **Multiple Sports Categories**: Cricket, American Football, Soccer, Tennis, and Formula 1
- **Hint System**: Get helpful hints when you're stuck (but they count against your stats!)
- **Real-time Scoring**: Track your performance with live score updates
- **Accuracy Tracking**: See your percentage accuracy and improvement over time

### 🎮 User Experience
- **Anonymous Play**: Jump right in without creating an account
- **Google Authentication**: Sign in with Google for persistent progress tracking
- **User Profiles**: Track your quiz history and achievements
- **Title System**: Earn titles based on your performance (Rookie, Pro, Expert, Legend)
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile devices

### 📊 Analytics & Progress
- **Detailed Statistics**: Track correct answers, incorrect answers, and hints used
- **Performance Badges**: Visual feedback based on your quiz performance
- **Progress Tracking**: See your improvement over time with detailed analytics
- **Leaderboard**: Compete with other players (coming soon)

### 🎨 Design & UI
- **Retro Gaming Aesthetic**: Silkscreen font and neon cyber styling
- **Dynamic Backgrounds**: Beautiful sports-themed background images
- **Smooth Animations**: Engaging hover effects and transitions
- **Mobile-First**: Optimized for touch devices with appropriate sizing

## 🏗️ Technical Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Lightning-fast build tool and development server
- **React Router** - Client-side routing for seamless navigation
- **CSS-in-JS** - Styled components with responsive design
- **React Icons** - Beautiful iconography throughout the app

### Backend & Services
- **Firebase Authentication** - Secure user authentication (Google OAuth + Anonymous)
- **Cloud Firestore** - Real-time database for user profiles and quiz data
- **Firebase Hosting** - Fast, secure hosting with global CDN
- **Netlify** - Alternative deployment with custom headers and redirects

### Development Tools
- **ESLint** - Code linting and formatting
- **Git** - Version control with semantic commits
- **Environment Variables** - Secure configuration management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stats-pandit.git
   cd stats-pandit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Google & Anonymous providers)
   - Create a Firestore database
   - Copy your Firebase config

4. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   Add your Firebase configuration to `.env.local`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎮 How to Play

1. **Choose Your Path**
   - Play as Guest (anonymous) for quick games
   - Sign in with Google to track your progress

2. **Select a Category**
   - Cricket 🏏
   - American Football 🏈
   - Soccer ⚽
   - Tennis 🎾
   - Formula 1 🏎️

3. **Answer Questions**
   - Type your answers in the input field
   - Use hints if you need help (counts against stats)
   - Track your score in real-time

4. **View Results**
   - See your final score and statistics
   - Earn performance badges
   - Check your accuracy percentage

## 📁 Project Structure

```
stats-pandit/
├── public/
│   ├── _headers              # Netlify custom headers
│   ├── _redirects           # SPA routing for Netlify
│   └── assets/              # Background images and videos
├── src/
│   ├── components/
│   │   ├── auth/            # Authentication components
│   │   │   ├── AuthModal.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   └── NicknameSetup.jsx
│   │   ├── CategorySelection.jsx
│   │   ├── Quiz.jsx
│   │   ├── FinalScore.jsx
│   │   ├── Leaderboard.jsx
│   │   └── LandingPage.jsx
│   ├── firebase/
│   │   └── firebase.js      # Firebase configuration
│   ├── utils/
│   │   └── responsive.js    # Responsive design utilities
│   ├── App.jsx              # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── firebase.json            # Firebase configuration
├── netlify.toml            # Netlify deployment config
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies and scripts
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Firebase
npm run firebase:deploy    # Deploy to Firebase
npm run firebase:serve     # Serve Firebase functions locally

# Utilities
npm run clean              # Clean build artifacts
npm run analyze           # Analyze bundle size
```

## 🌐 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy automatically on every push

### Firebase Hosting
```bash
npm run build
firebase deploy
```

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🎨 Customization

### Adding New Sports Categories
1. Add category data to `localQuizData` in `CategorySelection.jsx`
2. Create question data in Firestore
3. Add category icon and styling
4. Update routing in `App.jsx`

### Styling & Themes
- Modify CSS variables in `index.css`
- Update component styles in individual files
- Customize color scheme and fonts
- Add new animations and transitions

### Adding Features
- New question types (multiple choice, true/false)
- Multiplayer mode
- Timed quizzes
- Achievement system
- Social sharing

## 🔒 Security & Privacy

- **Authentication**: Secure Firebase Auth with Google OAuth
- **Data Protection**: All user data encrypted in Firestore
- **Privacy First**: Anonymous play option available
- **HTTPS Only**: All traffic encrypted with SSL/TLS
- **CSP Headers**: Content Security Policy for XSS protection

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Test on both desktop and mobile devices
- Ensure accessibility standards
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Sports Data**: Question data sourced from various sports databases
- **Design Inspiration**: Retro gaming and cyber aesthetics
- **Icons**: React Icons library
- **Fonts**: Google Fonts (Silkscreen)
- **Hosting**: Firebase and Netlify for reliable hosting

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/stats-pandit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/stats-pandit/discussions)
- **Email**: support@statspandit.com
- **Discord**: [Join our community](https://discord.gg/statspandit)

---

<div align="center">

**Built with ❤️ by [Your Name](https://github.com/yourusername)**

[🎮 Play Now](https://stats-pandit.netlify.app) • [📖 Documentation](https://github.com/yourusername/stats-pandit/wiki) • [🐛 Report Bug](https://github.com/yourusername/stats-pandit/issues)

</div>
