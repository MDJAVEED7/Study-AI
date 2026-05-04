import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import quizService from '../../services/quiz.service';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Target, BookOpen } from 'lucide-react';
import Button from '../../components/common/Button';

function QuizResultPage() {
  const { quizId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchResults = async () => {
      try {
        const response = await quizService.getQuizResults(quizId);
        setResults(response);
      } catch {
        toast.error('Failed to fetch quiz results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  if (!results) return <div className="text-center py-20">No results found</div>;

  const {
    data: { quiz, results: detailedResults },
  } = results;

  const score = quiz.score;
  const total = detailedResults.length;
  const correct = detailedResults.filter((r) => r.isCorrect).length;
  const incorrect = total - correct;

  return (
    <div>
      <Link
        to={`/documents/${quiz.document._id}`}
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft size={16} />
        Back to Document
      </Link>

      <PageHeader title={`${quiz.title || 'Quiz'} Results`} />

      {/* Score Card */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-md mb-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-600 text-white mb-4">
          <Trophy />
        </div>

        <h2 className="text-3xl font-bold text-blue-900">{score}%</h2>
        <p className="text-blue-600 mb-4">Your Score</p>

        <div className="flex justify-center gap-4 flex-wrap">
          <div className="px-4 py-2 bg-blue-50 rounded-lg text-blue-700 font-semibold flex items-center gap-2">
            <Target size={16} />
            {total} Total
          </div>

          <div className="px-4 py-2 bg-green-50 rounded-lg text-green-700 font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} />
            {correct} Correct
          </div>

          <div className="px-4 py-2 bg-red-50 rounded-lg text-red-600 font-semibold flex items-center gap-2">
            <XCircle size={16} />
            {incorrect} Incorrect
          </div>
        </div>
      </div>

      {/* Review */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
          <BookOpen size={18} />
          Detailed Review
        </h3>

        {detailedResults.map((result, index) => {
          const userIndex = result.options.findIndex((o) => o === result.selectedAnswer);
          const correctIndex = result.options.indexOf(result.correctAnswer);

          return (
            <div
              key={index}
              className="bg-white border border-blue-100 rounded-xl p-6 shadow-sm"
            >
              <div className="flex justify-between mb-3">
                <h4 className="font-semibold text-blue-900">
                  Question {index + 1}
                </h4>

                {result.isCorrect ? (
                  <CheckCircle2 className="text-green-600" />
                ) : (
                  <XCircle className="text-red-600" />
                )}
              </div>

              <p className="mb-4 text-blue-800">{result.question}</p>

              <div className="space-y-2">
                {result.options.map((opt, i) => {
                  const isCorrect = i === correctIndex;
                  const isUser = i === userIndex;

                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border ${
                        isCorrect
                          ? 'bg-green-50 border-green-300'
                          : isUser
                          ? 'bg-red-50 border-red-300'
                          : 'bg-blue-50 border-blue-100'
                      }`}
                    >
                      <span
                        className={`${
                          isCorrect
                            ? 'text-green-700 font-semibold'
                            : isUser
                            ? 'text-red-600 font-semibold'
                            : 'text-blue-800'
                        }`}
                      >
                        {opt}
                      </span>
                    </div>
                  );
                })}
              </div>

              {result.explanation && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm font-semibold text-blue-700 mb-1">
                    Explanation
                  </p>
                  <p className="text-blue-800">{result.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Link to={`/documents/${quiz.document._id}`}>
          <Button>
            <ArrowLeft className="w-4 h-4" />
            Return to Document
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default QuizResultPage;