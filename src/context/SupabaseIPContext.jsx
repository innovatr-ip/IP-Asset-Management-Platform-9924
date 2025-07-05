import React, { createContext, useContext, useState, useEffect } from 'react';
import { addDays, isBefore, isAfter, differenceInDays } from 'date-fns';
import supabase from '../lib/supabase';
import { useSupabaseAuth } from './SupabaseAuthContext';
import monitoringService from '../services/monitoringService.js';

const SupabaseIPContext = createContext();

export const useSupabaseIP = () => {
  const context = useContext(SupabaseIPContext);
  if (!context) {
    throw new Error('useSupabaseIP must be used within a SupabaseIPProvider');
  }
  return context;
};

export const SupabaseIPProvider = ({ children }) => {
  const { currentUser } = useSupabaseAuth();
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

  // Load data when user is available
  useEffect(() => {
    if (currentUser) {
      loadAllData();
    }
  }, [currentUser]);

  const loadAllData = async () => {
    try {
      await Promise.all([
        loadAssets(),
        loadClients(),
        loadTasks(),
        loadMatters(),
        loadCalendarEvents(),
        loadMonitoringItems(),
        loadMonitoringAlerts(),
        loadSettings()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Assets
  const loadAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('assets_ip8472')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Error loading assets:', error);
    }
  };

  const addAsset = async (asset) => {
    try {
      const { data, error } = await supabase
        .from('assets_ip8472')
        .insert({
          name: asset.name,
          type: asset.type,
          description: asset.description,
          registration_number: asset.registrationNumber,
          registration_date: asset.registrationDate,
          expiry_date: asset.expiryDate,
          jurisdiction: asset.jurisdiction,
          status: asset.status,
          client_id: asset.clientId,
          user_id: currentUser.id
        })
        .select()
        .single();

      if (error) throw error;
      await loadAssets();
      return data;
    } catch (error) {
      console.error('Error adding asset:', error);
      throw error;
    }
  };

  const updateAsset = async (id, updatedAsset) => {
    try {
      const { data, error } = await supabase
        .from('assets_ip8472')
        .update({
          name: updatedAsset.name,
          type: updatedAsset.type,
          description: updatedAsset.description,
          registration_number: updatedAsset.registrationNumber,
          registration_date: updatedAsset.registrationDate,
          expiry_date: updatedAsset.expiryDate,
          jurisdiction: updatedAsset.jurisdiction,
          status: updatedAsset.status,
          client_id: updatedAsset.clientId,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await loadAssets();
      return data;
    } catch (error) {
      console.error('Error updating asset:', error);
      throw error;
    }
  };

  const deleteAsset = async (id) => {
    try {
      const { error } = await supabase
        .from('assets_ip8472')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
      throw error;
    }
  };

  // Clients
  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients_ip8472')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const addClient = async (client) => {
    try {
      const { data, error } = await supabase
        .from('clients_ip8472')
        .insert({
          name: client.name,
          type: client.type,
          company: client.company,
          email: client.email,
          phone: client.phone,
          address: client.address,
          status: client.status,
          notes: client.notes,
          user_id: currentUser.id
        })
        .select()
        .single();

      if (error) throw error;
      await loadClients();
      return data;
    } catch (error) {
      console.error('Error adding client:', error);
      throw error;
    }
  };

  const updateClient = async (id, updatedClient) => {
    try {
      const { data, error } = await supabase
        .from('clients_ip8472')
        .update({
          name: updatedClient.name,
          type: updatedClient.type,
          company: updatedClient.company,
          email: updatedClient.email,
          phone: updatedClient.phone,
          address: updatedClient.address,
          status: updatedClient.status,
          notes: updatedClient.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await loadClients();
      return data;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  };

  const deleteClient = async (id) => {
    try {
      // Check for related assets
      const { data: relatedAssets } = await supabase
        .from('assets_ip8472')
        .select('id')
        .eq('client_id', id);

      if (relatedAssets && relatedAssets.length > 0) {
        throw new Error('Cannot delete client with existing IP assets. Please reassign or delete them first.');
      }

      const { error } = await supabase
        .from('clients_ip8472')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  };

  const getClientById = (id) => {
    return clients.find(client => client.id === id);
  };

  // Tasks
  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks_ip8472')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const addTask = async (task) => {
    try {
      const { data, error } = await supabase
        .from('tasks_ip8472')
        .insert({
          title: task.title,
          description: task.description,
          type: task.type,
          priority: task.priority,
          client_id: task.clientId,
          asset_id: task.assetId,
          matter_id: task.matterId,
          due_date: task.dueDate,
          notes: task.notes,
          completed: false,
          user_id: currentUser.id
        })
        .select()
        .single();

      if (error) throw error;
      await loadTasks();
      return data;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      const { data, error } = await supabase
        .from('tasks_ip8472')
        .update({
          title: updatedTask.title,
          description: updatedTask.description,
          type: updatedTask.type,
          priority: updatedTask.priority,
          client_id: updatedTask.clientId,
          asset_id: updatedTask.assetId,
          matter_id: updatedTask.matterId,
          due_date: updatedTask.dueDate,
          notes: updatedTask.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await loadTasks();
      return data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      const { error } = await supabase
        .from('tasks_ip8472')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const completeTask = async (id) => {
    try {
      const { data, error } = await supabase
        .from('tasks_ip8472')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await loadTasks();
      return data;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  };

  const reopenTask = async (id) => {
    try {
      const { data, error } = await supabase
        .from('tasks_ip8472')
        .update({
          completed: false,
          completed_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await loadTasks();
      return data;
    } catch (error) {
      console.error('Error reopening task:', error);
      throw error;
    }
  };

  // Matters
  const loadMatters = async () => {
    try {
      const { data, error } = await supabase
        .from('matters_ip8472')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMatters(data || []);
    } catch (error) {
      console.error('Error loading matters:', error);
    }
  };

  const addMatter = async (matter) => {
    try {
      const { data, error } = await supabase
        .from('matters_ip8472')
        .insert({
          title: matter.title,
          matter_number: matter.matterNumber,
          type: matter.type,
          status: matter.status,
          priority: matter.priority,
          description: matter.description,
          client_id: matter.clientId,
          asset_id: matter.assetId,
          next_deadline: matter.nextDeadline,
          notes: matter.notes,
          user_id: currentUser.id,
          last_updated: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      await loadMatters();
      return data;
    } catch (error) {
      console.error('Error adding matter:', error);
      throw error;
    }
  };

  const updateMatter = async (id, updatedMatter) => {
    try {
      const { data, error } = await supabase
        .from('matters_ip8472')
        .update({
          title: updatedMatter.title,
          matter_number: updatedMatter.matterNumber,
          type: updatedMatter.type,
          status: updatedMatter.status,
          priority: updatedMatter.priority,
          description: updatedMatter.description,
          client_id: updatedMatter.clientId,
          asset_id: updatedMatter.assetId,
          next_deadline: updatedMatter.nextDeadline,
          notes: updatedMatter.notes,
          last_updated: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await loadMatters();
      return data;
    } catch (error) {
      console.error('Error updating matter:', error);
      throw error;
    }
  };

  const deleteMatter = async (id) => {
    try {
      const { error } = await supabase
        .from('matters_ip8472')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadMatters();
    } catch (error) {
      console.error('Error deleting matter:', error);
      throw error;
    }
  };

  const getMatterById = (id) => {
    return matters.find(matter => matter.id === id);
  };

  const getTasksByMatter = (matterId) => {
    return tasks.filter(task => task.matter_id === matterId);
  };

  // Calendar Events
  const loadCalendarEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_events_ip8472')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setCalendarEvents(data || []);
    } catch (error) {
      console.error('Error loading calendar events:', error);
    }
  };

  const addCalendarEvent = async (event) => {
    try {
      const { data, error } = await supabase
        .from('calendar_events_ip8472')
        .insert({
          title: event.title,
          description: event.description,
          date: event.date,
          type: event.type,
          priority: event.priority,
          all_day: event.allDay,
          client_id: event.clientId,
          related_id: event.relatedId,
          location: event.location,
          notes: event.notes,
          user_id: currentUser.id
        })
        .select()
        .single();

      if (error) throw error;
      await loadCalendarEvents();
      return data;
    } catch (error) {
      console.error('Error adding calendar event:', error);
      throw error;
    }
  };

  const updateCalendarEvent = async (id, updatedEvent) => {
    try {
      const { data, error } = await supabase
        .from('calendar_events_ip8472')
        .update({
          title: updatedEvent.title,
          description: updatedEvent.description,
          date: updatedEvent.date,
          type: updatedEvent.type,
          priority: updatedEvent.priority,
          all_day: updatedEvent.allDay,
          client_id: updatedEvent.clientId,
          related_id: updatedEvent.relatedId,
          location: updatedEvent.location,
          notes: updatedEvent.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await loadCalendarEvents();
      return data;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  };

  const deleteCalendarEvent = async (id) => {
    try {
      const { error } = await supabase
        .from('calendar_events_ip8472')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadCalendarEvents();
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  };

  // Monitoring
  const loadMonitoringItems = async () => {
    try {
      const { data, error } = await supabase
        .from('monitoring_items_ip8472')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMonitoringItems(data || []);
    } catch (error) {
      console.error('Error loading monitoring items:', error);
    }
  };

  const loadMonitoringAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('monitoring_alerts_ip8472')
        .select('*')
        .order('detected_at', { ascending: false });

      if (error) throw error;
      setMonitoringAlerts(data || []);
    } catch (error) {
      console.error('Error loading monitoring alerts:', error);
    }
  };

  const addMonitoringItem = async (item) => {
    try {
      const { data, error } = await supabase
        .from('monitoring_items_ip8472')
        .insert({
          name: item.name,
          type: item.type,
          keywords: item.keywords,
          frequency: item.frequency,
          status: 'active',
          notifications: item.notifications,
          client_id: item.clientId,
          settings: item,
          user_id: currentUser.id
        })
        .select()
        .single();

      if (error) throw error;
      await loadMonitoringItems();

      // Start monitoring for trademark types
      if (data.type === 'trademark' && data.keywords.length > 0) {
        runManualCheck(data.id);
      }

      return data;
    } catch (error) {
      console.error('Error adding monitoring item:', error);
      throw error;
    }
  };

  const updateMonitoringItem = async (id, updatedItem) => {
    try {
      const { data, error } = await supabase
        .from('monitoring_items_ip8472')
        .update({
          name: updatedItem.name,
          keywords: updatedItem.keywords,
          frequency: updatedItem.frequency,
          status: updatedItem.status,
          notifications: updatedItem.notifications,
          client_id: updatedItem.clientId,
          settings: updatedItem,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await loadMonitoringItems();
      return data;
    } catch (error) {
      console.error('Error updating monitoring item:', error);
      throw error;
    }
  };

  const deleteMonitoringItem = async (id) => {
    try {
      // Delete related alerts first
      await supabase
        .from('monitoring_alerts_ip8472')
        .delete()
        .eq('monitoring_item_id', id);

      const { error } = await supabase
        .from('monitoring_items_ip8472')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadMonitoringItems();
      await loadMonitoringAlerts();
    } catch (error) {
      console.error('Error deleting monitoring item:', error);
      throw error;
    }
  };

  const runManualCheck = async (id) => {
    const item = monitoringItems.find(m => m.id === id);
    if (!item) return;

    // Update status to checking
    await supabase
      .from('monitoring_items_ip8472')
      .update({ 
        status: 'checking',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    try {
      const result = await monitoringService.startMonitoring(item);
      
      if (result.success) {
        // Update monitoring item with results
        await supabase
          .from('monitoring_items_ip8472')
          .update({
            last_checked: result.checkedAt,
            next_check: result.nextCheck?.toISOString(),
            status: 'active',
            alert_count: (item.alert_count || 0) + result.alerts.length,
            last_results: result.results,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);

        // Add new monitoring alerts
        if (result.alerts.length > 0) {
          const alertsToInsert = result.alerts.map(alert => ({
            monitoring_item_id: id,
            monitoring_item_name: item.name,
            type: alert.type,
            priority: alert.severity || alert.priority || 'medium',
            title: alert.title,
            description: alert.description,
            keyword: alert.keyword,
            platform: alert.platform,
            data: alert.data,
            detected_at: alert.detectedAt,
            action_required: alert.actionRequired,
            user_id: currentUser.id
          }));

          await supabase
            .from('monitoring_alerts_ip8472')
            .insert(alertsToInsert);
        }

        await loadMonitoringItems();
        await loadMonitoringAlerts();
      } else {
        // Update status to error
        await supabase
          .from('monitoring_items_ip8472')
          .update({
            status: 'error',
            last_error: result.error,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
      }
    } catch (error) {
      console.error('Manual check failed:', error);
      await supabase
        .from('monitoring_items_ip8472')
        .update({
          status: 'error',
          last_error: error.message,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
    }

    await loadMonitoringItems();
  };

  const dismissMonitoringAlert = async (alertId) => {
    try {
      const { error } = await supabase
        .from('monitoring_alerts_ip8472')
        .delete()
        .eq('id', alertId);

      if (error) throw error;
      await loadMonitoringAlerts();
    } catch (error) {
      console.error('Error dismissing monitoring alert:', error);
      throw error;
    }
  };

  // Settings
  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings_ip8472')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const { data, error } = await supabase
        .from('user_settings_ip8472')
        .upsert({
          user_id: currentUser.id,
          settings: { ...settings, ...newSettings },
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      setSettings(data.settings);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  // Helper functions
  const getAllCalendarEvents = () => {
    const events = [...calendarEvents];

    // Add task due dates
    tasks.forEach(task => {
      if (task.due_date && !task.completed) {
        events.push({
          id: `task-${task.id}`,
          title: task.title,
          date: task.due_date,
          type: 'task',
          priority: task.priority,
          sourceId: task.id,
          description: task.description,
          clientId: task.client_id,
          allDay: true,
        });
      }
    });

    // Add matter deadlines
    matters.forEach(matter => {
      if (matter.next_deadline) {
        events.push({
          id: `matter-${matter.id}`,
          title: `${matter.title} Deadline`,
          date: matter.next_deadline,
          type: 'matter',
          priority: matter.priority,
          sourceId: matter.id,
          description: matter.description,
          clientId: matter.client_id,
          allDay: true,
        });
      }
    });

    // Add asset expiry dates
    assets.forEach(asset => {
      if (asset.expiry_date) {
        const today = new Date();
        const expiryDate = new Date(asset.expiry_date);
        const daysUntilExpiry = differenceInDays(expiryDate, today);

        if (daysUntilExpiry >= -30 && daysUntilExpiry <= 365) {
          events.push({
            id: `asset-${asset.id}`,
            title: `${asset.name} Expires`,
            date: asset.expiry_date,
            type: 'asset-expiry',
            priority: daysUntilExpiry <= 30 ? 'high' : daysUntilExpiry <= 90 ? 'medium' : 'low',
            sourceId: asset.id,
            description: `${asset.type} registration expires`,
            clientId: asset.client_id,
            allDay: true,
          });
        }
      }
    });

    return events;
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

  // Stats functions
  const getAssetStats = () => {
    const total = assets.length;
    const active = assets.filter(asset => {
      if (!asset.expiry_date) return true;
      return isAfter(new Date(asset.expiry_date), new Date());
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
      !task.completed && task.due_date && new Date(task.due_date) < new Date()
    ).length;

    return { totalTasks, completedTasks, pendingTasks, overdueTasks };
  };

  const getMatterStats = () => {
    const totalMatters = matters.length;
    const activeMatters = matters.filter(matter => matter.status === 'active').length;
    const urgentMatters = matters.filter(matter => {
      if (!matter.next_deadline) return false;
      const daysUntilDeadline = differenceInDays(new Date(matter.next_deadline), new Date());
      return daysUntilDeadline <= 7 && daysUntilDeadline >= 0;
    }).length;
    const overdueMatters = matters.filter(matter => {
      if (!matter.next_deadline) return false;
      return new Date(matter.next_deadline) < new Date() && matter.status === 'active';
    }).length;

    return { totalMatters, activeMatters, urgentMatters, overdueMatters };
  };

  const getTasksByClient = (clientId) => {
    return tasks.filter(task => task.client_id === clientId);
  };

  const getTasksByAsset = (assetId) => {
    return tasks.filter(task => task.asset_id === assetId);
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
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

    // Asset functions
    addAsset,
    updateAsset,
    deleteAsset,

    // Client functions
    addClient,
    updateClient,
    deleteClient,
    getClientById,

    // Task functions
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    reopenTask,
    getTasksByClient,
    getTasksByAsset,
    getTasksByMatter,

    // Matter functions
    addMatter,
    updateMatter,
    deleteMatter,
    getMatterById,

    // Calendar functions
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    getAllCalendarEvents,

    // Monitoring functions
    addMonitoringItem,
    updateMonitoringItem,
    deleteMonitoringItem,
    runManualCheck,
    getMonitoringStats,
    dismissMonitoringAlert,

    // Settings
    updateSettings,

    // Stats
    getAssetStats,
    getClientStats,
    getTaskStats,
    getMatterStats,

    // Utility
    dismissAlert,
  };

  return (
    <SupabaseIPContext.Provider value={value}>
      {children}
    </SupabaseIPContext.Provider>
  );
};