import React, { useState, useEffect, useRef } from "react";
import { getRandomQuestions, saveQuizResult } from '../firebase/firebase.js';

// Sports configuration for display names
const sportsConfig = {
  american_football: { name: "Football", icon: "🏈" },
  cricket: { name: "Cricket", icon: "🏏" },
  nba: { name: "NBA", icon: "🏀" }
};

const Quiz = ({ categoryKey, onQuizComplete, user }) => {
  const [questions, setQuestions] = useState([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState(new Set());
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, hints: 0 });
  const [userInput, setUserInput] = useState("");
  const [answerStatus, setAnswerStatus] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial 10 questions
  useEffect(() => {
    async function loadInitialQuestions() {
      setIsLoading(true);
      const initial = await getRandomQuestions(categoryKey, 10);
      setQuestions(initial);
      setUsedQuestionIds(new Set(initial.map(q => q.id)));
      setCurrentQuestion(initial[0] || null);
      setQuestionNumber(1);
      setIsLoading(false);
    }
    loadInitialQuestions();
  }, [categoryKey]);

  // Fetch 20 more when user reaches question 7
  useEffect(() => {
    if (questionNumber === 8 && questions.length === 10) {
      async function loadMoreQuestions() {
        const more = await getRandomQuestions(categoryKey, 20, usedQuestionIds);
        setQuestions(prev => [...prev, ...more]);
        setUsedQuestionIds(prev => {
          const newSet = new Set(prev);
          more.forEach(q => newSet.add(q.id));
          return newSet;
        });
      }
      loadMoreQuestions();
    }
  }, [questionNumber, questions.length, categoryKey, usedQuestionIds]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim() || answerStatus) return;

    const userAnswer = userInput.trim().toLowerCase();
    const correctAnswer = currentQuestion.answer.toLowerCase();
    const isCorrect = userAnswer === correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
      setAnswerStatus('correct');
    } else {
      setStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
      setAnswerStatus('incorrect');
    }

    // Auto-advance after 2 seconds
    setTimeout(() => {
      handleNextQuestion();
    }, 2000);
  };

  const handleNextQuestion = () => {
    if (questionNumber >= 10) {
      handleFinishQuiz();
      return;
    }

    const nextQuestion = questions[questionNumber];
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      setQuestionNumber(prev => prev + 1);
      setUserInput("");
      setAnswerStatus(null);
      setShowHint(false);
      
      // Focus input for next question
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = async () => {
    const finalStats = {
      score,
      correct: stats.correct,
      incorrect: stats.incorrect,
      hints: stats.hints,
      category: categoryKey
    };

    if (user) {
      try {
        await saveQuizResult(user.uid, finalStats);
      } catch (error) {
        console.error('Error saving quiz result:', error);
      }
    }
    onQuizComplete(finalStats);
  };

  if (isLoading || !currentQuestion) {
    return (
      <div style={{minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
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
            Loading {sportsConfig[categoryKey]?.name || categoryKey} Quiz...
          </div>
          <div>🎯 Preparing your questions!</div>
        </div>
      </div>
    );
  }

  // --- Responsive helper ---
  const isMobile = window.innerWidth <= 768;
  
  // --- Style definitions ---
  const cardStyle = { 
    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
    border: '4px solid #00ffff', 
    borderRadius: isMobile ? '15px' : '20px', 
    padding: isMobile ? '20px 15px' : '40px 30px', 
    maxWidth: isMobile ? '100%' : '700px', 
    width: '100%', 
    textAlign: 'center', 
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 255, 255, 0.3)', 
    backdropFilter: 'blur(20px)', // Increased blur for better contrast
    WebkitBackdropFilter: 'blur(20px)', // Safari support
    position: 'relative', 
    fontFamily: "'Silkscreen', monospace",
    margin: isMobile ? '10px' : '0'
  };

const Quiz = ({ categoryKey, onQuizComplete, user }) => {
  const { isMobile } = useResponsive();
  const [questions, setQuestions] = useState([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState(new Set());
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, hints: 0 });
  const [userInput, setUserInput] = useState("");
  const [answerStatus, setAnswerStatus] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial 10 questions
  useEffect(() => {
    async function loadInitialQuestions() {
      setIsLoading(true);
      const initial = await getRandomQuestions(categoryKey, 10);
      setQuestions(initial);
      setUsedQuestionIds(new Set(initial.map(q => q.id)));
      setCurrentQuestion(initial[0] || null);
      setQuestionNumber(1);
      setIsLoading(false);
    }
    loadInitialQuestions();
  }, [categoryKey]);

  // Fetch 20 more when user reaches question 7
  useEffect(() => {
    if (questionNumber === 8 && questions.length === 10) {
      async function loadMoreQuestions() {
        const more = await getRandomQuestions(categoryKey, 20, usedQuestionIds);
        setQuestions(prev => [...prev, ...more]);
        setUsedQuestionIds(prev => {
          const newSet = new Set(prev);
          more.forEach(q => newSet.add(q.id));
          return newSet;
        });
      }
      loadMoreQuestions();
    }
  }, [questionNumber, questions.length, categoryKey, usedQuestionIds]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim() || !currentQuestion) return;
    const correctAnswer = currentQuestion.answer;
    const isCorrect = userInput.trim().toLowerCase() === correctAnswer.toLowerCase();
    if (isCorrect) {
      setAnswerStatus("correct");
      setScore((s) => s + 100);
      setStats((s) => ({ ...s, correct: s.correct + 1 }));
    } else {
      setAnswerStatus("incorrect");
      setStats((s) => ({ ...s, incorrect: s.incorrect + 1 }));
    }
  };

  const handleNextQuestion = () => {
    setAnswerStatus(null);
    setUserInput("");
    setShowHint(false);
    // Find the next unused question
    const currentIdx = questions.findIndex(q => q.id === currentQuestion.id);
    let nextIdx = currentIdx + 1;
    if (nextIdx < questions.length) {
      setCurrentQuestion(questions[nextIdx]);
      setQuestionNumber(prev => prev + 1);
    } else {
      // No more questions, finish quiz
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = async () => {
    const quizData = {
      category: categoryKey,
      score,
      correct: stats.correct,
      incorrect: stats.incorrect,
      hints: stats.hints,
      questionsAnswered: stats.correct + stats.incorrect
    };
    if (user && user.uid) {
      try {
        await saveQuizResult(user.uid, quizData);
      } catch (error) {
        console.error("Error saving quiz result:", error);
      }
    }
    onQuizComplete(quizData);
  };

  if (isLoading || !currentQuestion) {
    return (
      <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', border: '4px solid #00ffff', borderRadius: '20px', padding: '40px', textAlign: 'center', color: '#ffffff', fontFamily: "'Silkscreen', monospace" }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Loading Questions...</div>
          <div style={{ borderRadius: '50%', width: '40px', height: '40px', border: '4px solid #00ffff', borderTopColor: 'transparent', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
        </div>
      </div>
    );
  }

  // --- Responsive helper ---
  // Using the hook-provided isMobile value
  
  // --- Style definitions ---
  const cardStyle = { 
    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
    border: '4px solid #00ffff', 
    borderRadius: isMobile ? '15px' : '20px', 
    padding: isMobile ? '25px 20px' : '40px 30px', 
    maxWidth: isMobile ? '100%' : '700px', 
    width: '100%', 
    textAlign: 'center', 
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 255, 255, 0.3)', 
    backdropFilter: 'blur(15px)', 
    position: 'relative', 
    fontFamily: "'Silkscreen', monospace",
    margin: isMobile ? '10px' : '0'
  };
  
  const headerStyle = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: isMobile ? '20px' : '30px', 
    borderBottom: '3px solid #00ffff', 
    paddingBottom: isMobile ? '15px' : '20px',
    flexDirection: isMobile ? 'row' : 'row',
    gap: isMobile ? '5px' : '0',
    flexWrap: isMobile ? 'wrap' : 'nowrap'
  };
  
  const scoreStyle = { 
    textAlign: 'center',
    minWidth: isMobile ? '60px' : '80px',
    flex: isMobile ? '0 0 auto' : 'none'
  };
  const scoreLabelStyle = { 
    fontSize: isMobile ? '0.6rem' : '0.8rem', 
    color: '#00ffff', 
    textTransform: 'uppercase', 
    letterSpacing: isMobile ? '0.5px' : '1px', 
    marginBottom: '5px' 
  };
  const scoreValueStyle = { 
    fontSize: isMobile ? '1.3rem' : '2rem', 
    fontWeight: 'bold', 
    color: '#fef08a', 
    textShadow: '2px 2px 0px #86198f',
    lineHeight: '1'
  };
  
  const questionStyle = { 
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    border: '3px solid rgba(255, 255, 255, 0.3)', 
    borderRadius: '15px', 
    padding: isMobile ? '20px 15px' : '30px', 
    marginBottom: isMobile ? '20px' : '30px', 
    fontSize: isMobile ? '1.1rem' : '1.4rem', 
    color: '#ffffff', 
    lineHeight: '1.6', 
    backdropFilter: 'blur(10px)', 
    minHeight: isMobile ? '100px' : '120px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  };
  const inputStyle = { 
    width: '100%', 
    padding: isMobile ? '15px' : '20px', 
    fontSize: isMobile ? '1.1rem' : '1.3rem', 
    textAlign: 'center', 
    border: '4px solid #ffffff', 
    borderRadius: '12px', 
    marginBottom: isMobile ? '15px' : '20px', 
    fontFamily: "'Silkscreen', monospace", 
    backgroundColor: answerStatus === 'correct' ? '#10b981' : answerStatus === 'incorrect' ? '#ef4444' : '#ffffff', 
    color: answerStatus ? '#ffffff' : '#000000', 
    transition: 'all 0.3s ease', 
    outline: 'none',
    WebkitAppearance: 'none', // Remove iOS styling
    WebkitBorderRadius: '12px', // Ensure border radius on iOS
    touchAction: 'manipulation', // Prevent zoom on mobile
    minHeight: isMobile ? '50px' : '60px', // Ensure touch target is large enough
    boxSizing: 'border-box' // Include padding in width calculation
  };
  const buttonStyle = { 
    backgroundColor: '#ffd700', 
    color: '#000000', 
    border: '4px solid #000000', 
    borderRadius: '12px', 
    padding: isMobile ? '12px 20px' : '15px 30px', 
    fontSize: isMobile ? '0.9rem' : '1.1rem', 
    fontWeight: 'bold', 
    textTransform: 'uppercase', 
    letterSpacing: '1px', 
    cursor: 'pointer', 
    transition: 'all 0.3s ease', 
    fontFamily: "'Silkscreen', monospace", 
    width: '100%', 
    marginBottom: isMobile ? '10px' : '15px', 
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
    minHeight: isMobile ? '44px' : '50px'
  };
  const hintButtonStyle = { 
    ...buttonStyle, 
    backgroundColor: '#f59e0b', 
    width: isMobile ? '100%' : 'auto', 
    flexGrow: isMobile ? 0 : 1, 
    marginRight: isMobile ? '0' : '15px', 
    marginBottom: '0' 
  };
  const nextButtonStyle = { 
    ...buttonStyle, 
    backgroundColor: '#8b5cf6', 
    width: isMobile ? '100%' : 'auto', 
    flexGrow: isMobile ? 0 : 1, 
    marginBottom: '0' 
  };
  const finishButtonStyle = { 
    backgroundColor: '#dc2626', 
    color: '#ffffff', 
    border: '3px solid #991b1b', 
    borderRadius: '10px', 
    padding: isMobile ? '12px 20px' : '15px 25px', 
    fontSize: isMobile ? '0.8rem' : '1rem', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    transition: 'all 0.3s ease', 
    fontFamily: "'Silkscreen', monospace", 
    textTransform: 'uppercase', 
    letterSpacing: '1px', 
    flexGrow: isMobile ? 0 : 1,
    minHeight: isMobile ? '44px' : '50px',
    width: isMobile ? '100%' : 'auto'
  };
  const hintStyle = { 
    backgroundColor: 'rgba(245, 158, 11, 0.2)', 
    border: '3px solid #f59e0b', 
    borderRadius: '15px', 
    padding: isMobile ? '15px' : '25px', 
    marginTop: isMobile ? '15px' : '25px', 
    color: '#fbbf24', 
    fontSize: isMobile ? '0.9rem' : '1.1rem', 
    lineHeight: '1.5' 
  };
  const answerDisplayStyle = { 
    backgroundColor: 'rgba(16, 185, 129, 0.2)', 
    border: '3px solid #10b981', 
    borderRadius: '15px', 
    padding: isMobile ? '15px' : '20px', 
    marginBottom: isMobile ? '15px' : '20px', 
    color: '#ffffff' 
  };
  const middleSectionStyle = { 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    margin: isMobile ? '0 5px' : '0 30px',
    minWidth: isMobile ? '0' : 'auto'
  };
  const categoryDisplayStyle = { 
    fontSize: isMobile ? '1.1rem' : '1.8rem', 
    fontWeight: 'bold', 
    color: '#00ffff', 
    textShadow: '2px 2px 0px #000000', 
    marginBottom: '8px', 
    textAlign: 'center', 
    letterSpacing: isMobile ? '0.5px' : '1px',
    lineHeight: isMobile ? '1.2' : '1'
  };


  return (
    <div style={{
      minHeight: '100vh', 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: isMobile ? '10px' : '20px',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={cardStyle}>
        {/* Header */}
        <div style={headerStyle}>
            <div style={scoreStyle}><div style={scoreLabelStyle}>Score</div><div style={scoreValueStyle}>{score}</div></div>
            <div style={middleSectionStyle}><div style={categoryDisplayStyle}>{sportsConfig[categoryKey]?.name?.toUpperCase() || categoryKey.toUpperCase().replace('_', ' ')} 🏆</div></div>
            <div style={scoreStyle}><div style={scoreLabelStyle}>Answered</div><div style={scoreValueStyle}>{stats.correct + stats.incorrect}</div></div>
        </div>

        {/* Question */}
        <div style={questionStyle}>{currentQuestion.question}</div>

        {/* Answer Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: isMobile ? '15px' : '20px' }}>
          <input 
            ref={inputRef}
            type="text" 
            value={userInput} 
            onChange={(e) => setUserInput(e.target.value)} 
            disabled={!!answerStatus} 
            style={inputStyle} 
            placeholder="Type your answer..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            inputMode="text"
            enterKeyHint="done"
          />
          {/* Mobile: Submit and Hint side by side */}
          {!answerStatus && isMobile && (
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button type="submit" style={{
                ...buttonStyle, 
                marginBottom: '0', 
                flexGrow: 1,
                fontSize: '0.8rem',
                padding: '12px 15px'
              }}>⚡ SUBMIT ⚡</button>
              <button type="button" onClick={() => { setShowHint(true); setStats((s) => ({ ...s, hints: s.hints + 1 })); }} style={{
                ...buttonStyle,
                backgroundColor: '#f59e0b',
                marginBottom: '0', 
                flexGrow: 1,
                fontSize: '0.8rem',
                padding: '12px 15px'
              }}>💡 HINT</button>
            </div>
          )}
          {/* Desktop: Full width submit button */}
          {!answerStatus && !isMobile && (<button type="submit" style={buttonStyle}>⚡ SUBMIT ANSWER ⚡</button>)}
        </form>

        {/* Answer Status */}
        {answerStatus && (
          <div style={answerDisplayStyle}>
            <div style={{ fontSize: isMobile ? '1rem' : '1.2rem', marginBottom: '10px', fontWeight: 'bold' }}>{answerStatus === 'correct' ? '✓ CORRECT!' : '✗ INCORRECT'}</div>
            <div><strong>Correct Answer: {currentQuestion.answer}</strong></div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: isMobile ? '10px' : '15px', 
          justifyContent: 'center', 
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'stretch'
        }}>
          {/* Desktop hint button only */}
          {!answerStatus && !isMobile && (
            <button onClick={() => { setShowHint(true); setStats((s) => ({ ...s, hints: s.hints + 1 })); }} style={hintButtonStyle}>💡 GET HINT</button>
          )}
          
          {answerStatus && (
            <button onClick={handleNextQuestion} style={nextButtonStyle}>NEXT →</button>
          )}
          
          <button onClick={handleFinishQuiz} style={finishButtonStyle}>🏁 FINISH</button>
        </div>

        {/* Hint Display */}
        {showHint && !answerStatus && (
          <div style={hintStyle}>
            <div style={{ fontSize: isMobile ? '0.9rem' : '1.1rem', marginBottom: '10px', fontWeight: 'bold' }}>💡 Hint:</div>
            {currentQuestion.hint}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
