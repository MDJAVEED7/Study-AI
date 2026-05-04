import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, TrendingUp, Share2, Trash2 } from 'lucide-react';
import moment from 'moment';
import ShareModal from '../common/ShareModal';

const FlashcardSetCard = ({ flashcardSet, onDelete }) => {
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);

  const handleStudyNow = () => {
    navigate(`/flashcards/${flashcardSet._id}`);
  };

  const reviewedCount = flashcardSet.cards.filter((card) => card.lastReviewed).length;
  const totalCards = flashcardSet.cards.length;
  const progressPercentage =
    totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;

  return (
    <>
      <div className="group relative bg-white border border-blue-100 rounded-lg p-6 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
        
        {/* Share and Delete Buttons */}
        <div className="opacity-0 group-hover:opacity-100 absolute top-4 right-4 flex gap-2 transition-all">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowShareModal(true);
            }}
            className="p-2 rounded-lg hover:bg-blue-100 transition-all"
            title="Share this flashcard set"
          >
            <Share2 className="w-5 h-5 text-blue-600" />
          </button>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(flashcardSet);
              }}
              className="p-2 rounded-lg hover:bg-red-100 transition-all"
              title="Delete this flashcard set"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
              <BookOpen strokeWidth={2} className="h-6 w-6 text-white" />
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
              <h3
                className="text-base font-semibold text-blue-900 line-clamp-2 mb-1"
                title={flashcardSet?.documentId?.title || 'Flashcard'}
              >
                {flashcardSet?.documentId?.title || 'Flashcard'}
              </h3>

              <p className="text-xs font-medium uppercase tracking-wider text-blue-500">
                Created {moment(flashcardSet.createdAt).fromNow()}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 pt-2">
            <div className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-sm font-semibold">
              {totalCards} {totalCards === 1 ? 'Card' : 'Cards'}
            </div>

            {reviewedCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-sm font-semibold">
                <TrendingUp strokeWidth={2.5} className="h-4 w-4" />
                <span>{progressPercentage}%</span>
              </div>
            )}
          </div>

          {/* Progress */}
          {totalCards > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800">Progress</span>
                <span className="text-sm font-medium text-blue-600">
                  {reviewedCount}/{totalCards} reviewed
                </span>
              </div>

              <div className="relative h-2 bg-blue-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${progressPercentage}%` }}
                  className="absolute inset-y-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                />
              </div>
            </div>
          )}
        </div>

        {/* Button */}
        <div className="mt-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStudyNow();
            }}
            className="h-11 w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
          >
            <Sparkles strokeWidth={2} className="w-4 h-4" />
            Study Now
          </button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        resourceType="flashcard"
        resourceId={flashcardSet._id}
        resourceTitle={flashcardSet?.documentId?.title || 'Flashcard Set'}
      />
    </>
  );
};

export default FlashcardSetCard;