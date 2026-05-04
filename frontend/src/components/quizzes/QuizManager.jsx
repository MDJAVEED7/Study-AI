import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import quizServices from '../../services/quiz.service.js';
import aiServices from '../../services/ai.service.js';
import Spinner from '../common/Spinner.jsx';
import Button from '../common/Button.jsx';
import Modal from '../common/Modal.jsx';
import QuizCard from './QuizCard';
import EmptyState from '../common/EmptyState.jsx';

const QuizManager = ({ documentId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [numQuestions, setNumQuestions] = useState(1);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await quizServices.getAllQuizzes(documentId);
      setQuizzes(response.data);
    } catch {
      toast.error('Failed to fetch quizzes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchQuizzes();
  }, [documentId]);

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await aiServices.generateQuiz(documentId, { numQuestions });
      toast.success('Quiz generated successfully');
      setIsGenerateModalOpen(false);
      fetchQuizzes();
    } catch (error) {
      toast.error(error.message || 'Failed to generate quiz');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteRequest = (quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedQuiz) return;
    setDeleting(true);
    try {
      await quizServices.deleteQuiz(selectedQuiz._id);
      toast.success('Quiz deleted');
      setQuizzes(quizzes.filter((q) => q._id !== selectedQuiz._id));
      setIsDeleteModalOpen(false);
      setSelectedQuiz(null);
    } catch (error) {
      toast.error(error.message || 'Failed to delete quiz');
    } finally {
      setDeleting(false);
    }
  };

  const renderQuizContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      );
    }

    if (quizzes.length === 0) {
      return (
        <div className="bg-white border border-blue-100 rounded-2xl shadow-md p-8">
          <EmptyState
            onClickAction={() => setIsGenerateModalOpen(true)}
            title="No Quizzes yet"
            description="Generate quizzes to test your knowledge."
            buttonText="Generate Quiz"
            loading={generating}
          />
        </div>
      );
    }

    return (
      <div className="bg-white border border-blue-100 rounded-2xl shadow-md p-8">
        <div className="flex justify-end mb-6">
          <Button onClick={() => setIsGenerateModalOpen(true)}>
            <Plus size={16} />
            Generate Quiz
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} onDelete={handleDeleteRequest} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderQuizContent()}

      {/* Generate Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate New Quiz"
      >
        <form onSubmit={handleGenerateQuiz} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1">
              Number of Questions
            </label>
            <input
              type="number"
              value={numQuestions}
              onChange={(e) =>
                setNumQuestions(Math.max(1, parseInt(e.target.value)) || 1)
              }
              min="1"
              required
              className="w-full h-10 px-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsGenerateModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={generating}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {generating ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Quiz?"
      >
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-blue-800">
            {selectedQuiz?.title || 'this quiz'}
          </span>
          ?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmDelete}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default QuizManager;