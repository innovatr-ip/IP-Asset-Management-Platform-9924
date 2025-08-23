import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import EditUserModal from './EditUserModal';
import AddUserModal from './AddUserModal';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiX, FiEdit, FiTrash2, FiUsers, FiPlus, FiMail, FiPhone, 
  FiMapPin, FiCalendar, FiShield, FiUser, FiEye, FiEyeOff, FiKey 
} = FiIcons;

const OrganizationDetailsModal = ({ isOpen, onClose, organization }) => {
  const { users, updateUser, deleteUser, suspendUser, activateUser, getUsersByOrganization } = useAuth();
  const [activeTab, setActiveTab] = useState('details');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});

  const orgUsers = organization ? getUsersByOrganization(organization.id) : [];

  const getRoleIcon = (role) => {
    switch (role) {
      case 'super_admin': return FiShield;
      case 'org_admin': return FiUsers;
      case 'end_user': return FiUser;
      default: return FiUser;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'org_admin': return 'Organization Admin';
      case 'end_user': return 'End User';
      default: return role;
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

  const handleSuspendUser = (userId) => {
    if (window.confirm('Are you sure you want to suspend this user?')) {
      suspendUser(userId);
    }
  };

  const handleActivateUser = (userId) => {
    activateUser(userId);
  };

  const handleDeleteUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user?.role === 'super_admin') {
      alert('Cannot delete super admin accounts.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUser(userId);
    }
  };

  const togglePasswordVisibility = (userId) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleResetPassword = (user) => {
    const newPassword = `temp${Math.random().toString(36).substring(2, 8)}`;
    
    if (window.confirm(`Reset password for ${user.firstName} ${user.lastName}?\n\nNew temporary password: ${newPassword}\n\nThe user will need to change this on next login.`)) {
      updateUser(user.id, {
        password: newPassword,
        mustChangePassword: true,
        passwordResetAt: new Date().toISOString()
      });
      
      alert(`Password reset successfully!\n\nNew password: ${newPassword}\n\nPlease share this securely with the user.`);
    }
  };

  if (!isOpen || !organization) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <SafeIcon icon={FiUsers} className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{organization.name}</h2>
                <p className="text-sm text-gray-600">Organization Management</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <SafeIcon icon={FiX} className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'details' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Organization Details
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center space-x-2 ${
                activeTab === 'users' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>Users</span>
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                {orgUsers.length}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Organization Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Organization Name
                      </label>
                      <div className="text-lg font-semibold text-gray-900">{organization.name}</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Domain
                      </label>
                      <div className="text-gray-900">{organization.domain || 'Not specified'}</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        organization.status === 'active' ? 'bg-green-100 text-green-700' :
                        organization.status === 'suspended' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {organization.status}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Created
                      </label>
                      <div className="text-gray-900 flex items-center space-x-2">
                        <SafeIcon icon={FiCalendar} className="h-4 w-4 text-gray-400" />
                        <span>{format(new Date(organization.createdAt), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Email
                      </label>
                      <div className="text-gray-900 flex items-center space-x-2">
                        <SafeIcon icon={FiMail} className="h-4 w-4 text-gray-400" />
                        <span>{organization.contactEmail || 'Not specified'}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Phone
                      </label>
                      <div className="text-gray-900 flex items-center space-x-2">
                        <SafeIcon icon={FiPhone} className="h-4 w-4 text-gray-400" />
                        <span>{organization.contactPhone || 'Not specified'}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <div className="text-gray-900 flex items-start space-x-2">
                        <SafeIcon icon={FiMapPin} className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span>{organization.address || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {organization.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <div className="p-4 bg-gray-50 rounded-lg text-gray-900">
                      {organization.description}
                    </div>
                  </div>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{orgUsers.length}</div>
                    <div className="text-sm text-blue-800">Total Users</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {orgUsers.filter(u => u.status === 'active').length}
                    </div>
                    <div className="text-sm text-green-800">Active Users</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {orgUsers.filter(u => u.status === 'pending').length}
                    </div>
                    <div className="text-sm text-yellow-800">Pending Users</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {orgUsers.filter(u => u.status === 'suspended').length}
                    </div>
                    <div className="text-sm text-red-800">Suspended Users</div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Users Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Organization Users
                    </h3>
                    <p className="text-sm text-gray-600">
                      Manage user accounts, passwords, and permissions
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddUserModal(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 text-sm"
                  >
                    <SafeIcon icon={FiPlus} className="h-4 w-4" />
                    <span>Add User</span>
                  </motion.button>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Password
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Login
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orgUsers.map((user, index) => (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                    <span className="text-primary-700 font-medium text-sm">
                                      {user.firstName?.[0]}{user.lastName?.[0]}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.firstName} {user.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500 flex items-center space-x-1">
                                    <SafeIcon icon={FiMail} className="h-3 w-3" />
                                    <span>{user.email}</span>
                                  </div>
                                  {user.phone && (
                                    <div className="text-sm text-gray-500 flex items-center space-x-1">
                                      <SafeIcon icon={FiPhone} className="h-3 w-3" />
                                      <span>{user.phone}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <SafeIcon icon={getRoleIcon(user.role)} className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-900">{getRoleLabel(user.role)}</span>
                              </div>
                              {user.department && (
                                <div className="text-xs text-gray-500">{user.department}</div>
                              )}
                              {user.jobTitle && (
                                <div className="text-xs text-gray-500">{user.jobTitle}</div>
                              )}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                                {user.status}
                              </span>
                              {user.mustChangePassword && (
                                <div className="text-xs text-orange-600 mt-1">Must reset password</div>
                              )}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                  {showPasswords[user.id] ? user.password : '••••••••'}
                                </div>
                                <button
                                  onClick={() => togglePasswordVisibility(user.id)}
                                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                  title="Toggle password visibility"
                                >
                                  <SafeIcon 
                                    icon={showPasswords[user.id] ? FiEyeOff : FiEye} 
                                    className="h-4 w-4" 
                                  />
                                </button>
                                <button
                                  onClick={() => handleResetPassword(user)}
                                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                  title="Reset password"
                                >
                                  <SafeIcon icon={FiKey} className="h-4 w-4" />
                                </button>
                              </div>
                              {user.passwordResetAt && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Reset: {format(new Date(user.passwordResetAt), 'MMM dd, HH:mm')}
                                </div>
                              )}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.lastLogin 
                                ? format(new Date(user.lastLogin), 'MMM dd, yyyy')
                                : 'Never'
                              }
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => setEditingUser(user)}
                                  className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                                  title="Edit user"
                                >
                                  <SafeIcon icon={FiEdit} className="h-4 w-4" />
                                </button>
                                
                                {user.status === 'active' ? (
                                  <button
                                    onClick={() => handleSuspendUser(user.id)}
                                    className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                                    title="Suspend user"
                                  >
                                    <SafeIcon icon={FiIcons.FiUserX} className="h-4 w-4" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleActivateUser(user.id)}
                                    className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                                    title="Activate user"
                                  >
                                    <SafeIcon icon={FiIcons.FiUserCheck} className="h-4 w-4" />
                                  </button>
                                )}

                                {user.role !== 'super_admin' && (
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                                    title="Delete user"
                                  >
                                    <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {orgUsers.length === 0 && (
                    <div className="text-center py-12">
                      <SafeIcon icon={FiUsers} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No users in this organization</h3>
                      <p className="text-gray-600 mb-4">Add users to get started</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddUserModal(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium"
                      >
                        Add First User
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AddUserModal 
        isOpen={showAddUserModal} 
        onClose={() => setShowAddUserModal(false)}
        defaultOrganizationId={organization?.id}
      />
      
      <EditUserModal 
        isOpen={!!editingUser} 
        onClose={() => setEditingUser(null)} 
        user={editingUser} 
      />
    </AnimatePresence>
  );
};

export default OrganizationDetailsModal;