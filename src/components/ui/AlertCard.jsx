import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useIP } from '../../context/IPContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiAlertTriangle, FiClock, FiRefreshCw } = FiIcons;

const AlertCard = ({ alert }) => {
  const { dismissAlert } = useIP();

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'critical':
        return {
          bgColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          badgeColor: 'bg-red-100 text-red-800',
          icon: FiAlertTriangle,
        };
      case 'high':
        return {
          bgColor: 'bg-orange-50 border-orange-200',
          textColor: 'text-orange-800',
          iconColor: 'text-orange-600',
          badgeColor: 'bg-orange-100 text-orange-800',
          icon: FiAlertTriangle,
        };
      case 'medium':
        return {
          bgColor: 'bg-yellow-50 border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          badgeColor: 'bg-yellow-100 text-yellow-800',
          icon: FiClock,
        };
      case 'low':
        return {
          bgColor: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
          badgeColor: 'bg-blue-100 text-blue-800',
          icon: FiClock,
        };
      default:
        return {
          bgColor: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
          badgeColor: 'bg-gray-100 text-gray-800',
          icon: FiClock,
        };
    }
  };

  const config = getPriorityConfig(alert.priority);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'expiry': return FiAlertTriangle;
      case 'renewal': return FiRefreshCw;
      case 'overdue': return FiAlertTriangle;
      case 'matter-deadline': return FiClock;
      case 'matter-overdue': return FiAlertTriangle;
      default: return FiClock;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'expiry': return 'EXPIRY';
      case 'renewal': return 'RENEWAL';
      case 'overdue': return 'OVERDUE';
      case 'matter-deadline': return 'MATTER DEADLINE';
      case 'matter-overdue': return 'MATTER OVERDUE';
      default: return type?.toUpperCase() || 'ALERT';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`${config.bgColor} border rounded-xl p-6 shadow-sm`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className={`p-2 bg-white rounded-lg ${config.iconColor}`}>
            <SafeIcon icon={getTypeIcon(alert.type)} className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.badgeColor}`}>
                {alert.priority.toUpperCase()}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white ${config.textColor}`}>
                {getTypeLabel(alert.type)}
              </span>
            </div>
            <h3 className={`font-medium ${config.textColor} mb-1`}>
              {alert.assetName || alert.matterTitle || 'Alert'}
            </h3>
            <p className={`text-sm ${config.textColor} opacity-90 mb-2`}>
              {alert.message}
            </p>
            <p className="text-xs text-gray-500">
              Alert created: {format(new Date(alert.createdAt), 'MMM dd, yyyy HH:mm')}
            </p>
          </div>
        </div>
        <button
          onClick={() => dismissAlert(alert.id)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200"
        >
          <SafeIcon icon={FiX} className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default AlertCard;