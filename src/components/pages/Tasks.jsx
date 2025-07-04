import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIP } from '../../context/IPContext';
import TaskCard from '../ui/TaskCard';
import AddTaskModal from '../ui/AddTaskModal';
import TaskSearchFilter from '../ui/TaskSearchFilter';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiCheckSquare } = FiIcons;

const Tasks = () => {
  const { tasks } = useIP();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  const filteredTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'completed' && task.completed) ||
                           (filterStatus === 'pending' && !task.completed) ||
                           (filterStatus === 'overdue' && !task.completed && task.dueDate && new Date(task.dueDate) < new Date());
      
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'priority':
          const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
    overdue: tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < new Date()
    ).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Task Management
            </h1>
            <p className="text-gray-600">
              Track and manage IP-related tasks for your clients
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg flex items-center space-x-2 transition-all duration-200"
          >
            <SafeIcon icon={FiPlus} className="h-5 w-5" />
            <span>Add Task</span>
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <SafeIcon icon={FiCheckSquare} className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{taskStats.total}</h3>
                <p className="text-gray-600 text-sm">Total Tasks</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <SafeIcon icon={FiIcons.FiClock} className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{taskStats.pending}</h3>
                <p className="text-gray-600 text-sm">Pending</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <SafeIcon icon={FiIcons.FiCheck} className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{taskStats.completed}</h3>
                <p className="text-gray-600 text-sm">Completed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <SafeIcon icon={FiIcons.FiAlertTriangle} className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{taskStats.overdue}</h3>
                <p className="text-gray-600 text-sm">Overdue</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <TaskSearchFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </motion.div>

        {/* Tasks List */}
        <AnimatePresence>
          {filteredTasks.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TaskCard task={task} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <SafeIcon icon={FiCheckSquare} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' ? 'No tasks found' : 'No tasks yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by adding your first task to track IP-related work'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && filterPriority === 'all' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg"
                >
                  Add Your First Task
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Task Modal */}
        <AddTaskModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      </div>
    </div>
  );
};

export default Tasks;