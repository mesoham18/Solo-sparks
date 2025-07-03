import { useState, useEffect } from 'react';
import { Habit } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { format, isToday, parseISO } from 'date-fns';

export const useHabits = () => {
  const { user, updateUser } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    if (user) {
      const storedHabits = JSON.parse(localStorage.getItem(`soloSparks_habits_${user.id}`) || '[]');
      setHabits(storedHabits);
    }
  }, [user]);

  const saveHabits = (newHabits: Habit[]) => {
    if (user) {
      setHabits(newHabits);
      localStorage.setItem(`soloSparks_habits_${user.id}`, JSON.stringify(newHabits));
      
      // Update user stats
      const totalHabits = newHabits.length;
      const completedToday = newHabits.filter(habit => 
        habit.completedDates.some(date => isToday(parseISO(date)))
      ).length;
      
      updateUser({
        stats: {
          ...user.stats,
          totalHabits,
          completedHabits: completedToday,
        }
      });
    }
  };

  const addHabit = (habit: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'currentStreak' | 'longestStreak' | 'completedDates'>) => {
    if (user) {
      const newHabit: Habit = {
        ...habit,
        id: Date.now().toString(),
        userId: user.id,
        createdAt: new Date().toISOString(),
        currentStreak: 0,
        longestStreak: 0,
        completedDates: [],
      };
      saveHabits([...habits, newHabit]);
    }
  };

  const updateHabit = (habitId: string, updates: Partial<Habit>) => {
    const updatedHabits = habits.map(habit =>
      habit.id === habitId ? { ...habit, ...updates } : habit
    );
    saveHabits(updatedHabits);
  };

  const deleteHabit = (habitId: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    saveHabits(updatedHabits);
  };

  const completeHabit = (habitId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const habit = habits.find(h => h.id === habitId);
    
    if (habit && !habit.completedDates.includes(today)) {
      const newCompletedDates = [...habit.completedDates, today];
      const currentStreak = calculateStreak(newCompletedDates);
      const longestStreak = Math.max(habit.longestStreak, currentStreak);
      
      updateHabit(habitId, {
        completedDates: newCompletedDates,
        currentStreak,
        longestStreak,
      });
    }
  };

  const uncompleteHabit = (habitId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const habit = habits.find(h => h.id === habitId);
    
    if (habit && habit.completedDates.includes(today)) {
      const newCompletedDates = habit.completedDates.filter(date => date !== today);
      const currentStreak = calculateStreak(newCompletedDates);
      
      updateHabit(habitId, {
        completedDates: newCompletedDates,
        currentStreak,
      });
    }
  };

  const calculateStreak = (completedDates: string[]): number => {
    if (completedDates.length === 0) return 0;
    
    const sortedDates = completedDates.sort().reverse();
    let streak = 0;
    let currentDate = new Date();
    
    for (const dateStr of sortedDates) {
      const date = parseISO(dateStr);
      const daysDiff = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
        currentDate = date;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const isHabitCompletedToday = (habitId: string): boolean => {
    const habit = habits.find(h => h.id === habitId);
    const today = format(new Date(), 'yyyy-MM-dd');
    return habit ? habit.completedDates.includes(today) : false;
  };

  return {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    uncompleteHabit,
    isHabitCompletedToday,
  };
};