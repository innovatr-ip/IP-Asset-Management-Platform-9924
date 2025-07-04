import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiArrowRight, FiUser, FiBriefcase } = FiIcons;

const ClientsOverview = ({ clients }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'individual': return FiUser;
      case 'company': return FiBriefcase;
      default: return FiUser;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-8 shadow-md border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Clients</h2>
        <Link 
          to="/clients" 
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
        >
          <span className="text-sm font-medium">View all</span>
          <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {clients.length > 0 ? (
          clients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              <div className="p-2 bg-primary-50 rounded-lg">
                <SafeIcon icon={getTypeIcon(client.type)} className="h-4 w-4 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-sm">
                  {client.name}
                </h3>
                {client.company && (
                  <p className="text-xs text-gray-600 mt-1">
                    {client.company}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Added {format(new Date(client.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                client.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {client.status}
              </span>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <SafeIcon icon={FiUsers} className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No clients added yet</p>
            <p className="text-gray-400 text-xs">Start by adding your first client</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ClientsOverview;