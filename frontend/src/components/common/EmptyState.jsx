import React from 'react';
import Button from './Button';
import { FileText, Plus } from 'lucide-react';

const EmptyState = ({ onClickAction, title, description, buttonText, loading, loadingText }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-secondary mb-6 shadow-md">
        <FileText strokeWidth={2} className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-gray-600 mb-8 text-center max-w-sm">{description}</p>
      {onClickAction && (
        <Button onClick={onClickAction} disabled={loading} size="md" variant="primary">
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {loadingText}
            </>
          ) : (
            <>
              <Plus strokeWidth={2} className="w-5 h-5" />
              {buttonText}
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
