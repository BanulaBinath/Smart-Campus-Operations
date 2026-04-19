import React, { useState, useEffect } from 'react';
import { CheckCheck, Send } from 'lucide-react';
import TopBar from '../components/layout/TopBar';
import Sidebar from '../components/layout/Sidebar';
import NotificationItem from '../components/notifications/NotificationItem';
import { notificationApi } from '../api/notificationApi';
import { useAuth } from '../context/AuthContext';

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, UNREAD, BOOKINGS, TICKETS

  // Custom Notification Modal State
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customData, setCustomData] = useState({ title: '', message: '', targetRoles: [] });
  const [sendingCustom, setSendingCustom] = useState(false);

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

  const handleSendCustom = async (e) => {
    e.preventDefault();
    if (!customData.title || !customData.message || customData.targetRoles.length === 0) return;
    setSendingCustom(true);
    try {
      await notificationApi.sendCustomNotification(customData);
      setShowCustomModal(false);
      setCustomData({ title: '', message: '', targetRoles: [] });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to send custom notification', error);
    } finally {
      setSendingCustom(false);
    }
  };

  const handleRoleToggle = (role) => {
    setCustomData(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role) 
        ? prev.targetRoles.filter(r => r !== role)
        : [...prev.targetRoles, role]
    }));
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-gray-900">
      <Sidebar />
      
      <div className="flex flex-1 flex-col md:ml-[240px]">
        <TopBar title="Notifications" />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-5xl">
            
            {/* Header Area */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="inline-flex rounded-xl bg-gray-200/50 p-1.5 shrink-0 border border-gray-200/50 backdrop-blur-sm">
                {['ALL', 'UNREAD', 'BOOKINGS', 'TICKETS'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`rounded-lg px-6 py-2 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                      filter === tab
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                    }`}
                  >
                    {tab.charAt(0) + tab.slice(1).toLowerCase()}
                    {tab === 'UNREAD' && unreadCount > 0 && (
                      <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold ${filter === tab ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}>
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 shrink-0">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-white hover:shadow-md shrink-0"
                  >
                    <CheckCheck size={18} className="text-blue-600" />
                    Mark all as read
                  </button>
                )}

                {user?.role === 'ADMIN' && (
                  <button
                    onClick={() => setShowCustomModal(true)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 border border-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 shadow-md shadow-blue-500/20 shrink-0"
                  >
                    <Send size={18} className="text-white" />
                    Custom Notification
                  </button>
                )}
              </div>
            </div>

            {/* List Area */}
            <div className="rounded-3xl bg-white/60 backdrop-blur-xl border border-gray-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[450px] overflow-hidden">
              {loading ? (
                <div className="flex justify-center p-20">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-sm"></div>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-24 text-center h-full bg-gradient-to-b from-transparent to-gray-50/50">
                  <div className="mb-6 rounded-full bg-blue-50 p-5 shadow-sm border border-blue-100 transition-transform hover:scale-105">
                    <CheckCheck size={40} className="text-blue-600" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 tracking-tight">You're all caught up!</h3>
                  <p className="mt-3 text-base text-gray-500 font-medium">
                    No {filter !== 'ALL' ? filter.toLowerCase() : ''} notifications to show.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-gray-100/80">
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

      {/* Admin Custom Notification Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Send Custom Notification</h2>
            <form onSubmit={handleSendCustom}>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-semibold text-gray-700">Title</label>
                <input 
                  type="text" 
                  value={customData.title}
                  onChange={(e) => setCustomData({...customData, title: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-sm font-semibold text-gray-700">Message</label>
                <textarea 
                  value={customData.message}
                  onChange={(e) => setCustomData({...customData, message: e.target.value})}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-gray-700">Target Roles</label>
                <div className="flex flex-wrap gap-2">
                  {['STUDENT', 'LECTURER', 'TECHNICIAN'].map(role => {
                    const isSelected = customData.targetRoles.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleToggle(role)}
                        className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${isSelected ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                      >
                        {role}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingCustom || customData.targetRoles.length === 0}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {sendingCustom ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
