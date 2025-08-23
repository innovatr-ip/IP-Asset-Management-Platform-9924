import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QuestLogin } from '@questlabs/react-sdk';
import { useNavigate } from 'react-router-dom';
import questConfig from '../../config/questConfig';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShield, FiCheckCircle, FiTrendingUp, FiUsers, FiGlobe } = FiIcons;

const QuestLoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = ({ userId, token, newUser }) => {
    setIsLoading(true);
    
    // Store authentication data
    localStorage.setItem('quest-userId', userId);
    localStorage.setItem('quest-token', token);
    localStorage.setItem('quest-isNewUser', newUser.toString());
    
    // Call the parent success handler
    if (onLoginSuccess) {
      onLoginSuccess({ userId, token, newUser });
    }
    
    // Navigate based on user type
    if (newUser) {
      navigate('/onboarding');
    } else {
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  const features = [
    {
      icon: FiShield,
      title: "Comprehensive IP Protection",
      description: "Monitor trademarks, patents, and brand assets across multiple platforms"
    },
    {
      icon: FiTrendingUp,
      title: "Real-time Analytics",
      description: "Track portfolio performance with advanced reporting and insights"
    },
    {
      icon: FiUsers,
      title: "Team Collaboration",
      description: "Seamlessly manage IP workflows with your legal team"
    },
    {
      icon: FiGlobe,
      title: "Global Coverage",
      description: "Monitor IP assets across international jurisdictions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <Header />
      
      <main className="flex-grow flex pt-16 pb-8">
        {/* Left Section - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-32 right-16 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <img 
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751635789797-innovatr.png" 
                alt="Innovatr" 
                className="h-12 w-auto mb-6"
              />
              <h1 className="text-4xl font-bold mb-4">
                Welcome to Innovatr
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                The comprehensive intellectual property management platform trusted by legal professionals worldwide.
              </p>
            </motion.div>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <SafeIcon icon={feature.icon} className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 pt-8 border-t border-white/20"
            >
              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheckCircle} className="h-5 w-5 text-green-300" />
                  <span className="text-sm">SOC 2 Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheckCircle} className="h-5 w-5 text-green-300" />
                  <span className="text-sm">99.9% Uptime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheckCircle} className="h-5 w-5 text-green-300" />
                  <span className="text-sm">24/7 Support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Section - Authentication */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <img 
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751635789797-innovatr.png" 
                alt="Innovatr" 
                className="h-10 w-auto mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your IP management platform</p>
            </div>

            {/* Quest Login Component */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="hidden lg:block text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
                <p className="text-gray-600">Access your IP portfolio dashboard</p>
              </div>

              {/* Demo Account Info */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Account:</h3>
                <div className="text-xs text-blue-800 space-y-1">
                  <p><strong>Email:</strong> demo@innovatr.com</p>
                  <p><strong>Password:</strong> demo123</p>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="ml-3 text-gray-600">Setting up your account...</span>
                </div>
              ) : (
                <QuestLogin
                  onSubmit={handleLogin}
                  email={true}
                  google={false}
                  accent={questConfig.PRIMARY_COLOR}
                  style={{
                    width: '100%',
                    minHeight: '400px'
                  }}
                />
              )}

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-xs text-gray-500">
                  By signing in, you agree to our{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-700">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-700">Privacy Policy</a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default QuestLoginPage;