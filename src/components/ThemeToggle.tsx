import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ThemeToggle: React.FC = () => {
  const { user, toggleTheme } = useAuth();

  if (!user) return null;

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      title={`Switch to ${user.theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {user.theme === 'light' ? (
        <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      ) : (
        <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      )}
    </button>
  );
};

export default ThemeToggle;