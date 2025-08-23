import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBuilding, FiMail, FiPhone, FiMapPin, FiCreditCard, FiUsers, FiSave, FiCheck, FiEdit3, FiPackage } = FiIcons;

const CompanySettings = () => {
  const { currentUser, organizations, subscriptions, packages, updateOrganization, getOrganizationSubscription } = useAuth();
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Get current organization data
  const currentOrg = organizations.find(org => org.id === currentUser?.organizationId);
  const currentSubscription = getOrganizationSubscription(currentUser?.organizationId);
  const currentPackage = packages.find(pkg => pkg.id === currentSubscription?.package_id);

  const [formData, setFormData] = useState({
    name: currentOrg?.name || '',
    domain: currentOrg?.domain || '',
    contactEmail: currentOrg?.contactEmail || '',
    contactPhone: currentOrg?.contactPhone || '',
    address: currentOrg?.address || '',
    description: currentOrg?.description || '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      await updateOrganization(currentOrg.id, formData);
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error updating organization:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: currentOrg?.name || '',
      domain: currentOrg?.domain || '',
      contactEmail: currentOrg?.contactEmail || '',
      contactPhone: currentOrg?.contactPhone || '',
      address: currentOrg?.address || '',
      description: currentOrg?.description || '',
    });
    setIsEditing(false);
  };

  if (!currentUser || currentUser.role !== 'org_admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center">
          <SafeIcon icon={FiIcons.FiLock} className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">Only organization administrators can access company settings.</p>
        </div>
      </div>
    );
  }

  if (!currentOrg) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center">
          <SafeIcon icon={FiIcons.FiAlertTriangle} className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Organization Not Found</h2>
          <p className="text-gray-600">Unable to load organization information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Company Settings
          </h1>
          <p className="text-gray-600">
            Manage your organization information, subscription, and team settings
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Organization Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiBuilding} className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Organization Information</h2>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <SafeIcon icon={FiEdit3} className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={saved ? FiCheck : FiSave} className="h-4 w-4" />
                    <span>{saved ? 'Saved!' : 'Save'}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{currentOrg.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) => handleInputChange('domain', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="company.com"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{currentOrg.domain}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <SafeIcon icon={FiMail} className="inline h-4 w-4 mr-1" />
                  Contact Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{currentOrg.contactEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <SafeIcon icon={FiPhone} className="inline h-4 w-4 mr-1" />
                  Contact Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{currentOrg.contactPhone}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <SafeIcon icon={FiMapPin} className="inline h-4 w-4 mr-1" />
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{currentOrg.address}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Brief description of your organization"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">{currentOrg.description}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Subscription Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3 mb-6">
              <SafeIcon icon={FiCreditCard} className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Subscription Details</h2>
            </div>

            {currentSubscription && currentPackage ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <SafeIcon icon={FiPackage} className="h-8 w-8 text-primary-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{currentPackage.name}</h3>
                      <p className="text-sm text-gray-600">Current Plan</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary-600 mb-2">
                    ${currentPackage.price}
                    <span className="text-sm font-normal text-gray-600">/{currentPackage.billingCycle}</span>
                  </p>
                  <p className="text-sm text-gray-600">{currentPackage.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Plan Features</h4>
                  <ul className="space-y-2">
                    {currentPackage.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <SafeIcon icon={FiCheck} className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Usage Limits</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Users</span>
                        <span className="text-gray-900">
                          {currentPackage.limits.users === -1 ? 'Unlimited' : `0 / ${currentPackage.limits.users}`}
                        </span>
                      </div>
                      {currentPackage.limits.users !== -1 && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">IP Assets</span>
                        <span className="text-gray-900">
                          {currentPackage.limits.assets === -1 ? 'Unlimited' : `0 / ${currentPackage.limits.assets}`}
                        </span>
                      </div>
                      {currentPackage.limits.assets !== -1 && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-primary-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <SafeIcon icon={FiIcons.FiAlertCircle} className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
                <p className="text-gray-600 mb-4">Contact your system administrator to set up a subscription.</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className={`ml-2 font-medium ${
                    currentSubscription?.status === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {currentSubscription?.status || 'Inactive'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Billing Cycle:</span>
                  <span className="ml-2 font-medium text-gray-900 capitalize">
                    {currentSubscription?.billingCycle || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Next Billing:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {currentSubscription?.nextBillingDate 
                      ? new Date(currentSubscription.nextBillingDate).toLocaleDateString()
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Team Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3 mb-6">
              <SafeIcon icon={FiUsers} className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Team Overview</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  {organizations.filter(org => org.id === currentUser.organizationId).length}
                </div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {organizations.filter(org => org.id === currentUser.organizationId && org.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">2</div>
                <div className="text-sm text-gray-600">Admin Users</div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                To manage team members, contact your system administrator or visit the user management section.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;