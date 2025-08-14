import React, { useState, useCallback } from 'react';
import type { QuizQuestion } from '../types';
import { generateQuizQuestions, getFlagExplanation } from '../services/geminiService';
import Spinner from './common/Spinner';
import Button from './common/Button';

type QuizState = 'idle' | 'loading' | 'playing' | 'finished';

const formatExplanation = (explanation: string) => {
    // This helper function formats markdown-like text for display.
    return explanation.split('\n').filter(line => line.trim() !== '').map((line, index) => {
        if (line.startsWith('### ') || line.startsWith('## ') || line.startsWith('# ')) {
            return <h3 key={index} className="text-lg font-bold text-indigo-300 mt-3 mb-1">{line.replace(/#+\s/, '')}</h3>;
        }
        if (line.startsWith('* ')) {
            return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
        }
        return <p key={index} className="mb-2">{line}</p>;
    });
};

const QuizMode: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [flagExplanation, setFlagExplanation] = useState<string | null>(null);
  const [isExplanationLoading, setIsExplanationLoading] = useState<boolean>(false);

  const startQuiz = useCallback(async () => {
    setQuizState('loading');
    setError(null);
    try {
      const fetchedQuestions = await generateQuizQuestions();
      if (fetchedQuestions.length === 0) {
        throw new Error("No questions were generated.");
      }
      setQuestions(fetchedQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setFlagExplanation(null);
      setQuizState('playing');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setQuizState('idle');
    }
  }, []);

  const handleAnswerSelect = async (answer: string) => {
    if (selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const correct = answer === currentQuestion.correctAnswer;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
    }

    setIsExplanationLoading(true);
    setFlagExplanation(null);
    try {
        const explanation = await getFlagExplanation(currentQuestion.correctAnswer);
        setFlagExplanation(explanation);
    } catch (e) {
        setFlagExplanation('Could not load flag explanation.');
    } finally {
        setIsExplanationLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setFlagExplanation(null);
    } else {
      setQuizState('finished');
    }
  };
  
  const restartQuiz = () => {
    setQuizState('idle');
    setQuestions([]);
    setFlagExplanation(null);
  };

  const getButtonClass = (option: string) => {
    if (!selectedAnswer) {
      return 'bg-gray-700 hover:bg-indigo-600';
    }
    const isCorrectAnswer = option === questions[currentQuestionIndex].correctAnswer;
    const isSelectedAnswer = option === selectedAnswer;

    if (isCorrectAnswer) return 'bg-green-600 animate-pulse-correct';
    if (isSelectedAnswer && !isCorrectAnswer) return 'bg-red-600';
    return 'bg-gray-700 opacity-50';
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  const flagUrl = currentQuestion ? `https://flagcdn.com/h240/${currentQuestion.countryCode}.png` : '';

  if (quizState === 'idle') {
    return (
      <div className="text-center animate-fade-in">
        <h2 className="text-3xl font-extrabold text-indigo-400">Flag Knowledge Quiz</h2>
        <p className="mt-2 text-lg text-gray-400">Ready to test your flag identification skills?</p>
        <div className="mt-8">
            <Button onClick={startQuiz} size="lg">Start Quiz</Button>
            {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>
      </div>
    );
  }

  if (quizState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Spinner />
        <p className="mt-4 text-gray-400 text-lg">Generating your quiz...</p>
      </div>
    );
  }
  
  if (quizState === 'finished') {
    const percentage = Math.round((score / questions.length) * 100);
    return (
        <div className="text-center bg-gray-800 p-8 rounded-lg shadow-xl animate-fade-in">
            <h2 className="text-3xl font-bold text-indigo-400">Quiz Complete!</h2>
            <p className="text-5xl font-extrabold my-4">{percentage}%</p>
            <p className="text-xl text-gray-300">You answered {score} out of {questions.length} questions correctly.</p>
            <div className="mt-8">
                <Button onClick={restartQuiz} size="lg">Play Again</Button>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl">
            <div className="text-center mb-6">
                <p className="text-indigo-400 font-semibold">Question {currentQuestionIndex + 1} of {questions.length}</p>
                <h2 className="text-xl md:text-2xl font-bold mt-1">Which country does this flag belong to?</h2>
            </div>
            <div className="flex justify-center mb-8">
                <img src={flagUrl} alt="Country flag for quiz question" className="rounded-lg shadow-lg h-40 md:h-48" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map(option => (
                    <button
                        key={option}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={!!selectedAnswer}
                        className={`w-full text-left p-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${getButtonClass(option)} ${!selectedAnswer ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                    >
                        {option}
                    </button>
                ))}
            </div>
            
            {selectedAnswer && (
                <div className="mt-6 text-left animate-fade-in">
                    {isExplanationLoading ? (
                    <div className="flex items-center justify-center p-4">
                        <Spinner />
                        <p className="ml-3 text-gray-400">Revealing Symbolism...</p>
                    </div>
                    ) : (
                    flagExplanation && (
                        <div className="bg-gray-900/50 p-4 rounded-lg ring-1 ring-gray-700">
                        <h4 className="text-xl font-bold text-indigo-400 mb-2">
                            The Flag of {questions[currentQuestionIndex].correctAnswer}
                        </h4>
                        <div className="prose prose-invert max-w-none text-gray-300 text-sm">
                            {formatExplanation(flagExplanation)}
                        </div>
                        </div>
                    )
                    )}
                    {!isExplanationLoading && (
                      <div className="mt-6 text-center">
                          <Button onClick={handleNextQuestion} size="lg">
                              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                          </Button>
                      </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};

export default QuizMode;