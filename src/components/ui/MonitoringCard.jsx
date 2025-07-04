import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useIP } from '../../context/IPContext';
import SafeIcon from '../../common/SafeIcon';
import EditMonitoringModal from './EditMonitoringModal';
import * as FiIcons from 'react-icons/fi';

const { FiEdit, FiTrash2, FiShield, FiGlobe, FiShoppingCart, FiUsers, FiAlertTriangle, FiCheckCircle, FiClock, FiEye, FiActivity } = FiIcons;

const MonitoringCard = ({ item }) => {
  const { deleteMonitoringItem, runManualCheck } = useIP();
  const [showEditModal, setShowEditModal] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const getTypeConfig = (type) => {
    switch (type) {
      case 'trademark':
        return {
          icon: FiShield,
          label: 'USPTO Trademark',
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-600',
          description: 'Federal trademark applications'
        };
      case 'domain':
        return {
          icon: FiGlobe,
          label: 'Domain Names',
          bgColor: 'bg-green-50',
          iconColor: 'text-green-600',
          description: 'Domain registrations & availability'
        };
      case 'marketplace':
        return {
          icon: FiShoppingCart,
          label: 'Marketplace',
          bgColor: 'bg-purple-50',
          iconColor: 'text-purple-600',
          description: 'Amazon, eBay, Etsy listings'
        };
      case 'social':
        return {
          icon: FiUsers,
          label: 'Social Media',
          bgColor: 'bg-orange-50',
          iconColor: 'text-orange-600',
          description: 'Social platform monitoring'
        };
      default:
        return {
          icon: FiEye,
          label: 'General',
          bgColor: 'bg-gray-50',
          iconColor: 'text-gray-600',
          description: 'General brand monitoring'
        };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'checking':
        return 'bg-blue-100 text-blue-700';
      case 'paused':
        return 'bg-yellow-100 text-yellow-700';
      case 'error':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return FiCheckCircle;
      case 'checking':
        return FiActivity;
      case 'paused':
        return FiClock;
      case 'error':
        return FiAlertTriangle;
      default:
        return FiClock;
    }
  };

  const getAlertLevelColor = (alertCount) => {
    if (alertCount === 0) return 'text-green-600 bg-green-50';
    if (alertCount <= 5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this monitoring item?')) {
      deleteMonitoringItem(item.id);
    }
  };

  const handleManualCheck = async () => {
    setIsChecking(true);
    try {
      await runManualCheck(item.id);
    } finally {
      setIsChecking(false);
    }
  };

  const typeConfig = getTypeConfig(item.type);
  const StatusIcon = getStatusIcon(item.status);

  return (
    <>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 ${typeConfig.bgColor} rounded-lg`}>
              <SafeIcon icon={typeConfig.icon} className={`h-5 w-5 ${typeConfig.iconColor}`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
              <p className="text-sm text-gray-600">{typeConfig.label}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleManualCheck}
              disabled={isChecking || item.status === 'checking'}
              className={`p-2 rounded-lg transition-all duration-200 disabled:opacity-50 ${
                item.type === 'trademark' 
                  ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50' 
                  : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
              }`}
              title={item.type === 'trademark' ? 'Run USPTO check' : 'Manual check (mock)'}
            >
              <SafeIcon 
                icon={isChecking || item.status === 'checking' ? FiClock : FiIcons.FiRefreshCw} 
                className={`h-4 w-4 ${(isChecking || item.status === 'checking') ? 'animate-spin' : ''}`} 
              />
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
            >
              <SafeIcon icon={FiEdit} className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <SafeIcon icon={FiTrash2} className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Status and Alerts */}
        <div className="flex items-center space-x-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)} capitalize flex items-center space-x-1`}>
            <SafeIcon icon={StatusIcon} className="h-3 w-3" />
            <span>{item.status === 'checking' ? 'Running Check...' : item.status}</span>
          </span>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getAlertLevelColor(item.alertCount || 0)}`}>
            {item.alertCount || 0} alerts
          </div>
          {item.type === 'trademark' && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              🇺🇸 Live API
            </span>
          )}
        </div>

        {/* Keywords */}
        {item.keywords && item.keywords.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Monitoring Keywords:</h4>
            <div className="flex flex-wrap gap-1">
              {item.keywords.slice(0, 3).map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  {keyword}
                </span>
              ))}
              {item.keywords.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                  +{item.keywords.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4">
          {typeConfig.description}
          {item.type === 'trademark' && (
            <span className="block text-green-600 text-xs mt-1">
              ✓ Real-time USPTO monitoring active
            </span>
          )}
        </p>

        {/* Settings Summary */}
        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Check Frequency:</span>
            <span className="text-gray-900 font-medium capitalize">{item.frequency || 'daily'}</span>
          </div>
          {item.type === 'trademark' && item.includeVariations && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Variations:</span>
              <span className="text-gray-900 font-medium">Enabled</span>
            </div>
          )}
          {item.type === 'domain' && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Extensions:</span>
              <span className="text-gray-900 font-medium">{item.extensions?.length || 0} TLDs</span>
            </div>
          )}
          {item.type === 'marketplace' && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Platforms:</span>
              <span className="text-gray-900 font-medium">{item.platforms?.length || 0} sites</span>
            </div>
          )}
        </div>

        {/* Last Check */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Last checked:</span>
            <span>
              {item.lastChecked
                ? format(new Date(item.lastChecked), 'MMM dd, yyyy HH:mm')
                : 'Never'}
            </span>
          </div>
          {item.nextCheck && (
            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
              <span>Next check:</span>
              <span>{format(new Date(item.nextCheck), 'MMM dd, yyyy HH:mm')}</span>
            </div>
          )}
        </div>

        {/* Error Display */}
        {item.status === 'error' && item.lastError && (
          <div className="mt-3 p-2 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiAlertTriangle} className="h-4 w-4 text-red-600" />
              <span className="text-xs text-red-800">
                Error: {item.lastError}
              </span>
            </div>
          </div>
        )}

        {/* Recent Activity Indicator */}
        {item.lastAlertDate && (
          <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiAlertTriangle} className="h-4 w-4 text-yellow-600" />
              <span className="text-xs text-yellow-800">
                Recent activity: {format(new Date(item.lastAlertDate), 'MMM dd')}
              </span>
            </div>
          </div>
        )}

        {/* Real-time Results Preview */}
        {item.lastResults && item.lastResults.length > 0 && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <h5 className="text-xs font-medium text-blue-800 mb-2">Latest Findings:</h5>
            <div className="space-y-1">
              {item.lastResults.slice(0, 2).map((result, index) => (
                <div key={index} className="text-xs text-blue-700">
                  • {result.markDescription || result.name || result.title || 'New result found'}
                </div>
              ))}
              {item.lastResults.length > 2 && (
                <div className="text-xs text-blue-600">
                  +{item.lastResults.length - 2} more results
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      <EditMonitoringModal
        item={item}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
};

export default MonitoringCard;