import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { QuestAuthProvider } from './context/QuestAuthContext';
import { IPProvider } from './context/IPContext';
import QuestProtectedRoute from './components/auth/QuestProtectedRoute';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SafeIcon from './common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEye, FiEyeOff, FiShield, FiUser } = FiIcons;

// Import pages
import LandingPage from './components/pages/LandingPage';
import Dashboard from './components/pages/Dashboard';
import IPAssets from './components/pages/IPAssets';
import Clients from './components/pages/Clients';
import Tasks from './components/pages/Tasks';
import Matters from './components/pages/Matters';
import Calendar from './components/pages/Calendar';
import BrandMonitoring from './components/pages/BrandMonitoring';
import Alerts from './components/pages/Alerts';
import Employees from './components/pages/Employees';
import Settings from './components/pages/Settings';
import CompanySettings from './components/pages/CompanySettings';

// Import auth pages
import CustomerLoginPage from './components/auth/CustomerLoginPage';
import CreateAccountPage from './components/auth/CreateAccountPage';
import QuestLoginPage from './components/auth/QuestLoginPage';
import UnifiedLoginPage from './components/auth/UnifiedLoginPage';
import LoginForm from './components/auth/LoginForm';
import QuestOnboardingPage from './components/auth/QuestOnboardingPage';

// Import admin pages
import SuperAdminDashboard from './components/admin/SuperAdminDashboard';

import './App.css';

// Page Layout Component
const PageLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Landing Page Wrapper for hash navigation
const LandingPageWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return <LandingPage />;
};

function App() {
  return (
    <QuestAuthProvider>
      <AuthProvider>
        <IPProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPageWrapper />} />
                
                {/* Authentication Routes */}
                <Route path="/login" element={<CustomerLoginPage />} />
                <Route path="/create-account" element={<CreateAccountPage />} />
                <Route path="/quest-login" element={<QuestLoginPage />} />
                <Route path="/admin-login" element={<UnifiedLoginPage />} />
                <Route path="/unified-login" element={<UnifiedLoginPage />} />
                <Route path="/login-form" element={<LoginForm />} />
                <Route path="/onboarding" element={<QuestOnboardingPage />} />

                {/* Protected Application Routes */}
                <Route path="/dashboard" element={
                  <QuestProtectedRoute>
                    <PageLayout>
                      <Dashboard />
                    </PageLayout>
                  </QuestProtectedRoute>
                } />
                <Route path="/assets" element={
                  <QuestProtectedRoute>
                    <PageLayout>
                      <IPAssets />
                    </PageLayout>
                  </QuestProtectedRoute>
                } />
                <Route path="/clients" element={
                  <QuestProtectedRoute>
                    <PageLayout>
                      <Clients />
                    </PageLayout>
                  </QuestProtectedRoute>
                } />
                <Route path="/tasks" element={
                  <QuestProtectedRoute>
                    <PageLayout>
                      <Tasks />
                    </PageLayout>
                  </QuestProtectedRoute>
                } />
                <Route path="/matters" element={
                  <QuestProtectedRoute>
                    <PageLayout>
                      <Matters />
                    </PageLayout>
                  </QuestProtectedRoute>
                } />
                <Route path="/calendar" element={
                  <QuestProtectedRoute>
                    <PageLayout>
                      <Calendar />
                    </PageLayout>
                  </QuestProtectedRoute>
                } />
                <Route path="/monitoring" element={
                  <QuestProtectedRoute>
                    <PageLayout>
                      <BrandMonitoring />
                    </PageLayout>
                  </QuestProtectedRoute>
                } />
                <Route path="/alerts" element={
                  <QuestProtectedRoute>
                    <PageLayout>
                      <Alerts />
                    </PageLayout>
                  </QuestProtectedRoute>
                } />
                <Route path="/employees" element={
                  <QuestProtectedRoute>
                    <PageLayout>
                      <Employees />
                    </PageLayout>
                  </QuestProtectedRoute>
                } />
                <Route path="/settings" element={
                  <QuestProtectedRoute>
                    <PageLayout>
                      <Settings />
                    </PageLayout>
                  </QuestProtectedRoute>
                } />
                <Route path="/company-settings" element={
                  <QuestProtectedRoute>
                    <PageLayout>
                      <CompanySettings />
                    </PageLayout>
                  </QuestProtectedRoute>
                } />

                {/* Super Admin Routes */}
                <Route path="/super-admin" element={
                  <QuestProtectedRoute adminOnly>
                    <PageLayout>
                      <SuperAdminDashboard />
                    </PageLayout>
                  </QuestProtectedRoute>
                } />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </IPProvider>
      </AuthProvider>
    </QuestAuthProvider>
  );
}

export default App;