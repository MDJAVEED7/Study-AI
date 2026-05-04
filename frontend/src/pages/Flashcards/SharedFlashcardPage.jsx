import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { getSharedResource } from '../../services/share.service';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

const SharedFlashcardPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [flashcardSet, setFlashcardSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const fetchSharedFlashcards = async () => {
      setLoading(true);
      try {
        const response = await getSharedResource(token);
        if (response.data.resourceType === 'flashcard') {
          setFlashcardSet(response.data.resource);
        } else {
          setError('This shared resource is not a flashcard set');
        }
      } catch (err) {
        setError(err.error || 'Failed to load shared flashcards');
        toast.error(err.error || 'Failed to load shared flashcards');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSharedFlashcards();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <Spinner />
      </div>
    );
  }

  if (error || !flashcardSet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Flashcard Set Not Found</h1>
          <p className="text-gray-600">{error || 'This flashcard set is no longer available'}</p>
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

  const currentCard = flashcardSet.cards[currentCardIndex];
  const totalCards = flashcardSet.cards.length;

  const goToPrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const goToNext = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Flashcard Set</h1>
            <p className="text-gray-600">Shared - Read Only</p>
          </div>
        </div>

        {/* Document Info */}
        {flashcardSet.documentId && (
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
            <p className="text-sm text-gray-600">From Document</p>
            <p className="text-lg font-semibold text-gray-900">{flashcardSet.documentId.title}</p>
          </div>
        )}

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-2">Total Cards</p>
            <p className="text-3xl font-bold text-blue-600">{totalCards}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-2">Current Card</p>
            <p className="text-3xl font-bold text-blue-600">
              {currentCardIndex + 1} / {totalCards}
            </p>
          </div>
        </div>

        {/* Flashcard */}
        <div className="space-y-4">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative w-full h-80 cursor-pointer perspective"
          >
            <div
              className={`relative w-full h-full transition-transform duration-500 transform ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Front */}
              <div
                className="absolute w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 flex flex-col items-center justify-center text-white shadow-lg"
                style={{
                  backfaceVisibility: 'hidden',
                }}
              >
                <p className="text-sm text-blue-100 mb-4">Question</p>
                <p className="text-2xl font-bold text-center">{currentCard.question}</p>
              </div>

              {/* Back */}
              <div
                className="absolute w-full h-full bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 flex flex-col items-center justify-center text-white shadow-lg"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <p className="text-sm text-green-100 mb-4">Answer</p>
                <p className="text-2xl font-bold text-center">{currentCard.answer}</p>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-600 text-sm">
            Click the card to flip and see the answer
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={goToPrevious}
            disabled={currentCardIndex === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex-1 h-1 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentCardIndex + 1) / totalCards) * 100}%` }}
            />
          </div>

          <button
            onClick={goToNext}
            disabled={currentCardIndex === totalCards - 1}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Card List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">All Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flashcardSet.cards.map((card, index) => (
              <div
                key={index}
                onClick={() => {
                  setCurrentCardIndex(index);
                  setIsFlipped(false);
                }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  index === currentCardIndex
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <p className="text-sm font-medium text-gray-600 mb-2">Card {index + 1}</p>
                <p className="font-semibold text-gray-900 mb-2 line-clamp-2">{card.question}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{card.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <p className="text-yellow-900 text-sm">
            This is a shared flashcard set. You can view and study the cards, but cannot edit them.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedFlashcardPage;
