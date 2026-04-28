import React from 'react';
import NotificationBell from '../notifications/NotificationBell';
import { useAuth } from '../context/AuthContext';

/**
 * @param {Object} props
 * @param {string} props.title - The title of the current page
 */
const TopBar = ({ title }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div>
        <h1 className="text-xl font-bold text-[var(--color-text)]">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <NotificationBell />
        
        <div className="h-8 w-px bg-[var(--color-border)]"></div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold text-[var(--color-text)]">{user?.name}</span>
            <span className="text-xs text-[var(--color-text-muted)]">{user?.email}</span>
          </div>
          {user?.profilePicture ? (
            <img 
              src={user.profilePicture} 
              alt={user.name} 
              className="h-9 w-9 rounded-full object-cover border border-[var(--color-border)]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-sm font-bold text-[var(--color-primary-text)]">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
