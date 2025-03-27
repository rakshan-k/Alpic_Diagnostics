import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/signin');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/customers"
              className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
            >
              Customers
            </Link>
            <Link
              to="/equipment"
              className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
            >
              Equipment
            </Link>
            <Link
              to="/maintenance"
              className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
            >
              Maintenance Records
            </Link>
            <Link
              to="/calendar"
              className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
            >
              Calendar
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-gray-200" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}