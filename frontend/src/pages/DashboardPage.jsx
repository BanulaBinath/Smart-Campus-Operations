import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';
import { notificationApi } from '../api/notificationApi';
import NotificationItem from '../components/notifications/NotificationItem';
import { 
  CalendarCheck, 
  AlertTriangle, 
  Building2, 
  Bell,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCheck
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  
  useEffect(() => {
    const fetchRecentNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const data = await notificationApi.getNotifications();
        setNotifications(data.slice(0, 3)); // show top 3 on dashboard
      } catch (error) {
        console.error('Failed to fetch format notifications', error);
      } finally {
        setLoadingNotifications(false);
      }
    };
    fetchRecentNotifications();
  }, []);

  // Extract role prefix from path (e.g. /admin/dashboard -> admin)
  const rolePrefix = location.pathname.split('/')[1] || 'student';
  const roleTitle = rolePrefix.charAt(0).toUpperCase() + rolePrefix.slice(1);
  const isStudent = rolePrefix === 'student' || user?.role === 'USER';
  
  const quickActions = [
    {
      title: 'Book Facility',
      description: 'Reserve campus spaces for events or study',
      icon: Building2,
      path: isStudent ? '/student/facilities' : '/facilities',
      color: 'bg-blue-50 text-blue-600',
      hoverColor: 'hover:bg-blue-100 hover:border-blue-300'
    },
    {
      title: 'My Bookings',
      description: 'View and manage your current reservations',
      icon: CalendarCheck,
      path: '/bookings',
      color: 'bg-indigo-50 text-indigo-600',
      hoverColor: 'hover:bg-indigo-100 hover:border-indigo-300'
    },
    {
      title: 'Report Incident',
      description: 'Report maintenance or security issues',
      icon: AlertTriangle,
      path: '/incidents',
      color: 'bg-orange-50 text-orange-600',
      hoverColor: 'hover:bg-orange-100 hover:border-orange-300'
    },
    {
      title: 'Notifications',
      description: 'Check latest updates and announcements',
      icon: Bell,
      path: '/notifications',
      color: 'bg-purple-50 text-purple-600',
      hoverColor: 'hover:bg-purple-100 hover:border-purple-300'
    }
  ];
  
  return (
    <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar />
      <div className="flex flex-1 flex-col md:ml-[240px]">
        <TopBar title={`${roleTitle} Dashboard`} />
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Hero Welcome Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-blue-500 text-white shadow-lg p-8 md:p-10">
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                  Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
                </h2>
                <p className="text-blue-100 text-lg max-w-2xl font-medium">
                  Here's an overview of your campus operations today. Stay updated with your latest bookings and campus activity.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                   <Link to={isStudent ? '/student/facilities' : '/facilities'} className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-[var(--color-primary)] font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-all">
                     Explore Facilities
                   </Link>
                </div>
              </div>
              <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                 <svg width="400" height="400" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5l-10-5v9.5l10 5 10-5V4.5l-10 5z"/>
                 </svg>
              </div>
            </div>
            
            {/* Quick Actions Grid */}
            <div>
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
                <TrendingUp size={24} className="text-[var(--color-primary)]" />
                Quick Actions
              </h3>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {quickActions.map((action) => (
                  <Link 
                    key={action.title} 
                    to={action.path}
                    className={`block p-5 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-200 group ${action.hoverColor}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${action.color}`}>
                      <action.icon size={24} className="group-hover:scale-110 transition-transform" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1 flex items-center justify-between">
                      {action.title}
                      <ArrowRight size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h4>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">
                      {action.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Notifications Widget aligned to the new standard */}
            <div>
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={24} className="text-[var(--color-primary)]" />
                  Recent Notifications
                </div>
                <Link to="/notifications" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                  View All
                </Link>
              </h3>
              
              <div className="rounded-3xl bg-white/60 backdrop-blur-xl border border-gray-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                {loadingNotifications ? (
                  <div className="flex justify-center p-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-sm"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 text-center bg-gradient-to-b from-transparent to-gray-50/50">
                    <div className="mb-4 rounded-full bg-blue-50 p-4 shadow-sm border border-blue-100 transition-transform hover:scale-105">
                      <CheckCheck size={32} className="text-blue-600" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 tracking-tight">You're all caught up!</h3>
                    <p className="mt-2 text-sm text-gray-500 font-medium">
                      No recent notifications to show.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col divide-y divide-gray-100/80">
                    {notifications.map((notif) => (
                      <NotificationItem 
                        key={notif.id} 
                        notification={notif} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;