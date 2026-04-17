import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  AlertTriangle,
  Bell,
  Users,
  UserCircle,
  LogOut,
  GraduationCap
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Facilities', path: '/facilities', icon: Building2 }, // Module A stub
    { name: 'Bookings', path: '/bookings', icon: CalendarCheck }, // Module B stub
    { name: 'Incidents', path: '/incidents', icon: AlertTriangle }, // Module C stub
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ name: 'Users', path: '/admin/users', icon: Users });
  }

  return (
    <div className="fixed left-0 top-0 hidden h-full w-[240px] flex-col bg-[var(--color-sidebar-bg)] text-[var(--color-sidebar-text)] md:flex shadow-xl z-40">
      {/* Logo Area */}
      <div className="flex h-16 items-center justify-center border-b border-white/10 gap-2 font-bold px-4">
        <GraduationCap size={28} className="text-white" />
        <span className="text-xl text-white tracking-wide">SmartCampus</span>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                    isActive
                      ? 'bg-[var(--color-sidebar-active)] text-white font-medium'
                      : 'hover:bg-[var(--color-sidebar-hover)] hover:text-white'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Profile Area */}
      <div className="border-t border-white/10 p-4">
        <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors mb-2 ${
                isActive
                  ? 'bg-[var(--color-sidebar-active)] text-white font-medium'
                  : 'hover:bg-[var(--color-sidebar-hover)] hover:text-white'
              }`
            }
          >
            <UserCircle size={20} />
            <span>Profile</span>
          </NavLink>
        <div className="flex items-center justify-between gap-3 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-medium text-white truncate">{user?.name}</span>
              <span className="text-xs text-[var(--color-sidebar-text)] truncate">{user?.role}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-[var(--color-sidebar-text)] hover:text-[var(--color-danger-light)] transition-colors shrink-0"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
