import React, { useRef, useState, useEffect } from 'react';
import { Trash2, ArrowLeft, Sparkles, Brain } from 'lucide-react';
import toast from 'react-hot-toast';
import moment from 'moment';
import flashcardServices from '../../services/flashcards.service.js';
import aiServices from '../../services/ai.service.js';
import Spinner from '../common/Spinner.jsx';
import Modal from '../common/Modal.jsx';

import Button from '../common/Button.jsx';
import EmptyState from '../common/EmptyState.jsx';
import FlashcardViewer from './FlashcardViewer.jsx';

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);
  const hasFetched = useRef(false);

  const fetchFlashcardsSets = async () => {
    setLoading(true);
    try {
      const response = await flashcardServices.getFlashcards(documentId);
      setFlashcardSets(response.data);
    } catch (error) {
      toast.error('Failed to fetch flashcards sets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    if (documentId) {
      fetchFlashcardsSets();
    }
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiServices.generateFlashcards(documentId);
      toast.success('Flashcards generated successfully');
      fetchFlashcardsSets();
    } catch (error) {
      toast.error(error.error || 'Failed to generate flashcards');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;
    setDeleting(true);
    try {
      await flashcardServices.deleteFlashcard(setToDelete._id);
      toast.success('Flashcard set deleted successfully');
      setIsDeleteModalOpen(false);
      setSetToDelete(null);
      fetchFlashcardsSets();
    } catch (error) {
      toast.error(error.message || 'Failed to delete flashcard set.');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardServices.starFlashcard(cardId);
      const updatedSets = flashcardSets.map((set) => {
        if (set._id === selectedSet._id) {
          const updatedCards = set.cards.map((card) =>
            card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
          );
          return { ...set, cards: updatedCards };
        }
        return set;
      });
      setFlashcardSets(updatedSets);
      setSelectedSet(updatedSets.find((set) => set._id === selectedSet._id));
    } catch {
      toast.error('Failed to star flashcard.');
    }
  };

  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
  };

  const renderFlashcardViewer = () => (
    <div className="space-y-8">
      <button
        onClick={() => setSelectedSet(null)}
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft />
        Back to Sets
      </button>

      <FlashcardViewer
        selectedSet={selectedSet}
        currentCardIndex={currentCardIndex}
        setCurrentCardIndex={setCurrentCardIndex}
        handleToggleStar={handleToggleStar}
      />
    </div>
  );

  const renderSetList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      );
    }

    if (flashcardSets.length === 0) {
      return (
        <EmptyState
          onClickAction={handleGenerateFlashcards}
          title="No Flashcards yet"
          description="Generate flashcards to start learning."
          buttonText="Generate Flashcards"
          loading={generating}
        />
      );
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-semibold text-blue-900">
              Your Flashcard Sets
            </h3>
            <p className="text-blue-600 text-sm">
              {flashcardSets.length} sets available
            </p>
          </div>

          <Button onClick={handleGenerateFlashcards} disabled={generating}>
            {generating ? 'Generating...' : 'Generate New Set'}
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {flashcardSets.map((set) => (
            <div
              key={set._id}
              onClick={() => handleSelectSet(set)}
              className="group bg-white border border-blue-100 rounded-xl p-6 cursor-pointer shadow-sm hover:shadow-lg hover:border-blue-300 transition-all"
            >
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="opacity-0 group-hover:opacity-100 absolute top-4 right-4 p-2 hover:bg-red-100 rounded-lg"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>

              <div className="space-y-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Brain />
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-blue-900">
                    Flashcard Set
                  </h4>
                  <p className="text-xs text-blue-500">
                    {moment(set.createdAt).format('MMM D, YYYY')}
                  </p>
                </div>

                <div className="pt-2 border-t border-blue-100">
                  <span className="text-sm font-semibold text-blue-700">
                    {set.cards.length} cards
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white border border-blue-100 rounded-2xl shadow-md p-8">
        {selectedSet ? renderFlashcardViewer() : renderSetList()}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set?"
      >
        <p className="text-sm text-gray-600">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500"
            onClick={handleConfirmDelete}
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
};

export default FlashcardManager;