import React from 'react';
import Flashcard from './Flashcard.jsx';
import flashcardServices from '../../services/flashcards.service.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const FlashcardViewer = ({
  selectedSet,
  currentCardIndex,
  setCurrentCardIndex,
  handleToggleStar,
}) => {
  const handleNextCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % selectedSet.cards.length);
    }
  };

  const handlePrevCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) => (prevIndex - 1 + selectedSet.cards.length) % selectedSet.cards.length
      );
    }
  };

  const handleReview = async () => {
    const currCard = selectedSet?.cards[currentCardIndex];
    if (!currCard) return;

    try {
      await flashcardServices.reviewFlashcard(currCard._id);
      // optional: remove toast spam if navigating fast
      // toast.success('Flashcard reviewed');
    } catch (error) {
      toast.error('Failed to review flashcard.');
    }
  };

  if (!selectedSet || !selectedSet.cards?.length) return null;

  const currentCard = selectedSet.cards[currentCardIndex];

  return (
    <div className="flex flex-col items-center space-y-8 bg-white min-h-screen py-6">
      <div className="w-full max-w-2xl">
        <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} />
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={handlePrevCard}
          disabled={selectedSet.cards.length <= 1}
          className="group flex items-center gap-2 px-4 h-11 font-medium text-sm rounded-xl 
                     bg-blue-100 text-blue-700 hover:bg-blue-200 
                     transition-all duration-150 
                     disabled:bg-blue-50 disabled:text-blue-300 disabled:cursor-not-allowed"
        >
          <ChevronLeft
            strokeWidth={2}
            className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-150"
          />
          Previous
        </button>

        <div className="border py-2 px-4 rounded-lg border-blue-200 bg-blue-50 text-blue-700 font-medium">
          <span>
            {currentCardIndex + 1} <span>/</span> {selectedSet.cards.length}
          </span>
        </div>

        <button
          onClick={handleNextCard}
          disabled={selectedSet.cards.length <= 1}
          className="group flex items-center gap-2 px-5 h-11 font-medium text-sm rounded-xl 
                     bg-blue-600 text-white hover:bg-blue-700 
                     transition-all duration-150 
                     disabled:bg-blue-200 disabled:text-white disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight
            strokeWidth={2}
            className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150"
          />
        </button>
      </div>
    </div>
  );
};

export default FlashcardViewer;