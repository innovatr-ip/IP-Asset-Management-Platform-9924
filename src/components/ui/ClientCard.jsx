import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useIP } from '../../context/IPContext';
import SafeIcon from '../../common/SafeIcon';
import EditClientModal from './EditClientModal';
import * as FiIcons from 'react-icons/fi';

const { FiEdit, FiTrash2, FiMail, FiPhone, FiMapPin, FiUser, FiBriefcase, FiFolder } = FiIcons;

const ClientCard = ({ client }) => {
  const { deleteClient, assets } = useIP();
  const [showEditModal, setShowEditModal] = useState(false);

  const clientAssets = assets.filter(asset => asset.clientId === client.id);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'individual': return FiUser;
      case 'company': return FiBriefcase;
      default: return FiUser;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const handleDelete = () => {
    try {
      if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
        deleteClient(client.id);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-50 rounded-lg">
              <SafeIcon icon={getTypeIcon(client.type)} className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{client.name}</h3>
              {client.company && (
                <p className="text-sm text-gray-600">{client.company}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
            >
              <SafeIcon icon={FiEdit} className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <SafeIcon icon={FiTrash2} className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)} capitalize`}>
            {client.status}
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-sm mb-4">
          {client.email && (
            <div className="flex items-center space-x-2 text-gray-600">
              <SafeIcon icon={FiMail} className="h-4 w-4" />
              <span className="truncate">{client.email}</span>
            </div>
          )}
          {client.phone && (
            <div className="flex items-center space-x-2 text-gray-600">
              <SafeIcon icon={FiPhone} className="h-4 w-4" />
              <span>{client.phone}</span>
            </div>
          )}
          {client.address && (
            <div className="flex items-center space-x-2 text-gray-600">
              <SafeIcon icon={FiMapPin} className="h-4 w-4" />
              <span className="text-xs">{client.address}</span>
            </div>
          )}
        </div>

        {/* Assets Count */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <SafeIcon icon={FiFolder} className="h-4 w-4" />
            <span>{clientAssets.length} IP Asset{clientAssets.length !== 1 ? 's' : ''}</span>
          </div>
          <p className="text-xs text-gray-500">
            Added {format(new Date(client.createdAt), 'MMM dd, yyyy')}
          </p>
        </div>

        {/* Notes */}
        {client.notes && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-600 line-clamp-2">
              {client.notes}
            </p>
          </div>
        )}
      </motion.div>

      <EditClientModal
        client={client}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
};

export default ClientCard;