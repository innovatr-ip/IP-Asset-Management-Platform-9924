import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiMail, FiLock, FiEye, FiEyeOff, FiLogIn, FiAlertCircle, FiShield, 
  FiTrendingUp, FiUsers, FiGlobe, FiCheckCircle 
} = FiIcons;

const UnifiedLoginPage = () => {
  const navigate = useNavigate();
  const { login, authError } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        // Navigate based on user role
        if (result.user.role === 'super_admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (error || authError) {
      setError('');
    }
  };

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

            {/* Login Form */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="hidden lg:block text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
                <p className="text-gray-600">Access your IP portfolio dashboard</p>
              </div>

              {/* Demo Accounts Info */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Accounts:</h3>
                <div className="text-xs text-blue-800 space-y-1">
                  <p><strong>Super Admin:</strong> admin@innovatr.com / admin123</p>
                  <p><strong>Regular User:</strong> demo@innovatr.com / demo123</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {(error || authError) && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                    <SafeIcon icon={FiAlertCircle} className="h-5 w-5 text-red-600 mt-0.5" />
                    <p className="text-red-700 text-sm">{error || authError}</p>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <SafeIcon icon={FiLogIn} className="h-5 w-5" />
                      <span>Sign In</span>
                    </>
                  )}
                </motion.button>
              </form>

              {/* Quick Login Buttons */}
              <div className="mt-6 space-y-3">
                <div className="text-center text-sm text-gray-600 mb-3">
                  Quick Demo Access:
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setFormData({ email: 'admin@innovatr.com', password: 'admin123' });
                    }}
                    className="w-full px-4 py-2 text-sm border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <SafeIcon icon={FiShield} className="h-4 w-4" />
                    <span>Super Admin Demo</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setFormData({ email: 'demo@innovatr.com', password: 'demo123' });
                    }}
                    className="w-full px-4 py-2 text-sm border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <SafeIcon icon={FiUsers} className="h-4 w-4" />
                    <span>Regular User Demo</span>
                  </motion.button>
                </div>
              </div>

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

export default UnifiedLoginPage;