import React from 'react';
import { useQuestAuth } from '../../context/QuestAuthContext';
import QuestLoginPage from './QuestLoginPage';

const QuestProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useQuestAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your IP management platform...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <QuestLoginPage />;
  }

  return children;
};

export default QuestProtectedRoute;