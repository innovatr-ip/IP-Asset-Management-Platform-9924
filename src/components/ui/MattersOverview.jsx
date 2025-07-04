import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFileText, FiArrowRight, FiClock, FiAlertTriangle } = FiIcons;

const MattersOverview = ({ matters }) => {
  const getMatterIcon = (matter) => {
    if (!matter.nextDeadline) return FiFileText;
    
    const today = new Date();
    const deadline = new Date(matter.nextDeadline);
    const daysUntilDeadline = differenceInDays(deadline, today);
    
    if (daysUntilDeadline < 0) return FiAlertTriangle;
    if (daysUntilDeadline <= 7) return FiClock;
    return FiFileText;
  };

  const getMatterColor = (matter) => {
    if (!matter.nextDeadline) return 'text-blue-600 bg-blue-50';
    
    const today = new Date();
    const deadline = new Date(matter.nextDeadline);
    const daysUntilDeadline = differenceInDays(deadline, today);
    
    if (daysUntilDeadline < 0) return 'text-red-600 bg-red-50';
    if (daysUntilDeadline <= 7) return 'text-orange-600 bg-orange-50';
    return 'text-blue-600 bg-blue-50';
  };

  const getDeadlineText = (matter) => {
    if (!matter.nextDeadline) return 'No deadline set';
    
    const today = new Date();
    const deadline = new Date(matter.nextDeadline);
    const daysUntilDeadline = differenceInDays(deadline, today);
    
    if (daysUntilDeadline < 0) return `Overdue by ${Math.abs(daysUntilDeadline)} days`;
    if (daysUntilDeadline === 0) return 'Due today';
    if (daysUntilDeadline === 1) return 'Due tomorrow';
    return `Due in ${daysUntilDeadline} days`;
  };

  const getTypeLabel = (type) => {
    const typeLabels = {
      'registration': 'Registration',
      'objection': 'Objection',
      'dispute': 'Dispute',
      'renewal': 'Renewal',
      'enforcement': 'Enforcement',
      'opposition': 'Opposition',
      'cancellation': 'Cancellation',
      'licensing': 'Licensing'
    };
    return typeLabels[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-8 shadow-md border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Matters</h2>
        <Link 
          to="/matters" 
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
        >
          <span className="text-sm font-medium">View all</span>
          <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {matters.length > 0 ? (
          matters.map((matter, index) => (
            <motion.div
              key={matter.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              <div className={`p-2 rounded-lg ${getMatterColor(matter)}`}>
                <SafeIcon icon={getMatterIcon(matter)} className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-sm">
                  {matter.title}
                </h3>
                {matter.matterNumber && (
                  <p className="text-xs text-gray-500 mt-1">
                    #{matter.matterNumber}
                  </p>
                )}
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    matter.priority === 'high' 
                      ? 'bg-red-100 text-red-700' 
                      : matter.priority === 'medium' 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {matter.priority.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-600">
                    {getTypeLabel(matter.type)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {getDeadlineText(matter)}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <SafeIcon icon={FiFileText} className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No matters created yet</p>
            <p className="text-gray-400 text-xs">Start by creating your first matter</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MattersOverview;