import React, { createContext, useContext, useState, useEffect } from 'react';
import { addDays, isBefore, isAfter, differenceInDays } from 'date-fns';
import monitoringService from '../services/monitoringService.js';

const IPContext = createContext();

export const useIP = () => {
  const context = useContext(IPContext);
  if (!context) {
    throw new Error('useIP must be used within an IPProvider');
  }
  return context;
};

export const IPProvider = ({ children }) => {
  const [assets, setAssets] = useState([]);
  const [clients, setClients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [matters, setMatters] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [monitoringItems, setMonitoringItems] = useState([]);
  const [monitoringAlerts, setMonitoringAlerts] = useState([]);
  const [settings, setSettings] = useState({
    alertDays: [30, 60, 90],
    emailNotifications: true,
    autoRenewal: false,
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedAssets = localStorage.getItem('ip-assets');
    const savedClients = localStorage.getItem('ip-clients');
    const savedTasks = localStorage.getItem('ip-tasks');
    const savedMatters = localStorage.getItem('ip-matters');
    const savedCalendarEvents = localStorage.getItem('ip-calendar-events');
    const savedMonitoringItems = localStorage.getItem('ip-monitoring');
    const savedMonitoringAlerts = localStorage.getItem('ip-monitoring-alerts');
    const savedSettings = localStorage.getItem('ip-settings');

    if (savedAssets) {
      setAssets(JSON.parse(savedAssets));
    } else {
      // Initialize with sample data
      initializeSampleData();
    }
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    } else {
      // Initialize with sample clients
      initializeSampleClients();
    }
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    if (savedMatters) {
      setMatters(JSON.parse(savedMatters));
    }
    if (savedCalendarEvents) {
      setCalendarEvents(JSON.parse(savedCalendarEvents));
    }
    if (savedMonitoringItems) {
      setMonitoringItems(JSON.parse(savedMonitoringItems));
    } else {
      // Initialize with sample monitoring
      initializeSampleMonitoring();
    }
    if (savedMonitoringAlerts) {
      setMonitoringAlerts(JSON.parse(savedMonitoringAlerts));
    }
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Initialize sample data for demonstration
  const initializeSampleData = () => {
    const sampleAssets = [
      {
        id: 'asset-1',
        name: 'Innovatr Logo',
        type: 'trademark',
        description: 'Company logo trademark',
        registrationNumber: 'US123456',
        registrationDate: '2020-01-15',
        expiryDate: '2025-02-15',
        jurisdiction: 'United States',
        status: 'active',
        clientId: 'client-1',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'asset-2',
        name: 'TechFlow Patent',
        type: 'patent',
        description: 'Software process patent',
        registrationNumber: 'US987654',
        registrationDate: '2019-06-10',
        expiryDate: '2024-12-31',
        jurisdiction: 'United States',
        status: 'active',
        clientId: 'client-2',
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ];
    setAssets(sampleAssets);
  };

  const initializeSampleClients = () => {
    const sampleClients = [
      {
        id: 'client-1',
        name: 'TechCorp Inc.',
        type: 'company',
        company: 'TechCorp Inc.',
        email: 'contact@techcorp.com',
        phone: '+1-555-0123',
        status: 'active',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'client-2',
        name: 'Innovation Labs',
        type: 'company',
        company: 'Innovation Labs LLC',
        email: 'hello@innovationlabs.com',
        phone: '+1-555-0456',
        status: 'active',
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ];
    setClients(sampleClients);
  };

  const initializeSampleMonitoring = () => {
    const sampleMonitoring = [
      {
        id: 'monitoring-1',
        name: 'Innovatr Brand Protection',
        type: 'trademark',
        keywords: ['Innovatr', 'InnovatR'],
        frequency: 'daily',
        status: 'active',
        notifications: true,
        lastChecked: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        nextCheck: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
        alertCount: 2,
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    ];
    setMonitoringItems(sampleMonitoring);

    // Add sample monitoring alerts
    const sampleMonitoringAlerts = [
      {
        id: 'mon-alert-1',
        type: 'new_application',
        priority: 'high',
        title: 'New USPTO Application: INNOVATR TECH',
        description: 'Similar trademark application filed',
        keyword: 'Innovatr',
        monitoringItemId: 'monitoring-1',
        monitoringItemName: 'Innovatr Brand Protection',
        detectedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        data: {
          serialNumber: '97123456',
          applicantName: 'Tech Solutions LLC',
          applicationDate: '2024-11-15',
          markDescription: 'INNOVATR TECH',
          goodsAndServices: 'Computer software; Technology consulting services'
        },
        actionRequired: 'Review application and consider opposition if needed'
      },
      {
        id: 'mon-alert-2',
        type: 'suspicious_listing',
        priority: 'medium',
        title: 'Suspicious Amazon Listing',
        description: 'Product using similar branding detected',
        keyword: 'Innovatr',
        platform: 'Amazon',
        monitoringItemId: 'monitoring-1',
        monitoringItemName: 'Innovatr Brand Protection',
        detectedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        data: {
          seller: 'TechGadgets123',
          price: '$29.99',
          url: 'https://amazon.com/listing/example'
        },
        actionRequired: 'Review listing and consider takedown request'
      }
    ];
    setMonitoringAlerts(sampleMonitoringAlerts);
  };

  // Save data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ip-assets', JSON.stringify(assets));
    generateAlerts();
  }, [assets, settings.alertDays]);

  useEffect(() => {
    localStorage.setItem('ip-clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('ip-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('ip-matters', JSON.stringify(matters));
  }, [matters]);

  useEffect(() => {
    localStorage.setItem('ip-calendar-events', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem('ip-monitoring', JSON.stringify(monitoringItems));
  }, [monitoringItems]);

  useEffect(() => {
    localStorage.setItem('ip-monitoring-alerts', JSON.stringify(monitoringAlerts));
  }, [monitoringAlerts]);

  useEffect(() => {
    localStorage.setItem('ip-settings', JSON.stringify(settings));
  }, [settings]);

  // Brand Monitoring Functions
  const addMonitoringItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastChecked: null,
      nextCheck: new Date().toISOString(),
      status: 'active',
      alertCount: 0,
    };
    setMonitoringItems(prev => [...prev, newItem]);

    // Start monitoring immediately for trademark types
    if (newItem.type === 'trademark' && newItem.keywords.length > 0) {
      runManualCheck(newItem.id);
    }
  };

  const updateMonitoringItem = (id, updatedItem) => {
    setMonitoringItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, ...updatedItem, lastUpdated: new Date().toISOString() }
          : item
      )
    );
  };

  const deleteMonitoringItem = (id) => {
    setMonitoringItems(prev => prev.filter(item => item.id !== id));
    // Also remove related alerts
    setMonitoringAlerts(prev => prev.filter(alert => alert.monitoringItemId !== id));
  };

  const runManualCheck = async (id) => {
    const item = monitoringItems.find(m => m.id === id);
    if (!item) return;

    // Update status to checking
    setMonitoringItems(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, status: 'checking' }
          : m
      )
    );

    try {
      const result = await monitoringService.startMonitoring(item);
      if (result.success) {
        // Update monitoring item with results
        setMonitoringItems(prev =>
          prev.map(m =>
            m.id === id
              ? {
                  ...m,
                  lastChecked: result.checkedAt,
                  nextCheck: result.nextCheck?.toISOString(),
                  status: 'active',
                  alertCount: (m.alertCount || 0) + result.alerts.length,
                  lastResults: result.results
                }
              : m
          )
        );

        // Add new monitoring alerts
        if (result.alerts.length > 0) {
          const newAlerts = result.alerts.map(alert => ({
            ...alert,
            monitoringItemId: id,
            monitoringItemName: item.name
          }));
          setMonitoringAlerts(prev => [...prev, ...newAlerts]);
        }

        console.log(`Monitoring check completed for "${item.name}": ${result.alerts.length} new alerts`);
      } else {
        // Update status to error
        setMonitoringItems(prev =>
          prev.map(m =>
            m.id === id
              ? { ...m, status: 'error', lastError: result.error }
              : m
          )
        );
      }
    } catch (error) {
      console.error('Manual check failed:', error);
      setMonitoringItems(prev =>
        prev.map(m =>
          m.id === id
            ? { ...m, status: 'error', lastError: error.message }
            : m
        )
      );
    }
  };

  const getMonitoringStats = () => {
    const trademarks = monitoringItems.filter(item => item.type === 'trademark').length;
    const domains = monitoringItems.filter(item => item.type === 'domain').length;
    const marketplaces = monitoringItems.filter(item => item.type === 'marketplace').length;
    const social = monitoringItems.filter(item => item.type === 'social').length;

    return {
      trademarks,
      domains,
      marketplaces,
      social,
      total: monitoringItems.length,
      totalAlerts: monitoringAlerts.length,
      activeMonitoring: monitoringItems.filter(item => item.status === 'active').length
    };
  };

  // Dismiss monitoring alert
  const dismissMonitoringAlert = (alertId) => {
    setMonitoringAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  // Calendar Event Management Functions
  const addCalendarEvent = (event) => {
    const newEvent = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setCalendarEvents(prev => [...prev, newEvent]);
  };

  const updateCalendarEvent = (id, updatedEvent) => {
    setCalendarEvents(prev =>
      prev.map(event =>
        event.id === id ? { ...event, ...updatedEvent } : event
      )
    );
  };

  const deleteCalendarEvent = (id) => {
    setCalendarEvents(prev => prev.filter(event => event.id !== id));
  };

  const getCalendarEventById = (id) => {
    return calendarEvents.find(event => event.id === id);
  };

  // Get all calendar events including tasks, matters, and custom events
  const getAllCalendarEvents = () => {
    const events = [...calendarEvents];

    // Add task due dates
    tasks.forEach(task => {
      if (task.dueDate && !task.completed) {
        events.push({
          id: `task-${task.id}`,
          title: task.title,
          date: task.dueDate,
          type: 'task',
          priority: task.priority,
          sourceId: task.id,
          description: task.description,
          clientId: task.clientId,
          allDay: true,
        });
      }
    });

    // Add matter deadlines
    matters.forEach(matter => {
      if (matter.nextDeadline) {
        events.push({
          id: `matter-${matter.id}`,
          title: `${matter.title} Deadline`,
          date: matter.nextDeadline,
          type: 'matter',
          priority: matter.priority,
          sourceId: matter.id,
          description: matter.description,
          clientId: matter.clientId,
          allDay: true,
        });
      }
    });

    // Add asset expiry dates
    assets.forEach(asset => {
      if (asset.expiryDate) {
        const today = new Date();
        const expiryDate = new Date(asset.expiryDate);
        const daysUntilExpiry = differenceInDays(expiryDate, today);

        if (daysUntilExpiry >= -30 && daysUntilExpiry <= 365) { // Show 30 days past to 1 year future
          events.push({
            id: `asset-${asset.id}`,
            title: `${asset.name} Expires`,
            date: asset.expiryDate,
            type: 'asset-expiry',
            priority: daysUntilExpiry <= 30 ? 'high' : daysUntilExpiry <= 90 ? 'medium' : 'low',
            sourceId: asset.id,
            description: `${asset.type} registration expires`,
            clientId: asset.clientId,
            allDay: true,
          });
        }
      }
    });

    return events;
  };

  // Client Management Functions
  const addClient = (client) => {
    const newClient = {
      ...client,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (id, updatedClient) => {
    setClients(prev =>
      prev.map(client =>
        client.id === id ? { ...client, ...updatedClient } : client
      )
    );
  };

  const deleteClient = (id) => {
    // Check if client has assets or matters
    const clientAssets = assets.filter(asset => asset.clientId === id);
    const clientMatters = matters.filter(matter => matter.clientId === id);

    if (clientAssets.length > 0 || clientMatters.length > 0) {
      throw new Error('Cannot delete client with existing IP assets or matters. Please reassign or delete them first.');
    }

    setClients(prev => prev.filter(client => client.id !== id));
  };

  const getClientById = (id) => {
    return clients.find(client => client.id === id);
  };

  // Asset Management Functions
  const addAsset = (asset) => {
    const newAsset = {
      ...asset,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setAssets(prev => [...prev, newAsset]);
  };

  const updateAsset = (id, updatedAsset) => {
    setAssets(prev =>
      prev.map(asset =>
        asset.id === id ? { ...asset, ...updatedAsset } : asset
      )
    );
  };

  const deleteAsset = (id) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
  };

  // Matter Management Functions
  const addMatter = (matter) => {
    const newMatter = {
      ...matter,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    setMatters(prev => [...prev, newMatter]);
  };

  const updateMatter = (id, updatedMatter) => {
    setMatters(prev =>
      prev.map(matter =>
        matter.id === id
          ? { ...matter, ...updatedMatter, lastUpdated: new Date().toISOString() }
          : matter
      )
    );
  };

  const deleteMatter = (id) => {
    setMatters(prev => prev.filter(matter => matter.id !== id));
  };

  const getMatterById = (id) => {
    return matters.find(matter => matter.id === id);
  };

  const getTasksByMatter = (matterId) => {
    return tasks.filter(task => task.matterId === matterId);
  };

  // Task Management Functions
  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completed: false,
      completedAt: null,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id, updatedTask) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...updatedTask } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const completeTask = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: true, completedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const reopenTask = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: false, completedAt: null }
          : task
      )
    );
  };

  const getTasksByClient = (clientId) => {
    return tasks.filter(task => task.clientId === clientId);
  };

  const getTasksByAsset = (assetId) => {
    return tasks.filter(task => task.assetId === assetId);
  };

  const generateAlerts = () => {
    const newAlerts = [];
    const today = new Date();

    assets.forEach(asset => {
      if (asset.expiryDate) {
        const expiryDate = new Date(asset.expiryDate);
        const daysUntilExpiry = differenceInDays(expiryDate, today);

        settings.alertDays.forEach(alertDay => {
          if (daysUntilExpiry <= alertDay && daysUntilExpiry > 0) {
            newAlerts.push({
              id: `${asset.id}-${alertDay}`,
              assetId: asset.id,
              assetName: asset.name,
              type: 'expiry',
              message: `${asset.name} expires in ${daysUntilExpiry} days`,
              daysRemaining: daysUntilExpiry,
              priority: daysUntilExpiry <= 30 ? 'high' : daysUntilExpiry <= 60 ? 'medium' : 'low',
              createdAt: new Date().toISOString(),
            });
          }
        });

        // Add overdue alerts
        if (daysUntilExpiry < 0) {
          newAlerts.push({
            id: `${asset.id}-overdue`,
            assetId: asset.id,
            assetName: asset.name,
            type: 'overdue',
            message: `${asset.name} expired ${Math.abs(daysUntilExpiry)} days ago`,
            daysRemaining: daysUntilExpiry,
            priority: 'critical',
            createdAt: new Date().toISOString(),
          });
        }
      }
    });

    // Matter deadline alerts
    matters.forEach(matter => {
      if (matter.nextDeadline) {
        const deadline = new Date(matter.nextDeadline);
        const daysUntilDeadline = differenceInDays(deadline, today);

        if (daysUntilDeadline <= 30 && daysUntilDeadline >= 0) {
          newAlerts.push({
            id: `matter-${matter.id}-deadline`,
            matterId: matter.id,
            matterTitle: matter.title,
            type: 'matter-deadline',
            message: `Matter "${matter.title}" deadline in ${daysUntilDeadline} days`,
            daysRemaining: daysUntilDeadline,
            priority: daysUntilDeadline <= 7 ? 'critical' : daysUntilDeadline <= 14 ? 'high' : 'medium',
            createdAt: new Date().toISOString(),
          });
        }

        if (daysUntilDeadline < 0) {
          newAlerts.push({
            id: `matter-${matter.id}-overdue`,
            matterId: matter.id,
            matterTitle: matter.title,
            type: 'matter-overdue',
            message: `Matter "${matter.title}" deadline overdue by ${Math.abs(daysUntilDeadline)} days`,
            daysRemaining: daysUntilDeadline,
            priority: 'critical',
            createdAt: new Date().toISOString(),
          });
        }
      }
    });

    setAlerts(newAlerts);
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    // Also remove from monitoring alerts if it's a monitoring alert
    setMonitoringAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const getAssetStats = () => {
    const total = assets.length;
    const active = assets.filter(asset => {
      if (!asset.expiryDate) return true;
      return isAfter(new Date(asset.expiryDate), new Date());
    }).length;
    const expired = total - active;
    const criticalAlerts = alerts.filter(alert => alert.priority === 'critical').length;

    return { total, active, expired, criticalAlerts };
  };

  const getClientStats = () => {
    const totalClients = clients.length;
    const activeClients = clients.filter(client => client.status === 'active').length;
    const assetsPerClient = totalClients > 0 ? (assets.length / totalClients).toFixed(1) : 0;

    return { totalClients, activeClients, assetsPerClient };
  };

  const getTaskStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const overdueTasks = tasks.filter(task =>
      !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
    ).length;

    return { totalTasks, completedTasks, pendingTasks, overdueTasks };
  };

  const getMatterStats = () => {
    const totalMatters = matters.length;
    const activeMatters = matters.filter(matter => matter.status === 'active').length;
    const urgentMatters = matters.filter(matter => {
      if (!matter.nextDeadline) return false;
      const daysUntilDeadline = differenceInDays(new Date(matter.nextDeadline), new Date());
      return daysUntilDeadline <= 7 && daysUntilDeadline >= 0;
    }).length;
    const overdueMatters = matters.filter(matter => {
      if (!matter.nextDeadline) return false;
      return new Date(matter.nextDeadline) < new Date() && matter.status === 'active';
    }).length;

    return { totalMatters, activeMatters, urgentMatters, overdueMatters };
  };

  const value = {
    assets,
    clients,
    alerts,
    tasks,
    matters,
    calendarEvents,
    monitoringItems,
    monitoringAlerts,
    settings,
    addAsset,
    updateAsset,
    deleteAsset,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    reopenTask,
    getTasksByClient,
    getTasksByAsset,
    getTasksByMatter,
    addMatter,
    updateMatter,
    deleteMatter,
    getMatterById,
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    getCalendarEventById,
    getAllCalendarEvents,
    addMonitoringItem,
    updateMonitoringItem,
    deleteMonitoringItem,
    runManualCheck,
    getMonitoringStats,
    dismissMonitoringAlert,
    dismissAlert,
    updateSettings,
    getAssetStats,
    getClientStats,
    getTaskStats,
    getMatterStats,
  };

  return (
    <IPContext.Provider value={value}>
      {children}
    </IPContext.Provider>
  );
};