import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import AddSubscriptionModal from './AddSubscriptionModal';
import EditSubscriptionModal from './EditSubscriptionModal';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiSearch, FiEdit, FiPause, FiPlay, FiX, FiCreditCard, FiDollarSign } = FiIcons;

const SubscriptionManagement = () => {
  const { 
    subscriptions, 
    organizations, 
    packages, 
    cancelSubscription, 
    suspendSubscription, 
    updateSubscription 
  } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);

  const filteredSubscriptions = subscriptions.filter(sub => {
    const org = organizations.find(o => o.id === sub.organizationId);
    const pkg = packages.find(p => p.id === sub.packageId);
    
    const matchesSearch = 
      org?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'suspended':
        return 'bg-red-100 text-red-700';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleCancelSubscription = (subId) => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      cancelSubscription(subId);
    }
  };

  const handleSuspendSubscription = (subId) => {
    if (window.confirm('Are you sure you want to suspend this subscription?')) {
      suspendSubscription(subId);
    }
  };

  const handleReactivateSubscription = (subId) => {
    updateSubscription(subId, { status: 'active' });
  };

  const calculateMonthlyRevenue = () => {
    return subscriptions
      .filter(sub => sub.status === 'active')
      .reduce((total, sub) => {
        const pkg = packages.find(p => p.id === sub.packageId);
        return total + (pkg?.price || 0);
      }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subscription Management</h2>
          <p className="text-gray-600">Manage subscriptions and billing</p>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiDollarSign} className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">
                Monthly Revenue: <span className="font-medium text-green-600">${calculateMonthlyRevenue()}</span>
              </span>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="h-5 w-5" />
          <span>Add Subscription</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="cancelled">Cancelled</option>
            <option value="past_due">Past Due</option>
          </select>

          {/* Total Count */}
          <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4 py-3">
            <span className="text-sm text-gray-600">
              Total: <span className="font-medium text-gray-900">{filteredSubscriptions.length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Billing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {filteredSubscriptions.map((subscription, index) => {
                  const org = organizations.find(o => o.id === subscription.organizationId);
                  const pkg = packages.find(p => p.id === subscription.packageId);

                  return (
                    <motion.tr
                      key={subscription.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <SafeIcon icon={FiCreditCard} className="h-5 w-5 text-primary-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {org?.name || 'Unknown Organization'}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {subscription.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{pkg?.name || 'Unknown Package'}</div>
                        <div className="text-sm text-gray-500">{pkg?.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${pkg?.price}/month</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(subscription.status)}`}>
                          {subscription.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subscription.nextBillingDate ? 
                          format(new Date(subscription.nextBillingDate), 'MMM dd, yyyy') : 
                          'N/A'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingSubscription(subscription)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                          >
                            <SafeIcon icon={FiEdit} className="h-4 w-4" />
                          </button>
                          {subscription.status === 'active' ? (
                            <button
                              onClick={() => handleSuspendSubscription(subscription.id)}
                              className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                            >
                              <SafeIcon icon={FiPause} className="h-4 w-4" />
                            </button>
                          ) : subscription.status === 'suspended' ? (
                            <button
                              onClick={() => handleReactivateSubscription(subscription.id)}
                              className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                            >
                              <SafeIcon icon={FiPlay} className="h-4 w-4" />
                            </button>
                          ) : null}
                          {subscription.status !== 'cancelled' && (
                            <button
                              onClick={() => handleCancelSubscription(subscription.id)}
                              className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                            >
                              <SafeIcon icon={FiX} className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredSubscriptions.length === 0 && (
          <div className="text-center py-12">
            <SafeIcon icon={FiCreditCard} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddSubscriptionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <EditSubscriptionModal
        isOpen={!!editingSubscription}
        onClose={() => setEditingSubscription(null)}
        subscription={editingSubscription}
      />
    </div>
  );
};

export default SubscriptionManagement;