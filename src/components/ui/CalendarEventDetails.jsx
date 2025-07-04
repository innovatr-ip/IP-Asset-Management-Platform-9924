import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { useIP } from '../../context/IPContext';
import CalendarEventModal from './CalendarEventModal';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiEdit, FiTrash2, FiCalendar, FiClock, FiMapPin, FiUser, FiFileText } = FiIcons;

const CalendarEventDetails = ({ isOpen, onClose, event }) => {
  const { deleteCalendarEvent, getClientById, completeTask, updateTask, updateMatter } = useIP();
  const [showEditModal, setShowEditModal] = useState(false);

  if (!event) return null;

  const client = event.clientId ? getClientById(event.clientId) : null;

  const getEventTypeConfig = (type) => {
    switch (type) {
      case 'task':
        return {
          color: 'bg-blue-100 border-blue-400 text-blue-800',
          icon: FiIcons.FiCheckSquare,
          label: 'Task'
        };
      case 'matter':
        return {
          color: 'bg-purple-100 border-purple-400 text-purple-800',
          icon: FiIcons.FiFileText,
          label: 'Matter Deadline'
        };
      case 'asset-expiry':
        return {
          color: 'bg-orange-100 border-orange-400 text-orange-800',
          icon: FiIcons.FiFolder,
          label: 'Asset Expiry'
        };
      case 'meeting':
        return {
          color: 'bg-green-100 border-green-400 text-green-800',
          icon: FiIcons.FiUsers,
          label: 'Meeting'
        };
      case 'court-date':
        return {
          color: 'bg-red-100 border-red-400 text-red-800',
          icon: FiIcons.FiShield,
          label: 'Court Date'
        };
      default:
        return {
          color: 'bg-gray-100 border-gray-400 text-gray-800',
          icon: FiCalendar,
          label: 'Event'
        };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      if (event.type === 'event') {
        deleteCalendarEvent(event.id);
      }
      onClose();
    }
  };

  const handleMarkComplete = () => {
    if (event.type === 'task') {
      completeTask(event.sourceId);
      onClose();
    }
  };

  const config = getEventTypeConfig(event.type);
  const eventDate = typeof event.date === 'string' ? parseISO(event.date) : event.date;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${config.color}`}>
                <SafeIcon icon={config.icon} className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {event.title}
                </h2>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                    {config.label}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(event.priority)}`}>
                    {event.priority?.toUpperCase() || 'NORMAL'} PRIORITY
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {event.type === 'event' && (
                <>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
                  >
                    <SafeIcon icon={FiEdit} className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <SafeIcon icon={FiTrash2} className="h-5 w-5" />
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <SafeIcon icon={FiX} className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-6">
            {/* Date and Time */}
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiCalendar} className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">
                  {format(eventDate, 'EEEE, MMMM d, yyyy')}
                </p>
                {!event.allDay && event.time && (
                  <p className="text-gray-600 text-sm">
                    {format(eventDate, 'h:mm a')}
                  </p>
                )}
                {event.allDay && (
                  <p className="text-gray-600 text-sm">All day</p>
                )}
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{event.description}</p>
              </div>
            )}

            {/* Client Information */}
            {client && (
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiUser} className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{client.name}</p>
                  {client.company && (
                    <p className="text-gray-600 text-sm">{client.company}</p>
                  )}
                </div>
              </div>
            )}

            {/* Location */}
            {event.location && (
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiMapPin} className="h-5 w-5 text-gray-400" />
                <p className="text-gray-600">{event.location}</p>
              </div>
            )}

            {/* Notes */}
            {event.notes && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                <p className="text-gray-600">{event.notes}</p>
              </div>
            )}

            {/* Actions for different event types */}
            {event.type === 'task' && (
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Task Actions</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={handleMarkComplete}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiIcons.FiCheck} className="h-4 w-4" />
                    <span>Mark Complete</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t pt-6 mt-6">
            <div className="flex justify-between items-center text-sm text-gray-500">
              {event.createdAt && (
                <span>Created: {format(new Date(event.createdAt), 'MMM dd, yyyy')}</span>
              )}
              <span>ID: {event.id}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      <CalendarEventModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        eventToEdit={event}
      />
    </AnimatePresence>
  );
};

export default CalendarEventDetails;