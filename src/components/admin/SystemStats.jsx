import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiBuilding, FiCreditCard, FiDollarSign, FiUserX, FiX, FiTrendingUp, FiLogOut, FiUser, FiShield } = FiIcons;

const SystemStats = ({ stats }) => {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: FiUsers,
      color: 'blue',
      description: `${stats.activeUsers} active`
    },
    {
      title: 'Organizations',
      value: stats.totalOrganizations,
      icon: FiBuilding,
      color: 'purple',
      description: 'Law firms registered'
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      icon: FiCreditCard,
      color: 'green',
      description: `${stats.cancelledSubscriptions} cancelled`
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue}`,
      icon: FiDollarSign,
      color: 'green',
      description: 'Recurring revenue'
    },
    {
      title: 'Suspended Users',
      value: stats.suspendedUsers,
      icon: FiUserX,
      color: 'red',
      description: 'Requires attention'
    },
    {
      title: 'Cancelled Subscriptions',
      value: stats.cancelledSubscriptions,
      icon: FiX,
      color: 'red',
      description: 'This month'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      red: 'bg-red-50 text-red-600 border-red-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header with Logout */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>
          <p className="text-gray-600">Real-time system statistics and metrics</p>
        </div>

        {/* User Info and Logout Section */}
        <div className="flex items-center space-x-4">
          {/* Current User Info */}
          <div className="hidden md:flex items-center space-x-3 bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              <SafeIcon icon={FiShield} className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Super Admin'}
              </div>
              <div className="text-xs text-gray-600">
                {currentUser?.email || 'admin@innovatr.com'}
              </div>
              <div className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 mt-1">
                Super Admin
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 shadow-md font-medium group"
            title="Sign Out"
          >
            <SafeIcon icon={FiLogOut} className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
            <span className="hidden sm:inline">Sign Out</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                <SafeIcon icon={stat.icon} className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.title}</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">{stat.description}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiUsers} className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">View All Users</span>
            </div>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiBuilding} className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">Manage Organizations</span>
            </div>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiCreditCard} className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-900">View Billing</span>
            </div>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiTrendingUp} className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-900">Analytics</span>
            </div>
          </button>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-900">All Systems Operational</span>
            </div>
            <span className="text-xs text-green-700">Last checked: Just now</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Database</span>
              </div>
              <span className="text-xs text-gray-600">Response time: 12ms</span>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">API</span>
              </div>
              <span className="text-xs text-gray-600">Uptime: 99.9%</span>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Storage</span>
              </div>
              <span className="text-xs text-gray-600">85% available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Session Information */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Login Time:</span>
            <span className="font-medium text-gray-900">
              {currentUser?.lastLogin 
                ? new Date(currentUser.lastLogin).toLocaleString()
                : 'Current session'
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">User ID:</span>
            <span className="font-medium text-gray-900">{currentUser?.id || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Role:</span>
            <span className="font-medium text-gray-900">Super Administrator</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Permissions:</span>
            <span className="font-medium text-gray-900">Full System Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStats;