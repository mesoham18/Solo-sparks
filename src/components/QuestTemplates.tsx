import React, { useState } from 'react';
import { Search, Filter, Star, Clock, Users, Plus } from 'lucide-react';
import { QuestTemplate, Quest } from '../types';
import { useQuests } from '../hooks/useQuests';

const QuestTemplates: React.FC = () => {
  const { addQuest } = useQuests();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Mock quest templates - in a real app, these would come from an API
  const questTemplates: QuestTemplate[] = [
    {
      id: '1',
      title: '30-Day Fitness Challenge',
      description: 'Build a consistent exercise routine with progressive workouts',
      category: 'health',
      difficulty: 'medium',
      estimatedDuration: 30,
      popularity: 95,
      tags: ['fitness', 'health', 'routine'],
      milestones: [
        { title: 'Complete Week 1', description: 'Finish first 7 days of workouts', priority: 'high' },
        { title: 'Reach Halfway Point', description: 'Complete 15 days of consistent exercise', priority: 'medium' },
        { title: 'Final Week Push', description: 'Complete the last 7 days strong', priority: 'high' },
      ]
    },
    {
      id: '2',
      title: 'Learn a New Language',
      description: 'Master basic conversational skills in your chosen language',
      category: 'learning',
      difficulty: 'hard',
      estimatedDuration: 90,
      popularity: 88,
      tags: ['language', 'education', 'communication'],
      milestones: [
        { title: 'Learn Basic Vocabulary', description: 'Master 100 essential words', priority: 'high' },
        { title: 'Grammar Fundamentals', description: 'Understand basic sentence structure', priority: 'medium' },
        { title: 'First Conversation', description: 'Have a 5-minute conversation', priority: 'high' },
      ]
    },
    {
      id: '3',
      title: 'Digital Detox Challenge',
      description: 'Reduce screen time and reconnect with the real world',
      category: 'mindfulness',
      difficulty: 'medium',
      estimatedDuration: 21,
      popularity: 76,
      tags: ['mindfulness', 'wellness', 'balance'],
      milestones: [
        { title: 'Phone-Free Mornings', description: 'No phone for first hour of each day', priority: 'high' },
        { title: 'Social Media Break', description: 'Avoid social media for one week', priority: 'medium' },
        { title: 'Tech-Free Evening', description: 'No screens 2 hours before bed', priority: 'high' },
      ]
    },
    {
      id: '4',
      title: 'Creative Writing Journey',
      description: 'Write consistently and develop your storytelling skills',
      category: 'creativity',
      difficulty: 'medium',
      estimatedDuration: 60,
      popularity: 82,
      tags: ['writing', 'creativity', 'storytelling'],
      milestones: [
        { title: 'Daily Writing Habit', description: 'Write for 30 minutes daily for 2 weeks', priority: 'high' },
        { title: 'Complete First Story', description: 'Finish a short story of 1000+ words', priority: 'medium' },
        { title: 'Share Your Work', description: 'Get feedback from others on your writing', priority: 'high' },
      ]
    },
    {
      id: '5',
      title: 'Financial Freedom Plan',
      description: 'Take control of your finances and build wealth',
      category: 'finance',
      difficulty: 'hard',
      estimatedDuration: 120,
      popularity: 91,
      tags: ['finance', 'budgeting', 'investing'],
      milestones: [
        { title: 'Create Budget', description: 'Track expenses and create monthly budget', priority: 'high' },
        { title: 'Emergency Fund', description: 'Save $1000 for emergencies', priority: 'medium' },
        { title: 'Investment Account', description: 'Open and fund investment account', priority: 'high' },
      ]
    },
    {
      id: '6',
      title: 'Relationship Building',
      description: 'Strengthen connections with family and friends',
      category: 'relationships',
      difficulty: 'easy',
      estimatedDuration: 45,
      popularity: 79,
      tags: ['relationships', 'communication', 'social'],
      milestones: [
        { title: 'Weekly Check-ins', description: 'Call or meet with loved ones weekly', priority: 'high' },
        { title: 'Express Gratitude', description: 'Thank someone important to you', priority: 'medium' },
        { title: 'Plan Quality Time', description: 'Organize meaningful activities together', priority: 'high' },
      ]
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'health', label: 'Health & Fitness' },
    { value: 'career', label: 'Career Development' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'learning', label: 'Learning & Education' },
    { value: 'creativity', label: 'Creativity & Arts' },
    { value: 'finance', label: 'Finance' },
    { value: 'mindfulness', label: 'Mindfulness' },
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];

  const filteredTemplates = questTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleUseTemplate = (template: QuestTemplate) => {
    const newQuest: Omit<Quest, 'id' | 'userId' | 'createdAt'> = {
      title: template.title,
      description: template.description,
      category: template.category,
      difficulty: template.difficulty,
      points: template.difficulty === 'easy' ? 50 : template.difficulty === 'medium' ? 100 : 200,
      status: 'active',
      progress: 0,
      milestones: template.milestones.map((milestone, index) => ({
        ...milestone,
        id: Date.now().toString() + index,
        completed: false,
      })),
      tags: template.tags,
      isPublic: false,
      collaborators: [],
      priority: 'medium',
      estimatedDuration: template.estimatedDuration,
      notes: '',
      attachments: [],
    };

    addQuest(newQuest);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      health: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      career: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      relationships: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
      learning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      creativity: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      finance: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      mindfulness: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'text-green-600 dark:text-green-400',
      medium: 'text-yellow-600 dark:text-yellow-400',
      hard: 'text-red-600 dark:text-red-400',
    };
    return colors[difficulty as keyof typeof colors] || 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Quest Templates</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredTemplates.length} templates available
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </span>
                    <span className={`text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{template.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{template.description}</p>
                </div>
                
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">{template.popularity}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{template.estimatedDuration} days</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{Math.floor(template.popularity * 10)} users</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Milestones ({template.milestones.length})
                </h4>
                <ul className="space-y-1">
                  {template.milestones.slice(0, 2).map((milestone, index) => (
                    <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                      {milestone.title}
                    </li>
                  ))}
                  {template.milestones.length > 2 && (
                    <li className="text-xs text-gray-500 dark:text-gray-500">
                      +{template.milestones.length - 2} more milestones
                    </li>
                  )}
                </ul>
              </div>

              <button
                onClick={() => handleUseTemplate(template)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Use This Template
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">No templates found</h3>
          <p className="text-gray-400 dark:text-gray-500">
            Try adjusting your search terms or filters to find more templates.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestTemplates;