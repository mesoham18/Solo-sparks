import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('soloSparks_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Ensure user has all new properties
      const enhancedUser = {
        ...parsedUser,
        level: parsedUser.level || 1,
        experience: parsedUser.experience || 0,
        theme: parsedUser.theme || 'light',
        preferences: {
          notifications: true,
          emailUpdates: false,
          publicProfile: true,
          showInLeaderboard: true,
          ...parsedUser.preferences
        },
        stats: {
          totalQuests: 0,
          completedQuests: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalPoints: 0,
          totalHabits: 0,
          completedHabits: 0,
          weeklyGoal: 5,
          monthlyGoal: 20,
          ...parsedUser.stats
        },
        badges: parsedUser.badges || [],
        connections: parsedUser.connections || []
      };
      setUser(enhancedUser);
      
      // Apply theme
      if (enhancedUser.theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('soloSparks_users') || '[]');
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        const enhancedUser = {
          ...userWithoutPassword,
          level: userWithoutPassword.level || 1,
          experience: userWithoutPassword.experience || 0,
          theme: userWithoutPassword.theme || 'light',
          preferences: {
            notifications: true,
            emailUpdates: false,
            publicProfile: true,
            showInLeaderboard: true,
            ...userWithoutPassword.preferences
          },
          stats: {
            totalQuests: 0,
            completedQuests: 0,
            currentStreak: 0,
            longestStreak: 0,
            totalPoints: 0,
            totalHabits: 0,
            completedHabits: 0,
            weeklyGoal: 5,
            monthlyGoal: 20,
            ...userWithoutPassword.stats
          },
          badges: userWithoutPassword.badges || [],
          connections: userWithoutPassword.connections || []
        };
        
        setUser(enhancedUser);
        localStorage.setItem('soloSparks_user', JSON.stringify(enhancedUser));
        
        // Apply theme
        if (enhancedUser.theme === 'dark') {
          document.documentElement.classList.add('dark');
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('soloSparks_users') || '[]');
      
      if (users.find((u: any) => u.email === email)) {
        return false; // User already exists
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
        createdAt: new Date().toISOString(),
        level: 1,
        experience: 0,
        theme: 'light' as const,
        preferences: {
          notifications: true,
          emailUpdates: false,
          publicProfile: true,
          showInLeaderboard: true,
        },
        stats: {
          totalQuests: 0,
          completedQuests: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalPoints: 0,
          totalHabits: 0,
          completedHabits: 0,
          weeklyGoal: 5,
          monthlyGoal: 20,
        },
        badges: [],
        connections: []
      };

      users.push(newUser);
      localStorage.setItem('soloSparks_users', JSON.stringify(users));

      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('soloSparks_user', JSON.stringify(userWithoutPassword));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('soloSparks_user');
    document.documentElement.classList.remove('dark');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('soloSparks_user', JSON.stringify(updatedUser));

      // Update in users array
      const users = JSON.parse(localStorage.getItem('soloSparks_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userData };
        localStorage.setItem('soloSparks_users', JSON.stringify(users));
      }
    }
  };

  const toggleTheme = () => {
    if (user) {
      const newTheme = user.theme === 'light' ? 'dark' : 'light';
      updateUser({ theme: newTheme });
      
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    toggleTheme,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};