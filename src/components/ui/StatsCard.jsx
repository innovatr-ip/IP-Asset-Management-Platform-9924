import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiTrendingDown } = FiIcons;

const StatsCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };

  const trendColor = trend?.startsWith('+') ? 'text-green-600' : 'text-red-600';
  const TrendIcon = trend?.startsWith('+') ? FiTrendingUp : FiTrendingDown;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <SafeIcon icon={icon} className="h-6 w-6" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${trendColor}`}>
            <SafeIcon icon={TrendIcon} className="h-4 w-4" />
            <span className="text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-gray-600 text-sm">{title}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;