import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import quizService from '../../services/quiz.service';
import PageHeader from '../../components/common/PageHeader.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button.jsx';

function QuizTakePage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchQuiz = async () => {
      try {
        const response = await quizService.getQuizById(quizId);
        if (response.data.userAnswers.length > 0) {
          navigate(`/quizzes/${quizId}/result`);
        }
        setQuiz(response.data);
      } catch (error) {
        toast.error(error.message || 'Failed to fetch quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      const formattedAnswers = Object.keys(selectedAnswers).map((questionId) => {
        const question = quiz.questions.find((q) => q._id === questionId);
        const questionIndex = quiz.questions.findIndex((q) => q._id === questionId);
        return {
          questionIndex,
          selectedAnswer: question.options[selectedAnswers[questionId]],
        };
      });

      await quizService.submitQuiz(quizId, formattedAnswers);
      toast.success('Quiz submitted successfully');
      navigate(`/quizzes/${quizId}/result`);
    } catch (error) {
      toast.error(error.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner /></div>;
  }

  if (!quiz || quiz.questions.length === 0) {
    return <div className="text-center py-20">No questions found</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title={quiz.title || 'Take Quiz'} />

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-blue-800 font-semibold mb-2">
          <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
          <span>{answeredCount} answered</span>
        </div>

        <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
          <div
            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            className="h-full bg-blue-600 transition-all"
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-md mb-6">
        <div className="text-blue-600 font-semibold mb-4">
          Question {currentQuestionIndex + 1}
        </div>

        <h3 className="text-lg font-semibold text-blue-900 mb-6">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion._id] === index;

            return (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${
                  isSelected
                    ? 'bg-blue-50 border-blue-400'
                    : 'border-blue-100 hover:bg-blue-50'
                }`}
              >
                <input
                  type="radio"
                  checked={isSelected}
                  onChange={() => handleOptionChange(currentQuestion._id, index)}
                  className="accent-blue-600"
                />

                <span className="ml-3 text-blue-900">{option}</span>

                {isSelected && (
                  <CheckCircle2 className="ml-auto text-blue-600" />
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50"
        >
          <ChevronLeft className="inline w-4 h-4" /> Previous
        </button>

        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <Button onClick={handleSubmitQuiz} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        ) : (
          <button
            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Next <ChevronRight className="inline w-4 h-4" />
          </button>
        )}
      </div>

      {/* Question Navigator */}
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {quiz.questions.map((q, index) => {
          const isAnswered = selectedAnswers[q._id] !== undefined;
          const isCurrent = index === currentQuestionIndex;

          return (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-lg text-sm font-semibold ${
                isCurrent
                  ? 'bg-blue-600 text-white'
                  : isAnswered
                  ? 'bg-blue-200 text-blue-800'
                  : 'bg-blue-50 text-blue-500'
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuizTakePage;