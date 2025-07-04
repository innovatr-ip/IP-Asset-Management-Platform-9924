import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, isAfter, differenceInDays } from 'date-fns';
import { useIP } from '../../context/IPContext';
import SafeIcon from '../../common/SafeIcon';
import EditAssetModal from './EditAssetModal';
import * as FiIcons from 'react-icons/fi';

const { FiEdit, FiTrash2, FiCalendar, FiFileText, FiCopyright, FiShield, FiUser } = FiIcons;

const AssetCard = ({ asset }) => {
  const { deleteAsset, getClientById } = useIP();
  const [showEditModal, setShowEditModal] = useState(false);

  const client = getClientById(asset.clientId);

  const getStatusColor = () => {
    if (!asset.expiryDate) return 'bg-gray-100 text-gray-700';
    
    const expiryDate = new Date(asset.expiryDate);
    const today = new Date();
    const daysUntilExpiry = differenceInDays(expiryDate, today);

    if (daysUntilExpiry < 0) return 'bg-red-100 text-red-700';
    if (daysUntilExpiry <= 30) return 'bg-orange-100 text-orange-700';
    if (daysUntilExpiry <= 90) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const getStatusText = () => {
    if (!asset.expiryDate) return 'No expiry';
    
    const expiryDate = new Date(asset.expiryDate);
    const today = new Date();
    const daysUntilExpiry = differenceInDays(expiryDate, today);

    if (daysUntilExpiry < 0) return `Expired ${Math.abs(daysUntilExpiry)} days ago`;
    if (daysUntilExpiry === 0) return 'Expires today';
    if (daysUntilExpiry === 1) return 'Expires tomorrow';
    return `Expires in ${daysUntilExpiry} days`;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'patent': return FiShield;
      case 'trademark': return FiCopyright;
      case 'copyright': return FiFileText;
      case 'trade-secret': return FiIcons.FiLock;
      default: return FiFileText;
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      deleteAsset(asset.id);
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
              <SafeIcon icon={getTypeIcon(asset.type)} className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{asset.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{asset.type.replace('-', ' ')}</p>
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

        {/* Client Info */}
        {client && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <SafeIcon icon={FiUser} className="h-4 w-4" />
              <span>Owner: {client.name}</span>
              {client.company && <span>({client.company})</span>}
            </div>
          </div>
        )}

        {/* Description */}
        {asset.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {asset.description}
          </p>
        )}

        {/* Status */}
        <div className="mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        {/* Dates */}
        <div className="space-y-2 text-sm">
          {asset.registrationDate && (
            <div className="flex items-center space-x-2 text-gray-600">
              <SafeIcon icon={FiCalendar} className="h-4 w-4" />
              <span>Registered: {format(new Date(asset.registrationDate), 'MMM dd, yyyy')}</span>
            </div>
          )}
          {asset.expiryDate && (
            <div className="flex items-center space-x-2 text-gray-600">
              <SafeIcon icon={FiCalendar} className="h-4 w-4" />
              <span>Expires: {format(new Date(asset.expiryDate), 'MMM dd, yyyy')}</span>
            </div>
          )}
          {asset.jurisdiction && (
            <div className="flex items-center space-x-2 text-gray-600">
              <SafeIcon icon={FiIcons.FiGlobe} className="h-4 w-4" />
              <span>Jurisdiction: {asset.jurisdiction}</span>
            </div>
          )}
        </div>

        {/* Registration Number */}
        {asset.registrationNumber && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Registration #: {asset.registrationNumber}
            </p>
          </div>
        )}
      </motion.div>

      <EditAssetModal
        asset={asset}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
};

export default AssetCard;