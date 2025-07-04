import React,{useState,useEffect} from 'react';
import {HashRouter as Router,Routes,Route,Navigate} from 'react-router-dom';
import {motion,AnimatePresence} from 'framer-motion';
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
import LoginForm from './components/auth/LoginForm';
import SuperAdminDashboard from './components/admin/SuperAdminDashboard';
import {IPProvider} from './context/IPContext';
import {AuthProvider,useAuth} from './context/AuthContext';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({children}) => {
  const {currentUser, isLoading} = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <LoginForm onLoginSuccess={() => {}} />;
  }
  
  return children;
};

// Main App Content Component
const AppContent = () => {
  const {currentUser} = useAuth();
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
    <IPProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className="pt-16 flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route 
                path="/" 
                element={
                  <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -20}}
                    transition={{duration: 0.3}}
                  >
                    <Dashboard />
                  </motion.div>
                } 
              />
              <Route 
                path="/assets" 
                element={
                  <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -20}}
                    transition={{duration: 0.3}}
                  >
                    <IPAssets />
                  </motion.div>
                } 
              />
              <Route 
                path="/monitoring" 
                element={
                  <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -20}}
                    transition={{duration: 0.3}}
                  >
                    <BrandMonitoring />
                  </motion.div>
                } 
              />
              <Route 
                path="/clients" 
                element={
                  <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -20}}
                    transition={{duration: 0.3}}
                  >
                    <Clients />
                  </motion.div>
                } 
              />
              <Route 
                path="/matters" 
                element={
                  <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -20}}
                    transition={{duration: 0.3}}
                  >
                    <Matters />
                  </motion.div>
                } 
              />
              <Route 
                path="/tasks" 
                element={
                  <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -20}}
                    transition={{duration: 0.3}}
                  >
                    <Tasks />
                  </motion.div>
                } 
              />
              <Route 
                path="/calendar" 
                element={
                  <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -20}}
                    transition={{duration: 0.3}}
                  >
                    <Calendar />
                  </motion.div>
                } 
              />
              <Route 
                path="/alerts" 
                element={
                  <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -20}}
                    transition={{duration: 0.3}}
                  >
                    <Alerts />
                  </motion.div>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -20}}
                    transition={{duration: 0.3}}
                  >
                    <Settings />
                  </motion.div>
                } 
              />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </IPProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ProtectedRoute>
          <AppContent />
        </ProtectedRoute>
      </Router>
    </AuthProvider>
  );
}

export default App;