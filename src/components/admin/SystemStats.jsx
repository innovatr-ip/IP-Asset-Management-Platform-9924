import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiBuilding, FiCreditCard, FiDollarSign, FiUserX, FiX, FiTrendingUp } = FiIcons;

const SystemStats = ({ stats }) => {
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
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>
        <p className="text-gray-600">Real-time system statistics and metrics</p>
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

      {/* Recent Activity */}
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
    </div>
  );
};

export default SystemStats;