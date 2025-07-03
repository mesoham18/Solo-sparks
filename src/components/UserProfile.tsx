import React, { useState } from 'react';
import { User, Mail, Calendar, Trophy, Target, Award, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSave = () => {
    if (user) {
      updateUser(formData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  const achievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Created your first quest',
      icon: '🎯',
      unlocked: (user?.stats.totalQuests || 0) > 0,
    },
    {
      id: 2,
      title: 'Achiever',
      description: 'Completed 5 quests',
      icon: '🏆',
      unlocked: (user?.stats.completedQuests || 0) >= 5,
    },
    {
      id: 3,
      title: 'Dedicated',
      description: 'Completed 10 quests',
      icon: '💎',
      unlocked: (user?.stats.completedQuests || 0) >= 10,
    },
    {
      id: 4,
      title: 'Points Master',
      description: 'Earned 1000 points',
      icon: '⭐',
      unlocked: (user?.stats.totalPoints || 0) >= 1000,
    },
  ];

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <p className="text-purple-100">{user.email}</p>
                <div className="flex items-center mt-2 text-purple-100">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </div>
        
        <div className="px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{user.stats.totalQuests}</div>
              <div className="text-gray-600">Total Quests</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{user.stats.completedQuests}</div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{user.stats.totalPoints}</div>
              <div className="text-gray-600">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{user.stats.currentStreak}</div>
              <div className="text-gray-600">Current Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Achievements
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-6 rounded-xl border-2 transition-all ${
                achievement.unlocked
                  ? 'border-yellow-200 bg-yellow-50 shadow-md'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{achievement.title}</h3>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                {achievement.unlocked && (
                  <div className="mt-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Award className="h-3 w-3 mr-1" />
                      Unlocked
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;