import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, BarChart2, Trash2, Award, Share2 } from 'lucide-react';
import moment from 'moment';
import ShareModal from '../common/ShareModal';

const QuizCard = ({ quiz, onDelete }) => {
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <>
      <div className="group relative bg-white border border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover:-translate-y-1">
        
        {/* Delete and Share Buttons */}
        <div className="opacity-0 group-hover:opacity-100 absolute top-4 right-4 flex gap-2 transition-all">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowShareModal(true);
            }}
            className="p-2 rounded-lg hover:bg-blue-100 transition-all"
            title="Share this quiz"
          >
            <Share2 className="w-5 h-5 text-blue-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(quiz);
            }}
            className="p-2 rounded-lg hover:bg-red-100 transition-all"
            title="Delete this quiz"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
        </div>

        <div className="space-y-4">
          
          {/* Score Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-semibold">
            <Award className="w-4 h-4" />
            <span>Score: {quiz?.score ?? 'N/A'}</span>
          </div>

          {/* Title */}
          <div>
            <h3
              className="text-lg font-semibold text-blue-900 mb-1 line-clamp-2"
              title={quiz.title}
            >
              {quiz.title || `Quiz - ${moment(quiz.createdAt).format('MMM D, YYYY')}`}
            </h3>

            <p className="text-xs font-medium uppercase tracking-wider text-blue-500">
              Created {moment(quiz.createdAt).format('MMM D, YYYY')}
            </p>
          </div>

          {/* Questions Count */}
          <div className="flex items-center gap-3 pt-2 border-t border-blue-100">
            <div className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
              {quiz.questions.length}{' '}
              {quiz.questions.length === 1 ? 'Question' : 'Questions'}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-4 border-t border-blue-100">
          {quiz?.userAnswers?.length > 0 ? (
            <Link to={`/quizzes/${quiz._id}/result`}>
              <button className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 hover:shadow-md">
                <BarChart2 className="w-4 h-4" />
                View Results
              </button>
            </Link>
          ) : (
            <Link to={`/quizzes/${quiz._id}`}>
              <button className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Start Quiz
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        resourceType="quiz"
        resourceId={quiz._id}
        resourceTitle={quiz.title || `Quiz - ${moment(quiz.createdAt).format('MMM D, YYYY')}`}
      />
    </>
  );
};

export default QuizCard;