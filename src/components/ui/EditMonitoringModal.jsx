import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIP } from '../../context/IPContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiSave } = FiIcons;

const EditMonitoringModal = ({ item, isOpen, onClose }) => {
  const { updateMonitoringItem, clients } = useIP();
  const [formData, setFormData] = useState({
    name: '',
    clientId: '',
    keywords: [''],
    frequency: 'daily',
    notifications: true,
    status: 'active',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        clientId: item.clientId || '',
        keywords: item.keywords || [''],
        frequency: item.frequency || 'daily',
        notifications: item.notifications !== false,
        status: item.status || 'active',
        // Copy type-specific settings
        ...(item.type === 'trademark' && {
          classes: item.classes || [],
          includeVariations: item.includeVariations !== false,
        }),
        ...(item.type === 'domain' && {
          extensions: item.extensions || ['.com', '.net', '.org'],
          includeTypos: item.includeTypos !== false,
        }),
        ...(item.type === 'marketplace' && {
          platforms: item.platforms || ['amazon', 'ebay'],
          categories: item.categories || [],
        }),
        ...(item.type === 'social' && {
          socialPlatforms: item.socialPlatforms || ['instagram', 'twitter', 'facebook'],
          includeHashtags: item.includeHashtags !== false,
        }),
      });
    }
  }, [item]);

  const frequencies = [
    { value: 'hourly', label: 'Every Hour' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty keywords
    const cleanData = {
      ...formData,
      keywords: formData.keywords.filter(k => k.trim())
    };

    updateMonitoringItem(item.id, cleanData);
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

  if (!isOpen || !item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Monitoring</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <SafeIcon icon={FiX} className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
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

            {/* Client */}
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

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords to Monitor *
              </label>
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

            {/* Frequency */}
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
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="error">Error</option>
              </select>
            </div>

            {/* Notifications */}
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

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 flex items-center space-x-2"
              >
                <SafeIcon icon={FiSave} className="h-5 w-5" />
                <span>Save Changes</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditMonitoringModal;