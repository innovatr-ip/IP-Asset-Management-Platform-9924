import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import AddOrganizationModal from './AddOrganizationModal';
import EditOrganizationModal from './EditOrganizationModal';
import OrganizationDetailsModal from './OrganizationDetailsModal';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiPlus, FiSearch, FiEdit, FiTrash2, FiBuilding, FiUsers, 
  FiCreditCard, FiEye, FiSettings 
} = FiIcons;

const OrganizationManagement = () => {
  const { 
    organizations, users, subscriptions, deleteOrganization, 
    getUsersByOrganization, getOrganizationSubscription 
  } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState(null);
  const [viewingOrganization, setViewingOrganization] = useState(null);

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.domain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteOrganization = (orgId) => {
    const orgUsers = getUsersByOrganization(orgId);
    if (orgUsers.length > 0) {
      alert('Cannot delete organization with existing users. Please remove or transfer users first.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      deleteOrganization(orgId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Organization Management</h2>
          <p className="text-gray-600">Manage law firms and organizations with full user control</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="h-5 w-5" />
          <span>Add Organization</span>
        </motion.button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="relative max-w-md">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredOrganizations.map((org, index) => {
            const orgUsers = getUsersByOrganization(org.id);
            const subscription = getOrganizationSubscription(org.id);

            return (
              <motion.div
                key={org.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <SafeIcon icon={FiBuilding} className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
                      <p className="text-sm text-gray-500">{org.domain || 'No domain'}</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setViewingOrganization(org)}
                      className="text-gray-400 hover:text-blue-600 p-1 hover:bg-blue-50 rounded"
                      title="View details and manage users"
                    >
                      <SafeIcon icon={FiEye} className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingOrganization(org)}
                      className="text-gray-400 hover:text-primary-600 p-1 hover:bg-primary-50 rounded"
                      title="Edit organization"
                    >
                      <SafeIcon icon={FiEdit} className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteOrganization(org.id)}
                      className="text-gray-400 hover:text-red-600 p-1 hover:bg-red-50 rounded"
                      title="Delete organization"
                    >
                      <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Status */}
                <div className="mb-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(org.status)}`}>
                    {org.status}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <SafeIcon icon={FiUsers} className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-lg font-semibold text-gray-900">{orgUsers.length}</span>
                    </div>
                    <p className="text-xs text-gray-600">Users</p>
                    <div className="text-xs text-gray-500 mt-1">
                      {orgUsers.filter(u => u.status === 'active').length} active
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <SafeIcon icon={FiCreditCard} className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-lg font-semibold text-gray-900">
                        {subscription ? '✓' : '✗'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">Subscription</p>
                    {subscription && (
                      <div className="text-xs text-gray-500 mt-1">Active</div>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                {org.contactEmail && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Contact:</span> {org.contactEmail}
                    </p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex space-x-2 mb-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setViewingOrganization(org)}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                  >
                    <SafeIcon icon={FiSettings} className="h-4 w-4" />
                    <span>Manage</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditingOrganization(org)}
                    className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                  >
                    <SafeIcon icon={FiEdit} className="h-4 w-4" />
                    <span>Edit</span>
                  </motion.button>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Created {format(new Date(org.createdAt), 'MMM dd, yyyy')}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredOrganizations.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiBuilding} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No organizations found</h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Try adjusting your search criteria' 
              : 'Get started by adding your first organization'
            }
          </p>
        </div>
      )}

      {/* Modals */}
      <AddOrganizationModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
      
      <EditOrganizationModal 
        isOpen={!!editingOrganization} 
        onClose={() => setEditingOrganization(null)} 
        organization={editingOrganization} 
      />
      
      <OrganizationDetailsModal
        isOpen={!!viewingOrganization}
        onClose={() => setViewingOrganization(null)}
        organization={viewingOrganization}
      />
    </div>
  );
};

export default OrganizationManagement;