import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <h1 className="text-9xl font-black text-gray-200">403</h1>
      <div className="absolute flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-tight">
          Access Restricted
        </h2>
        <p className="text-gray-400 mb-8 text-center max-w-xs text-sm">
          The requested resource is not available or you do not have permission to view it.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-black text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-all"
        >
          Return to Homepage
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
