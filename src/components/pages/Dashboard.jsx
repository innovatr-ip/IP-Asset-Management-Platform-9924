import React from 'react';
import { motion } from 'framer-motion';
import { useIP } from '../../context/IPContext';
import StatsCard from '../ui/StatsCard';
import RecentAssets from '../ui/RecentAssets';
import AlertsOverview from '../ui/AlertsOverview';
import IPChart from '../ui/IPChart';
import ClientsOverview from '../ui/ClientsOverview';
import TasksOverview from '../ui/TasksOverview';
import MattersOverview from '../ui/MattersOverview';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFolder, FiCheckCircle, FiAlertTriangle, FiBell, FiUsers, FiCheckSquare, FiFileText } = FiIcons;

const Dashboard = () => {
  const { getAssetStats, getClientStats, getTaskStats, getMatterStats, assets, alerts, clients, tasks, matters } = useIP();
  const assetStats = getAssetStats();
  const clientStats = getClientStats();
  const taskStats = getTaskStats();
  const matterStats = getMatterStats();

  const recentAssets = assets
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const urgentAlerts = alerts
    .filter(alert => alert.priority === 'high' || alert.priority === 'critical')
    .slice(0, 3);

  const recentClients = clients
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const recentTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return new Date(b.createdAt) - new Date(a.createdAt);
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    })
    .slice(0, 5);

  const recentMatters = matters
    .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            IP Portfolio Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor and manage your intellectual property assets, clients, matters, and tasks
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 mb-8"
        >
          <StatsCard
            title="Total Assets"
            value={assetStats.total}
            icon={FiFolder}
            color="blue"
            trend="+12%"
          />
          <StatsCard
            title="Total Clients"
            value={clientStats.totalClients}
            icon={FiUsers}
            color="purple"
            trend="+8%"
          />
          <StatsCard
            title="Active Matters"
            value={matterStats.activeMatters}
            icon={FiFileText}
            color="green"
            trend="+15%"
          />
          <StatsCard
            title="Pending Tasks"
            value={taskStats.pendingTasks}
            icon={FiCheckSquare}
            color="orange"
            trend="+3%"
          />
          <StatsCard
            title="Urgent Matters"
            value={matterStats.urgentMatters}
            icon={FiIcons.FiClock}
            color="orange"
            trend="+2%"
          />
          <StatsCard
            title="Expired Assets"
            value={assetStats.expired}
            icon={FiAlertTriangle}
            color="red"
            trend="-2%"
          />
          <StatsCard
            title="Critical Alerts"
            value={assetStats.criticalAlerts}
            icon={FiBell}
            color="red"
            trend="0%"
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* IP Portfolio Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <IPChart assets={assets} />
            </motion.div>

            {/* Recent Assets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <RecentAssets assets={recentAssets} />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Matters Overview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <MattersOverview matters={recentMatters} />
            </motion.div>

            {/* Tasks Overview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <TasksOverview tasks={recentTasks} />
            </motion.div>

            {/* Alerts Overview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <AlertsOverview alerts={urgentAlerts} />
            </motion.div>

            {/* Clients Overview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <ClientsOverview clients={recentClients} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;