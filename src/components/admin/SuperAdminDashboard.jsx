import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import UserManagement from './UserManagement';
import OrganizationManagement from './OrganizationManagement';
import SubscriptionManagement from './SubscriptionManagement';
import PackageManagement from './PackageManagement';
import SystemStats from './SystemStats';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiBuilding, FiCreditCard, FiPackage, FiBarChart3, FiSettings } = FiIcons;

const SuperAdminDashboard = () => {
  const { currentUser, getSystemStats } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = getSystemStats();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart3 },
    { id: 'users', label: 'Users', icon: FiUsers },
    { id: 'organizations', label: 'Organizations', icon: FiBuilding },
    { id: 'subscriptions', label: 'Subscriptions', icon: FiCreditCard },
    { id: 'packages', label: 'Packages', icon: FiPackage },
    { id: 'system', label: 'System', icon: FiSettings }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SystemStats stats={stats} />;
      case 'users':
        return <UserManagement />;
      case 'organizations':
        return <OrganizationManagement />;
      case 'subscriptions':
        return <SubscriptionManagement />;
      case 'packages':
        return <PackageManagement />;
      case 'system':
        return <div className="p-8 text-center text-gray-500">System settings coming soon...</div>;
      default:
        return <SystemStats stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {currentUser?.firstName}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                System Status: <span className="text-green-600 font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <SafeIcon icon={tab.icon} className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                    {tab.id === 'users' && (
                      <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {stats.totalUsers}
                      </span>
                    )}
                    {tab.id === 'organizations' && (
                      <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {stats.totalOrganizations}
                      </span>
                    )}
                    {tab.id === 'subscriptions' && (
                      <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {stats.activeSubscriptions}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;