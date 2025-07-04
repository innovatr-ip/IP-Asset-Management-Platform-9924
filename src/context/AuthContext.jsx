import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCurrentUser = localStorage.getItem('auth-current-user');
    const savedUsers = localStorage.getItem('auth-users');
    const savedOrganizations = localStorage.getItem('auth-organizations');
    const savedSubscriptions = localStorage.getItem('auth-subscriptions');
    const savedPackages = localStorage.getItem('auth-packages');

    if (savedCurrentUser) {
      setCurrentUser(JSON.parse(savedCurrentUser));
    }
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    if (savedOrganizations) {
      setOrganizations(JSON.parse(savedOrganizations));
    }
    if (savedSubscriptions) {
      setSubscriptions(JSON.parse(savedSubscriptions));
    }
    if (savedPackages) {
      setPackages(JSON.parse(savedPackages));
    } else {
      // Initialize default packages
      initializeDefaultPackages();
    }

    // Initialize super admin if no users exist
    if (!savedUsers || JSON.parse(savedUsers).length === 0) {
      initializeSuperAdmin();
    }

    setIsLoading(false);
  }, []);

  // Save data to localStorage whenever they change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('auth-current-user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('auth-users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('auth-organizations', JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    localStorage.setItem('auth-subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('auth-packages', JSON.stringify(packages));
  }, [packages]);

  const initializeSuperAdmin = () => {
    const superAdmin = {
      id: 'super-admin-1',
      email: 'admin@innovatr.com',
      password: 'admin123', // In production, this would be hashed
      firstName: 'Super',
      lastName: 'Admin',
      role: 'super_admin',
      status: 'active',
      organizationId: null,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      permissions: ['all']
    };

    setUsers([superAdmin]);
  };

  const initializeDefaultPackages = () => {
    const defaultPackages = [
      {
        id: 'pkg-1',
        name: 'Starter',
        description: 'Perfect for solo practitioners and small firms',
        price: 99,
        billingCycle: 'monthly',
        features: [
          'Up to 100 IP assets',
          'Basic brand monitoring',
          '5 end users',
          'Standard support',
          'Basic reporting'
        ],
        limits: {
          assets: 100,
          endUsers: 5,
          storage: '5GB',
          apiCalls: 1000
        },
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'pkg-2',
        name: 'Professional',
        description: 'Ideal for growing law firms with expanding IP portfolios',
        price: 199,
        billingCycle: 'monthly',
        features: [
          'Up to 500 IP assets',
          'Advanced brand monitoring',
          '15 end users',
          'Priority support',
          'Advanced reporting',
          'API access',
          'White-label options'
        ],
        limits: {
          assets: 500,
          endUsers: 15,
          storage: '25GB',
          apiCalls: 5000
        },
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'pkg-3',
        name: 'Enterprise',
        description: 'For large firms requiring unlimited access and premium features',
        price: 499,
        billingCycle: 'monthly',
        features: [
          'Unlimited IP assets',
          'Premium brand monitoring with AI',
          'Unlimited end users',
          'Dedicated support manager',
          'Custom reporting & analytics',
          'Full API access',
          'Custom integrations',
          'Advanced security features'
        ],
        limits: {
          assets: -1, // unlimited
          endUsers: -1, // unlimited
          storage: '100GB',
          apiCalls: -1 // unlimited
        },
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    setPackages(defaultPackages);
  };

  // Authentication functions
  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password && u.status === 'active');
    if (user) {
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      setCurrentUser(updatedUser);
      
      // Update user's last login
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      
      return { success: true, user: updatedUser };
    }
    return { success: false, error: 'Invalid credentials or account suspended' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('auth-current-user');
  };

  // User management functions
  const createUser = (userData) => {
    const newUser = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      status: 'active'
    };

    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (userId, updates) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates, updatedAt: new Date().toISOString() } : user
    ));
  };

  const suspendUser = (userId) => {
    updateUser(userId, { status: 'suspended' });
  };

  const activateUser = (userId) => {
    updateUser(userId, { status: 'active' });
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  // Organization management functions
  const createOrganization = (orgData) => {
    const newOrg = {
      ...orgData,
      id: `org-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      settings: {
        allowSelfRegistration: false,
        requireApproval: true,
        ...orgData.settings
      }
    };

    setOrganizations(prev => [...prev, newOrg]);
    return newOrg;
  };

  const updateOrganization = (orgId, updates) => {
    setOrganizations(prev => prev.map(org => 
      org.id === orgId ? { ...org, ...updates, updatedAt: new Date().toISOString() } : org
    ));
  };

  const deleteOrganization = (orgId) => {
    // First, remove all users from this organization
    setUsers(prev => prev.filter(user => user.organizationId !== orgId));
    
    // Remove subscriptions for this organization
    setSubscriptions(prev => prev.filter(sub => sub.organizationId !== orgId));
    
    // Remove the organization
    setOrganizations(prev => prev.filter(org => org.id !== orgId));
  };

  // Subscription management functions
  const createSubscription = (subscriptionData) => {
    const newSubscription = {
      ...subscriptionData,
      id: `sub-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      nextBillingDate: calculateNextBillingDate(subscriptionData.billingCycle),
      usageStats: {
        assets: 0,
        endUsers: 0,
        storage: 0,
        apiCalls: 0
      }
    };

    setSubscriptions(prev => [...prev, newSubscription]);
    return newSubscription;
  };

  const updateSubscription = (subId, updates) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === subId ? { ...sub, ...updates, updatedAt: new Date().toISOString() } : sub
    ));
  };

  const cancelSubscription = (subId) => {
    updateSubscription(subId, { 
      status: 'cancelled', 
      cancelledAt: new Date().toISOString() 
    });
  };

  const suspendSubscription = (subId) => {
    updateSubscription(subId, { 
      status: 'suspended', 
      suspendedAt: new Date().toISOString() 
    });
  };

  // Package management functions
  const createPackage = (packageData) => {
    const newPackage = {
      ...packageData,
      id: `pkg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    setPackages(prev => [...prev, newPackage]);
    return newPackage;
  };

  const updatePackage = (pkgId, updates) => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === pkgId ? { ...pkg, ...updates, updatedAt: new Date().toISOString() } : pkg
    ));
  };

  const deletePackage = (pkgId) => {
    setPackages(prev => prev.filter(pkg => pkg.id !== pkgId));
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

  const getUsersByOrganization = (orgId) => {
    return users.filter(user => user.organizationId === orgId);
  };

  const getOrganizationSubscription = (orgId) => {
    return subscriptions.find(sub => sub.organizationId === orgId && sub.status === 'active');
  };

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true;
    return currentUser.permissions?.includes(permission) || false;
  };

  const isWithinLimits = (orgId, limitType, currentUsage) => {
    const subscription = getOrganizationSubscription(orgId);
    if (!subscription) return false;

    const pkg = packages.find(p => p.id === subscription.packageId);
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
    const monthlyRevenue = subscriptions
      .filter(s => s.status === 'active')
      .reduce((total, sub) => {
        const pkg = packages.find(p => p.id === sub.packageId);
        return total + (pkg?.price || 0);
      }, 0);

    return {
      totalUsers,
      activeUsers,
      totalOrganizations,
      activeSubscriptions,
      monthlyRevenue,
      suspendedUsers: users.filter(u => u.status === 'suspended').length,
      cancelledSubscriptions: subscriptions.filter(s => s.status === 'cancelled').length
    };
  };

  const value = {
    // Auth state
    currentUser,
    isLoading,
    
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