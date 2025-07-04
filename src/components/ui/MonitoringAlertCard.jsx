import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useIP } from '../../context/IPContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiExternalLink, FiShield, FiGlobe, FiShoppingCart, FiUsers, FiAlertTriangle, FiInfo } = FiIcons;

const MonitoringAlertCard = ({ alert }) => {
  const { dismissMonitoringAlert } = useIP();

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
          icon: FiInfo,
        };
      case 'low':
        return {
          bgColor: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
          badgeColor: 'bg-blue-100 text-blue-800',
          icon: FiInfo,
        };
      default:
        return {
          bgColor: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
          badgeColor: 'bg-gray-100 text-gray-800',
          icon: FiInfo,
        };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'new_application':
      case 'similar_mark':
        return FiShield;
      case 'domain_registration':
        return FiGlobe;
      case 'suspicious_listing':
        return FiShoppingCart;
      case 'brand_mention':
        return FiUsers;
      default:
        return FiInfo;
    }
  };

  const config = getPriorityConfig(alert.priority);
  const TypeIcon = getTypeIcon(alert.type);

  const renderAlertDetails = () => {
    if (!alert.data) return null;

    switch (alert.type) {
      case 'new_application':
      case 'similar_mark':
        return (
          <div className="mt-3 p-3 bg-white bg-opacity-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {alert.data.serialNumber && (
                <div>
                  <span className="font-medium">Serial #:</span> {alert.data.serialNumber}
                </div>
              )}
              {alert.data.applicantName && (
                <div>
                  <span className="font-medium">Applicant:</span> {alert.data.applicantName}
                </div>
              )}
              {alert.data.applicationDate && (
                <div>
                  <span className="font-medium">Filed:</span> {format(new Date(alert.data.applicationDate), 'MMM dd, yyyy')}
                </div>
              )}
              {alert.data.similarity && (
                <div>
                  <span className="font-medium">Similarity:</span> {Math.round(alert.data.similarity * 100)}%
                </div>
              )}
            </div>
            {alert.data.goodsAndServices && (
              <div className="mt-2 text-xs">
                <span className="font-medium">Goods/Services:</span>
                <p className="text-gray-600 mt-1">{alert.data.goodsAndServices}</p>
              </div>
            )}
          </div>
        );
      case 'domain_registration':
        return (
          <div className="mt-3 p-3 bg-white bg-opacity-50 rounded-lg">
            <div className="text-xs space-y-1">
              <div><span className="font-medium">Domain:</span> {alert.data.name}</div>
              <div><span className="font-medium">Registered:</span> {format(new Date(alert.data.registrationDate), 'MMM dd, yyyy')}</div>
              <div><span className="font-medium">Registrant:</span> {alert.data.registrant}</div>
            </div>
          </div>
        );
      case 'suspicious_listing':
        return (
          <div className="mt-3 p-3 bg-white bg-opacity-50 rounded-lg">
            <div className="text-xs space-y-1">
              <div><span className="font-medium">Platform:</span> {alert.platform}</div>
              <div><span className="font-medium">Seller:</span> {alert.data.seller}</div>
              <div><span className="font-medium">Price:</span> {alert.data.price}</div>
              {alert.data.url && (
                <a
                  href={alert.data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                >
                  <span>View Listing</span>
                  <SafeIcon icon={FiExternalLink} className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        );
      case 'brand_mention':
        return (
          <div className="mt-3 p-3 bg-white bg-opacity-50 rounded-lg">
            <div className="text-xs space-y-2">
              <div><span className="font-medium">Platform:</span> {alert.platform}</div>
              <div><span className="font-medium">Author:</span> {alert.data.author}</div>
              <div className="bg-gray-100 p-2 rounded text-gray-700 italic">
                "{alert.data.content}"
              </div>
              {alert.data.engagement && (
                <div className="flex space-x-4 text-gray-600">
                  <span>👍 {alert.data.engagement.likes}</span>
                  <span>🔄 {alert.data.engagement.shares}</span>
                  <span>💬 {alert.data.engagement.comments}</span>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
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
        <div className="flex items-start space-x-4 flex-1">
          <div className={`p-2 bg-white rounded-lg ${config.iconColor}`}>
            <SafeIcon icon={TypeIcon} className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.badgeColor}`}>
                {alert.priority.toUpperCase()}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white ${config.textColor}`}>
                {alert.type.replace('_', ' ').toUpperCase()}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                🔍 {alert.monitoringItemName}
              </span>
            </div>
            <h3 className={`font-medium ${config.textColor} mb-1`}>
              {alert.title}
            </h3>
            <p className={`text-sm ${config.textColor} opacity-90 mb-2`}>
              {alert.description}
            </p>
            {alert.keyword && (
              <p className="text-xs text-gray-600 mb-2">
                <span className="font-medium">Triggered by keyword:</span> "{alert.keyword}"
              </p>
            )}
            {alert.actionRequired && (
              <div className="mt-3 p-2 bg-white bg-opacity-60 rounded-lg">
                <p className="text-xs font-medium text-gray-800">Recommended Action:</p>
                <p className="text-xs text-gray-600 mt-1">{alert.actionRequired}</p>
              </div>
            )}
            {renderAlertDetails()}
            <p className="text-xs text-gray-500 mt-3">
              Detected: {format(new Date(alert.detectedAt), 'MMM dd, yyyy HH:mm')}
            </p>
          </div>
        </div>
        <button
          onClick={() => dismissMonitoringAlert(alert.id)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200"
        >
          <SafeIcon icon={FiX} className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default MonitoringAlertCard;