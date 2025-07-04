import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIP } from '../../context/IPContext';
import AlertCard from '../ui/AlertCard';
import MonitoringAlertCard from '../ui/MonitoringAlertCard';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBell, FiCheckCircle, FiShield } = FiIcons;

const Alerts = () => {
  const { alerts, monitoringAlerts } = useIP();
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Combine all alerts
  const allAlerts = [
    ...alerts.map(alert => ({ ...alert, source: 'system' })),
    ...monitoringAlerts.map(alert => ({ ...alert, source: 'monitoring' }))
  ];

  const filteredAlerts = allAlerts.filter(alert => {
    const matchesPriority = filterPriority === 'all' || alert.priority === filterPriority;
    const matchesType = filterType === 'all' || 
                       (filterType === 'monitoring' && alert.source === 'monitoring') ||
                       (filterType === 'system' && alert.source === 'system');
    
    return matchesPriority && matchesType;
  });

  const priorityCounts = {
    critical: allAlerts.filter(a => a.priority === 'critical').length,
    high: allAlerts.filter(a => a.priority === 'high').length,
    medium: allAlerts.filter(a => a.priority === 'medium').length,
    low: allAlerts.filter(a => a.priority === 'low').length,
  };

  const typeCounts = {
    monitoring: monitoringAlerts.length,
    system: alerts.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Alerts & Notifications
          </h1>
          <p className="text-gray-600">
            Stay on top of important deadlines, renewals, and brand monitoring alerts
          </p>
        </motion.div>

        {/* Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Alerts</h3>
            
            {/* Priority Filter */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">By Priority</h4>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setFilterPriority('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterPriority === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({allAlerts.length})
                </button>
                <button
                  onClick={() => setFilterPriority('critical')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterPriority === 'critical'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  Critical ({priorityCounts.critical})
                </button>
                <button
                  onClick={() => setFilterPriority('high')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterPriority === 'high'
                      ? 'bg-orange-600 text-white'
                      : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                  }`}
                >
                  High ({priorityCounts.high})
                </button>
                <button
                  onClick={() => setFilterPriority('medium')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterPriority === 'medium'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                  }`}
                >
                  Medium ({priorityCounts.medium})
                </button>
                <button
                  onClick={() => setFilterPriority('low')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterPriority === 'low'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  Low ({priorityCounts.low})
                </button>
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">By Type</h4>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Types
                </button>
                <button
                  onClick={() => setFilterType('monitoring')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                    filterType === 'monitoring'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  <SafeIcon icon={FiShield} className="h-4 w-4" />
                  <span>Brand Monitoring ({typeCounts.monitoring})</span>
                </button>
                <button
                  onClick={() => setFilterType('system')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                    filterType === 'system'
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                  }`}
                >
                  <SafeIcon icon={FiBell} className="h-4 w-4" />
                  <span>System Alerts ({typeCounts.system})</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alerts List */}
        <AnimatePresence>
          {filteredAlerts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {filteredAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {alert.source === 'monitoring' ? (
                    <MonitoringAlertCard alert={alert} />
                  ) : (
                    <AlertCard alert={alert} />
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <SafeIcon
                icon={allAlerts.length === 0 ? FiCheckCircle : FiBell}
                className="h-16 w-16 text-gray-400 mx-auto mb-4"
              />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {allAlerts.length === 0 ? 'All caught up!' : 'No alerts for this filter'}
              </h3>
              <p className="text-gray-600">
                {allAlerts.length === 0
                  ? 'You have no pending alerts. Great job staying on top of your IP portfolio!'
                  : 'Try selecting a different filter to see other alerts.'
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Alerts;