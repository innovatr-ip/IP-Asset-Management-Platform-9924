import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheckSquare, FiArrowRight, FiClock, FiAlertTriangle } = FiIcons;

const TasksOverview = ({ tasks }) => {
  const getTaskIcon = (task) => {
    if (!task.dueDate) return FiCheckSquare;
    
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const daysUntilDue = differenceInDays(dueDate, today);
    
    if (daysUntilDue < 0) return FiAlertTriangle;
    if (daysUntilDue <= 3) return FiClock;
    return FiCheckSquare;
  };

  const getTaskColor = (task) => {
    if (!task.dueDate) return 'text-blue-600 bg-blue-50';
    
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const daysUntilDue = differenceInDays(dueDate, today);
    
    if (daysUntilDue < 0) return 'text-red-600 bg-red-50';
    if (daysUntilDue <= 3) return 'text-orange-600 bg-orange-50';
    return 'text-blue-600 bg-blue-50';
  };

  const getDueDateText = (task) => {
    if (!task.dueDate) return 'No due date';
    
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const daysUntilDue = differenceInDays(dueDate, today);
    
    if (daysUntilDue < 0) return `Overdue by ${Math.abs(daysUntilDue)} days`;
    if (daysUntilDue === 0) return 'Due today';
    if (daysUntilDue === 1) return 'Due tomorrow';
    return `Due in ${daysUntilDue} days`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-8 shadow-md border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Upcoming Tasks</h2>
        <Link 
          to="/tasks" 
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
        >
          <span className="text-sm font-medium">View all</span>
          <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              <div className={`p-2 rounded-lg ${getTaskColor(task)}`}>
                <SafeIcon icon={getTaskIcon(task)} className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-sm">
                  {task.title}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'high' 
                      ? 'bg-red-100 text-red-700' 
                      : task.priority === 'medium' 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {task.priority.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-600">
                    {task.type.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {getDueDateText(task)}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <SafeIcon icon={FiCheckSquare} className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No pending tasks</p>
            <p className="text-gray-400 text-xs">You're all caught up!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TasksOverview;