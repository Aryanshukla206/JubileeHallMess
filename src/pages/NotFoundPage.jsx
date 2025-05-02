import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center">
          <Coffee size={80} className="text-blue-600" />
        </div>
        <h1 className="mt-6 text-4xl font-extrabold text-gray-900">404</h1>
        <p className="mt-2 text-lg text-gray-600">Page not found</p>
        <p className="mt-1 text-gray-500 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Home size={16} className="mr-1" />
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;