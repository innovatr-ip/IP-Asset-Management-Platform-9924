import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OnBoarding } from '@questlabs/react-sdk';
import { useNavigate } from 'react-router-dom';
import questConfig from '../../config/questConfig';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiRocket, FiTarget, FiUsers, FiTrendingUp, FiCheckCircle } = FiIcons;

const QuestOnboardingPage = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  
  // Get stored authentication data
  const userId = localStorage.getItem('quest-userId');
  const token = localStorage.getItem('quest-token');

  useEffect(() => {
    // Redirect if no authentication data
    if (!userId || !token) {
      navigate('/login');
      return;
    }
  }, [userId, token, navigate]);

  const getAnswers = () => {
    // Clear the new user flag
    localStorage.removeItem('quest-isNewUser');
    
    // Navigate to main application
    navigate('/dashboard');
  };

  const onboardingSteps = [
    {
      icon: FiTarget,
      title: "Set Your Goals",
      description: "Tell us about your IP management objectives"
    },
    {
      icon: FiUsers,
      title: "Team Setup",
      description: "Configure your organization and team preferences"
    },
    {
      icon: FiTrendingUp,
      title: "Portfolio Insights",
      description: "Customize your dashboard and reporting preferences"
    }
  ];

  const benefits = [
    "Comprehensive IP asset tracking",
    "Real-time brand monitoring",
    "Automated deadline management",
    "Team collaboration tools",
    "Advanced reporting & analytics"
  ];

  if (!userId || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Left Section - Welcome & Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-blue-600 to-purple-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
          <div className="absolute top-32 left-24 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-24 right-20 w-56 h-56 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center space-x-3 mb-6">
              <SafeIcon icon={FiRocket} className="h-8 w-8 text-green-300" />
              <h1 className="text-4xl font-bold">Let's Get Started!</h1>
            </div>
            <p className="text-xl text-green-100 leading-relaxed">
              Welcome to Innovatr! We're setting up your personalized IP management experience.
            </p>
          </motion.div>

          {/* Onboarding Steps Preview */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6">What to Expect:</h2>
            <div className="space-y-4">
              {onboardingSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className={`flex items-start space-x-4 p-3 rounded-lg transition-all duration-300 ${
                    index === currentStep ? 'bg-white/10 backdrop-blur-sm' : ''
                  }`}
                >
                  <div className="flex-shrink-0 p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <SafeIcon icon={step.icon} className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-green-100 text-sm">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold mb-4">You'll get access to:</h3>
            {benefits.map((benefit, index) => (
              <div key={benefit} className="flex items-center space-x-3">
                <SafeIcon icon={FiCheckCircle} className="h-5 w-5 text-green-300 flex-shrink-0" />
                <span className="text-green-100">{benefit}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Section - Onboarding Component */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <SafeIcon icon={FiRocket} className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Let's Get Started!</h1>
            </div>
            <p className="text-gray-600">Setting up your IP management experience</p>
          </div>

          {/* Onboarding Container */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="hidden lg:block text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Setup</h2>
              <p className="text-gray-600">Help us personalize your experience</p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Setup Progress</span>
                <span className="text-sm font-medium text-primary-600">Step {currentStep + 1} of 3</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Quest Onboarding Component */}
            <div style={{ minHeight: '400px' }}>
              <OnBoarding
                userId={userId}
                token={token}
                questId={questConfig.QUEST_ONBOARDING_QUESTID}
                answer={answers}
                setAnswer={setAnswers}
                getAnswers={getAnswers}
                singleChoose="modal1"
                multiChoice="modal2"
                style={{
                  width: '100%',
                  minHeight: '400px'
                }}
              >
                <OnBoarding.Header />
                <OnBoarding.Content />
                <OnBoarding.Footer />
              </OnBoarding>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Need help? Contact our support team at{' '}
                <a href="mailto:support@innovatr.com" className="text-primary-600 hover:text-primary-700">
                  support@innovatr.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuestOnboardingPage;