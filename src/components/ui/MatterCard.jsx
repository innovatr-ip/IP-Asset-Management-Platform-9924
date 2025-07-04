import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import { useIP } from '../../context/IPContext';
import SafeIcon from '../../common/SafeIcon';
import EditMatterModal from './EditMatterModal';
import * as FiIcons from 'react-icons/fi';

const { FiEdit, FiTrash2, FiCalendar, FiUser, FiFolder, FiFileText, FiClock } = FiIcons;

const MatterCard = ({ matter }) => {
  const { deleteMatter, getClientById, assets, getTasksByMatter } = useIP();
  const [showEditModal, setShowEditModal] = useState(false);

  const client = getClientById(matter.clientId);
  const relatedAsset = assets.find(asset => asset.id === matter.assetId);
  const matterTasks = getTasksByMatter(matter.id);

  const getTypeConfig = (type) => {
    switch (type) {
      case 'registration':
        return {
          icon: FiFileText,
          label: 'Registration',
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-600'
        };
      case 'objection':
        return {
          icon: FiIcons.FiAlertTriangle,
          label: 'Objection',
          bgColor: 'bg-orange-50',
          iconColor: 'text-orange-600'
        };
      case 'dispute':
        return {
          icon: FiIcons.FiShield,
          label: 'Dispute',
          bgColor: 'bg-red-50',
          iconColor: 'text-red-600'
        };
      case 'renewal':
        return {
          icon: FiIcons.FiRefreshCw,
          label: 'Renewal',
          bgColor: 'bg-green-50',
          iconColor: 'text-green-600'
        };
      case 'enforcement':
        return {
          icon: FiIcons.FiLock,
          label: 'Enforcement',
          bgColor: 'bg-purple-50',
          iconColor: 'text-purple-600'
        };
      default:
        return {
          icon: FiFileText,
          label: 'General',
          bgColor: 'bg-gray-50',
          iconColor: 'text-gray-600'
        };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'on-hold': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDeadlineStatus = () => {
    if (!matter.nextDeadline) return null;

    const deadline = new Date(matter.nextDeadline);
    const today = new Date();
    const daysUntilDeadline = differenceInDays(deadline, today);

    if (daysUntilDeadline < 0) {
      return {
        color: 'text-red-600',
        text: `Overdue by ${Math.abs(daysUntilDeadline)} days`,
        bgColor: 'bg-red-50'
      };
    } else if (daysUntilDeadline === 0) {
      return {
        color: 'text-orange-600',
        text: 'Due today',
        bgColor: 'bg-orange-50'
      };
    } else if (daysUntilDeadline <= 7) {
      return {
        color: 'text-orange-600',
        text: `Due in ${daysUntilDeadline} days`,
        bgColor: 'bg-orange-50'
      };
    } else {
      return {
        color: 'text-blue-600',
        text: `Due in ${daysUntilDeadline} days`,
        bgColor: 'bg-blue-50'
      };
    }
  };

  const typeConfig = getTypeConfig(matter.type);
  const deadlineStatus = getDeadlineStatus();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this matter? This action cannot be undone.')) {
      deleteMatter(matter.id);
    }
  };

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
              <h3 className="font-semibold text-gray-900 text-lg">{matter.title}</h3>
              {matter.matterNumber && (
                <p className="text-sm text-gray-600">#{matter.matterNumber}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
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

        {/* Status Badges */}
        <div className="flex items-center space-x-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(matter.status)} capitalize`}>
            {matter.status.replace('-', ' ')}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(matter.priority)} capitalize`}>
            {matter.priority} Priority
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {typeConfig.label}
          </span>
        </div>

        {/* Description */}
        {matter.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {matter.description}
          </p>
        )}

        {/* Client and Asset Info */}
        <div className="space-y-2 text-sm mb-4">
          {client && (
            <div className="flex items-center space-x-2 text-gray-600">
              <SafeIcon icon={FiUser} className="h-4 w-4" />
              <span>Client: {client.name}</span>
              {client.company && <span>({client.company})</span>}
            </div>
          )}
          {relatedAsset && (
            <div className="flex items-center space-x-2 text-gray-600">
              <SafeIcon icon={FiFolder} className="h-4 w-4" />
              <span>Asset: {relatedAsset.name}</span>
            </div>
          )}
          {matterTasks.length > 0 && (
            <div className="flex items-center space-x-2 text-gray-600">
              <SafeIcon icon={FiIcons.FiCheckSquare} className="h-4 w-4" />
              <span>{matterTasks.length} associated task{matterTasks.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Deadline */}
        {matter.nextDeadline && deadlineStatus && (
          <div className={`p-3 rounded-lg mb-4 ${deadlineStatus.bgColor}`}>
            <div className={`flex items-center space-x-2 ${deadlineStatus.color}`}>
              <SafeIcon icon={FiClock} className="h-4 w-4" />
              <span className="text-sm font-medium">{deadlineStatus.text}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Deadline: {format(new Date(matter.nextDeadline), 'MMM dd, yyyy')}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Created: {format(new Date(matter.createdAt), 'MMM dd, yyyy')}</span>
            <span>Updated: {format(new Date(matter.lastUpdated), 'MMM dd, yyyy')}</span>
          </div>
        </div>
      </motion.div>

      <EditMatterModal
        matter={matter}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
};

export default MatterCard;