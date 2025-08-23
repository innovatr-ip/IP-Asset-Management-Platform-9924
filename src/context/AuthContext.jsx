import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize demo data
  useEffect(() => {
    initializeDemoData();
  }, []);

  const initializeDemoData = () => {
    // Demo Organizations
    const demoOrganizations = [
      {
        id: 'org-1',
        name: 'Acme Law Firm',
        domain: 'acmelaw.com',
        contactEmail: 'contact@acmelaw.com',
        contactPhone: '+1 (555) 123-4567',
        address: '123 Legal Street, New York, NY 10001',
        description: 'Leading intellectual property law firm specializing in patents and trademarks',
        status: 'active',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'org-2', 
        name: 'TechCorp Legal',
        domain: 'techcorp.com',
        contactEmail: 'legal@techcorp.com',
        contactPhone: '+1 (555) 987-6543',
        address: '456 Innovation Ave, San Francisco, CA 94105',
        description: 'In-house legal team for technology company',
        status: 'active',
        createdAt: '2024-02-01T14:30:00Z'
      }
    ];

    // Demo Packages
    const demoPackages = [
      {
        id: 'pkg-1',
        name: 'Professional',
        description: 'Perfect for small law firms and solo practitioners',
        price: 99,
        billingCycle: 'monthly',
        features: ['Up to 500 IP assets', 'Basic monitoring', 'Email support', 'Standard reporting'],
        limits: { users: 5, assets: 500, monitoring: 10 },
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'pkg-2',
        name: 'Enterprise',
        description: 'Comprehensive solution for large organizations',
        price: 299,
        billingCycle: 'monthly', 
        features: ['Unlimited IP assets', 'Advanced monitoring', 'Priority support', 'Custom reporting', 'API access'],
        limits: { users: 50, assets: -1, monitoring: -1 },
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ];

    // Demo Subscriptions
    const demoSubscriptions = [
      {
        id: 'sub-1',
        organization_id: 'org-1',
        package_id: 'pkg-1',
        billingCycle: 'monthly',
        status: 'active',
        nextBillingDate: '2025-02-01T00:00:00Z',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'sub-2',
        organization_id: 'org-2',
        package_id: 'pkg-2', 
        billingCycle: 'monthly',
        status: 'active',
        nextBillingDate: '2025-02-01T00:00:00Z',
        createdAt: '2024-02-01T14:30:00Z'
      }
    ];

    // Demo Users
    const demoUsers = [
      {
        id: 'user-1',
        email: 'admin@innovatr.com',
        password: 'admin123',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'super_admin',
        status: 'active',
        organizationId: null,
        department: 'Administration',
        jobTitle: 'System Administrator',
        phone: '+1 (555) 000-0001',
        notes: 'System super administrator',
        lastLogin: '2025-01-01T12:00:00Z',
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 'user-2',
        email: 'admin@lawfirm.com',
        password: 'admin123',
        firstName: 'John',
        lastName: 'Smith',
        role: 'org_admin',
        status: 'active',
        organizationId: 'org-1',
        department: 'Legal',
        jobTitle: 'Managing Partner',
        phone: '+1 (555) 123-4567',
        notes: 'Organization administrator for Acme Law Firm',
        lastLogin: '2025-01-01T10:30:00Z',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'user-3',
        email: 'user@lawfirm.com',
        password: 'user123',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'end_user',
        status: 'active',
        organizationId: 'org-1',
        department: 'IP',
        jobTitle: 'IP Paralegal',
        phone: '+1 (555) 123-4568',
        notes: 'IP paralegal specializing in trademark prosecution',
        lastLogin: '2025-01-01T09:15:00Z',
        createdAt: '2024-01-15T11:00:00Z'
      },
      {
        id: 'user-4',
        email: 'demo@innovatr.com',
        password: 'demo123',
        firstName: 'Demo',
        lastName: 'User',
        role: 'end_user',
        status: 'active',
        organizationId: 'org-2',
        department: 'Legal',
        jobTitle: 'IP Counsel',
        phone: '+1 (555) 987-6543',
        notes: 'Demo end user account',
        lastLogin: '2025-01-01T08:45:00Z',
        createdAt: '2024-02-01T14:30:00Z'
      },
      {
        id: 'user-5',
        email: 'admin@techcorp.com',
        password: 'admin123',
        firstName: 'Michael',
        lastName: 'Chen',
        role: 'org_admin',
        status: 'active',
        organizationId: 'org-2',
        department: 'Legal',
        jobTitle: 'Chief Legal Officer',
        phone: '+1 (555) 987-6544',
        notes: 'Organization administrator for TechCorp Legal',
        lastLogin: '2025-01-01T11:20:00Z',
        createdAt: '2024-02-01T14:30:00Z'
      }
    ];

    setOrganizations(demoOrganizations);
    setPackages(demoPackages);
    setSubscriptions(demoSubscriptions);
    setUsers(demoUsers);
    setIsLoading(false);
  };

  // Authentication functions
  const login = async (email, password) => {
    setAuthError(null);
    try {
      // Find user in demo data
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        setAuthError('Invalid email or password');
        return { success: false, error: 'Invalid email or password' };
      }

      if (user.status !== 'active') {
        setAuthError('Account is not active. Please contact your administrator.');
        return { success: false, error: 'Account is not active' };
      }

      // Update last login
      const updatedUsers = users.map(u => 
        u.id === user.id 
          ? { ...u, lastLogin: new Date().toISOString() }
          : u
      );
      setUsers(updatedUsers);

      // Set current user
      const currentUserData = {
        ...user,
        lastLogin: new Date().toISOString()
      };
      setCurrentUser(currentUserData);

      return { success: true, user: currentUserData };
    } catch (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    setAuthError(null);
  };

  // User management functions
  const createUser = async (userData) => {
    try {
      const newUser = {
        id: `user-${Date.now()}`,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        status: userData.status || 'active',
        organizationId: userData.organizationId,
        department: userData.department,
        jobTitle: userData.jobTitle,
        phone: userData.phone,
        notes: userData.notes,
        mustChangePassword: userData.mustChangePassword || false,
        lastLogin: null,
        createdAt: new Date().toISOString()
      };

      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const updateUser = async (userId, updates) => {
    try {
      setUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { 
                ...user, 
                ...updates,
                updatedAt: new Date().toISOString()
              } 
            : user
        )
      );

      // If updating the current user, update the state
      if (userId === currentUser?.id) {
        setCurrentUser(prev => ({
          ...prev,
          ...updates,
          updatedAt: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const suspendUser = async (userId) => {
    await updateUser(userId, { status: 'suspended' });
  };

  const activateUser = async (userId) => {
    await updateUser(userId, { status: 'active' });
  };

  const deleteUser = async (userId) => {
    try {
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  // Organization management functions
  const createOrganization = async (orgData) => {
    try {
      const newOrg = {
        id: `org-${Date.now()}`,
        name: orgData.name,
        domain: orgData.domain,
        contactEmail: orgData.contactEmail,
        contactPhone: orgData.contactPhone,
        address: orgData.address,
        description: orgData.description,
        status: orgData.status || 'active',
        createdAt: new Date().toISOString()
      };

      setOrganizations(prev => [...prev, newOrg]);
      return newOrg;
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  };

  const updateOrganization = async (orgId, updates) => {
    try {
      setOrganizations(prev => 
        prev.map(org => 
          org.id === orgId 
            ? { ...org, ...updates, updatedAt: new Date().toISOString() }
            : org
        )
      );
    } catch (error) {
      console.error('Error updating organization:', error);
      throw error;
    }
  };

  const deleteOrganization = async (orgId) => {
    try {
      // Check for users in this organization
      const orgUsers = getUsersByOrganization(orgId);
      
      if (orgUsers.length > 0) {
        throw new Error('Cannot delete organization with existing users. Please remove or transfer users first.');
      }

      setOrganizations(prev => prev.filter(org => org.id !== orgId));
    } catch (error) {
      console.error('Error deleting organization:', error);
      throw error;
    }
  };

  const getUsersByOrganization = (orgId) => {
    return users.filter(user => user.organizationId === orgId);
  };

  // Subscription management functions
  const createSubscription = async (subscriptionData) => {
    try {
      const nextBillingDate = calculateNextBillingDate(subscriptionData.billingCycle);
      
      const newSubscription = {
        id: `sub-${Date.now()}`,
        organization_id: subscriptionData.organizationId,
        package_id: subscriptionData.packageId,
        billingCycle: subscriptionData.billingCycle,
        status: subscriptionData.status || 'active',
        nextBillingDate,
        createdAt: new Date().toISOString()
      };

      setSubscriptions(prev => [...prev, newSubscription]);
      return newSubscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  };

  const updateSubscription = async (subId, updates) => {
    try {
      const nextBillingDate = updates.billingCycle 
        ? calculateNextBillingDate(updates.billingCycle) 
        : undefined;

      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subId 
            ? { 
                ...sub, 
                ...updates,
                nextBillingDate: nextBillingDate || sub.nextBillingDate,
                updatedAt: new Date().toISOString()
              }
            : sub
        )
      );
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  };

  const cancelSubscription = async (subId) => {
    try {
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subId 
            ? { 
                ...sub, 
                status: 'cancelled',
                cancelledAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            : sub
        )
      );
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  };

  const suspendSubscription = async (subId) => {
    try {
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subId 
            ? { 
                ...sub, 
                status: 'suspended',
                suspendedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            : sub
        )
      );
    } catch (error) {
      console.error('Error suspending subscription:', error);
      throw error;
    }
  };

  // Package management functions
  const createPackage = async (packageData) => {
    try {
      const newPackage = {
        id: `pkg-${Date.now()}`,
        name: packageData.name,
        description: packageData.description,
        price: packageData.price,
        billingCycle: packageData.billingCycle,
        features: packageData.features,
        limits: packageData.limits,
        isActive: packageData.isActive !== false,
        createdAt: new Date().toISOString()
      };

      setPackages(prev => [...prev, newPackage]);
      return newPackage;
    } catch (error) {
      console.error('Error creating package:', error);
      throw error;
    }
  };

  const updatePackage = async (pkgId, updates) => {
    try {
      setPackages(prev => 
        prev.map(pkg => 
          pkg.id === pkgId 
            ? { ...pkg, ...updates, updatedAt: new Date().toISOString() }
            : pkg
        )
      );
    } catch (error) {
      console.error('Error updating package:', error);
      throw error;
    }
  };

  const deletePackage = async (pkgId) => {
    try {
      // Check for subscriptions using this package
      const packageSubs = subscriptions.filter(sub => 
        sub.package_id === pkgId && sub.status === 'active'
      );
      
      if (packageSubs.length > 0) {
        throw new Error('Cannot delete package with active subscriptions. Please migrate or cancel subscriptions first.');
      }

      setPackages(prev => prev.filter(pkg => pkg.id !== pkgId));
    } catch (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  };

  // Utility functions
  const calculateNextBillingDate = (billingCycle) => {
    const now = new Date();
    switch (billingCycle) {
      case 'monthly':
        return new Date(now.setMonth(now.getMonth() + 1)).toISOString();
      case 'quarterly':
        return new Date(now.setMonth(now.getMonth() + 3)).toISOString();
      case 'annually':
        return new Date(now.setFullYear(now.getFullYear() + 1)).toISOString();
      default:
        return new Date(now.setMonth(now.getMonth() + 1)).toISOString();
    }
  };

  const getOrganizationSubscription = (orgId) => {
    return subscriptions.find(sub => sub.organization_id === orgId && sub.status === 'active');
  };

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true;
    return currentUser.permissions?.includes(permission) || false;
  };

  const isWithinLimits = (orgId, limitType, currentUsage) => {
    const subscription = getOrganizationSubscription(orgId);
    if (!subscription) return false;
    
    const pkg = packages.find(p => p.id === subscription.package_id);
    if (!pkg) return false;
    
    const limit = pkg.limits[limitType];
    if (limit === -1) return true; // unlimited
    return currentUsage < limit;
  };

  // Statistics functions
  const getSystemStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const totalOrganizations = organizations.length;
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
    const cancelledSubscriptions = subscriptions.filter(s => s.status === 'cancelled').length;
    
    const monthlyRevenue = subscriptions
      .filter(s => s.status === 'active')
      .reduce((total, sub) => {
        const pkg = packages.find(p => p.id === sub.package_id);
        return total + (pkg?.price || 0);
      }, 0);

    return {
      totalUsers,
      activeUsers,
      totalOrganizations,
      activeSubscriptions,
      monthlyRevenue,
      suspendedUsers: users.filter(u => u.status === 'suspended').length,
      cancelledSubscriptions
    };
  };

  const value = {
    // Auth state
    currentUser,
    isLoading,
    authError,
    // Data
    users,
    organizations,
    subscriptions,
    packages,
    // Auth functions
    login,
    logout,
    // User management
    createUser,
    updateUser,
    suspendUser,
    activateUser,
    deleteUser,
    // Organization management
    createOrganization,
    updateOrganization,
    deleteOrganization,
    getUsersByOrganization,
    // Subscription management
    createSubscription,
    updateSubscription,
    cancelSubscription,
    suspendSubscription,
    getOrganizationSubscription,
    // Package management
    createPackage,
    updatePackage,
    deletePackage,
    // Utility functions
    hasPermission,
    isWithinLimits,
    getSystemStats
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};