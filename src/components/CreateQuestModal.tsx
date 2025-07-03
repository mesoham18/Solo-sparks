import React, { useState } from 'react';
import { X, Target, Plus, Minus, Calendar, Flag, Tag } from 'lucide-react';
import { Quest, Milestone } from '../types';

interface CreateQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (quest: Omit<Quest, 'id' | 'userId' | 'createdAt'>) => void;
}

const CreateQuestModal: React.FC<CreateQuestModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal' as Quest['category'],
    difficulty: 'medium' as Quest['difficulty'],
    priority: 'medium' as Quest['priority'],
    points: 100,
    dueDate: '',
    estimatedDuration: 7,
    notes: '',
    tags: [] as string[],
    isPublic: false,
  });
  
  const [milestones, setMilestones] = useState<Omit<Milestone, 'id' | 'completed' | 'completedAt'>[]>([]);
  const [newTag, setNewTag] = useState('');

  const categories = [
    { value: 'personal', label: 'Personal Growth' },
    { value: 'health', label: 'Health & Fitness' },
    { value: 'career', label: 'Career Development' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'learning', label: 'Learning & Education' },
    { value: 'creativity', label: 'Creativity & Arts' },
    { value: 'finance', label: 'Finance' },
    { value: 'mindfulness', label: 'Mindfulness' },
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy', points: 50 },
    { value: 'medium', label: 'Medium', points: 100 },
    { value: 'hard', label: 'Hard', points: 200 },
    { value: 'expert', label: 'Expert', points: 300 },
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const questMilestones: Milestone[] = milestones.map((milestone, index) => ({
      ...milestone,
      id: Date.now().toString() + index,
      completed: false,
    }));

    const quest: Omit<Quest, 'id' | 'userId' | 'createdAt'> = {
      ...formData,
      status: 'active',
      progress: 0,
      milestones: questMilestones,
      collaborators: [],
      attachments: [],
    };

    onSubmit(quest);
    onClose();
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: 'personal',
      difficulty: 'medium',
      priority: 'medium',
      points: 100,
      dueDate: '',
      estimatedDuration: 7,
      notes: '',
      tags: [],
      isPublic: false,
    });
    setMilestones([]);
    setNewTag('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              name === 'points' || name === 'estimatedDuration' ? parseInt(value) || 0 : value,
    }));
  };

  const handleDifficultyChange = (difficulty: Quest['difficulty']) => {
    const difficultyData = difficulties.find(d => d.value === difficulty);
    setFormData(prev => ({
      ...prev,
      difficulty,
      points: difficultyData?.points || 100,
    }));
  };

  const addMilestone = () => {
    setMilestones(prev => [...prev, { title: '', description: '', priority: 'medium' }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(prev => prev.filter((_, i) => i !== index));
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    setMilestones(prev => prev.map((milestone, i) => 
      i === index ? { ...milestone, [field]: value } : milestone
    ));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Quest</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quest Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your quest title"
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Describe your quest and what you want to achieve"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {difficulties.map(difficulty => (
                    <button
                      key={difficulty.value}
                      type="button"
                      onClick={() => handleDifficultyChange(difficulty.value)}
                      className={`py-2 px-3 rounded-lg border font-medium text-sm transition-all ${
                        formData.difficulty === difficulty.value
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400'
                      }`}
                    >
                      {difficulty.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Points ({formData.points})
                </label>
                <input
                  type="range"
                  name="points"
                  min="10"
                  max="500"
                  step="10"
                  value={formData.points}
                  onChange={handleInputChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>10</span>
                  <span>500</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estimated Duration (days)
                </label>
                <input
                  type="number"
                  name="estimatedDuration"
                  value={formData.estimatedDuration}
                  onChange={handleInputChange}
                  min="1"
                  max="365"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm rounded-full flex items-center gap-2"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add a tag"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Additional notes or thoughts about this quest"
              />
            </div>

            {/* Milestones */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Milestones (Optional)
                </label>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Milestone
                </button>
              </div>
              
              {milestones.map((milestone, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">Milestone {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Milestone title"
                      value={milestone.title}
                      onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <textarea
                      placeholder="Milestone description"
                      value={milestone.description}
                      onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <select
                      value={milestone.priority}
                      onChange={(e) => updateMilestone(index, 'priority', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {/* Settings */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quest Settings</h3>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700 dark:text-gray-300">
                  Make this quest public (visible to other users)
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Create Quest
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestModal;