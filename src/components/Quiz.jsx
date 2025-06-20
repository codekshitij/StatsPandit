import React, { useState, useEffect } from "react";
import { saveQuizResult } from '../firebase/firebase.js';

const Quiz = ({ categoryKey, onQuizComplete, user }) => {
  const [allQuestions, setAllQuestions] = useState([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState(new Set());
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  
  const [score, setScore] = useState(0);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, hints: 0 });
  const [userInput, setUserInput] = useState("");
  const [answerStatus, setAnswerStatus] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to select the next random question
  const selectNextQuestion = React.useCallback((available, usedIds) => {
    let unusedQuestions = available.filter(q => !usedIds.has(q.id));
 
    // If we have run out of unique questions, reset the pool to make it unlimited.
    if (unusedQuestions.length === 0 && available.length > 0) {
      const newUsedIds = new Set(); // Create an empty set
      setUsedQuestionIds(newUsedIds); // Reset the state
      unusedQuestions = available; // All questions are now available again
    }

    // If after all that, there are still no questions (e.g. JSON files were empty), end the quiz.
    if (unusedQuestions.length === 0) {
      console.log('🏁 No questions available to select! Finishing quiz...');
      // Use current state values at call time instead of closure values
      setScore(currentScore => {
        setStats(currentStats => {
          onQuizComplete({ score: currentScore, ...currentStats });
          return currentStats;
        });
        return currentScore;
      });
      return;
    }

    const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
    const nextQuestion = unusedQuestions[randomIndex];

    console.log(`🎯 Selected question: "${nextQuestion.question}" (ID: ${nextQuestion.id})`);
    setCurrentQuestion(nextQuestion);
    // Use the function version of setState to ensure we have the latest `prevUsed`
    setUsedQuestionIds(prevUsed => new Set(prevUsed).add(nextQuestion.id));
    setQuestionNumber(prev => prev + 1);
  }, [onQuizComplete]); // Removed score and stats from dependency array


  // Effect to load all questions from JSON when the component mounts
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        let jsonData;
        switch (categoryKey) {
          case 'cricket':   jsonData = (await import('../assets/cricket_quiz_questions.json')).default; break;
          case 'football':  jsonData = (await import('../assets/american_football_quiz_questions.json')).default; break;
          case 'soccer':    jsonData = (await import('../assets/soccer_quiz_questions.json')).default; break;
          case 'formula-1': jsonData = (await import('../assets/formula1_quiz_questions.json')).default; break;
          case 'tennis':    jsonData = (await import('../assets/tennis_quiz_questions.json')).default; break;
          default: throw new Error(`Unknown category: ${categoryKey}`);
        }

        // Filter for unique questions and add a unique ID to each
        const uniqueQuestions = [];
        const seenQuestions = new Set();
        jsonData.forEach((q, index) => {
          const questionText = q.question.toLowerCase().trim();
          if (!seenQuestions.has(questionText)) {
            seenQuestions.add(questionText);
            uniqueQuestions.push({ ...q, id: `${categoryKey}-${index}` });
          }
        });
        
        setAllQuestions(uniqueQuestions);
        // Select the very first question
        if (uniqueQuestions.length > 0) {
          const firstQuestion = uniqueQuestions[Math.floor(Math.random() * uniqueQuestions.length)];
          console.log(`🎯 Initial question: "${firstQuestion.question}" (ID: ${firstQuestion.id})`);
          setCurrentQuestion(firstQuestion);
          setUsedQuestionIds(new Set().add(firstQuestion.id));
        }

      } catch (error) {
        console.error("Error loading initial questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [categoryKey, selectNextQuestion]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim() || !currentQuestion) return;
    
    const correctAnswer = currentQuestion.answer;
    const isCorrect = userInput.trim().toLowerCase() === correctAnswer.toLowerCase();
    
    console.log(`📝 Question ${questionNumber}: "${currentQuestion.question}"`);
    console.log(`💭 User answer: "${userInput.trim()}" | Correct answer: "${correctAnswer}"`);
    console.log(`✅ Result: ${isCorrect ? 'CORRECT' : 'INCORRECT'}`);
    
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
    console.log(`🔄 Moving to next question (current was Q${questionNumber})`);
    setAnswerStatus(null);
    setUserInput("");
    setShowHint(false);
    // Select the next random question from the pool
    selectNextQuestion(allQuestions, usedQuestionIds);
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

    // Save to Firebase if user is available
    if (user && user.uid) {
      try {
        await saveQuizResult(user.uid, quizData);
        console.log('✅ Quiz result saved to Firebase');
      } catch (error) {
        console.error('❌ Failed to save quiz result:', error);
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

  // --- Style definitions ---
  const cardStyle = { backgroundColor: 'rgba(0, 0, 0, 0.9)', border: '4px solid #00ffff', borderRadius: '20px', padding: '40px 30px', maxWidth: '700px', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 255, 255, 0.3)', backdropFilter: 'blur(15px)', position: 'relative', fontFamily: "'Silkscreen', monospace" };
  const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '3px solid #00ffff', paddingBottom: '20px' };
  const scoreStyle = { textAlign: 'center' };
  const scoreLabelStyle = { fontSize: '0.8rem', color: '#00ffff', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' };
  const scoreValueStyle = { fontSize: '2rem', fontWeight: 'bold', color: '#fef08a', textShadow: '2px 2px 0px #86198f' };
  const questionStyle = { backgroundColor: 'rgba(0, 0, 0, 0.7)', border: '3px solid rgba(255, 255, 255, 0.3)', borderRadius: '15px', padding: '30px', marginBottom: '30px', fontSize: '1.4rem', color: '#ffffff', lineHeight: '1.6', backdropFilter: 'blur(10px)', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
  const inputStyle = { width: '100%', padding: '20px', fontSize: '1.3rem', textAlign: 'center', border: '4px solid #ffffff', borderRadius: '12px', marginBottom: '20px', fontFamily: "'Silkscreen', monospace", backgroundColor: answerStatus === 'correct' ? '#10b981' : answerStatus === 'incorrect' ? '#ef4444' : '#ffffff', color: answerStatus ? '#ffffff' : '#000000', transition: 'all 0.3s ease', outline: 'none' };
  const buttonStyle = { backgroundColor: '#ffd700', color: '#000000', border: '4px solid #000000', borderRadius: '12px', padding: '15px 30px', fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.3s ease', fontFamily: "'Silkscreen', monospace", width: '100%', marginBottom: '15px', boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)' };
  const hintButtonStyle = { ...buttonStyle, backgroundColor: '#f59e0b', width: 'auto', flexGrow: 1, marginRight: '15px', marginBottom: '0' };
  const nextButtonStyle = { ...buttonStyle, backgroundColor: '#8b5cf6', width: 'auto', flexGrow: 1, marginBottom: '0' };
  const finishButtonStyle = { backgroundColor: '#dc2626', color: '#ffffff', border: '3px solid #991b1b', borderRadius: '10px', padding: '15px 25px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease', fontFamily: "'Silkscreen', monospace", textTransform: 'uppercase', letterSpacing: '1px', flexGrow: 1};
  const hintStyle = { backgroundColor: 'rgba(245, 158, 11, 0.2)', border: '3px solid #f59e0b', borderRadius: '15px', padding: '25px', marginTop: '25px', color: '#fbbf24', fontSize: '1.1rem', lineHeight: '1.5' };
  const answerDisplayStyle = { backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '3px solid #10b981', borderRadius: '15px', padding: '20px', marginBottom: '20px', color: '#ffffff' };
  const middleSectionStyle = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 30px' };
  const categoryDisplayStyle = { fontSize: '1.8rem', fontWeight: 'bold', color: '#00ffff', textShadow: '2px 2px 0px #000000', marginBottom: '8px', textAlign: 'center', letterSpacing: '1px' };


  return (
    <div style={{minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
      <div style={cardStyle}>
        {/* Header */}
        <div style={headerStyle}>
            <div style={scoreStyle}><div style={scoreLabelStyle}>Score</div><div style={scoreValueStyle}>{score}</div></div>
            <div style={middleSectionStyle}><div style={categoryDisplayStyle}>{categoryKey.toUpperCase().replace('-', ' ')} 🏆</div></div>
            <div style={scoreStyle}><div style={scoreLabelStyle}>Answered</div><div style={scoreValueStyle}>{stats.correct + stats.incorrect}</div></div>
        </div>

        {/* Question */}
        <div style={questionStyle}>{currentQuestion.question}</div>

        {/* Answer Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} disabled={!!answerStatus} style={inputStyle} placeholder="Type your answer..."/>
          {!answerStatus && (<button type="submit" style={buttonStyle}>⚡ SUBMIT ANSWER ⚡</button>)}
        </form>

        {/* Answer Status */}
        {answerStatus && (
          <div style={answerDisplayStyle}>
            <div style={{ fontSize: '1.2rem', marginBottom: '10px', fontWeight: 'bold' }}>{answerStatus === 'correct' ? '✓ CORRECT!' : '✗ INCORRECT'}</div>
            <div><strong>Correct Answer: {currentQuestion.answer}</strong></div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          {!answerStatus && (
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
            <div style={{ fontSize: '1.1rem', marginBottom: '10px', fontWeight: 'bold' }}>💡 Hint:</div>
            {currentQuestion.hint}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
