import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { notificationApi } from '../../api/notificationApi';
import NotificationItem from './NotificationItem';

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationApi.getUnreadCount();
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error('Failed to fetch unread count', error);
    }
  };

  const fetchRecentNotifications = async () => {
    try {
      const data = await notificationApi.getNotifications();
      setNotifications(data.slice(0, 5)); // First 5
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Poll every 30 seconds
    const intervalId = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchRecentNotifications();
    }
  }, [isOpen]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-primary)] transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-danger)] text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg z-50">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
            <h3 className="font-semibold text-[var(--color-text)]">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-[var(--color-text-muted)]">
                You're all caught up!
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notif) => (
                  <NotificationItem key={notif.id} notification={notif} inDropdown />
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-[var(--color-border)] px-4 py-3 text-center bg-[var(--color-bg)] rounded-b-xl">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
