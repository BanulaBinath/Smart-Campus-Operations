import React from 'react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import TopBar from '../components/layout/TopBar';
import Sidebar from '../components/layout/Sidebar';
import RoleBadge from '../components/admin/RoleBadge';
import { LogOut } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  return (
    <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar />
      <div className="flex flex-1 flex-col md:ml-[240px]">
        <TopBar title="My Profile" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-2xl mt-8">
            
            <div className="rounded-[12px] bg-[var(--color-surface)] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-[var(--color-primary)] to-[#3B82F6]"></div>
              
              <div className="px-8 pb-8">
                <div className="relative -mt-16 mb-4 flex items-end justify-between">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-[var(--color-primary-light)] text-4xl font-bold text-[var(--color-primary-text)] shadow-sm shrink-0 overflow-hidden">
                    {user.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt={user.name} 
                        className="h-full w-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="mb-2">
                    <RoleBadge role={user.role} />
                  </div>
                </div>

                <h2 className="text-2xl font-bold mt-2">{user.name}</h2>
                <p className="text-[var(--color-text-muted)] flex items-center gap-2 mb-8">
                  {user.email}
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                  <span>Joined {user.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : 'Recently'}</span>
                </p>

                <div className="mb-8 rounded-lg border border-[var(--color-border)] p-4 flex items-start gap-4">
                  <div className="mt-1">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Account Linked to Google</h3>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                      Your identity is managed securely by your university Google Workspace account. Your role ({user.role}) within this system is managed by administrators.
                    </p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 rounded-[8px] bg-white border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-danger)] transition-colors hover:bg-red-50 hover:border-red-200"
                  >
                    <LogOut size={16} />
                    Sign Out Securely
                  </button>
                </div>
                
              </div>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
