import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, BookOpen, Clock, Dock, BrainCircuit } from 'lucide-react';
import moment from 'moment';

const formatFilesize = (bytes) => {
  if (bytes === undefined || bytes === null) return 'N/A';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/documents/${document._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(document);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group relative bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:border-primary/30"
    >
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
            <FileText className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
          >
            <Trash2 className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        {/* Title */}
        <h3 title={document.title} className="text-base font-semibold text-foreground truncate mb-2">
          {document.title}
        </h3>

        {/* Doc Info */}
        <div className="flex items-center gap-3 text-sm mb-3 text-gray-600">
          {document.fileSize !== undefined && (
            <>
              <span className="font-medium">{formatFilesize(document.fileSize)}</span>
            </>
          )}
        </div>

        {/* Stats Section */}
        <div className="flex items-center gap-2 flex-wrap">
          {document.flashcardCount !== undefined && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-100">
              <Dock strokeWidth={2} className="w-4 h-4 text-green-700" />
              <span className="font-semibold text-sm text-green-700">{document.flashcardCount} Flashcards</span>
            </div>
          )}
          {document.quizCount !== undefined && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-100">
              <BrainCircuit strokeWidth={2} className="w-4 h-4 text-purple-700" />
              <span className="font-semibold text-sm text-purple-700">{document.quizCount} Quizzes</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Clock strokeWidth={2} className="h-4 w-4" />
          <span>Uploaded {moment(document.createdAt).fromNow()}</span>
        </div>
      </div>

      <div />
    </div>
  );
};

export default DocumentCard;
