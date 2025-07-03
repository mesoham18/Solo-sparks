import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useQuests } from './useQuests';
import { useHabits } from './useHabits';
import { AnalyticsData } from '../types';
import { format, subDays, parseISO, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export const useAnalytics = (): AnalyticsData => {
  const { user } = useAuth();
  const { quests } = useQuests();
  const { habits } = useHabits();

  return useMemo(() => {
    if (!user) {
      return {
        questsCompleted: [],
        pointsEarned: [],
        categoryBreakdown: [],
        streakHistory: [],
        productivityScore: 0,
        weeklyProgress: 0,
        monthlyProgress: 0,
      };
    }

    const now = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => subDays(now, i)).reverse();

    // Quests completed over time
    const questsCompleted = last30Days.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const count = quests.filter(quest => 
        quest.completedAt && format(parseISO(quest.completedAt), 'yyyy-MM-dd') === dateStr
      ).length;
      return { date: dateStr, count };
    });

    // Points earned over time
    const pointsEarned = last30Days.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const points = quests
        .filter(quest => quest.completedAt && format(parseISO(quest.completedAt), 'yyyy-MM-dd') === dateStr)
        .reduce((sum, quest) => sum + quest.points, 0);
      return { date: dateStr, points };
    });

    // Category breakdown
    const categoryCount = quests.reduce((acc, quest) => {
      acc[quest.category] = (acc[quest.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalQuests = quests.length;
    const categoryBreakdown = Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
      percentage: totalQuests > 0 ? Math.round((count / totalQuests) * 100) : 0,
    }));

    // Streak history (simplified)
    const streakHistory = last30Days.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const hasActivity = quests.some(quest => 
        quest.completedAt && format(parseISO(quest.completedAt), 'yyyy-MM-dd') === dateStr
      ) || habits.some(habit => habit.completedDates.includes(dateStr));
      
      return { date: dateStr, streak: hasActivity ? 1 : 0 };
    });

    // Productivity score (0-100)
    const completedQuests = quests.filter(q => q.status === 'completed').length;
    const totalActiveQuests = quests.filter(q => q.status === 'active').length;
    const completionRate = totalActiveQuests > 0 ? completedQuests / (completedQuests + totalActiveQuests) : 0;
    const productivityScore = Math.round(completionRate * 100);

    // Weekly progress
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    const weeklyCompletedQuests = quests.filter(quest => 
      quest.completedAt && isWithinInterval(parseISO(quest.completedAt), { start: weekStart, end: weekEnd })
    ).length;
    const weeklyProgress = Math.round((weeklyCompletedQuests / user.stats.weeklyGoal) * 100);

    // Monthly progress
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const monthlyCompletedQuests = quests.filter(quest => 
      quest.completedAt && isWithinInterval(parseISO(quest.completedAt), { start: monthStart, end: monthEnd })
    ).length;
    const monthlyProgress = Math.round((monthlyCompletedQuests / user.stats.monthlyGoal) * 100);

    return {
      questsCompleted,
      pointsEarned,
      categoryBreakdown,
      streakHistory,
      productivityScore,
      weeklyProgress,
      monthlyProgress,
    };
  }, [user, quests, habits]);
};