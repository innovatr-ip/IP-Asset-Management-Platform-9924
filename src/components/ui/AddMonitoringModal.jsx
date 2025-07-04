import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIP } from '../../context/IPContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiPlus } = FiIcons;

const AddMonitoringModal = ({ isOpen, onClose }) => {
  const { addMonitoringItem, clients } = useIP();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: 'trademark',
    clientId: '',
    keywords: [''],
    frequency: 'daily',
    notifications: true,
    // Trademark specific
    classes: [],
    includeVariations: true,
    // Domain specific
    extensions: ['.com', '.net', '.org'],
    includeTypos: true,
    // Marketplace specific
    platforms: ['amazon', 'ebay'],
    categories: [],
    // Social specific
    socialPlatforms: ['instagram', 'twitter', 'facebook'],
    includeHashtags: true,
  });

  const monitoringTypes = [
    {
      value: 'trademark',
      label: 'USPTO Trademark',
      icon: FiIcons.FiShield,
      description: 'Monitor federal trademark applications and registrations',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      value: 'domain',
      label: 'Domain Names',
      icon: FiIcons.FiGlobe,
      description: 'Track new domain registrations and availability',
      color: 'text-green-600 bg-green-50'
    },
    {
      value: 'marketplace',
      label: 'Marketplace',
      icon: FiIcons.FiShoppingCart,
      description: 'Monitor product listings on major e-commerce platforms',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      value: 'social',
      label: 'Social Media',
      icon: FiIcons.FiUsers,
      description: 'Track brand mentions and username availability',
      color: 'text-orange-600 bg-orange-50'
    }
  ];

  const frequencies = [
    { value: 'hourly', label: 'Every Hour' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const domainExtensions = [
    '.com', '.net', '.org', '.biz', '.info', '.co', '.io', 
    '.us', '.uk', '.au', '.ca', '.de', '.fr', '.jp'
  ];

  const marketplacePlatforms = [
    { value: 'amazon', label: 'Amazon' },
    { value: 'ebay', label: 'eBay' },
    { value: 'etsy', label: 'Etsy' },
    { value: 'alibaba', label: 'Alibaba' },
    { value: 'shopify', label: 'Shopify Stores' },
    { value: 'walmart', label: 'Walmart' }
  ];

  const socialPlatforms = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'Twitter/X' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'youtube', label: 'YouTube' }
  ];

  const trademarkClasses = [
    { value: '1', label: 'Class 1 - Chemicals' },
    { value: '9', label: 'Class 9 - Electronics' },
    { value: '25', label: 'Class 25 - Clothing' },
    { value: '35', label: 'Class 35 - Advertising' },
    { value: '42', label: 'Class 42 - Technology' },
    // Add more as needed
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clean up data based on type
    const cleanData = { ...formData };
    if (cleanData.type !== 'trademark') {
      delete cleanData.classes;
      delete cleanData.includeVariations;
    }
    if (cleanData.type !== 'domain') {
      delete cleanData.extensions;
      delete cleanData.includeTypos;
    }
    if (cleanData.type !== 'marketplace') {
      delete cleanData.platforms;
      delete cleanData.categories;
    }
    if (cleanData.type !== 'social') {
      delete cleanData.socialPlatforms;
      delete cleanData.includeHashtags;
    }

    // Filter out empty keywords
    cleanData.keywords = cleanData.keywords.filter(k => k.trim());

    addMonitoringItem(cleanData);
    setFormData({
      name: '',
      type: 'trademark',
      clientId: '',
      keywords: [''],
      frequency: 'daily',
      notifications: true,
      classes: [],
      includeVariations: true,
      extensions: ['.com', '.net', '.org'],
      includeTypos: true,
      platforms: ['amazon', 'ebay'],
      categories: [],
      socialPlatforms: ['instagram', 'twitter', 'facebook'],
      includeHashtags: true,
    });
    setCurrentStep(1);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleKeywordChange = (index, value) => {
    const newKeywords = [...formData.keywords];
    newKeywords[index] = value;
    setFormData(prev => ({ ...prev, keywords: newKeywords }));
  };

  const addKeyword = () => {
    setFormData(prev => ({ ...prev, keywords: [...prev.keywords, ''] }));
  };

  const removeKeyword = (index) => {
    setFormData(prev => ({ 
      ...prev, 
      keywords: prev.keywords.filter((_, i) => i !== index) 
    }));
  };

  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() && formData.type;
      case 2:
        return formData.keywords.some(k => k.trim());
      case 3:
        return true;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add Brand Monitoring</h2>
              <p className="text-gray-600 mt-1">Step {currentStep} of 3</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <SafeIcon icon={FiX} className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Setup Progress</span>
              <span className="text-sm font-medium text-gray-600">{Math.round((currentStep / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Info & Type */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monitoring Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Apple Inc. Brand Protection"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client
                  </label>
                  <select
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select a client (optional)</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name} {client.company && `(${client.company})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Monitoring Type *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {monitoringTypes.map(type => (
                      <label
                        key={type.value}
                        className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
                          formData.type === type.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={type.value}
                          checked={formData.type === type.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${type.color}`}>
                            <SafeIcon icon={type.icon} className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{type.label}</h3>
                            <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Keywords & Specific Settings */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords to Monitor *
                  </label>
                  <p className="text-sm text-gray-500 mb-4">
                    Add brand names, product names, and variations to monitor
                  </p>
                  <div className="space-y-2">
                    {formData.keywords.map((keyword, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={keyword}
                          onChange={(e) => handleKeywordChange(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter keyword or brand name"
                        />
                        {formData.keywords.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeKeyword(index)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <SafeIcon icon={FiX} className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addKeyword}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                    >
                      + Add Another Keyword
                    </button>
                  </div>
                </div>

                {/* Type-specific settings */}
                {formData.type === 'trademark' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Trademark Classes (Optional)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {trademarkClasses.map(cls => (
                        <label key={cls.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.classes.includes(cls.value)}
                            onChange={(e) => handleArrayChange('classes', cls.value, e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{cls.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {formData.type === 'domain' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Domain Extensions to Monitor
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {domainExtensions.map(ext => (
                        <label key={ext} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.extensions.includes(ext)}
                            onChange={(e) => handleArrayChange('extensions', ext, e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{ext}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {formData.type === 'marketplace' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Platforms to Monitor
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {marketplacePlatforms.map(platform => (
                        <label key={platform.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.platforms.includes(platform.value)}
                            onChange={(e) => handleArrayChange('platforms', platform.value, e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{platform.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {formData.type === 'social' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Social Platforms to Monitor
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {socialPlatforms.map(platform => (
                        <label key={platform.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.socialPlatforms.includes(platform.value)}
                            onChange={(e) => handleArrayChange('socialPlatforms', platform.value, e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{platform.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Frequency & Notifications */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check Frequency
                  </label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  >
                    {frequencies.map(freq => (
                      <option key={freq.value} value={freq.value}>
                        {freq.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    More frequent checks provide faster alerts but may increase costs
                  </p>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="notifications"
                      checked={formData.notifications}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                      <p className="text-sm text-gray-500">Receive email alerts when new matches are found</p>
                    </div>
                  </label>
                </div>

                {/* Type-specific advanced options */}
                {formData.type === 'trademark' && (
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="includeVariations"
                        checked={formData.includeVariations}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Include Variations</span>
                        <p className="text-sm text-gray-500">Monitor similar spellings and phonetic variations</p>
                      </div>
                    </label>
                  </div>
                )}

                {formData.type === 'domain' && (
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="includeTypos"
                        checked={formData.includeTypos}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Include Typosquatting</span>
                        <p className="text-sm text-gray-500">Monitor common typos and character substitutions</p>
                      </div>
                    </label>
                  </div>
                )}

                {formData.type === 'social' && (
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="includeHashtags"
                        checked={formData.includeHashtags}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Monitor Hashtags</span>
                        <p className="text-sm text-gray-500">Include hashtag variations in monitoring</p>
                      </div>
                    </label>
                  </div>
                )}

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Monitoring Summary</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Type:</strong> {monitoringTypes.find(t => t.value === formData.type)?.label}</p>
                    <p><strong>Keywords:</strong> {formData.keywords.filter(k => k.trim()).length} keywords</p>
                    <p><strong>Frequency:</strong> {frequencies.find(f => f.value === formData.frequency)?.label}</p>
                    <p><strong>Notifications:</strong> {formData.notifications ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    Previous
                  </button>
                )}
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!canProceed()}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SafeIcon icon={FiPlus} className="h-5 w-5" />
                    <span>Start Monitoring</span>
                  </motion.button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddMonitoringModal;