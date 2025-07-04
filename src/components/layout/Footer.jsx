import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHeart, FiShield, FiFileText } = FiIcons;

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          
          {/* Left Side - Copyright */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-3"
          >
            {/* Logo */}
            <div className="relative">
              <img 
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751635789797-innovatr.png"
                alt="Innovatr"
                className="h-6 w-auto opacity-80"
              />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            
            {/* Copyright Text */}
            <div className="text-gray-300 text-sm">
              <span className="font-medium">© Copyright 2025 Innovatr</span>
              <span className="mx-2">•</span>
              <span>All Rights Reserved</span>
            </div>
          </motion.div>

          {/* Right Side - Legal Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center space-x-6"
          >
            <a
              href="#privacy"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200 group"
            >
              <SafeIcon 
                icon={FiShield} 
                className="h-4 w-4 group-hover:text-blue-400 transition-colors" 
              />
              <span className="text-sm font-medium group-hover:underline">
                Privacy Policy
              </span>
            </a>
            
            <a
              href="#terms"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200 group"
            >
              <SafeIcon 
                icon={FiFileText} 
                className="h-4 w-4 group-hover:text-blue-400 transition-colors" 
              />
              <span className="text-sm font-medium group-hover:underline">
                Terms of Use
              </span>
            </a>
          </motion.div>
        </div>

        {/* Bottom Decorative Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-6 pt-4 border-t border-gray-700"
        >
          <div className="flex justify-center items-center space-x-2 text-gray-500 text-xs">
            <span>Crafted with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <SafeIcon icon={FiHeart} className="h-3 w-3 text-red-400" />
            </motion.div>
            <span>for IP professionals worldwide</span>
          </div>
        </motion.div>

        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;