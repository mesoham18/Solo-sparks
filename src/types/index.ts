export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  level: number;
  experience: number;
  theme: 'light' | 'dark';
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    publicProfile: boolean;
    showInLeaderboard: boolean;
  };
  stats: {
    totalQuests: number;
    completedQuests: number;
    currentStreak: number;
    longestStreak: number;
    totalPoints: number;
    totalHabits: number;
    completedHabits: number;
    weeklyGoal: number;
    monthlyGoal: number;
  };
  badges: Badge[];
  connections: string[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'health' | 'career' | 'relationships' | 'personal' | 'learning' | 'creativity' | 'finance' | 'mindfulness';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  points: number;
  status: 'active' | 'completed' | 'paused' | 'archived';
  progress: number;
  createdAt: string;
  completedAt?: string;
  dueDate?: string;
  userId: string;
  milestones: Milestone[];
  tags: string[];
  isPublic: boolean;
  collaborators: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDuration: number; // in days
  actualDuration?: number;
  notes: string;
  attachments: string[];
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  category: Quest['category'];
  frequency: 'daily' | 'weekly' | 'monthly';
  targetCount: number;
  currentStreak: number;
  longestStreak: number;
  completedDates: string[];
  createdAt: string;
  userId: string;
  isActive: boolean;
  reminderTime?: string;
  color: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: string;
  level: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface QuestTemplate {
  id: string;
  title: string;
  description: string;
  category: Quest['category'];
  difficulty: Quest['difficulty'];
  estimatedDuration: number;
  milestones: Omit<Milestone, 'id' | 'completed' | 'completedAt'>[];
  tags: string[];
  popularity: number;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  type: 'achievement' | 'milestone' | 'motivation' | 'question';
  questId?: string;
  questTitle?: string;
  createdAt: string;
  likes: string[];
  comments: Comment[];
  isPublic: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  likes: string[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  toggleTheme: () => void;
}

export interface AnalyticsData {
  questsCompleted: { date: string; count: number }[];
  pointsEarned: { date: string; points: number }[];
  categoryBreakdown: { category: string; count: number; percentage: number }[];
  streakHistory: { date: string; streak: number }[];
  productivityScore: number;
  weeklyProgress: number;
  monthlyProgress: number;
}