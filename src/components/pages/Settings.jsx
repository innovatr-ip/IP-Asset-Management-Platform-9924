import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useIP } from '../../context/IPContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSettings, FiBell, FiMail, FiRefreshCw, FiSave } = FiIcons;

const Settings = () => {
  const { settings, updateSettings } = useIP();
  const [localSettings, setLocalSettings] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAlertDaysChange = (index, value) => {
    const newAlertDays = [...localSettings.alertDays];
    newAlertDays[index] = parseInt(value);
    setLocalSettings(prev => ({
      ...prev,
      alertDays: newAlertDays.sort((a, b) => a - b)
    }));
  };

  const addAlertDay = () => {
    const newDay = 30;
    setLocalSettings(prev => ({
      ...prev,
      alertDays: [...prev.alertDays, newDay].sort((a, b) => a - b)
    }));
  };

  const removeAlertDay = (index) => {
    const newAlertDays = localSettings.alertDays.filter((_, i) => i !== index);
    setLocalSettings(prev => ({
      ...prev,
      alertDays: newAlertDays
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Settings
          </h1>
          <p className="text-gray-600">
            Configure your IP management preferences
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Alert Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3 mb-6">
              <SafeIcon icon={FiBell} className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Alert Settings</h2>
            </div>

            <div className="space-y-6">
              {/* Alert Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Alert Days Before Expiry
                </label>
                <div className="space-y-3">
                  {localSettings.alertDays.map((days, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="number"
                        value={days}
                        onChange={(e) => handleAlertDaysChange(index, e.target.value)}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="1"
                        max="365"
                      />
                      <span className="text-gray-600">days</span>
                      {localSettings.alertDays.length > 1 && (
                        <button
                          onClick={() => removeAlertDay(index)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <SafeIcon icon={FiIcons.FiX} className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addAlertDay}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                  >
                    + Add Alert Day
                  </button>
                </div>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive email alerts for upcoming deadlines</p>
                </div>
                <button
                  onClick={() => setLocalSettings(prev => ({
                    ...prev,
                    emailNotifications: !prev.emailNotifications
                  }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.emailNotifications ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Auto Renewal */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Auto Renewal Reminders</h3>
                  <p className="text-sm text-gray-500">Automatically set renewal reminders for assets</p>
                </div>
                <button
                  onClick={() => setLocalSettings(prev => ({
                    ...prev,
                    autoRenewal: !prev.autoRenewal
                  }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.autoRenewal ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.autoRenewal ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3 mb-6">
              <SafeIcon icon={FiMail} className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Critical alerts (expired assets)</span>
                <span className="text-red-600 font-medium">Always enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">High priority alerts (30 days or less)</span>
                <span className="text-orange-600 font-medium">Always enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Medium priority alerts (30-60 days)</span>
                <span className="text-yellow-600 font-medium">Configurable</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Low priority alerts (60+ days)</span>
                <span className="text-blue-600 font-medium">Configurable</span>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-end"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className={`px-6 py-3 rounded-lg font-medium shadow-lg flex items-center space-x-2 transition-all duration-200 ${
                saved
                  ? 'bg-green-600 text-white'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              <SafeIcon 
                icon={saved ? FiIcons.FiCheck : FiSave} 
                className="h-5 w-5" 
              />
              <span>{saved ? 'Saved!' : 'Save Settings'}</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;