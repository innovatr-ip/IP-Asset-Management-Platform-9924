import React, { createContext, useContext, useState, useEffect } from 'react';
import { QuestProvider } from '@questlabs/react-sdk';
import questConfig from '../config/questConfig';

const QuestAuthContext = createContext();

export const useQuestAuth = () => {
  const context = useContext(QuestAuthContext);
  if (!context) {
    throw new Error('useQuestAuth must be used within a QuestAuthProvider');
  }
  return context;
};

export const QuestAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [questUser, setQuestUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication
    const userId = localStorage.getItem('quest-userId');
    const token = localStorage.getItem('quest-token');
    
    if (userId && token) {
      setQuestUser({ userId, token });
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  const loginUser = (userData) => {
    const { userId, token, newUser } = userData;
    
    localStorage.setItem('quest-userId', userId);
    localStorage.setItem('quest-token', token);
    localStorage.setItem('quest-isNewUser', newUser.toString());
    
    setQuestUser({ userId, token, newUser });
    setIsAuthenticated(true);
  };

  const logoutUser = () => {
    localStorage.removeItem('quest-userId');
    localStorage.removeItem('quest-token');
    localStorage.removeItem('quest-isNewUser');
    
    setQuestUser(null);
    setIsAuthenticated(false);
  };

  const isNewUser = () => {
    return localStorage.getItem('quest-isNewUser') === 'true';
  };

  const value = {
    isAuthenticated,
    questUser,
    isLoading,
    loginUser,
    logoutUser,
    isNewUser
  };

  return (
    <QuestProvider 
      apiKey={questConfig.APIKEY}
      entityId={questConfig.ENTITYID}
      apiType="PRODUCTION"
    >
      <QuestAuthContext.Provider value={value}>
        {children}
      </QuestAuthContext.Provider>
    </QuestProvider>
  );
};