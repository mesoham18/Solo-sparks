import React, { useState } from 'react';
import { Plus, Target, Trophy, Calendar, User, LogOut, BarChart3, CheckSquare, Lightbulb, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useQuests } from '../hooks/useQuests';
import QuestCard from './QuestCard';
import CreateQuestModal from './CreateQuestModal';
import UserProfile from './UserProfile';
import AnalyticsDashboard from './AnalyticsDashboard';
import HabitTracker from './HabitTracker';
import QuestTemplates from './QuestTemplates';
import ThemeToggle from './ThemeToggle';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { quests, addQuest, updateQuest, deleteQuest, completeQuest } = useQuests();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quests' | 'habits' | 'analytics' | 'templates' | 'profile'>('dashboard');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const activeQuests = quests.filter(q => q.status === 'active');
  const completedQuests = quests.filter(q => q.status === 'completed');

  const stats = [
    {
      title: 'Active Quests',
      value: activeQuests.length,
      icon: Target,
      color: 'bg-blue-500',
      trend: '+2 this week'
    },
    {
      title: 'Completed',
      value: completedQuests.length,
      icon: Trophy,
      color: 'bg-green-500',
      trend: '+5 this month'
    },
    {
      title: 'Total Points',
      value: user?.stats.totalPoints || 0,
      icon: Calendar,
      color: 'bg-purple-500',
      trend: `Level ${user?.level || 1}`
    },
    {
      title: 'Current Streak',
      value: user?.stats.currentStreak || 0,
      icon: CheckSquare,
      color: 'bg-orange-500',
      trend: `Best: ${user?.stats.longestStreak || 0}`
    },
  ];

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'quests', label: 'Quests', icon: Target },
    { id: 'habits', label: 'Habits', icon: CheckSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'templates', label: 'Templates', icon: Lightbulb },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
            <p className="text-purple-100 text-lg">
              You're on level {user?.level} with {user?.experience} XP. Keep growing!
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
            <div className="text-purple-200">{new Date().toLocaleDateString()}</div>
          </div>
        </div>
        
        {/* Experience Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Level {user?.level}</span>
            <span>{(user?.experience || 0) % 1000}/1000 XP</span>
          </div>
          <div className="w-full bg-purple-700/30 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((user?.experience || 0) % 1000) / 10}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{stat.trend}</p>
              </div>
              <div className={`${stat.color} rounded-full p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-400 dark:hover:border-purple-400 transition-colors group"
          >
            <Plus className="h-8 w-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
            <span className="text-gray-600 dark:text-gray-400 group-hover:text-purple-500 font-medium">
              Create New Quest
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('templates')}
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-400 transition-colors group"
          >
            <Lightbulb className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
            <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-500 font-medium">
              Browse Templates
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('habits')}
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-400 dark:hover:border-green-400 transition-colors group"
          >
            <CheckSquare className="h-8 w-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
            <span className="text-gray-600 dark:text-gray-400 group-hover:text-green-500 font-medium">
              Track Habits
            </span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Quests</h2>
          <button
            onClick={() => setActiveTab('quests')}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
          >
            View All
          </button>
        </div>
        
        {activeQuests.length === 0 ? (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">No active quests</h3>
            <p className="text-gray-400 dark:text-gray-500 mb-6">Start your growth journey by creating your first quest!</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300"
            >
              Create Your First Quest
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeQuests.slice(0, 6).map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onUpdate={updateQuest}
                onDelete={deleteQuest}
                onComplete={completeQuest}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderQuests = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">All Quests</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Quest
        </button>
      </div>

      {/* Active Quests */}
      {activeQuests.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Active Quests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onUpdate={updateQuest}
                onDelete={deleteQuest}
                onComplete={completeQuest}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Quests */}
      {completedQuests.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Completed Quests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onUpdate={updateQuest}
                onDelete={deleteQuest}
                onComplete={completeQuest}
              />
            ))}
          </div>
        </div>
      )}

      {quests.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <Target className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-500 dark:text-gray-400 mb-4">No quests yet</h3>
          <p className="text-gray-400 dark:text-gray-500 mb-8 max-w-md mx-auto">
            Ready to start your personal growth journey? Create your first quest and begin transforming your life!
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300"
          >
            Create Your First Quest
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Solo Sparks
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    activeTab === item.id
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium hidden sm:block">{user?.name}</span>
              </div>
              
              <button
                onClick={logout}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto px-4 py-2 space-x-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'quests' && renderQuests()}
        {activeTab === 'habits' && <HabitTracker />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'templates' && <QuestTemplates />}
        {activeTab === 'profile' && <UserProfile />}
      </main>

      {/* Create Quest Modal */}
      <CreateQuestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={addQuest}
      />
    </div>
  );
};

export default Dashboard;