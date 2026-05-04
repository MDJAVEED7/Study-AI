import React from 'react';

const Spinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-purple-50 to-blue-50">
      <div className="flex-col gap-4 w-full flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-gray-200 border-t-primary text-primary text-4xl animate-spin flex items-center justify-center rounded-full">
          <div className="w-16 h-16 border-4 border-gray-100 border-t-secondary text-secondary text-2xl animate-spin flex items-center justify-center rounded-full"></div>
        </div>
        <p className="text-gray-600 font-medium mt-4">Loading...</p>
      </div>
    </div>
  );
};

export default Spinner;
