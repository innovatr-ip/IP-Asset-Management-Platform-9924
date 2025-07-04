import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBell, FiArrowRight, FiCheckCircle } = FiIcons;

const AlertsOverview = ({ alerts }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-8 shadow-md border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Urgent Alerts</h2>
        <Link 
          to="/alerts" 
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
        >
          <span className="text-sm font-medium">View all</span>
          <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => {
            const getPriorityColor = (priority) => {
              switch (priority) {
                case 'critical': return 'text-red-600 bg-red-50';
                case 'high': return 'text-orange-600 bg-orange-50';
                case 'medium': return 'text-yellow-600 bg-yellow-50';
                default: return 'text-blue-600 bg-blue-50';
              }
            };

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                <div className={`p-2 rounded-lg ${getPriorityColor(alert.priority)}`}>
                  <SafeIcon icon={FiBell} className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm">
                    {alert.assetName}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {alert.message}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getPriorityColor(alert.priority)}`}>
                    {alert.priority.toUpperCase()}
                  </span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <SafeIcon icon={FiCheckCircle} className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No urgent alerts</p>
            <p className="text-gray-400 text-xs">You're all caught up!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AlertsOverview;