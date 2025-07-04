import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiEdit, FiTrash2, FiPackage, FiCheck, FiUsers, FiHardDrive, FiActivity } = FiIcons;

// Temporary inline modals until we create separate files
const AddPackageModal = ({ isOpen, onClose }) => {
  const { createPackage } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    billingCycle: 'monthly',
    features: [''],
    limits: {
      assets: '',
      endUsers: '',
      storage: '',
      apiCalls: ''
    },
    isActive: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const packageData = {
      ...formData,
      price: parseFloat(formData.price),
      features: formData.features.filter(f => f.trim()),
      limits: {
        assets: formData.limits.assets === '' ? -1 : parseInt(formData.limits.assets),
        endUsers: formData.limits.endUsers === '' ? -1 : parseInt(formData.limits.endUsers),
        storage: formData.limits.storage || '10GB',
        apiCalls: formData.limits.apiCalls === '' ? -1 : parseInt(formData.limits.apiCalls)
      }
    };

    createPackage(packageData);
    setFormData({
      name: '',
      description: '',
      price: '',
      billingCycle: 'monthly',
      features: [''],
      limits: {
        assets: '',
        endUsers: '',
        storage: '',
        apiCalls: ''
      },
      isActive: true
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('limits.')) {
      const limitField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        limits: {
          ...prev.limits,
          [limitField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add New Package</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <SafeIcon icon={FiIcons.FiX} className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Professional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="99.99"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Package description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter feature"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiIcons.FiX} className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                >
                  + Add Feature
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 flex items-center space-x-2"
              >
                <SafeIcon icon={FiPlus} className="h-5 w-5" />
                <span>Add Package</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const EditPackageModal = ({ isOpen, onClose, package: pkg }) => {
  const { updatePackage } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    billingCycle: 'monthly',
    features: [''],
    limits: {
      assets: '',
      endUsers: '',
      storage: '',
      apiCalls: ''
    },
    isActive: true
  });

  React.useEffect(() => {
    if (pkg) {
      setFormData({
        name: pkg.name || '',
        description: pkg.description || '',
        price: pkg.price?.toString() || '',
        billingCycle: pkg.billingCycle || 'monthly',
        features: pkg.features?.length ? pkg.features : [''],
        limits: {
          assets: pkg.limits?.assets === -1 ? '' : pkg.limits?.assets?.toString() || '',
          endUsers: pkg.limits?.endUsers === -1 ? '' : pkg.limits?.endUsers?.toString() || '',
          storage: pkg.limits?.storage || '',
          apiCalls: pkg.limits?.apiCalls === -1 ? '' : pkg.limits?.apiCalls?.toString() || ''
        },
        isActive: pkg.isActive !== false
      });
    }
  }, [pkg]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const packageData = {
      ...formData,
      price: parseFloat(formData.price),
      features: formData.features.filter(f => f.trim()),
      limits: {
        assets: formData.limits.assets === '' ? -1 : parseInt(formData.limits.assets),
        endUsers: formData.limits.endUsers === '' ? -1 : parseInt(formData.limits.endUsers),
        storage: formData.limits.storage || '10GB',
        apiCalls: formData.limits.apiCalls === '' ? -1 : parseInt(formData.limits.apiCalls)
      }
    };

    updatePackage(pkg.id, packageData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('limits.')) {
      const limitField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        limits: {
          ...prev.limits,
          [limitField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  if (!isOpen || !pkg) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Package</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <SafeIcon icon={FiIcons.FiX} className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Professional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="99.99"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Package description"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 flex items-center space-x-2"
              >
                <SafeIcon icon={FiIcons.FiSave} className="h-5 w-5" />
                <span>Save Changes</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const PackageManagement = () => {
  const { packages, subscriptions, deletePackage } = useAuth();
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