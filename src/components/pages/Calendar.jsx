import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday,
  parseISO
} from 'date-fns';
import { useIP } from '../../context/IPContext';
import CalendarEventModal from '../ui/CalendarEventModal';
import CalendarEventDetails from '../ui/CalendarEventDetails';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiChevronLeft, FiChevronRight, FiPlus, FiFilter, FiCalendar } = FiIcons;

const Calendar = () => {
  const { getAllCalendarEvents, getClientById } = useIP();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [viewType, setViewType] = useState('month'); // month, week, day
  const [filterType, setFilterType] = useState('all'); // all, tasks, matters, assets, events

  const allEvents = getAllCalendarEvents();

  // Filter events based on selected filter
  const filteredEvents = allEvents.filter(event => {
    if (filterType === 'all') return true;
    if (filterType === 'tasks') return event.type === 'task';
    if (filterType === 'matters') return event.type === 'matter';
    if (filterType === 'assets') return event.type === 'asset-expiry';
    if (filterType === 'events') return event.type === 'event';
    return true;
  });

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
          label: 'Matter'
        };
      case 'asset-expiry':
        return {
          color: 'bg-orange-100 border-orange-400 text-orange-800',
          icon: FiIcons.FiFolder,
          label: 'Asset Expiry'
        };
      case 'event':
        return {
          color: 'bg-green-100 border-green-400 text-green-800',
          icon: FiIcons.FiCalendar,
          label: 'Event'
        };
      default:
        return {
          color: 'bg-gray-100 border-gray-400 text-gray-800',
          icon: FiIcons.FiCalendar,
          label: 'Event'
        };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 border-red-400 text-red-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'low':
        return 'bg-blue-100 border-blue-400 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  const getEventsForDate = (date) => {
    return filteredEvents.filter(event => {
      const eventDate = typeof event.date === 'string' ? parseISO(event.date) : event.date;
      return isSameDay(eventDate, date);
    });
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const dayEvents = getEventsForDate(day);
        
        days.push(
          <div
            key={day}
            className={`min-h-[120px] p-2 border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              !isSameMonth(day, monthStart) ? 'text-gray-400 bg-gray-50' : ''
            } ${isToday(day) ? 'bg-blue-50 border-blue-200' : ''}`}
            onClick={() => {
              setSelectedDate(cloneDay);
              setShowEventModal(true);
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`text-sm font-medium ${isToday(day) ? 'text-blue-600' : ''}`}>
                {formattedDate}
              </span>
              {dayEvents.length > 0 && (
                <span className="text-xs bg-primary-100 text-primary-600 px-1 rounded">
                  {dayEvents.length}
                </span>
              )}
            </div>
            
            <div className="space-y-1">
              {dayEvents.slice(0, 3).map((event, idx) => {
                const config = getEventTypeConfig(event.type);
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`text-xs p-1 rounded border-l-2 ${config.color} truncate cursor-pointer hover:shadow-sm`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(event);
                      setShowEventDetails(true);
                    }}
                  >
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={config.icon} className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{event.title}</span>
                    </div>
                  </motion.div>
                );
              })}
              {dayEvents.length > 3 && (
                <div className="text-xs text-gray-500 text-center">
                  +{dayEvents.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day}>
          {days}
        </div>
      );
      days = [];
    }

    return <div className="bg-white rounded-lg overflow-hidden">{rows}</div>;
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      const dayEvents = getEventsForDate(day);
      
      days.push(
        <div key={day} className="border-r border-gray-200 last:border-r-0">
          <div className={`p-4 border-b border-gray-200 text-center ${isToday(day) ? 'bg-blue-50' : ''}`}>
            <div className="text-sm font-medium text-gray-600">
              {format(day, 'EEE')}
            </div>
            <div className={`text-xl font-bold ${isToday(day) ? 'text-blue-600' : 'text-gray-900'}`}>
              {format(day, 'd')}
            </div>
          </div>
          
          <div className="p-2 min-h-[400px] space-y-2">
            {dayEvents.map((event, idx) => {
              const config = getEventTypeConfig(event.type);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-2 rounded border-l-4 ${config.color} cursor-pointer hover:shadow-sm`}
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowEventDetails(true);
                  }}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <SafeIcon icon={config.icon} className="h-4 w-4" />
                    <span className="text-sm font-medium truncate">{event.title}</span>
                  </div>
                  {event.description && (
                    <p className="text-xs text-gray-600 truncate">{event.description}</p>
                  )}
                </motion.div>
              );
            })}
            
            <button
              onClick={() => {
                setSelectedDate(day);
                setShowEventModal(true);
              }}
              className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-colors text-sm"
            >
              + Add Event
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-200">
          {days}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);
    
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </h2>
          {isToday(currentDate) && (
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full mt-2">
              Today
            </span>
          )}
        </div>
        
        <div className="space-y-4">
          {dayEvents.length > 0 ? (
            dayEvents.map((event, idx) => {
              const config = getEventTypeConfig(event.type);
              const client = event.clientId ? getClientById(event.clientId) : null;
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-4 rounded-lg border-l-4 ${config.color} cursor-pointer hover:shadow-md transition-shadow`}
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowEventDetails(true);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={config.icon} className="h-5 w-5" />
                      <div>
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        {event.description && (
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        )}
                        {client && (
                          <p className="text-xs text-gray-500 mt-1">
                            Client: {client.name}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(event.priority)}`}>
                        {event.priority?.toUpperCase() || 'NORMAL'}
                      </span>
                      <span className="text-xs text-gray-500">{config.label}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <SafeIcon icon={FiCalendar} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No events scheduled for this day</p>
              <button
                onClick={() => {
                  setSelectedDate(currentDate);
                  setShowEventModal(true);
                }}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Event
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
            <p className="text-gray-600">
              Manage your IP deadlines, tasks, and events
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* View Type Selector */}
            <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
              {['month', 'week', 'day'].map((type) => (
                <button
                  key={type}
                  onClick={() => setViewType(type)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    viewType === type
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            
            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
            >
              <option value="all">All Events</option>
              <option value="tasks">Tasks Only</option>
              <option value="matters">Matters Only</option>
              <option value="assets">Asset Expiries</option>
              <option value="events">Custom Events</option>
            </select>
            
            {/* Add Event Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedDate(new Date());
                setShowEventModal(true);
              }}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium shadow-md flex items-center space-x-2 transition-all duration-200"
            >
              <SafeIcon icon={FiPlus} className="h-5 w-5" />
              <span>Add Event</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-6 bg-white rounded-lg p-4 shadow-md border border-gray-100"
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiChevronLeft} className="h-5 w-5" />
            </button>
            
            <h2 className="text-xl font-semibold text-gray-900">
              {viewType === 'day' 
                ? format(currentDate, 'MMMM d, yyyy')
                : format(currentDate, 'MMMM yyyy')
              }
            </h2>
            
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiChevronRight} className="h-5 w-5" />
            </button>
          </div>
          
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors font-medium"
          >
            Today
          </button>
        </motion.div>

        {/* Calendar Header (for month/week view) */}
        {(viewType === 'month' || viewType === 'week') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-7 bg-white border-b border-gray-200 rounded-t-lg"
          >
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-4 text-center font-medium text-gray-600 border-r border-gray-200 last:border-r-0">
                {day}
              </div>
            ))}
          </motion.div>
        )}

        {/* Calendar Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {viewType === 'month' && renderMonthView()}
          {viewType === 'week' && renderWeekView()}
          {viewType === 'day' && renderDayView()}
        </motion.div>

        {/* Event Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8"
        >
          {[
            { type: 'tasks', label: 'Pending Tasks', icon: FiIcons.FiCheckSquare, color: 'blue' },
            { type: 'matters', label: 'Matter Deadlines', icon: FiIcons.FiFileText, color: 'purple' },
            { type: 'asset-expiry', label: 'Asset Expiries', icon: FiIcons.FiFolder, color: 'orange' },
            { type: 'events', label: 'Custom Events', icon: FiIcons.FiCalendar, color: 'green' },
          ].map((stat) => {
            const count = allEvents.filter(event => event.type === stat.type).length;
            return (
              <div key={stat.type} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-${stat.color}-50 rounded-lg`}>
                    <SafeIcon icon={stat.icon} className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{count}</h3>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Modals */}
        <CalendarEventModal
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false);
            setSelectedDate(null);
          }}
          selectedDate={selectedDate}
        />

        <CalendarEventDetails
          isOpen={showEventDetails}
          onClose={() => {
            setShowEventDetails(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
        />
      </div>
    </div>
  );
};

export default Calendar;