import React, { useState } from 'react';
import { Plus, Check, X, Calendar, Flame, Target } from 'lucide-react';
import { useHabits } from '../hooks/useHabits';
import { Habit } from '../types';
import { format, subDays, isToday, parseISO } from 'date-fns';

const HabitTracker: React.FC = () => {
  const { habits, addHabit, deleteHabit, completeHabit, uncompleteHabit, isHabitCompletedToday } = useHabits();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({
    title: '',
    description: '',
    category: 'health' as Habit['category'],
    frequency: 'daily' as Habit['frequency'],
    targetCount: 1,
    color: '#8b5cf6',
  });

  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.title.trim()) {
      addHabit({
        ...newHabit,
        isActive: true,
      });
      setNewHabit({
        title: '',
        description: '',
        category: 'health',
        frequency: 'daily',
        targetCount: 1,
        color: '#8b5cf6',
      });
      setIsCreateModalOpen(false);
    }
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600';
    if (streak >= 14) return 'text-blue-600';
    if (streak >= 7) return 'text-green-600';
    if (streak >= 3) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Habit Tracker</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Habit
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <Target className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-500 dark:text-gray-400 mb-4">No habits yet</h3>
          <p className="text-gray-400 dark:text-gray-500 mb-8 max-w-md mx-auto">
            Start building positive habits that will transform your daily routine and help you achieve your goals.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300"
          >
            Create Your First Habit
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {habits.map((habit) => (
            <div key={habit.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{habit.title}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 capitalize">
                      {habit.frequency}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{habit.description}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className={`flex items-center gap-1 ${getStreakColor(habit.currentStreak)}`}>
                      <Flame className="h-4 w-4" />
                      <span className="font-bold">{habit.currentStreak}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Current</span>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-purple-600 dark:text-purple-400 font-bold">
                      {habit.longestStreak}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Best</span>
                  </div>
                  
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* 7-day tracker */}
              <div className="flex items-center gap-2">
                {last7Days.map((date) => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const isCompleted = habit.completedDates.includes(dateStr);
                  const isCurrentDay = isToday(date);
                  
                  return (
                    <button
                      key={dateStr}
                      onClick={() => {
                        if (isCurrentDay) {
                          if (isCompleted) {
                            uncompleteHabit(habit.id);
                          } else {
                            completeHabit(habit.id);
                          }
                        }
                      }}
                      disabled={!isCurrentDay}
                      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : isCurrentDay
                          ? 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-400'
                          : 'border-gray-200 dark:border-gray-700 opacity-50'
                      } ${isCurrentDay ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {format(date, 'd')}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Habit Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Habit</h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateHabit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Habit Name
                  </label>
                  <input
                    type="text"
                    value={newHabit.title}
                    onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Drink 8 glasses of water"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newHabit.description}
                    onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Why is this habit important to you?"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={newHabit.category}
                      onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value as Habit['category'] })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="health">Health</option>
                      <option value="personal">Personal</option>
                      <option value="career">Career</option>
                      <option value="learning">Learning</option>
                      <option value="creativity">Creativity</option>
                      <option value="mindfulness">Mindfulness</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Frequency
                    </label>
                    <select
                      value={newHabit.frequency}
                      onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value as Habit['frequency'] })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color
                  </label>
                  <div className="flex gap-2">
                    {['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewHabit({ ...newHabit, color })}
                        className={`w-8 h-8 rounded-full border-2 ${
                          newHabit.color === color ? 'border-gray-400' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300"
                  >
                    Create Habit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitTracker;