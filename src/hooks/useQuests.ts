import { useState, useEffect } from 'react';
import { Quest } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useQuests = () => {
  const { user, updateUser } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);

  useEffect(() => {
    if (user) {
      const storedQuests = JSON.parse(localStorage.getItem(`soloSparks_quests_${user.id}`) || '[]');
      // Ensure quests have all new properties
      const enhancedQuests = storedQuests.map((quest: any) => ({
        ...quest,
        tags: quest.tags || [],
        isPublic: quest.isPublic !== undefined ? quest.isPublic : false,
        collaborators: quest.collaborators || [],
        priority: quest.priority || 'medium',
        estimatedDuration: quest.estimatedDuration || 7,
        notes: quest.notes || '',
        attachments: quest.attachments || [],
        milestones: quest.milestones?.map((milestone: any) => ({
          ...milestone,
          priority: milestone.priority || 'medium'
        })) || []
      }));
      setQuests(enhancedQuests);
    }
  }, [user]);

  const saveQuests = (newQuests: Quest[]) => {
    if (user) {
      setQuests(newQuests);
      localStorage.setItem(`soloSparks_quests_${user.id}`, JSON.stringify(newQuests));
      
      // Update user stats
      const completedCount = newQuests.filter(q => q.status === 'completed').length;
      const totalPoints = newQuests.reduce((sum, q) => sum + (q.status === 'completed' ? q.points : 0), 0);
      
      // Calculate experience and level
      const experience = user.experience + (completedCount > user.stats.completedQuests ? 50 : 0);
      const level = Math.floor(experience / 1000) + 1;
      
      updateUser({
        experience,
        level,
        stats: {
          ...user.stats,
          totalQuests: newQuests.length,
          completedQuests: completedCount,
          totalPoints,
        }
      });
    }
  };

  const addQuest = (quest: Omit<Quest, 'id' | 'userId' | 'createdAt'>) => {
    if (user) {
      const newQuest: Quest = {
        ...quest,
        id: Date.now().toString(),
        userId: user.id,
        createdAt: new Date().toISOString(),
        tags: quest.tags || [],
        isPublic: quest.isPublic || false,
        collaborators: quest.collaborators || [],
        priority: quest.priority || 'medium',
        estimatedDuration: quest.estimatedDuration || 7,
        notes: quest.notes || '',
        attachments: quest.attachments || [],
      };
      saveQuests([...quests, newQuest]);
    }
  };

  const updateQuest = (questId: string, updates: Partial<Quest>) => {
    const updatedQuests = quests.map(quest =>
      quest.id === questId ? { ...quest, ...updates } : quest
    );
    saveQuests(updatedQuests);
  };

  const deleteQuest = (questId: string) => {
    const updatedQuests = quests.filter(quest => quest.id !== questId);
    saveQuests(updatedQuests);
  };

  const completeQuest = (questId: string) => {
    updateQuest(questId, {
      status: 'completed',
      progress: 100,
      completedAt: new Date().toISOString(),
    });
  };

  const duplicateQuest = (questId: string) => {
    const questToDuplicate = quests.find(q => q.id === questId);
    if (questToDuplicate) {
      const duplicatedQuest = {
        ...questToDuplicate,
        title: `${questToDuplicate.title} (Copy)`,
        status: 'active' as const,
        progress: 0,
        completedAt: undefined,
        milestones: questToDuplicate.milestones.map(m => ({
          ...m,
          id: Date.now().toString() + Math.random(),
          completed: false,
          completedAt: undefined
        }))
      };
      addQuest(duplicatedQuest);
    }
  };

  const archiveQuest = (questId: string) => {
    updateQuest(questId, { status: 'archived' });
  };

  const getQuestsByCategory = (category: Quest['category']) => {
    return quests.filter(quest => quest.category === category);
  };

  const getQuestsByStatus = (status: Quest['status']) => {
    return quests.filter(quest => quest.status === status);
  };

  const searchQuests = (searchTerm: string) => {
    return quests.filter(quest => 
      quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quest.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  return {
    quests,
    addQuest,
    updateQuest,
    deleteQuest,
    completeQuest,
    duplicateQuest,
    archiveQuest,
    getQuestsByCategory,
    getQuestsByStatus,
    searchQuests,
  };
};