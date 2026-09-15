import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import DashboardLayout from "../component/DashboardLayout";
import confetti from "canvas-confetti";
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  Zap,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Play,
  BarChart2,
  X,
} from "lucide-react";
import "./quizzes.css";

function Quizzes() {
  const { user, awardXP } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // Quiz History
  const [history, setHistory] = useState([
    {
      _id: "h1",
      quizTitle: "React 19 & Frontend Engineering Assessment",
      score: 90,
      accuracy: 90,
      timeTaken: "6 mins 40 sec",
      date: "Yesterday",
      strongTopics: ["React 19", "Performance"],
      weakTopics: [],
    },
    {
      _id: "h2",
      quizTitle: "Node.js, Express & Database Systems Quiz",
      score: 82,
      accuracy: 82,
      timeTaken: "8 mins 15 sec",
      date: "3 days ago",
      strongTopics: ["Express Middlewares"],
      weakTopics: ["DBMS Normalization"],
    },
  ]);

  const fallbackQuizzes = [
    {
      _id: "q-1",
      title: "React 19 & Frontend Engineering Assessment",
      category: "Frontend",
      difficulty: "Medium",
      durationMinutes: 10,
      totalMarks: 100,
      description: "Evaluate your knowledge of React 19 hooks, compiler optimizations, and state management.",
      questions: [
        {
          questionText: "What hook in React 19 allows reading the value of a Promise or Context synchronously?",
          options: ["useAsync()", "use()", "usePromise()", "useResource()"],
          correctOptionIndex: 1,
          explanation: "React 19 introduced the use() API to consume resources synchronously within render.",
          topic: "React 19"
        },
        {
          questionText: "Why does React require keys when rendering lists of elements?",
          options: [
            "To optimize CSS layout calculation",
            "To help React identify which items have changed, been added, or removed during reconciliation",
            "To bind event listeners to the window object",
            "To ensure synchronous database synchronization"
          ],
          correctOptionIndex: 1,
          explanation: "Keys give elements a stable identity so the diffing algorithm minimizes DOM mutations.",
          topic: "Virtual DOM"
        },
        {
          questionText: "Which hook should be used to memorize an expensive computed calculation?",
          options: ["useCallback", "useMemo", "useRef", "useEffect"],
          correctOptionIndex: 1,
          explanation: "useMemo caches the result of a calculation between re-renders.",
          topic: "Performance"
        },
        {
          questionText: "What does the Virtual DOM provide over direct DOM manipulation?",
          options: [
            "Eliminates the need for JavaScript entirely",
            "Batches updates and computes minimal diffs before applying changes to the actual DOM",
            "Replaces the browser's rendering engine with WebAssembly",
            "Stores HTML inside localStorage permanently"
          ],
          correctOptionIndex: 1,
          explanation: "Virtual DOM computes diffs in memory to minimize expensive layout repaints.",
          topic: "Virtual DOM"
        }
      ]
    },
    {
      _id: "q-2",
      title: "Node.js, Express & Database Systems Quiz",
      category: "Backend & DBMS",
      difficulty: "Medium",
      durationMinutes: 10,
      totalMarks: 100,
      description: "Test your understanding of Node.js event loop, Express middleware, and MongoDB query design.",
      questions: [
        {
          questionText: "How does Node.js handle non-blocking asynchronous I/O operations?",
          options: [
            "By spawning a new operating system thread for every single HTTP request",
            "Using the Libuv event loop and an underlying thread pool for asynchronous tasks",
            "By executing all code synchronously on multiple CPU cores automatically",
            "By compiling JavaScript code into native C++ binaries at runtime"
          ],
          correctOptionIndex: 1,
          explanation: "Node.js relies on Libuv to handle event-driven, non-blocking I/O across a single main thread.",
          topic: "Node.js Internals"
        },
        {
          questionText: "What is the primary role of the 'next()' function in an Express middleware?",
          options: [
            "Terminates the HTTP connection immediately",
            "Passes control to the next middleware function in the stack",
            "Reroutes the user back to the login page",
            "Commits the active database transaction"
          ],
          correctOptionIndex: 1,
          explanation: "Calling next() tells Express to invoke the next middleware in the chain.",
          topic: "Express"
        },
        {
          questionText: "In MongoDB, what does the ESR rule stand for when designing compound indexes?",
          options: [
            "Entity, System, Relation",
            "Equality, Sort, Range",
            "Encrypted, Secure, Replicated",
            "Execute, Save, Rollback"
          ],
          correctOptionIndex: 1,
          explanation: "The ESR rule advises structuring index keys in Equality first, Sort second, and Range third.",
          topic: "MongoDB"
        },
        {
          questionText: "Which database normal form eliminates transitive dependencies?",
          options: ["First Normal Form (1NF)", "Second Normal Form (2NF)", "Third Normal Form (3NF)", "BCNF"],
          correctOptionIndex: 2,
          explanation: "3NF requires that a relation is in 2NF and no non-prime attribute is transitively dependent on the primary key.",
          topic: "DBMS"
        }
      ]
    }
  ];

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await apiClient.get("/quizzes");
        if (res.data && res.data.quizzes && res.data.quizzes.length > 0) {
          setQuizzes(res.data.quizzes);
        } else {
          setQuizzes(fallbackQuizzes);
        }
      } catch (err) {
        console.warn("Using offline fallback quizzes:", err.message);
        setQuizzes(fallbackQuizzes);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // Timer countdown when active quiz is running
  useEffect(() => {
    if (!activeQuiz || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuiz, isSubmitted, selectedAnswers]);

  const startQuiz = async (quiz) => {
    // If questions were excluded in list, fetch full quiz details
    try {
      const res = await apiClient.get(`/quizzes/${quiz._id}`);
      if (res.data && res.data.quiz && res.data.quiz.questions?.length > 0) {
        setActiveQuiz(res.data.quiz);
      } else {
        const matched = fallbackQuizzes.find((q) => q._id === quiz._id) || fallbackQuizzes[0];
        setActiveQuiz(matched);
      }
    } catch {
      const matched = fallbackQuizzes.find((q) => q._id === quiz._id) || fallbackQuizzes[0];
      setActiveQuiz(matched);
    }

    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeft((quiz.durationMinutes || 10) * 60);
    setIsSubmitted(false);
    setQuizResult(null);
  };

  const handleSelectOption = (questionIndex, optionIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex,
    });
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;

    const timeSpentSeconds = (activeQuiz.durationMinutes || 10) * 60 - timeLeft;
    const minutes = Math.floor(timeSpentSeconds / 60);
    const seconds = timeSpentSeconds % 60;
    const formattedTime = `${minutes} mins ${seconds} sec`;

    try {
      const res = await apiClient.post("/quizzes/submit", {
        quizId: activeQuiz._id,
        userId: user?.id || user?._id || "papu-das-mca",
        answers: selectedAnswers,
        timeTakenSeconds: timeSpentSeconds,
      });

      if (res.data && res.data.result) {
        const r = res.data.result;
        setQuizResult({
          score: r.score,
          accuracy: r.accuracy,
          timeTaken: formattedTime,
          strongTopics: r.strongTopics || ["Core Concepts"],
          weakTopics: r.weakTopics || [],
          reviewDetails: r.reviewDetails,
          xpEarned: r.xpEarned || 100,
        });
        awardXP(r.xpEarned || 100);
      }
    } catch {
      // Local calculation fallback
      let correct = 0;
      const strong = new Set();
      const weak = new Set();

      activeQuiz.questions.forEach((q, i) => {
        if (selectedAnswers[i] === q.correctOptionIndex) {
          correct++;
          strong.add(q.topic || "Core Concept");
        } else {
          weak.add(q.topic || "Core Concept");
        }
      });

      const score = Math.round((correct / activeQuiz.questions.length) * 100);
      const resultObj = {
        score,
        accuracy: score,
        timeTaken: formattedTime,
        strongTopics: Array.from(strong),
        weakTopics: Array.from(weak),
        xpEarned: 100,
        reviewDetails: activeQuiz.questions.map((q, i) => ({
          questionText: q.questionText,
          options: q.options,
          studentAnswer: selectedAnswers[i],
          correctAnswer: q.correctOptionIndex,
          isCorrect: selectedAnswers[i] === q.correctOptionIndex,
          explanation: q.explanation,
          topic: q.topic,
        })),
      };
      setQuizResult(resultObj);
      awardXP(100);
    }

    setIsSubmitted(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    toast.success("Quiz submitted successfully! Check your assessment report.");
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <DashboardLayout>
      <div className="quizzes-saas-page">
        <div className="saas-container">
          {/* Top Header */}
          <div className="quizzes-header">
            <span className="saas-badge badge-purple">Skill Evaluations</span>
            <h1 className="quizzes-title">Assessments & Timed Practice Quizzes</h1>
            <p className="quizzes-subtitle">
              Validate your mastery with timed MCQs, instant performance breakdowns, strong vs weak topic analysis, and earn XP badges.
            </p>
          </div>

        {/* QUIZ TAKING MODAL / VIEW */}
        {activeQuiz && (
          <div className="active-quiz-overlay">
            <div className="active-quiz-modal saas-card">
              {/* Modal Topbar */}
              <div className="quiz-modal-header">
                <div>
                  <span className="saas-badge badge-purple">{activeQuiz.category}</span>
                  <h2 className="modal-quiz-title">{activeQuiz.title}</h2>
                </div>

                {!isSubmitted && (
                  <div className={`quiz-timer-pill ${timeLeft < 120 ? "timer-warning" : ""}`}>
                    <Clock size={16} />
                    <span>{formatTimer(timeLeft)}</span>
                  </div>
                )}

                <button className="close-quiz-btn" onClick={() => setActiveQuiz(null)}>
                  <X size={20} />
                </button>
              </div>

              {/* ACTIVE QUESTION OR RESULT */}
              {!isSubmitted ? (
                <div className="quiz-testing-area">
                  {/* Progress Indicator */}
                  <div className="question-progress-bar">
                    <span className="q-count-text">
                      Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                    </span>
                    <div className="saas-progress-track">
                      <div
                        className="saas-progress-fill"
                        style={{
                          width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Current Question */}
                  <div className="question-box">
                    <h3 className="question-text">
                      {activeQuiz.questions[currentQuestionIndex].questionText}
                    </h3>

                    {/* Options List */}
                    <div className="options-grid">
                      {activeQuiz.questions[currentQuestionIndex].options.map((option, optIdx) => {
                        const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                        return (
                          <div
                            key={optIdx}
                            className={`option-choice-card ${isSelected ? "selected" : ""}`}
                            onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                          >
                            <span className="option-letter">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="option-label">{option}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Nav & Submit Controls */}
                  <div className="quiz-nav-row">
                    <button
                      className="btn-saas btn-saas-secondary"
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                    >
                      Previous
                    </button>

                    {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                      <button
                        className="btn-saas btn-saas-primary"
                        onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                      >
                        Next Question
                      </button>
                    ) : (
                      <button
                        className="btn-saas btn-saas-primary"
                        onClick={handleSubmitQuiz}
                      >
                        Submit Assessment
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* QUIZ RESULT VIEW */
                <div className="quiz-result-report">
                  <div className="result-score-hero">
                    <div className="score-circle">
                      <span className="score-num">{quizResult?.score}%</span>
                      <span className="score-label">Score</span>
                    </div>

                    <div className="result-headline-block">
                      <h3>
                        {quizResult?.score >= 80 ? "🎉 Outstanding Performance!" : "Good Effort! Keep Practicing!"}
                      </h3>
                      <p>You have earned <strong>+{quizResult?.xpEarned || 100} XP</strong> for completing this assessment.</p>
                    </div>
                  </div>

                  {/* 4 Stats Metrics */}
                  <div className="result-metrics-grid">
                    <div className="result-stat-box">
                      <span className="label">Score</span>
                      <strong className="val text-emerald">{quizResult?.score} / 100</strong>
                    </div>
                    <div className="result-stat-box">
                      <span className="label">Accuracy</span>
                      <strong className="val text-cyan">{quizResult?.accuracy}%</strong>
                    </div>
                    <div className="result-stat-box">
                      <span className="label">Time Taken</span>
                      <strong className="val text-purple">{quizResult?.timeTaken}</strong>
                    </div>
                    <div className="result-stat-box">
                      <span className="label">XP Earned</span>
                      <strong className="val text-amber">+{quizResult?.xpEarned} ⚡</strong>
                    </div>
                  </div>

                  {/* Strong Topics & Topics to Improve */}
                  <div className="topics-analysis-grid">
                    <div className="topic-card strong-topics">
                      <div className="topic-header">
                        <CheckCircle2 size={18} className="text-emerald" />
                        <h4>Strong Topics</h4>
                      </div>
                      <div className="topic-chips">
                        {quizResult?.strongTopics?.map((t, i) => (
                          <span key={i} className="saas-badge badge-emerald">{t}</span>
                        ))}
                      </div>
                    </div>

                    <div className="topic-card weak-topics">
                      <div className="topic-header">
                        <AlertTriangle size={18} className="text-amber" />
                        <h4>Topics to Improve</h4>
                      </div>
                      <div className="topic-chips">
                        {quizResult?.weakTopics?.length > 0 ? (
                          quizResult.weakTopics.map((t, i) => (
                            <span key={i} className="saas-badge badge-amber">{t}</span>
                          ))
                        ) : (
                          <small className="text-muted">None! You nailed all concepts.</small>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Detailed Question Review with Explanations */}
                  <div className="detailed-review-section">
                    <h4>Detailed Answer Explanations</h4>
                    <div className="review-list">
                      {quizResult?.reviewDetails?.map((q, idx) => (
                        <div
                          key={idx}
                          className={`review-item ${q.isCorrect ? "correct-border" : "wrong-border"}`}
                        >
                          <div className="review-q-top">
                            <span className="q-number">Q{idx + 1}:</span>
                            <span className="q-title">{q.questionText}</span>
                            {q.isCorrect ? (
                              <CheckCircle2 size={18} className="text-emerald shrink-0" />
                            ) : (
                              <XCircle size={18} className="text-rose shrink-0" />
                            )}
                          </div>

                          <div className="review-answers-block">
                            <div className="ans-line">
                              <span>Your Answer:</span>
                              <strong>{q.options[q.studentAnswer] || "Not Answered"}</strong>
                            </div>
                            <div className="ans-line text-emerald">
                              <span>Correct Answer:</span>
                              <strong>{q.options[q.correctAnswer]}</strong>
                            </div>
                          </div>

                          <div className="explanation-box">
                            <strong>Explanation:</strong> {q.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="result-actions-footer">
                    <button
                      className="btn-saas btn-saas-secondary"
                      onClick={() => setActiveQuiz(null)}
                    >
                      Close Assessment
                    </button>
                    <button
                      className="btn-saas btn-saas-primary"
                      onClick={() => startQuiz(activeQuiz)}
                    >
                      <RotateCcw size={16} /> Retake Quiz
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quizzes Catalog Grid */}
        <div className="quizzes-grid">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="saas-card quiz-card">
              <div className="quiz-card-top">
                <span className="saas-badge badge-purple">{quiz.category}</span>
                <span className="difficulty-tag">{quiz.difficulty || "Medium"}</span>
              </div>

              <h3 className="quiz-title">{quiz.title}</h3>
              <p className="quiz-desc">{quiz.description}</p>

              <div className="quiz-meta-info">
                <span>⏱️ {quiz.durationMinutes || 10} Mins</span>
                <span>❓ {quiz.questions?.length || 4} Questions</span>
                <span>🏆 100 Marks</span>
              </div>

              <button
                className="btn-saas btn-saas-primary w-100"
                onClick={() => startQuiz(quiz)}
              >
                <Play size={16} /> Start Assessment
              </button>
            </div>
          ))}
        </div>

        {/* Assessment History Table */}
        <div className="quiz-history-section saas-card">
          <div className="history-header">
            <div className="history-title-group">
              <BarChart2 size={20} className="text-cyan" />
              <h3>Your Past Assessment Performance</h3>
            </div>
          </div>

          <div className="table-responsive">
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Assessment Subject</th>
                  <th>Score</th>
                  <th>Accuracy</th>
                  <th>Time Taken</th>
                  <th>Date</th>
                  <th>Proficiency</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h._id}>
                    <td className="bold-cell">{h.quizTitle}</td>
                    <td className="text-emerald font-bold">{h.score}%</td>
                    <td>{h.accuracy}%</td>
                    <td>{h.timeTaken}</td>
                    <td className="text-muted">{h.date}</td>
                    <td>
                      <span className="saas-badge badge-emerald">Mastered</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}

export default Quizzes;
