import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Dashboard from './components/pages/Dashboard';
import IPAssets from './components/pages/IPAssets';
import BrandMonitoring from './components/pages/BrandMonitoring';
import Clients from './components/pages/Clients';
import Matters from './components/pages/Matters';
import Tasks from './components/pages/Tasks';
import Calendar from './components/pages/Calendar';
import Alerts from './components/pages/Alerts';
import Settings from './components/pages/Settings';
import Employees from './components/pages/Employees';
import SupabaseLoginForm from './components/auth/SupabaseLoginForm';
import SuperAdminDashboard from './components/admin/SuperAdminDashboard';
import { SupabaseIPProvider, useSupabaseIP } from './context/SupabaseIPContext';
import { SupabaseAuthProvider, useSupabaseAuth } from './context/SupabaseAuthContext';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, isLoading } = useSupabaseAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to Supabase...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <SupabaseLoginForm onLoginSuccess={() => {}} />;
  }

  return children;
};

// Main App Content Component
const AppContent = () => {
  const { currentUser } = useSupabaseAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // If user is super admin, show admin interface
  if (currentUser?.role === 'super_admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <SuperAdminDashboard />
      </div>
    );
  }

  // Regular IP management interface
  return (
    <SupabaseIPProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className="pt-16 flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Dashboard />
                  </motion.div>
                }
              />
              <Route
                path="/assets"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <IPAssets />
                  </motion.div>
                }
              />
              <Route
                path="/monitoring"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BrandMonitoring />
                  </motion.div>
                }
              />
              <Route
                path="/clients"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Clients />
                  </motion.div>
                }
              />
              <Route
                path="/matters"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Matters />
                  </motion.div>
                }
              />
              <Route
                path="/tasks"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Tasks />
                  </motion.div>
                }
              />
              <Route
                path="/calendar"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Calendar />
                  </motion.div>
                }
              />
              <Route
                path="/alerts"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alerts />
                  </motion.div>
                }
              />
              <Route
                path="/settings"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Settings />
                  </motion.div>
                }
              />
              <Route
                path="/employees"
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Employees />
                  </motion.div>
                }
              />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </SupabaseIPProvider>
  );
};

function App() {
  return (
    <SupabaseAuthProvider>
      <Router>
        <ProtectedRoute>
          <AppContent />
        </ProtectedRoute>
      </Router>
    </SupabaseAuthProvider>
  );
}

export default App;