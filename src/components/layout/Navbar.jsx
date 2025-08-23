import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShield, FiHome, FiFolder, FiBell, FiUsers, FiCheckSquare, FiFileText, FiCalendar, FiEye, FiChevronDown, FiMenu, FiLogOut, FiUser, FiLogIn, FiSettings } = FiIcons;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  const manageItems = [
    { path: '/clients', icon: FiUsers, label: 'Clients' },
    { path: '/assets', icon: FiFolder, label: 'IP Assets' },
    { path: '/matters', icon: FiFileText, label: 'Matters' },
    { path: '/tasks', icon: FiCheckSquare, label: 'Tasks' },
    { path: '/employees', icon: FiUsers, label: 'Employees' }
  ];

  const mainNavItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/monitoring', icon: FiEye, label: 'Brand Monitoring' },
    { path: '/calendar', icon: FiCalendar, label: 'Calendar' },
    { path: '/alerts', icon: FiBell, label: 'Alerts' },
  ];

  // Check if any manage item is active
  const isManageActive = manageItems.some(item => location.pathname === item.path);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsManageOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      setIsProfileOpen(false);
      navigate('/customer-login');
    }
  };

  const getUserDisplayName = () => {
    if (currentUser?.firstName && currentUser?.lastName) {
      return `${currentUser.firstName} ${currentUser.lastName}`;
    }
    return currentUser?.email || 'User';
  };

  const getInitials = () => {
    if (currentUser?.firstName && currentUser?.lastName) {
      return `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`.toUpperCase();
    }
    return currentUser?.email?.charAt(0).toUpperCase() || 'U';
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'org_admin': return 'Organization Admin';
      case 'end_user': return 'End User';
      default: return 'User';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-700';
      case 'org_admin': return 'bg-blue-100 text-blue-700';
      case 'end_user': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-700 shadow-lg" 
         style={{ backgroundColor: '#000018' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center">
            <div className="relative">
              <img 
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751635789797-innovatr.png" 
                alt="Innovatr" 
                className="h-8 w-auto" 
                style={{ height: '32px' }}
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-4 py-2 rounded-lg transition-all duration-200 group"
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative flex items-center space-x-2">
                    <SafeIcon 
                      icon={item.icon} 
                      className={`h-5 w-5 transition-colors ${
                        isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                      }`} 
                    />
                    <span className={`text-sm font-medium transition-colors ${
                      isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}

            {/* Manage Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsManageOpen(!isManageOpen)}
                className="relative px-4 py-2 rounded-lg transition-all duration-200 group flex items-center space-x-2"
              >
                {isManageActive && (
                  <motion.div
                    layoutId="navbar-active-manage"
                    className="absolute inset-0 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative flex items-center space-x-2">
                  <SafeIcon 
                    icon={FiShield} 
                    className={`h-5 w-5 transition-colors ${
                      isManageActive || isManageOpen ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    }`} 
                  />
                  <span className={`text-sm font-medium transition-colors ${
                    isManageActive || isManageOpen ? 'text-white' : 'text-gray-300 group-hover:text-white'
                  }`}>
                    Manage
                  </span>
                  <SafeIcon 
                    icon={FiChevronDown} 
                    className={`h-4 w-4 transition-all duration-200 ${
                      isManageActive || isManageOpen ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    } ${isManageOpen ? 'rotate-180' : ''}`} 
                  />
                </div>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isManageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 right-0 w-48 rounded-xl shadow-xl border border-gray-700"
                    style={{ backgroundColor: '#000018' }}
                  >
                    <div className="py-2">
                      {manageItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsManageOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-3 transition-all duration-200 ${
                              isActive 
                                ? 'bg-white bg-opacity-10 text-white' 
                                : 'text-gray-300 hover:bg-white hover:bg-opacity-5 hover:text-white'
                            }`}
                          >
                            <SafeIcon icon={item.icon} className="h-4 w-4" />
                            <span className="text-sm font-medium">{item.label}</span>
                            {isActive && (
                              <div className="ml-auto w-2 h-2 bg-green-400 rounded-full"></div>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side - Auth & Profile */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              /* User Profile Dropdown */
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {getInitials()}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-white">
                      {getUserDisplayName()}
                    </div>
                    <div className="text-xs text-gray-300">
                      {getRoleLabel(currentUser.role)}
                    </div>
                  </div>
                  <SafeIcon 
                    icon={FiChevronDown} 
                    className={`h-4 w-4 text-gray-300 transition-transform duration-200 ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 right-0 w-80 rounded-xl shadow-xl border border-gray-700 overflow-hidden"
                      style={{ backgroundColor: '#000018' }}
                    >
                      {/* Profile Header */}
                      <div className="px-6 py-4 border-b border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {getInitials()}
                          </div>
                          <div className="flex-1">
                            <div className="text-base font-semibold text-white">
                              {getUserDisplayName()}
                            </div>
                            <div className="text-sm text-blue-100">
                              {currentUser.email}
                            </div>
                            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-2 ${getRoleColor(currentUser.role)}`}>
                              {getRoleLabel(currentUser.role)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Profile Menu Items */}
                      <div className="py-2">
                        <div className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
                          Account
                        </div>
                        <Link
                          to="/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white hover:bg-opacity-5 hover:text-white transition-all duration-200"
                        >
                          <SafeIcon icon={FiSettings} className="h-4 w-4" />
                          <span className="text-sm font-medium">Account Settings</span>
                        </Link>
                        <div className="border-t border-gray-700 my-2"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-red-500 hover:bg-opacity-10 hover:text-red-400 transition-all duration-200"
                        >
                          <SafeIcon icon={FiLogOut} className="h-4 w-4" />
                          <span className="text-sm font-medium">Sign Out</span>
                        </button>
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-3 bg-gray-800 bg-opacity-50 border-t border-gray-700">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Innovatr Platform</span>
                          <span>v2.1.0</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Login Button for logged out users */
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/customer-login')}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 font-medium"
              >
                <SafeIcon icon={FiLogIn} className="h-4 w-4" />
                <span>Sign In</span>
              </motion.button>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10"
              >
                <SafeIcon icon={FiMenu} className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-700 py-4"
            >
              <div className="space-y-2">
                {/* Mobile Auth Section */}
                {currentUser && (
                  <div className="px-4 py-3 bg-white bg-opacity-5 rounded-lg mx-2 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {getInitials()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {getUserDisplayName()}
                        </div>
                        <div className="text-xs text-gray-300">
                          {getRoleLabel(currentUser.role)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {mainNavItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 mx-2 ${
                        isActive 
                          ? 'bg-white bg-opacity-10 text-white' 
                          : 'text-gray-300 hover:bg-white hover:bg-opacity-5 hover:text-white'
                      }`}
                    >
                      <SafeIcon icon={item.icon} className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}

                {/* Mobile Manage Section */}
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <div className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide">
                    Manage
                  </div>
                  {manageItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 mx-2 ${
                          isActive 
                            ? 'bg-white bg-opacity-10 text-white' 
                            : 'text-gray-300 hover:bg-white hover:bg-opacity-5 hover:text-white'
                        }`}
                      >
                        <SafeIcon icon={item.icon} className="h-5 w-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile Logout */}
                {currentUser && (
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 mx-2 text-gray-300 hover:bg-red-500 hover:bg-opacity-10 hover:text-red-400"
                    >
                      <SafeIcon icon={FiLogOut} className="h-5 w-5" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;