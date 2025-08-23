import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useQuestAuth } from '../../context/QuestAuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMenu, FiX, FiChevronDown, FiUser, FiShield, FiLogOut, FiSettings, FiBuilding } = FiIcons;

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { isAuthenticated, logout: questLogout } = useQuestAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSignInMenuOpen, setIsSignInMenuOpen] = useState(false);

  const isLandingPage = location.pathname === '/';
  const isAuthPage = ['/login', '/create-account', '/quest-login', '/admin-login', '/unified-login', '/login-form'].includes(location.pathname);

  const handleNavClick = (sectionId) => {
    setIsMenuOpen(false);
    
    if (isLandingPage) {
      // If we're on the landing page, scroll to the section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on another page, navigate to landing page with hash
      navigate(`/#${sectionId}`);
    }
  };

  const handleSignOut = async () => {
    if (isAuthenticated) {
      await questLogout();
    }
    if (currentUser) {
      await logout();
    }
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const navItems = [
    { name: 'Home', sectionId: 'hero' },
    { name: 'Features', sectionId: 'features' },
    { name: 'Solutions', sectionId: 'solutions' },
    { name: 'Pricing', sectionId: 'pricing' },
    { name: 'About', sectionId: 'about' },
    { name: 'Contact', sectionId: 'contact' }
  ];

  const appNavItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'IP Assets', path: '/assets' },
    { name: 'Clients', path: '/clients' },
    { name: 'Matters', path: '/matters' },
    { name: 'Tasks', path: '/tasks' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Monitoring', path: '/monitoring' },
    { name: 'Alerts', path: '/alerts' }
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IP</span>
            </div>
            <span className="text-xl font-bold text-gray-900">InnovatrIP</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {(currentUser || isAuthenticated) && !isAuthPage ? (
              // App Navigation for authenticated users
              appNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                    location.pathname === item.path
                      ? 'text-primary-600'
                      : 'text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))
            ) : (
              // Landing page navigation
              navItems.map((item) => (
                <button
                  key={item.sectionId}
                  onClick={() => handleNavClick(item.sectionId)}
                  className="text-gray-700 hover:text-primary-600 text-sm font-medium transition-colors"
                >
                  {item.name}
                </button>
              ))
            )}
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser || isAuthenticated ? (
              // User menu for authenticated users
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {currentUser?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {currentUser?.firstName || 'User'}
                  </span>
                  <SafeIcon icon={FiChevronDown} className="h-4 w-4 text-gray-500" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {currentUser?.firstName} {currentUser?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {currentUser?.role?.replace('_', ' ')}
                        </p>
                      </div>
                      
                      <Link
                        to="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <SafeIcon icon={FiSettings} className="h-4 w-4 mr-3" />
                        Settings
                      </Link>
                      
                      {currentUser?.role === 'org_admin' && (
                        <Link
                          to="/company-settings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <SafeIcon icon={FiBuilding} className="h-4 w-4 mr-3" />
                          Company Settings
                        </Link>
                      )}
                      
                      {currentUser?.role === 'super_admin' && (
                        <Link
                          to="/super-admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <SafeIcon icon={FiShield} className="h-4 w-4 mr-3" />
                          Super Admin
                        </Link>
                      )}
                      
                      <div className="border-t border-gray-100 mt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <SafeIcon icon={FiLogOut} className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : !isAuthPage ? (
              // Sign in dropdown for non-authenticated users on landing page
              <div className="relative">
                <button
                  onClick={() => setIsSignInMenuOpen(!isSignInMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200"
                >
                  <span>Sign In</span>
                  <SafeIcon icon={FiChevronDown} className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {isSignInMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                    >
                      <Link
                        to="/login"
                        onClick={() => setIsSignInMenuOpen(false)}
                        className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <SafeIcon icon={FiUser} className="h-5 w-5 text-blue-600 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Customer Login</div>
                          <div className="text-xs text-gray-500">Access your IP portfolio</div>
                        </div>
                      </Link>
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <Link
                        to="/admin-login"
                        onClick={() => setIsSignInMenuOpen(false)}
                        className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <SafeIcon icon={FiShield} className="h-5 w-5 text-red-600 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Super Admin</div>
                          <div className="text-xs text-gray-500">System administration</div>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <SafeIcon icon={isMenuOpen ? FiX : FiMenu} className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-2 space-y-1">
              {(currentUser || isAuthenticated) && !isAuthPage ? (
                // App navigation for mobile
                appNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))
              ) : (
                // Landing page navigation for mobile
                navItems.map((item) => (
                  <button
                    key={item.sectionId}
                    onClick={() => handleNavClick(item.sectionId)}
                    className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {item.name}
                  </button>
                ))
              )}

              {/* Mobile auth buttons */}
              {!currentUser && !isAuthenticated && !isAuthPage && (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiUser} className="h-4 w-4 mr-2" />
                    Customer Login
                  </Link>
                  <Link
                    to="/admin-login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiShield} className="h-4 w-4 mr-2" />
                    Super Admin
                  </Link>
                </div>
              )}

              {/* Mobile user menu */}
              {(currentUser || isAuthenticated) && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {currentUser?.role?.replace('_', ' ')}
                    </p>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiSettings} className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                  {currentUser?.role === 'org_admin' && (
                    <Link
                      to="/company-settings"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiBuilding} className="h-4 w-4 mr-2" />
                      Company Settings
                    </Link>
                  )}
                  {currentUser?.role === 'super_admin' && (
                    <Link
                      to="/super-admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiShield} className="h-4 w-4 mr-2" />
                      Super Admin
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiLogOut} className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;