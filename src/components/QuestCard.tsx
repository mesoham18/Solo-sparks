import React, { useState } from 'react';
import { CheckCircle, Clock, Target, MoreHorizontal, Edit, Trash2, Play, Pause, Copy, Archive, Flag, Calendar, Tag } from 'lucide-react';
import { Quest } from '../types';

interface QuestCardProps {
  quest: Quest;
  onUpdate: (questId: string, updates: Partial<Quest>) => void;
  onDelete: (questId: string) => void;
  onComplete: (questId: string) => void;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest, onUpdate, onDelete, onComplete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors = {
      health: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      career: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      relationships: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
      personal: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      learning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      creativity: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      finance: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      mindfulness: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'text-green-600 dark:text-green-400',
      medium: 'text-yellow-600 dark:text-yellow-400',
      hard: 'text-red-600 dark:text-red-400',
      expert: 'text-purple-600 dark:text-purple-400',
    };
    return colors[difficulty as keyof typeof colors] || 'text-gray-600 dark:text-gray-400';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-gray-500 dark:text-gray-400',
      medium: 'text-blue-600 dark:text-blue-400',
      high: 'text-orange-600 dark:text-orange-400',
      urgent: 'text-red-600 dark:text-red-400',
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600 dark:text-gray-400';
  };

  const handleProgressUpdate = (newProgress: number) => {
    onUpdate(quest.id, { progress: Math.max(0, Math.min(100, newProgress)) });
  };

  const handleStatusToggle = () => {
    const newStatus = quest.status === 'active' ? 'paused' : 'active';
    onUpdate(quest.id, { status: newStatus });
  };

  const handleArchive = () => {
    onUpdate(quest.id, { status: 'archived' });
    setShowMenu(false);
  };

  const completedMilestones = quest.milestones.filter(m => m.completed).length;
  const totalMilestones = quest.milestones.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(quest.category)}`}>
                {quest.category}
              </span>
              <span className={`text-xs font-medium ${getDifficultyColor(quest.difficulty)}`}>
                {quest.difficulty}
              </span>
              <span className={`text-xs font-medium ${getPriorityColor(quest.priority)}`}>
                <Flag className="h-3 w-3 inline mr-1" />
                {quest.priority}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{quest.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{quest.description}</p>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-2 z-10 min-w-[140px]">
                <button
                  onClick={() => {
                    handleStatusToggle();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"
                >
                  {quest.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {quest.status === 'active' ? 'Pause' : 'Resume'}
                </button>
                <button
                  onClick={() => {
                    handleArchive();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2"
                >
                  <Archive className="h-4 w-4" />
                  Archive
                </button>
                <button
                  onClick={() => {
                    onDelete(quest.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {quest.tags && quest.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {quest.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full flex items-center gap-1"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
            {quest.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">
                +{quest.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{quest.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${quest.progress}%` }}
            />
          </div>
        </div>

        {/* Milestones */}
        {totalMilestones > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Milestones</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {completedMilestones}/{totalMilestones}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
              <div
                className="bg-green-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Progress Controls */}
        {quest.status === 'active' && quest.progress < 100 && (
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => handleProgressUpdate(quest.progress - 10)}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              disabled={quest.progress <= 0}
            >
              -10%
            </button>
            <button
              onClick={() => handleProgressUpdate(quest.progress + 10)}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              disabled={quest.progress >= 100}
            >
              +10%
            </button>
          </div>
        )}

        {/* Due Date */}
        {quest.dueDate && (
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>Due: {new Date(quest.dueDate).toLocaleDateString()}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {quest.status === 'completed' ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : quest.status === 'paused' ? (
              <Pause className="h-5 w-5 text-yellow-500" />
            ) : quest.status === 'archived' ? (
              <Archive className="h-5 w-5 text-gray-500" />
            ) : (
              <Clock className="h-5 w-5 text-blue-500" />
            )}
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
              {quest.status}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
              {quest.points} pts
            </span>
            
            {quest.status === 'active' && quest.progress >= 100 && (
              <button
                onClick={() => onComplete(quest.id)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
              >
                Complete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestCard;