import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIP } from '../../context/IPContext';
import MonitoringCard from '../ui/MonitoringCard';
import AddMonitoringModal from '../ui/AddMonitoringModal';
import MonitoringSearchFilter from '../ui/MonitoringSearchFilter';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiShield, FiGlobe, FiShoppingCart, FiUsers } = FiIcons;

const BrandMonitoring = () => {
  const { monitoringItems, getMonitoringStats } = useIP();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('lastChecked');

  const filteredItems = monitoringItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'alertCount':
          return (b.alertCount || 0) - (a.alertCount || 0);
        default:
          return new Date(b.lastChecked) - new Date(a.lastChecked);
      }
    });

  const stats = getMonitoringStats();

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
              Brand Monitoring
            </h1>
            <p className="text-gray-600">
              Monitor trademarks, domains, marketplaces, and social media for your brands
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg flex items-center space-x-2 transition-all duration-200"
          >
            <SafeIcon icon={FiPlus} className="h-5 w-5" />
            <span>Add Monitoring</span>
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <SafeIcon icon={FiShield} className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.trademarks}</h3>
                <p className="text-gray-600 text-sm">USPTO Monitoring</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <SafeIcon icon={FiGlobe} className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.domains}</h3>
                <p className="text-gray-600 text-sm">Domain Monitoring</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <SafeIcon icon={FiShoppingCart} className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.marketplaces}</h3>
                <p className="text-gray-600 text-sm">Marketplace Monitoring</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <SafeIcon icon={FiUsers} className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{stats.social}</h3>
                <p className="text-gray-600 text-sm">Social Media</p>
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
          <MonitoringSearchFilter
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

        {/* Monitoring Items Grid */}
        <AnimatePresence>
          {filteredItems.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MonitoringCard item={item} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <SafeIcon icon={FiShield} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? 'No monitoring items found'
                  : 'No monitoring set up yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start protecting your brand by setting up comprehensive monitoring'}
              </p>
              {!searchTerm && filterType === 'all' && filterStatus === 'all' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg"
                >
                  Set Up Brand Monitoring
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Monitoring Modal */}
        <AddMonitoringModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      </div>
    </div>
  );
};

export default BrandMonitoring;