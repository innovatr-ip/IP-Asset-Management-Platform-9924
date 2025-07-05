import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const SupabaseAuthContext = createContext();

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

export const SupabaseAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadInitialData();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserData(session.user.id);
        } else {
          setCurrentUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is already logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserData(session.user.id);
      }
      
      // Load organizations and packages
      await Promise.all([
        loadOrganizations(),
        loadPackages(),
        loadUsers(),
        loadSubscriptions()
      ]);
      
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async (userId) => {
    try {
      const { data: userData, error } = await supabase
        .from('users_ip8472')
        .select('*')
        .eq('auth_user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setCurrentUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users_ip8472')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations_ip8472')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error loading organizations:', error);
    }
  };

  const loadPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages_ip8472')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error loading packages:', error);
    }
  };

  const loadSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions_ip8472')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    }
  };

  // Authentication functions
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        await loadUserData(data.user.id);
        return { success: true, user: data.user };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // User management functions
  const createUser = async (userData) => {
    try {
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true
      });

      if (authError) throw authError;

      // Create user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users_ip8472')
        .insert({
          auth_user_id: authData.user.id,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role,
          organization_id: userData.organizationId,
          status: userData.status || 'active',
          phone: userData.phone,
          department: userData.department,
          job_title: userData.jobTitle,
          notes: userData.notes
        })
        .select()
        .single();

      if (profileError) throw profileError;

      await loadUsers();
      return profileData;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const updateUser = async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('users_ip8472')
        .update({
          first_name: updates.firstName,
          last_name: updates.lastName,
          email: updates.email,
          phone: updates.phone,
          role: updates.role,
          status: updates.status,
          department: updates.department,
          job_title: updates.jobTitle,
          notes: updates.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      await loadUsers();
      
      // Update current user if it's the same user
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(data);
      }
      
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const suspendUser = async (userId) => {
    return updateUser(userId, { status: 'suspended' });
  };

  const activateUser = async (userId) => {
    return updateUser(userId, { status: 'active' });
  };

  const deleteUser = async (userId) => {
    try {
      const { error } = await supabase
        .from('users_ip8472')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  // Organization management
  const createOrganization = async (orgData) => {
    try {
      const { data, error } = await supabase
        .from('organizations_ip8472')
        .insert({
          name: orgData.name,
          domain: orgData.domain,
          contact_email: orgData.contactEmail,
          contact_phone: orgData.contactPhone,
          address: orgData.address,
          description: orgData.description,
          status: orgData.status || 'active'
        })
        .select()
        .single();

      if (error) throw error;
      await loadOrganizations();
      return data;
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  };

  const updateOrganization = async (orgId, updates) => {
    try {
      const { data, error } = await supabase
        .from('organizations_ip8472')
        .update({
          name: updates.name,
          domain: updates.domain,
          contact_email: updates.contactEmail,
          contact_phone: updates.contactPhone,
          address: updates.address,
          description: updates.description,
          status: updates.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orgId)
        .select()
        .single();

      if (error) throw error;
      await loadOrganizations();
      return data;
    } catch (error) {
      console.error('Error updating organization:', error);
      throw error;
    }
  };

  const deleteOrganization = async (orgId) => {
    try {
      const { error } = await supabase
        .from('organizations_ip8472')
        .delete()
        .eq('id', orgId);

      if (error) throw error;
      await loadOrganizations();
    } catch (error) {
      console.error('Error deleting organization:', error);
      throw error;
    }
  };

  // Package management
  const createPackage = async (packageData) => {
    try {
      const { data, error } = await supabase
        .from('packages_ip8472')
        .insert({
          name: packageData.name,
          description: packageData.description,
          price: packageData.price,
          billing_cycle: packageData.billingCycle,
          features: packageData.features,
          limits: packageData.limits,
          is_active: packageData.isActive
        })
        .select()
        .single();

      if (error) throw error;
      await loadPackages();
      return data;
    } catch (error) {
      console.error('Error creating package:', error);
      throw error;
    }
  };

  const updatePackage = async (pkgId, updates) => {
    try {
      const { data, error } = await supabase
        .from('packages_ip8472')
        .update({
          name: updates.name,
          description: updates.description,
          price: updates.price,
          billing_cycle: updates.billingCycle,
          features: updates.features,
          limits: updates.limits,
          is_active: updates.isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', pkgId)
        .select()
        .single();

      if (error) throw error;
      await loadPackages();
      return data;
    } catch (error) {
      console.error('Error updating package:', error);
      throw error;
    }
  };

  const deletePackage = async (pkgId) => {
    try {
      const { error } = await supabase
        .from('packages_ip8472')
        .delete()
        .eq('id', pkgId);

      if (error) throw error;
      await loadPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  };

  // Subscription management
  const createSubscription = async (subscriptionData) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions_ip8472')
        .insert({
          organization_id: subscriptionData.organizationId,
          package_id: subscriptionData.packageId,
          billing_cycle: subscriptionData.billingCycle,
          status: subscriptionData.status || 'active',
          next_billing_date: calculateNextBillingDate(subscriptionData.billingCycle)
        })
        .select()
        .single();

      if (error) throw error;
      await loadSubscriptions();
      return data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  };

  const updateSubscription = async (subId, updates) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions_ip8472')
        .update({
          organization_id: updates.organizationId,
          package_id: updates.packageId,
          billing_cycle: updates.billingCycle,
          status: updates.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', subId)
        .select()
        .single();

      if (error) throw error;
      await loadSubscriptions();
      return data;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  };

  const cancelSubscription = async (subId) => {
    return updateSubscription(subId, { status: 'cancelled' });
  };

  const suspendSubscription = async (subId) => {
    return updateSubscription(subId, { status: 'suspended' });
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
    return users.filter(user => user.organization_id === orgId);
  };

  const getOrganizationSubscription = (orgId) => {
    return subscriptions.find(sub => sub.organization_id === orgId && sub.status === 'active');
  };

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true;
    return currentUser.permissions?.includes(permission) || false;
  };

  const getSystemStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const totalOrganizations = organizations.length;
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
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
    getSystemStats
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};