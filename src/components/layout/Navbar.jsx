import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShield, FiHome, FiFolder, FiBell, FiSettings, FiUsers, FiCheckSquare, FiFileText, FiCalendar, FiEye, FiChevronDown, FiMenu } = FiIcons;

const Navbar = () => {
  const location = useLocation();
  const [isManageOpen, setIsManageOpen] = useState(false);
  const dropdownRef = useRef(null);

  const manageItems = [
    { path: '/clients', icon: FiUsers, label: 'Clients' },
    { path: '/assets', icon: FiFolder, label: 'IP Assets' },
    { path: '/matters', icon: FiFileText, label: 'Matters' },
    { path: '/tasks', icon: FiCheckSquare, label: 'Tasks' },
  ];

  const mainNavItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/monitoring', icon: FiEye, label: 'Brand Monitoring' },
    { path: '/calendar', icon: FiCalendar, label: 'Calendar' },
    { path: '/alerts', icon: FiBell, label: 'Alerts' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ];

  // Check if any manage item is active
  const isManageActive = manageItems.some(item => location.pathname === item.path);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsManageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-700 shadow-lg" style={{ backgroundColor: '#000018' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
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

          {/* Navigation Links */}
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
                        isActive
                          ? 'text-white'
                          : 'text-gray-300 group-hover:text-white'
                      }`}
                    />
                    <span
                      className={`text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-gray-300 group-hover:text-white'
                      }`}
                    >
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
                      isManageActive || isManageOpen
                        ? 'text-white'
                        : 'text-gray-300 group-hover:text-white'
                    }`}
                  />
                  <span
                    className={`text-sm font-medium transition-colors ${
                      isManageActive || isManageOpen
                        ? 'text-white'
                        : 'text-gray-300 group-hover:text-white'
                    }`}
                  >
                    Manage
                  </span>
                  <SafeIcon
                    icon={FiChevronDown}
                    className={`h-4 w-4 transition-all duration-200 ${
                      isManageActive || isManageOpen
                        ? 'text-white'
                        : 'text-gray-300 group-hover:text-white'
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10">
              <SafeIcon icon={FiMenu} className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;