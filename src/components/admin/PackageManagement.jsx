import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import AddPackageModal from './AddPackageModal';
import EditPackageModal from './EditPackageModal';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiEdit, FiTrash2, FiPackage, FiCheck, FiUsers, FiHardDrive, FiActivity } = FiIcons;

const PackageManagement = () => {
  const { packages, subscriptions, createPackage, updatePackage, deletePackage } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const handleDeletePackage = (pkgId) => {
    const activeSubscriptions = subscriptions.filter(sub => 
      sub.packageId === pkgId && sub.status === 'active'
    );

    if (activeSubscriptions.length > 0) {
      alert('Cannot delete package with active subscriptions. Please migrate or cancel subscriptions first.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this package?')) {
      deletePackage(pkgId);
    }
  };

  const getSubscriptionCount = (pkgId) => {
    return subscriptions.filter(sub => sub.packageId === pkgId && sub.status === 'active').length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Package Management</h2>
          <p className="text-gray-600">Manage subscription packages and pricing</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="h-5 w-5" />
          <span>Add Package</span>
        </motion.button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
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
                    <SafeIcon icon={FiPackage} className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                    <p className="text-sm text-gray-500">{pkg.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingPackage(pkg)}
                    className="text-gray-400 hover:text-primary-600 p-1 hover:bg-primary-50 rounded"
                  >
                    <SafeIcon icon={FiEdit} className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="text-gray-400 hover:text-red-600 p-1 hover:bg-red-50 rounded"
                  >
                    <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-bold text-gray-900">${pkg.price}</span>
                  <span className="text-gray-500">/{pkg.billingCycle}</span>
                </div>
                <div className="mt-2">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                    {getSubscriptionCount(pkg.id)} active subscriptions
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Features</h4>
                <ul className="space-y-2">
                  {pkg.features.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                  {pkg.features.length > 4 && (
                    <li className="text-sm text-gray-500">
                      +{pkg.features.length - 4} more features
                    </li>
                  )}
                </ul>
              </div>

              {/* Limits */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Limits</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiPackage} className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">
                      {pkg.limits.assets === -1 ? 'Unlimited' : pkg.limits.assets} assets
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiUsers} className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">
                      {pkg.limits.endUsers === -1 ? 'Unlimited' : pkg.limits.endUsers} users
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiHardDrive} className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">{pkg.limits.storage}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiActivity} className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">
                      {pkg.limits.apiCalls === -1 ? 'Unlimited' : pkg.limits.apiCalls} API calls
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="mt-4">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  pkg.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {pkg.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {packages.length === 0 && (
        <div className="text-center py-12">
          <SafeIcon icon={FiPackage} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No packages found</h3>
          <p className="text-gray-600">Get started by adding your first package</p>
        </div>
      )}

      {/* Modals */}
      <AddPackageModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <EditPackageModal
        isOpen={!!editingPackage}
        onClose={() => setEditingPackage(null)}
        package={editingPackage}
      />
    </div>
  );
};

export default PackageManagement;