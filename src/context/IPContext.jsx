import React, { createContext, useContext, useState, useEffect } from 'react';
import { addDays, isBefore, isAfter, differenceInDays } from 'date-fns';
import monitoringService from '../services/monitoringService.js';
import { useAuth } from './AuthContext';
import supabase from '../lib/supabase';

const IPContext = createContext();

export const useIP = () => {
  const context = useContext(IPContext);
  if (!context) {
    throw new Error('useIP must be used within an IPProvider');
  }
  return context;
};

export const IPProvider = ({ children }) => {
  const { currentUser } = useAuth();
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
  const [isLoading, setIsLoading] = useState(true);

  // Load demo data when user changes
  useEffect(() => {
    if (currentUser) {
      loadDemoData();
    } else {
      // Reset data when user logs out
      resetData();
    }
  }, [currentUser]);

  const resetData = () => {
    setAssets([]);
    setClients([]);
    setAlerts([]);
    setTasks([]);
    setMatters([]);
    setCalendarEvents([]);
    setMonitoringItems([]);
    setMonitoringAlerts([]);
    setSettings({
      alertDays: [30, 60, 90],
      emailNotifications: true,
      autoRenewal: false,
    });
  };

  const loadDemoData = () => {
    if (!currentUser?.organizationId) {
      setIsLoading(false);
      return;
    }

    // Demo clients based on organization
    let demoClients = [];
    let demoAssets = [];
    let demoMatters = [];
    let demoTasks = [];
    let demoEvents = [];
    let demoMonitoring = [];
    let demoMonitoringAlerts = [];

    if (currentUser.organizationId === 'org-1') { // Acme Law Firm
      demoClients = [
        {
          id: 'client-1',
          name: 'TechStart Inc.',
          type: 'corporate',
          company: 'TechStart Inc.',
          email: 'legal@techstart.com',
          phone: '+1 (555) 234-5678',
          address: '789 Innovation Drive, Austin, TX 78701',
          status: 'active',
          notes: 'Fast-growing tech startup, focus on mobile applications',
          createdAt: '2024-03-15T10:00:00Z'
        },
        {
          id: 'client-2',
          name: 'Global Manufacturing Co.',
          type: 'corporate',
          company: 'Global Manufacturing Co.',
          email: 'ip@globalmanuf.com',
          phone: '+1 (555) 345-6789',
          address: '456 Industrial Blvd, Detroit, MI 48201',
          status: 'active',
          notes: 'Large manufacturing company with extensive patent portfolio',
          createdAt: '2024-02-20T14:30:00Z'
        },
        {
          id: 'client-3',
          name: 'Creative Brands LLC',
          type: 'corporate',
          company: 'Creative Brands LLC',
          email: 'contact@creativebrands.com',
          phone: '+1 (555) 456-7890',
          address: '123 Design Ave, Los Angeles, CA 90210',
          status: 'active',
          notes: 'Fashion and lifestyle brand, heavy trademark focus',
          createdAt: '2024-04-01T09:15:00Z'
        },
        {
          id: 'client-4',
          name: 'John Smith',
          type: 'individual',
          company: 'Independent Inventor',
          email: 'john.smith@email.com',
          phone: '+1 (555) 567-8901',
          address: '987 Maple Street, Portland, OR 97205',
          status: 'active',
          notes: 'Independent inventor with several pending patent applications',
          createdAt: '2024-01-10T16:45:00Z'
        }
      ];

      demoAssets = [
        {
          id: 'asset-1',
          name: 'MobileApp Pro',
          type: 'trademark',
          description: 'Mobile application development platform trademark',
          registrationNumber: 'US-TM-5234567',
          registrationDate: '2022-06-15',
          expiryDate: '2032-06-15',
          jurisdiction: 'US',
          status: 'registered',
          clientId: 'client-1',
          createdAt: '2022-06-15T10:00:00Z'
        },
        {
          id: 'asset-2',
          name: 'Smart Manufacturing System',
          type: 'patent',
          description: 'IoT-based manufacturing optimization system',
          registrationNumber: 'US-PAT-11234567',
          registrationDate: '2023-03-20',
          expiryDate: '2043-03-20',
          jurisdiction: 'US',
          status: 'granted',
          clientId: 'client-2',
          createdAt: '2023-03-20T14:30:00Z'
        },
        {
          id: 'asset-3',
          name: 'EcoStyle',
          type: 'trademark',
          description: 'Sustainable fashion brand trademark',
          registrationNumber: 'US-TM-6345678',
          registrationDate: '2023-09-10',
          expiryDate: '2033-09-10',
          jurisdiction: 'US',
          status: 'registered',
          clientId: 'client-3',
          createdAt: '2023-09-10T11:20:00Z'
        },
        {
          id: 'asset-4',
          name: 'Renewable Energy Converter',
          type: 'patent',
          description: 'Improved solar panel efficiency system',
          registrationNumber: 'US-PAT-11456789',
          registrationDate: '2024-01-15',
          expiryDate: '2044-01-15',
          jurisdiction: 'US',
          status: 'granted',
          clientId: 'client-4',
          createdAt: '2024-01-15T09:30:00Z'
        },
        {
          id: 'asset-5',
          name: 'QuickConnect',
          type: 'trademark',
          description: 'Communication software trademark',
          registrationNumber: 'US-TM-7456789',
          registrationDate: '2021-12-05',
          expiryDate: '2025-03-15',
          jurisdiction: 'US',
          status: 'registered',
          clientId: 'client-1',
          createdAt: '2021-12-05T15:45:00Z'
        }
      ];

      demoMatters = [
        {
          id: 'matter-1',
          title: 'MobileApp Pro Trademark Renewal',
          matterNumber: 'ACM-2024-001',
          type: 'trademark-renewal',
          status: 'active',
          priority: 'medium',
          description: 'Renewal proceedings for MobileApp Pro trademark',
          clientId: 'client-1',
          assetId: 'asset-1',
          nextDeadline: '2025-02-15',
          notes: 'Client notified, renewal fee prepared',
          createdAt: '2024-12-01T10:00:00Z',
          lastUpdated: '2025-01-15T14:30:00Z'
        },
        {
          id: 'matter-2',
          title: 'Smart Manufacturing Patent Maintenance',
          matterNumber: 'ACM-2024-002',
          type: 'patent-maintenance',
          status: 'active',
          priority: 'high',
          description: 'Patent maintenance fee filing',
          clientId: 'client-2',
          assetId: 'asset-2',
          nextDeadline: '2025-02-28',
          notes: 'First maintenance fee due',
          createdAt: '2024-11-15T09:00:00Z',
          lastUpdated: '2025-01-10T16:20:00Z'
        },
        {
          id: 'matter-3',
          title: 'EcoStyle Opposition Response',
          matterNumber: 'ACM-2024-003',
          type: 'trademark-opposition',
          status: 'active',
          priority: 'high',
          description: 'Responding to trademark opposition',
          clientId: 'client-3',
          assetId: 'asset-3',
          nextDeadline: '2025-02-10',
          notes: 'Opposition filed by competitor, response in progress',
          createdAt: '2024-12-20T11:30:00Z',
          lastUpdated: '2025-01-18T10:15:00Z'
        }
      ];

      demoTasks = [
        {
          id: 'task-1',
          title: 'Review MobileApp Pro renewal documents',
          description: 'Review and finalize renewal paperwork for MobileApp Pro trademark',
          type: 'document-review',
          priority: 'medium',
          clientId: 'client-1',
          assetId: 'asset-1',
          matterId: 'matter-1',
          dueDate: '2025-02-05',
          notes: 'Client has provided updated specimens',
          completed: false,
          assignedTo: 'user-3',
          createdAt: '2024-12-01T10:30:00Z'
        },
        {
          id: 'task-2',
          title: 'Calculate patent maintenance fee',
          description: 'Calculate exact maintenance fee amount for Smart Manufacturing patent',
          type: 'fee-calculation',
          priority: 'high',
          clientId: 'client-2',
          assetId: 'asset-2',
          matterId: 'matter-2',
          dueDate: '2025-02-20',
          notes: 'Check for small entity status',
          completed: false,
          assignedTo: 'user-2',
          createdAt: '2024-11-15T09:30:00Z'
        },
        {
          id: 'task-3',
          title: 'Draft opposition response brief',
          description: 'Prepare response to EcoStyle trademark opposition',
          type: 'brief-drafting',
          priority: 'high',
          clientId: 'client-3',
          assetId: 'asset-3',
          matterId: 'matter-3',
          dueDate: '2025-02-01',
          notes: 'Include evidence of use and distinctiveness',
          completed: false,
          assignedTo: 'user-2',
          createdAt: '2024-12-20T12:00:00Z'
        },
        {
          id: 'task-4',
          title: 'Client meeting - quarterly review',
          description: 'Quarterly IP portfolio review with TechStart Inc.',
          type: 'client-meeting',
          priority: 'medium',
          clientId: 'client-1',
          dueDate: '2025-01-30',
          notes: 'Prepare portfolio summary and upcoming deadlines',
          completed: false,
          assignedTo: 'user-2',
          createdAt: '2025-01-01T14:00:00Z'
        },
        {
          id: 'task-5',
          title: 'File continuation application',
          description: 'File continuation for renewable energy patent',
          type: 'filing',
          priority: 'medium',
          clientId: 'client-4',
          assetId: 'asset-4',
          dueDate: '2025-03-15',
          notes: 'Claims amendments ready for filing',
          completed: true,
          completedAt: '2025-01-10T16:30:00Z',
          assignedTo: 'user-3',
          createdAt: '2024-12-15T11:45:00Z'
        }
      ];

      demoEvents = [
        {
          id: 'event-1',
          title: 'USPTO Deadline - MobileApp Pro Renewal',
          description: 'Final deadline for MobileApp Pro trademark renewal',
          date: '2025-02-15',
          time: '17:00',
          type: 'deadline',
          priority: 'high',
          allDay: false,
          clientId: 'client-1',
          relatedId: 'matter-1',
          location: 'USPTO',
          notes: 'Cannot be extended',
          createdAt: '2024-12-01T10:00:00Z'
        },
        {
          id: 'event-2',
          title: 'Client Call - Global Manufacturing',
          description: 'Monthly check-in call with Global Manufacturing legal team',
          date: '2025-02-03',
          time: '14:00',
          type: 'meeting',
          priority: 'medium',
          allDay: false,
          clientId: 'client-2',
          location: 'Conference Room A / Zoom',
          notes: 'Discuss patent portfolio strategy',
          createdAt: '2024-11-15T09:00:00Z'
        }
      ];

      demoMonitoring = [
        {
          id: 'monitor-1',
          name: 'MobileApp Brand Protection',
          type: 'trademark',
          keywords: ['MobileApp', 'Mobile App Pro', 'MobileAppPro'],
          frequency: 'weekly',
          notifications: true,
          status: 'active',
          lastChecked: '2025-01-20T10:00:00Z',
          nextCheck: '2025-01-27T10:00:00Z',
          alertCount: 3,
          clientId: 'client-1',
          classes: ['009', '042'],
          includeVariations: true,
          createdAt: '2024-06-15T11:00:00Z'
        },
        {
          id: 'monitor-2',
          name: 'EcoStyle Domain Watch',
          type: 'domain',
          keywords: ['ecostyle', 'eco-style'],
          frequency: 'daily',
          notifications: true,
          status: 'active',
          lastChecked: '2025-01-21T08:00:00Z',
          nextCheck: '2025-01-22T08:00:00Z',
          alertCount: 1,
          clientId: 'client-3',
          extensions: ['.com', '.net', '.org', '.shop'],
          includeTypos: true,
          createdAt: '2023-09-10T12:00:00Z'
        }
      ];

      demoMonitoringAlerts = [
        {
          id: 'alert-1',
          type: 'trademark',
          priority: 'high',
          title: 'Similar trademark application filed',
          description: 'A trademark application for "MobileAppExpert" was filed in class 042',
          keyword: 'MobileApp',
          platform: 'USPTO',
          monitoringItemId: 'monitor-1',
          monitoringItemName: 'MobileApp Brand Protection',
          detectedAt: '2025-01-20T10:30:00Z',
          data: {
            applicationNumber: 'US-APP-98765432',
            applicant: 'Competitor Tech LLC',
            classes: ['042'],
            filingDate: '2025-01-19'
          },
          actionRequired: true,
          createdAt: '2025-01-20T10:35:00Z'
        },
        {
          id: 'alert-2',
          type: 'domain',
          priority: 'medium',
          title: 'Domain registration detected',
          description: 'Domain "eco-style-shop.com" was registered',
          keyword: 'eco-style',
          platform: 'Domain Registry',
          monitoringItemId: 'monitor-2',
          monitoringItemName: 'EcoStyle Domain Watch',
          detectedAt: '2025-01-21T08:15:00Z',
          data: {
            domain: 'eco-style-shop.com',
            registrant: 'Private Registration',
            registrationDate: '2025-01-20'
          },
          actionRequired: false,
          createdAt: '2025-01-21T08:20:00Z'
        }
      ];
    } else if (currentUser.organizationId === 'org-2') { // TechCorp Legal
      demoClients = [
        {
          id: 'client-tc-1',
          name: 'TechCorp Product Division',
          type: 'internal',
          company: 'TechCorp Inc.',
          email: 'products@techcorp.com',
          phone: '+1 (555) 987-6543',
          address: '456 Innovation Ave, San Francisco, CA 94105',
          status: 'active',
          notes: 'Internal product development team',
          createdAt: '2024-02-01T14:30:00Z'
        },
        {
          id: 'client-tc-2',
          name: 'TechCorp Research Labs',
          type: 'internal',
          company: 'TechCorp Inc.',
          email: 'research@techcorp.com',
          phone: '+1 (555) 987-6544',
          address: '456 Innovation Ave, San Francisco, CA 94105',
          status: 'active',
          notes: 'R&D department with active patent program',
          createdAt: '2024-02-01T14:30:00Z'
        }
      ];

      demoAssets = [
        {
          id: 'asset-tc-1',
          name: 'TechCorp AI Assistant',
          type: 'trademark',
          description: 'AI-powered virtual assistant trademark',
          registrationNumber: 'US-TM-8123456',
          registrationDate: '2023-08-15',
          expiryDate: '2033-08-15',
          jurisdiction: 'US',
          status: 'registered',
          clientId: 'client-tc-1',
          createdAt: '2023-08-15T10:00:00Z'
        },
        {
          id: 'asset-tc-2',
          name: 'Quantum Processing Algorithm',
          type: 'patent',
          description: 'Advanced quantum computing optimization method',
          registrationNumber: 'US-PAT-11987654',
          registrationDate: '2024-05-10',
          expiryDate: '2044-05-10',
          jurisdiction: 'US',
          status: 'granted',
          clientId: 'client-tc-2',
          createdAt: '2024-05-10T15:20:00Z'
        },
        {
          id: 'asset-tc-3',
          name: 'TechCorp Cloud Platform',
          type: 'trademark',
          description: 'Cloud computing platform brand',
          registrationNumber: 'US-TM-8234567',
          registrationDate: '2022-11-20',
          expiryDate: '2025-04-20',
          jurisdiction: 'US',
          status: 'registered',
          clientId: 'client-tc-1',
          createdAt: '2022-11-20T13:45:00Z'
        }
      ];

      demoMatters = [
        {
          id: 'matter-tc-1',
          title: 'TechCorp Cloud Platform Renewal',
          matterNumber: 'TC-2025-001',
          type: 'trademark-renewal',
          status: 'active',
          priority: 'high',
          description: 'Urgent renewal for cloud platform trademark',
          clientId: 'client-tc-1',
          assetId: 'asset-tc-3',
          nextDeadline: '2025-04-20',
          notes: 'Critical brand asset - must not lapse',
          createdAt: '2024-10-20T09:00:00Z',
          lastUpdated: '2025-01-15T11:30:00Z'
        }
      ];

      demoTasks = [
        {
          id: 'task-tc-1',
          title: 'Prepare Cloud Platform renewal filing',
          description: 'Complete Section 8 and 9 renewal for TechCorp Cloud Platform',
          type: 'renewal-filing',
          priority: 'high',
          clientId: 'client-tc-1',
          assetId: 'asset-tc-3',
          matterId: 'matter-tc-1',
          dueDate: '2025-03-20',
          notes: 'Collect usage evidence from marketing team',
          completed: false,
          assignedTo: 'user-5',
          createdAt: '2024-10-20T09:30:00Z'
        },
        {
          id: 'task-tc-2',
          title: 'Patent landscape analysis',
          description: 'Analyze quantum computing patent landscape for R&D strategy',
          type: 'analysis',
          priority: 'medium',
          clientId: 'client-tc-2',
          dueDate: '2025-02-28',
          notes: 'Focus on recent applications in quantum optimization',
          completed: false,
          assignedTo: 'user-5',
          createdAt: '2025-01-05T14:00:00Z'
        }
      ];

      demoEvents = [
        {
          id: 'event-tc-1',
          title: 'Cloud Platform Renewal Deadline',
          description: 'Final deadline for TechCorp Cloud Platform trademark renewal',
          date: '2025-04-20',
          time: '23:59',
          type: 'deadline',
          priority: 'critical',
          allDay: false,
          clientId: 'client-tc-1',
          relatedId: 'matter-tc-1',
          location: 'USPTO',
          notes: 'Absolutely critical - core business trademark',
          createdAt: '2024-10-20T09:00:00Z'
        }
      ];

      demoMonitoring = [
        {
          id: 'monitor-tc-1',
          name: 'TechCorp Brand Monitoring',
          type: 'trademark',
          keywords: ['TechCorp', 'Tech Corp', 'TechCorps'],
          frequency: 'daily',
          notifications: true,
          status: 'active',
          lastChecked: '2025-01-21T09:00:00Z',
          nextCheck: '2025-01-22T09:00:00Z',
          alertCount: 5,
          clientId: 'client-tc-1',
          classes: ['009', '042', '035'],
          includeVariations: true,
          createdAt: '2024-02-01T15:00:00Z'
        }
      ];

      demoMonitoringAlerts = [];
    }

    // Set all demo data
    setClients(demoClients);
    setAssets(demoAssets);
    setMatters(demoMatters);
    setTasks(demoTasks);
    setCalendarEvents(demoEvents);
    setMonitoringItems(demoMonitoring);
    setMonitoringAlerts(demoMonitoringAlerts);

    // Generate alerts based on assets and matters
    generateAlertsFromData(demoAssets, demoMatters);

    setIsLoading(false);
  };

  const generateAlertsFromData = (assetData, matterData) => {
    const newAlerts = [];
    const today = new Date();

    // Generate asset expiry alerts
    assetData.forEach(asset => {
      if (asset.expiryDate) {
        const expiryDate = new Date(asset.expiryDate);
        const daysUntilExpiry = differenceInDays(expiryDate, today);

        // Add alerts for configured days
        settings.alertDays.forEach(alertDay => {
          if (daysUntilExpiry <= alertDay && daysUntilExpiry > 0) {
            newAlerts.push({
              id: `alert-${asset.id}-${alertDay}`,
              assetId: asset.id,
              assetName: asset.name,
              type: 'expiry',
              message: `${asset.name} expires in ${daysUntilExpiry} days`,
              daysRemaining: daysUntilExpiry,
              priority: daysUntilExpiry <= 30 ? 'high' : daysUntilExpiry <= 60 ? 'medium' : 'low',
              createdAt: new Date().toISOString()
            });
          }
        });

        // Add overdue alerts
        if (daysUntilExpiry < 0) {
          newAlerts.push({
            id: `alert-overdue-${asset.id}`,
            assetId: asset.id,
            assetName: asset.name,
            type: 'overdue',
            message: `${asset.name} expired ${Math.abs(daysUntilExpiry)} days ago`,
            daysRemaining: daysUntilExpiry,
            priority: 'critical',
            createdAt: new Date().toISOString()
          });
        }
      }
    });

    // Generate matter deadline alerts
    matterData.forEach(matter => {
      if (matter.nextDeadline) {
        const deadline = new Date(matter.nextDeadline);
        const daysUntilDeadline = differenceInDays(deadline, today);

        if (daysUntilDeadline <= 30 && daysUntilDeadline >= 0) {
          newAlerts.push({
            id: `alert-matter-${matter.id}`,
            matterId: matter.id,
            matterTitle: matter.title,
            type: 'matter-deadline',
            message: `Matter "${matter.title}" deadline in ${daysUntilDeadline} days`,
            daysRemaining: daysUntilDeadline,
            priority: daysUntilDeadline <= 7 ? 'critical' : daysUntilDeadline <= 14 ? 'high' : 'medium',
            createdAt: new Date().toISOString()
          });
        }

        if (daysUntilDeadline < 0) {
          newAlerts.push({
            id: `alert-matter-overdue-${matter.id}`,
            matterId: matter.id,
            matterTitle: matter.title,
            type: 'matter-overdue',
            message: `Matter "${matter.title}" deadline overdue by ${Math.abs(daysUntilDeadline)} days`,
            daysRemaining: daysUntilDeadline,
            priority: 'critical',
            createdAt: new Date().toISOString()
          });
        }
      }
    });

    setAlerts(newAlerts);
  };

  // Fetch settings from database (fallback to demo data if needed)
  const fetchSettings = async () => {
    if (!currentUser?.organizationId) return;
    
    try {
      const { data, error } = await supabase
        .from('settings_ip5603')
        .select('*')
        .eq('organization_id', currentUser.organizationId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setSettings({
          alertDays: data.alert_days || [30, 60, 90],
          emailNotifications: data.email_notifications,
          autoRenewal: data.auto_renewal,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Use demo settings if database fails
    }
  };

  // Client Management Functions
  const addClient = async (client) => {
    try {
      const newClient = {
        id: `client-${Date.now()}`,
        name: client.name,
        type: client.type,
        company: client.company,
        email: client.email,
        phone: client.phone,
        address: client.address,
        status: client.status,
        notes: client.notes,
        createdAt: new Date().toISOString()
      };
      
      setClients(prev => [...prev, newClient]);
      return newClient;
    } catch (error) {
      console.error('Error adding client:', error);
      throw error;
    }
  };

  const updateClient = async (id, updatedClient) => {
    try {
      setClients(prev => 
        prev.map(client => 
          client.id === id ? { ...client, ...updatedClient } : client
        )
      );
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  };

  const deleteClient = async (id) => {
    try {
      // Check if client has assets or matters
      const clientAssets = assets.filter(asset => asset.clientId === id);
      const clientMatters = matters.filter(matter => matter.clientId === id);
      
      if (clientAssets.length > 0 || clientMatters.length > 0) {
        throw new Error('Cannot delete client with existing IP assets or matters. Please reassign or delete them first.');
      }
      
      setClients(prev => prev.filter(client => client.id !== id));
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  };

  const getClientById = (id) => {
    return clients.find(client => client.id === id);
  };

  // Asset Management Functions
  const addAsset = async (asset) => {
    try {
      const newAsset = {
        id: `asset-${Date.now()}`,
        name: asset.name,
        type: asset.type,
        description: asset.description,
        registrationNumber: asset.registrationNumber,
        registrationDate: asset.registrationDate,
        expiryDate: asset.expiryDate,
        jurisdiction: asset.jurisdiction,
        status: asset.status,
        clientId: asset.clientId,
        createdAt: new Date().toISOString()
      };
      
      setAssets(prev => {
        const updatedAssets = [...prev, newAsset];
        generateAlertsFromData(updatedAssets, matters);
        return updatedAssets;
      });
      
      return newAsset;
    } catch (error) {
      console.error('Error adding asset:', error);
      throw error;
    }
  };

  const updateAsset = async (id, updatedAsset) => {
    try {
      const updatedAssets = assets.map(asset => 
        asset.id === id ? { ...asset, ...updatedAsset } : asset
      );
      
      setAssets(updatedAssets);
      generateAlertsFromData(updatedAssets, matters);
    } catch (error) {
      console.error('Error updating asset:', error);
      throw error;
    }
  };

  const deleteAsset = async (id) => {
    try {
      const updatedAssets = assets.filter(asset => asset.id !== id);
      setAssets(updatedAssets);
      generateAlertsFromData(updatedAssets, matters);
    } catch (error) {
      console.error('Error deleting asset:', error);
      throw error;
    }
  };

  // Matter Management Functions
  const addMatter = async (matter) => {
    try {
      const newMatter = {
        id: `matter-${Date.now()}`,
        title: matter.title,
        matterNumber: matter.matterNumber,
        type: matter.type,
        status: matter.status,
        priority: matter.priority,
        description: matter.description,
        clientId: matter.clientId,
        assetId: matter.assetId || null,
        nextDeadline: matter.nextDeadline,
        notes: matter.notes,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      setMatters(prev => {
        const updatedMatters = [...prev, newMatter];
        generateAlertsFromData(assets, updatedMatters);
        return updatedMatters;
      });
      
      return newMatter;
    } catch (error) {
      console.error('Error adding matter:', error);
      throw error;
    }
  };

  const updateMatter = async (id, updatedMatter) => {
    try {
      const updatedMatters = matters.map(matter => 
        matter.id === id ? { 
          ...matter, 
          ...updatedMatter, 
          lastUpdated: new Date().toISOString() 
        } : matter
      );
      
      setMatters(updatedMatters);
      generateAlertsFromData(assets, updatedMatters);
    } catch (error) {
      console.error('Error updating matter:', error);
      throw error;
    }
  };

  const deleteMatter = async (id) => {
    try {
      const updatedMatters = matters.filter(matter => matter.id !== id);
      setMatters(updatedMatters);
      generateAlertsFromData(assets, updatedMatters);
    } catch (error) {
      console.error('Error deleting matter:', error);
      throw error;
    }
  };

  const getMatterById = (id) => {
    return matters.find(matter => matter.id === id);
  };

  const getTasksByMatter = (matterId) => {
    return tasks.filter(task => task.matterId === matterId);
  };

  // Task Management Functions
  const addTask = async (task) => {
    try {
      const newTask = {
        id: `task-${Date.now()}`,
        title: task.title,
        description: task.description,
        type: task.type,
        priority: task.priority,
        clientId: task.clientId || null,
        assetId: task.assetId || null,
        matterId: task.matterId || null,
        dueDate: task.dueDate,
        notes: task.notes,
        completed: false,
        assignedTo: currentUser.id,
        createdAt: new Date().toISOString()
      };
      
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? { ...task, ...updatedTask } : task
        )
      );
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const completeTask = async (id) => {
    try {
      const completedAt = new Date().toISOString();
      
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? { ...task, completed: true, completedAt } : task
        )
      );
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  };

  const reopenTask = async (id) => {
    try {
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? { ...task, completed: false, completedAt: null } : task
        )
      );
    } catch (error) {
      console.error('Error reopening task:', error);
      throw error;
    }
  };

  const getTasksByClient = (clientId) => {
    return tasks.filter(task => task.clientId === clientId);
  };

  const getTasksByAsset = (assetId) => {
    return tasks.filter(task => task.assetId === assetId);
  };

  // Calendar Event Management Functions
  const addCalendarEvent = async (event) => {
    try {
      const newEvent = {
        id: `event-${Date.now()}`,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        type: event.type,
        priority: event.priority,
        allDay: event.allDay,
        clientId: event.clientId || null,
        relatedId: event.relatedId,
        location: event.location,
        notes: event.notes,
        createdAt: new Date().toISOString()
      };
      
      setCalendarEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (error) {
      console.error('Error adding calendar event:', error);
      throw error;
    }
  };

  const updateCalendarEvent = async (id, updatedEvent) => {
    try {
      setCalendarEvents(prev => 
        prev.map(event => 
          event.id === id ? { ...event, ...updatedEvent } : event
        )
      );
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  };

  const deleteCalendarEvent = async (id) => {
    try {
      setCalendarEvents(prev => prev.filter(event => event.id !== id));
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
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
        if (daysUntilExpiry >= -30 && daysUntilExpiry <= 365) {
          // Show 30 days past to 1 year future
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

  // Brand Monitoring Functions
  const addMonitoringItem = async (item) => {
    try {
      const configuration = {};
      
      if (item.type === 'trademark') {
        configuration.classes = item.classes || [];
        configuration.includeVariations = item.includeVariations !== false;
      } else if (item.type === 'domain') {
        configuration.extensions = item.extensions || ['.com', '.net', '.org'];
        configuration.includeTypos = item.includeTypos !== false;
      } else if (item.type === 'marketplace') {
        configuration.platforms = item.platforms || ['amazon', 'ebay'];
        configuration.categories = item.categories || [];
      } else if (item.type === 'social') {
        configuration.socialPlatforms = item.socialPlatforms || ['instagram', 'twitter', 'facebook'];
        configuration.includeHashtags = item.includeHashtags !== false;
      }
      
      const newItem = {
        id: `monitor-${Date.now()}`,
        name: item.name,
        type: item.type,
        keywords: item.keywords,
        frequency: item.frequency || 'daily',
        notifications: item.notifications !== false,
        status: 'active',
        lastChecked: null,
        nextCheck: new Date().toISOString(),
        alertCount: 0,
        clientId: item.clientId || null,
        ...configuration,
        createdAt: new Date().toISOString()
      };
      
      setMonitoringItems(prev => [...prev, newItem]);
      
      // Start monitoring immediately for trademark types
      if (newItem.type === 'trademark' && newItem.keywords.length > 0) {
        runManualCheck(newItem.id);
      }
      
      return newItem;
    } catch (error) {
      console.error('Error adding monitoring item:', error);
      throw error;
    }
  };

  const updateMonitoringItem = async (id, updatedItem) => {
    try {
      const configuration = {};
      
      if (updatedItem.type === 'trademark') {
        configuration.classes = updatedItem.classes || [];
        configuration.includeVariations = updatedItem.includeVariations !== false;
      } else if (updatedItem.type === 'domain') {
        configuration.extensions = updatedItem.extensions || ['.com', '.net', '.org'];
        configuration.includeTypos = updatedItem.includeTypos !== false;
      } else if (updatedItem.type === 'marketplace') {
        configuration.platforms = updatedItem.platforms || ['amazon', 'ebay'];
        configuration.categories = updatedItem.categories || [];
      } else if (updatedItem.type === 'social') {
        configuration.socialPlatforms = updatedItem.socialPlatforms || ['instagram', 'twitter', 'facebook'];
        configuration.includeHashtags = updatedItem.includeHashtags !== false;
      }
      
      setMonitoringItems(prev => 
        prev.map(item => 
          item.id === id ? { 
            ...item, 
            ...updatedItem,
            ...configuration 
          } : item
        )
      );
    } catch (error) {
      console.error('Error updating monitoring item:', error);
      throw error;
    }
  };

  const deleteMonitoringItem = async (id) => {
    try {
      setMonitoringItems(prev => prev.filter(item => item.id !== id));
      setMonitoringAlerts(prev => prev.filter(alert => alert.monitoringItemId !== id));
    } catch (error) {
      console.error('Error deleting monitoring item:', error);
      throw error;
    }
  };

  const runManualCheck = async (id) => {
    const item = monitoringItems.find(m => m.id === id);
    if (!item) return;

    // Update status to checking
    setMonitoringItems(prev => prev.map(m => m.id === id ? { ...m, status: 'checking' } : m));
    
    try {
      const result = await monitoringService.startMonitoring(item);
      if (result.success) {
        const checkedAt = new Date().toISOString();
        const nextCheck = result.nextCheck?.toISOString();
        
        setMonitoringItems(prev => prev.map(m => m.id === id ? {
          ...m,
          lastChecked: checkedAt,
          nextCheck,
          status: 'active',
          alertCount: (m.alertCount || 0) + result.alerts.length,
          lastResults: result.results
        } : m));

        // Add new monitoring alerts
        if (result.alerts.length > 0) {
          const newAlerts = result.alerts.map(alert => ({
            id: `alert-${Date.now()}-${Math.random()}`,
            type: alert.type,
            priority: alert.priority || alert.severity || 'medium',
            title: alert.title,
            description: alert.description,
            keyword: alert.keyword,
            platform: alert.platform,
            monitoringItemId: id,
            monitoringItemName: item.name,
            detectedAt: alert.detectedAt || checkedAt,
            data: alert.data || {},
            actionRequired: alert.actionRequired,
            createdAt: checkedAt
          }));
          
          setMonitoringAlerts(prev => [...prev, ...newAlerts]);
        }
        
        console.log(`Monitoring check completed for "${item.name}": ${result.alerts.length} new alerts`);
      } else {
        setMonitoringItems(prev => prev.map(m => m.id === id ? {
          ...m,
          status: 'error',
          lastError: result.error
        } : m));
      }
    } catch (error) {
      console.error('Manual check failed:', error);
      
      setMonitoringItems(prev => prev.map(m => m.id === id ? {
        ...m,
        status: 'error',
        lastError: error.message
      } : m));
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
      activeMonitoring: monitoringItems.filter(item => item.status === 'active').length,
    };
  };

  // Dismiss monitoring alert
  const dismissMonitoringAlert = async (alertId) => {
    try {
      setMonitoringAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Error dismissing monitoring alert:', error);
    }
  };

  const dismissAlert = async (alertId) => {
    try {
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      setSettings(prev => ({ ...prev, ...newSettings }));
      
      // Regenerate alerts with new settings
      generateAlertsFromData(assets, matters);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const getAssetStats = () => {
    const total = assets.length;
    const active = assets.filter(asset => {
      if (!asset.expiryDate) return true;
      return isAfter(new Date(asset.expiryDate), new Date());
    }).length;
    const expired = total - active;
    const criticalAlerts = alerts.filter(alert => alert.priority === 'critical').length;
    
    return {
      total,
      active,
      expired,
      criticalAlerts
    };
  };

  const getClientStats = () => {
    const totalClients = clients.length;
    const activeClients = clients.filter(client => client.status === 'active').length;
    const assetsPerClient = totalClients > 0 ? (assets.length / totalClients).toFixed(1) : 0;
    
    return {
      totalClients,
      activeClients,
      assetsPerClient
    };
  };

  const getTaskStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const overdueTasks = tasks.filter(task => 
      !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
    ).length;
    
    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks
    };
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
    
    return {
      totalMatters,
      activeMatters,
      urgentMatters,
      overdueMatters
    };
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
    isLoading,
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