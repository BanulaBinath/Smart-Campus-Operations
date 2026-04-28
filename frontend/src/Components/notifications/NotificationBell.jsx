import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';

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
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 mt-1 w-80 md:w-96 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 z-50 transform opacity-100 scale-100 transition-all origin-top-right">
          <div className="flex items-center justify-between border-b border-gray-50 bg-gray-50/50 px-4 py-3.5">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto divide-y divide-gray-50 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="px-4 py-12 flex flex-col items-center justify-center text-center">
                <div className="rounded-full bg-gray-50 p-3 mb-3">
                  <Bell size={24} className="text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-500">You're all caught up!</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notif) => (
                  <NotificationItem key={notif.id} notification={notif} inDropdown />
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-50 px-4 py-3 text-center bg-gray-50/30">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors block w-full"
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
