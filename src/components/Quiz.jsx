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
  }, [questionNumber, categoryKey, questions.length, usedQuestionIds]);

  if (isLoading || !currentQuestion) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '1.5rem'}}>
        Loading Quiz...
      </div>
    );
  }

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
      correct: stats.correct + (answerStatus === 'correct' ? 1 : 0),
      incorrect: stats.incorrect + (answerStatus === 'incorrect' ? 1 : 0),
      hints: stats.hints,
      score: score + (answerStatus === 'correct' ? 10 : 0)
    };

    if (user) {
      try {
        await saveQuizResult(user.uid, {
          category: categoryKey,
          score: score,
          stats: finalStats,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Error saving quiz result:', error);
      }
    }

    onQuizComplete(finalStats);
  };

  // --- Responsive helper ---
  const isMobile = window.innerWidth <= 768;
  
  // --- Style definitions ---
  const cardStyle = { 
    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
    border: '4px solid #00ffff', 
    borderRadius: isMobile ? '10px' : '20px', 
    padding: isMobile ? '12px 10px' : '40px 30px', 
    maxWidth: isMobile ? '95%' : '700px', 
    width: '100%', 
    textAlign: 'center', 
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 255, 255, 0.3)', 
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    position: 'relative', 
    fontFamily: "'Silkscreen', monospace",
    margin: isMobile ? '5px' : '0'
  };
  
  const headerStyle = { 
    display: 'flex', 
    justifyContent: isMobile ? 'center' : 'space-between', 
    alignItems: 'center', 
    marginBottom: isMobile ? '12px' : '30px', 
    borderBottom: '3px solid #00ffff', 
    paddingBottom: isMobile ? '10px' : '20px',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '10px' : '0'
  };
  
  const scoreLabelStyle = { 
    fontSize: isMobile ? '0.6rem' : '0.8rem', 
    color: '#00ffff', 
    textTransform: 'uppercase', 
    letterSpacing: '1px', 
    marginBottom: isMobile ? '0' : '5px' 
  };
  
  const scoreValueStyle = { 
    fontSize: isMobile ? '1rem' : '2rem', 
    fontWeight: 'bold', 
    color: '#fef08a', 
    textShadow: '2px 2px 0px #86198f' 
  };
  
  const questionStyle = { 
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    border: '3px solid rgba(255, 255, 255, 0.3)', 
    borderRadius: '15px', 
    padding: isMobile ? '12px 10px' : '30px', 
    marginBottom: isMobile ? '12px' : '30px', 
    fontSize: isMobile ? '0.95rem' : '1.4rem', 
    color: '#ffffff', 
    lineHeight: '1.6', 
    backdropFilter: 'blur(10px)', 
    minHeight: isMobile ? '60px' : '120px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  };

  const inputStyle = { 
    width: '100%', 
    padding: isMobile ? '10px' : '20px', 
    fontSize: isMobile ? '0.9rem' : '1.3rem', 
    textAlign: 'center', 
    border: '4px solid #ffffff', 
    borderRadius: '12px', 
    marginBottom: isMobile ? '10px' : '20px', 
    fontFamily: "'Silkscreen', monospace", 
    backgroundColor: answerStatus === 'correct' ? '#10b981' : answerStatus === 'incorrect' ? '#ef4444' : '#ffffff', 
    color: answerStatus ? '#ffffff' : '#000000', 
    transition: 'all 0.3s ease', 
    outline: 'none',
    WebkitAppearance: 'none',
    WebkitBorderRadius: '12px',
    touchAction: 'manipulation',
    minHeight: isMobile ? '40px' : '60px',
    boxSizing: 'border-box'
  };

  const buttonStyle = { 
    backgroundColor: '#ffd700', 
    color: '#000000', 
    border: '4px solid #000000', 
    borderRadius: '12px', 
    padding: isMobile ? '8px 12px' : '12px 25px', 
    fontSize: isMobile ? '0.75rem' : '1rem', 
    fontWeight: 'bold', 
    textTransform: 'uppercase', 
    letterSpacing: '1px', 
    cursor: 'pointer', 
    transition: 'all 0.3s ease', 
    fontFamily: "'Silkscreen', monospace", 
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
    minHeight: isMobile ? '36px' : '45px',
    flex: isMobile ? '1' : '1'
  };

  const hintButtonStyle = { 
    ...buttonStyle, 
    backgroundColor: '#f59e0b',
    marginRight: isMobile ? '6px' : '0',
    marginLeft: isMobile ? '0' : '15px'
  };

  const nextButtonStyle = { 
    ...buttonStyle, 
    backgroundColor: '#8b5cf6',
    flex: 'none',
    width: isMobile ? '100%' : 'auto'
  };

  const finishButtonStyle = { 
    backgroundColor: '#dc2626', 
    color: '#ffffff', 
    border: '3px solid #991b1b', 
    borderRadius: '10px', 
    padding: isMobile ? '8px 12px' : '12px 30px', 
    fontSize: isMobile ? '0.7rem' : '1rem', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    transition: 'all 0.3s ease', 
    fontFamily: "'Silkscreen', monospace", 
    textTransform: 'uppercase', 
    letterSpacing: '1px',
    minHeight: isMobile ? '36px' : '45px',
    width: isMobile ? '100%' : 'auto',
    marginTop: isMobile ? '6px' : '15px'
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

  const categoryDisplayStyle = { 
    fontSize: isMobile ? '1.3rem' : '1.8rem', 
    fontWeight: 'bold', 
    color: '#00ffff', 
    textShadow: '2px 2px 0px #000000', 
    marginBottom: '8px', 
    textAlign: 'center', 
    letterSpacing: '1px' 
  };

  return (
    <div style={{
      minHeight: '100vh', 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: isMobile ? '5px' : '20px',
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div style={cardStyle}>
        {/* Header */}
        <div style={headerStyle}>
          {isMobile ? (
            <>
              <div style={categoryDisplayStyle}>
                {sportsConfig[categoryKey]?.name?.toUpperCase() || categoryKey.toUpperCase().replace('_', ' ')} 🏆
              </div>
              <div style={{display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{textAlign: 'center'}}>
                  <div style={scoreLabelStyle}>Score</div>
                  <div style={scoreValueStyle}>{score}</div>
                </div>
                <div style={{textAlign: 'center'}}>
                  <div style={scoreLabelStyle}>Answered</div>
                  <div style={scoreValueStyle}>{stats.correct + stats.incorrect}</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{textAlign: 'center'}}>
                <div style={scoreLabelStyle}>Score</div>
                <div style={scoreValueStyle}>{score}</div>
              </div>
              <div style={categoryDisplayStyle}>
                {sportsConfig[categoryKey]?.name?.toUpperCase() || categoryKey.toUpperCase().replace('_', ' ')} 🏆
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={scoreLabelStyle}>Answered</div>
                <div style={scoreValueStyle}>{stats.correct + stats.incorrect}</div>
              </div>
            </>
          )}
        </div>

        {/* Question */}
        <div style={questionStyle}>{currentQuestion.question}</div>

        {/* Answer Form and Buttons Container */}
        <div>
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
            
            {/* Submit and Hint buttons side by side on mobile */}
            {!answerStatus && (
              <div style={{ 
                display: 'flex', 
                gap: isMobile ? '10px' : '15px', 
                marginBottom: isMobile ? '10px' : '0'
              }}>
                <button type="submit" style={buttonStyle}>
                  ⚡ SUBMIT ANSWER ⚡
                </button>
                <button 
                  type="button"
                  onClick={() => { 
                    setShowHint(true); 
                    setStats((s) => ({ ...s, hints: s.hints + 1 })); 
                  }} 
                  style={hintButtonStyle}
                >
                  💡 HINT
                </button>
              </div>
            )}
          </form>

          {/* Answer Status */}
          {answerStatus && (
            <div style={answerDisplayStyle}>
              <div style={{ fontSize: isMobile ? '1rem' : '1.2rem', marginBottom: '10px', fontWeight: 'bold' }}>
                {answerStatus === 'correct' ? '✓ CORRECT!' : '✗ INCORRECT'}
              </div>
              <div><strong>Correct Answer: {currentQuestion.answer}</strong></div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '10px' : '15px', 
            justifyContent: 'center' 
          }}>
            {answerStatus && (
              <button onClick={handleNextQuestion} style={nextButtonStyle}>
                NEXT →
              </button>
            )}
            
            <button onClick={handleFinishQuiz} style={finishButtonStyle}>
              🏁 FINISH
            </button>
          </div>

          {/* Hint Display */}
          {showHint && !answerStatus && (
            <div style={hintStyle}>
              <div style={{ fontSize: isMobile ? '0.9rem' : '1.1rem', marginBottom: '10px', fontWeight: 'bold' }}>
                💡 Hint:
              </div>
              {currentQuestion.hint}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
