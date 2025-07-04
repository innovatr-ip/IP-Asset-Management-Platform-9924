import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIP } from '../../context/IPContext';
import MatterCard from '../ui/MatterCard';
import AddMatterModal from '../ui/AddMatterModal';
import MatterSearchFilter from '../ui/MatterSearchFilter';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiFileText } = FiIcons;

const Matters = () => {
  const { matters, getMatterStats } = useIP();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('lastUpdated');

  const filteredMatters = matters
    .filter(matter => {
      const matchesSearch = matter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           matter.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           matter.matterNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || matter.type === filterType;
      const matchesStatus = filterStatus === 'all' || matter.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'matterNumber':
          return (a.matterNumber || '').localeCompare(b.matterNumber || '');
        case 'type':
          return a.type.localeCompare(b.type);
        case 'nextDeadline':
          if (!a.nextDeadline && !b.nextDeadline) return 0;
          if (!a.nextDeadline) return 1;
          if (!b.nextDeadline) return -1;
          return new Date(a.nextDeadline) - new Date(b.nextDeadline);
        default:
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      }
    });

  const matterStats = getMatterStats();

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
              Legal Matters
            </h1>
            <p className="text-gray-600">
              Manage IP registrations, objections, and disputes
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg flex items-center space-x-2 transition-all duration-200"
          >
            <SafeIcon icon={FiPlus} className="h-5 w-5" />
            <span>New Matter</span>
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
                <SafeIcon icon={FiFileText} className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{matterStats.totalMatters}</h3>
                <p className="text-gray-600 text-sm">Total Matters</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <SafeIcon icon={FiIcons.FiPlay} className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{matterStats.activeMatters}</h3>
                <p className="text-gray-600 text-sm">Active</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <SafeIcon icon={FiIcons.FiClock} className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{matterStats.urgentMatters}</h3>
                <p className="text-gray-600 text-sm">Urgent</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <SafeIcon icon={FiIcons.FiAlertTriangle} className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{matterStats.overdueMatters}</h3>
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
          <MatterSearchFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </motion.div>

        {/* Matters Grid */}
        <AnimatePresence>
          {filteredMatters.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredMatters.map((matter, index) => (
                <motion.div
                  key={matter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MatterCard matter={matter} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <SafeIcon icon={FiFileText} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all' ? 'No matters found' : 'No matters yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by creating your first legal matter'
                }
              </p>
              {!searchTerm && filterType === 'all' && filterStatus === 'all' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg"
                >
                  Create Your First Matter
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Matter Modal */}
        <AddMatterModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      </div>
    </div>
  );
};

export default Matters;