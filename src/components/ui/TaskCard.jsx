import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import { useIP } from '../../context/IPContext';
import SafeIcon from '../../common/SafeIcon';
import EditTaskModal from './EditTaskModal';
import * as FiIcons from 'react-icons/fi';

const { FiEdit, FiTrash2, FiCalendar, FiUser, FiFolder, FiCheck, FiRotateCcw, FiFileText } = FiIcons;

const TaskCard = ({ task }) => {
  const { deleteTask, completeTask, reopenTask, getClientById, assets, getMatterById } = useIP();
  const [showEditModal, setShowEditModal] = useState(false);

  const client = getClientById(task.clientId);
  const asset = assets.find(a => a.id === task.assetId);
  const matter = getMatterById(task.matterId);

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high':
        return {
          bgColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-800',
          badgeColor: 'bg-red-100 text-red-800',
        };
      case 'medium':
        return {
          bgColor: 'bg-yellow-50 border-yellow-200',
          textColor: 'text-yellow-800',
          badgeColor: 'bg-yellow-100 text-yellow-800',
        };
      case 'low':
        return {
          bgColor: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-800',
          badgeColor: 'bg-blue-100 text-blue-800',
        };
      default:
        return {
          bgColor: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-800',
          badgeColor: 'bg-gray-100 text-gray-800',
        };
    }
  };

  const getTypeConfig = (type) => {
    switch (type) {
      case 'filing':
        return { icon: FiIcons.FiFileText, label: 'Filing' };
      case 'renewal':
        return { icon: FiIcons.FiRefreshCw, label: 'Renewal' };
      case 'research':
        return { icon: FiIcons.FiSearch, label: 'Research' };
      case 'meeting':
        return { icon: FiIcons.FiUsers, label: 'Meeting' };
      case 'deadline':
        return { icon: FiIcons.FiClock, label: 'Deadline' };
      case 'follow-up':
        return { icon: FiIcons.FiPhone, label: 'Follow-up' };
      case 'objection-response':
        return { icon: FiIcons.FiMessageSquare, label: 'Objection Response' };
      case 'court-filing':
        return { icon: FiIcons.FiFileText, label: 'Court Filing' };
      case 'evidence-gathering':
        return { icon: FiIcons.FiSearch, label: 'Evidence Gathering' };
      default:
        return { icon: FiIcons.FiCheckSquare, label: 'General' };
    }
  };

  const getStatusInfo = () => {
    if (task.completed) {
      return {
        color: 'text-green-600',
        text: `Completed ${format(new Date(task.completedAt), 'MMM dd, yyyy')}`,
        bgColor: 'bg-green-50 border-green-200',
      };
    }

    if (!task.dueDate) {
      return {
        color: 'text-gray-600',
        text: 'No due date',
        bgColor: 'bg-white border-gray-200',
      };
    }

    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const daysUntilDue = differenceInDays(dueDate, today);

    if (daysUntilDue < 0) {
      return {
        color: 'text-red-600',
        text: `Overdue by ${Math.abs(daysUntilDue)} days`,
        bgColor: 'bg-red-50 border-red-200',
      };
    } else if (daysUntilDue === 0) {
      return {
        color: 'text-orange-600',
        text: 'Due today',
        bgColor: 'bg-orange-50 border-orange-200',
      };
    } else if (daysUntilDue <= 3) {
      return {
        color: 'text-orange-600',
        text: `Due in ${daysUntilDue} days`,
        bgColor: 'bg-orange-50 border-orange-200',
      };
    } else {
      return {
        color: 'text-blue-600',
        text: `Due in ${daysUntilDue} days`,
        bgColor: 'bg-white border-gray-200',
      };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const typeConfig = getTypeConfig(task.type);
  const statusInfo = getStatusInfo();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  const handleToggleComplete = () => {
    if (task.completed) {
      reopenTask(task.id);
    } else {
      completeTask(task.id);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        className={`${statusInfo.bgColor} border rounded-xl p-6 shadow-sm transition-all duration-300 ${
          task.completed ? 'opacity-75' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4 flex-1">
            <div className="p-2 bg-white rounded-lg">
              <SafeIcon icon={typeConfig.icon} className="h-5 w-5 text-primary-600" />
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.badgeColor}`}>
                  {task.priority.toUpperCase()}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {typeConfig.label}
                </span>
                {task.completed && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    COMPLETED
                  </span>
                )}
              </div>

              <h3 className={`font-medium text-lg mb-2 ${task.completed ? 'line-through' : ''}`}>
                {task.title}
              </h3>

              {task.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="space-y-2 text-sm">
                {client && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <SafeIcon icon={FiUser} className="h-4 w-4" />
                    <span>Client: {client.name}</span>
                    {client.company && <span>({client.company})</span>}
                  </div>
                )}
                {matter && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <SafeIcon icon={FiFileText} className="h-4 w-4" />
                    <span>Matter: {matter.title}</span>
                    {matter.matterNumber && <span>(#{matter.matterNumber})</span>}
                  </div>
                )}
                {asset && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <SafeIcon icon={FiFolder} className="h-4 w-4" />
                    <span>Asset: {asset.name}</span>
                  </div>
                )}
                {task.dueDate && (
                  <div className={`flex items-center space-x-2 ${statusInfo.color}`}>
                    <SafeIcon icon={FiCalendar} className="h-4 w-4" />
                    <span>{statusInfo.text}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleComplete}
              className={`p-2 rounded-lg transition-all duration-200 ${
                task.completed
                  ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                  : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
              }`}
              title={task.completed ? 'Reopen task' : 'Mark as complete'}
            >
              <SafeIcon icon={task.completed ? FiRotateCcw : FiCheck} className="h-5 w-5" />
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

        {(task.notes || task.completed) && (
          <div className="pt-4 border-t border-gray-200">
            {task.notes && (
              <p className="text-xs text-gray-600 mb-2">
                <span className="font-medium">Notes:</span> {task.notes}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Created {format(new Date(task.createdAt), 'MMM dd, yyyy HH:mm')}
            </p>
          </div>
        )}
      </motion.div>

      <EditTaskModal
        task={task}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
};

export default TaskCard;