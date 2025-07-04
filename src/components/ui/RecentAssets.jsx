import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFileText, FiCopyright, FiShield, FiArrowRight } = FiIcons;

const RecentAssets = ({ assets }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'patent': return FiShield;
      case 'trademark': return FiCopyright;
      case 'copyright': return FiFileText;
      case 'trade-secret': return FiIcons.FiLock;
      default: return FiFileText;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-8 shadow-md border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Assets</h2>
        <Link 
          to="/assets" 
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
        >
          <span className="text-sm font-medium">View all</span>
          <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {assets.length > 0 ? (
          assets.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              <div className="p-2 bg-primary-50 rounded-lg">
                <SafeIcon icon={getTypeIcon(asset.type)} className="h-5 w-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{asset.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="capitalize">{asset.type.replace('-', ' ')}</span>
                  <span>•</span>
                  <span>Added {format(new Date(asset.createdAt), 'MMM dd, yyyy')}</span>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {asset.registrationNumber && (
                  <span>#{asset.registrationNumber}</span>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <SafeIcon icon={FiFileText} className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No assets added yet</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecentAssets;