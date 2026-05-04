import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getSharedResource } from '../../services/share.service';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

const SharedQuizPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSharedQuiz = async () => {
      setLoading(true);
      try {
        const response = await getSharedResource(token);
        if (response.data.resourceType === 'quiz') {
          setQuiz(response.data.resource);
        } else {
          setError('This shared resource is not a quiz');
        }
      } catch (err) {
        setError(err.error || 'Failed to load shared quiz');
        toast.error(err.error || 'Failed to load shared quiz');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSharedQuiz();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <Spinner />
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Quiz Not Found</h1>
          <p className="text-gray-600">{error || 'This quiz is no longer available'}</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-blue-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-gray-600">Shared Quiz - Read Only</p>
          </div>
        </div>

        {/* Document Info */}
        {quiz.documentId && (
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
            <p className="text-sm text-gray-600">From Document</p>
            <p className="text-lg font-semibold text-gray-900">{quiz.documentId.title}</p>
          </div>
        )}

        {/* Quiz Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-2">Questions</p>
            <p className="text-3xl font-bold text-blue-600">{quiz.questions.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-2">Score</p>
            <p className="text-3xl font-bold text-blue-600">{quiz.score || 'N/A'}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-2">Status</p>
            <p className="text-lg font-semibold text-blue-600">
              {quiz.completedAt ? 'Completed' : 'Not Completed'}
            </p>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Questions</h2>
          {quiz.questions.map((question, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                  {index + 1}. {question.question}
                </h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg whitespace-nowrap ml-4">
                  {question.difficulty}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Options:</p>
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
                    <p className="text-gray-900">
                      {String.fromCharCode(65 + optIndex)}. {option}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <p className="text-sm font-medium text-gray-700 mb-2">Correct Answer:</p>
                <p className="font-semibold text-blue-900">{question.correctAnswer}</p>
              </div>

              {question.explanation && (
                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                  <p className="text-sm font-medium text-gray-700 mb-2">Explanation:</p>
                  <p className="text-gray-800">{question.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <p className="text-yellow-900 text-sm">
            This is a shared quiz. You can view the questions and answers, but cannot take the quiz.
            <br />
            <span className="text-xs text-yellow-700 mt-2 block">
              To take this quiz, the creator should share their flashcards or quiz with you directly.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedQuizPage;
