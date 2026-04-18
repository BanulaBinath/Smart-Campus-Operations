import React, { useState, useEffect } from 'react';
import { CheckCheck } from 'lucide-react';
import TopBar from '../Components/layout/TopBar';
import Sidebar from '../Components/layout/Sidebar';
import NotificationItem from '../Components/notifications/NotificationItem';
import { notificationApi } from '../api/notificationApi';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, UNREAD, BOOKINGS, TICKETS

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationApi.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch format notifications', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const handleMarkRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'BOOKINGS') return n.type.startsWith('BOOKING');
    if (filter === 'TICKETS') return n.type.startsWith('TICKET');
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar />
      
      <div className="flex flex-1 flex-col md:ml-[240px]">
        <TopBar title="Notifications" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-4xl">
            
            {/* Header Area */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex overflow-x-auto rounded-lg bg-gray-100 p-1 shrink-0">
                {['ALL', 'UNREAD', 'BOOKINGS', 'TICKETS'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
                      filter === tab
                        ? 'bg-white text-[var(--color-text)] shadow-sm'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    {tab.charAt(0) + tab.slice(1).toLowerCase()}
                    {tab === 'UNREAD' && unreadCount > 0 && (
                      <span className="ml-2 rounded-full bg-[var(--color-primary-light)] px-2 py-0.5 text-xs text-[var(--color-primary-text)]">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center justify-center gap-2 rounded-lg bg-white border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-gray-50 shrink-0"
                >
                  <CheckCheck size={16} />
                  Mark all as read
                </button>
              )}
            </div>

            {/* List Area */}
            <div className="rounded-[12px] bg-[var(--color-surface)] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
              {loading ? (
                <div className="flex justify-center p-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 text-center">
                  <div className="mb-4 rounded-full bg-[var(--color-primary-light)] p-4">
                    <CheckCheck size={32} className="text-[var(--color-primary)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--color-text)]">You're all caught up!</h3>
                  <p className="mt-1 text-[var(--color-text-muted)]">
                    No {filter !== 'ALL' ? filter.toLowerCase() : ''} notifications to show.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {filteredNotifications.map((notif) => (
                    <NotificationItem 
                      key={notif.id} 
                      notification={notif} 
                      onMarkRead={handleMarkRead}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage;
