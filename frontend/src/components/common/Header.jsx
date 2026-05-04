import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, User, Menu } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white shadow-md">
      <div className="flex items-center justify-between h-full px-6">
        {/* Mobile Menu */}
        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 hover:bg-color-bg-light rounded-lg transition-colors"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={24} className="text-primary" />
        </button>

        <div className="hidden md:block"></div>

        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-color-bg-light transition-all duration-300 group">
            <Bell
              size={20}
              strokeWidth={2}
              className="text-primary group-hover:scale-110 transition-transform duration-200"
            />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-accent rounded-full animate-pulse"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-semibold text-foreground">{user?.username || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
            </div>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white font-semibold">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
