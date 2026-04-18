import React, { useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import TopBar from '../components/layout/TopBar';
import Sidebar from '../components/layout/Sidebar';
import RoleBadge from '../components/admin/RoleBadge';
import { LogOut, Save, Edit2, Trash2, X } from 'lucide-react';
import { userApi } from '../api/userApi';
import { useToast } from '../hooks/useToast';
import Toast from '../components/ui/Toast';

const ProfilePage = () => {
  const { user, logout, fetchCurrentUser } = useAuth();
  const { toasts, removeToast, success, error } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    profilePicture: user?.profilePicture || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  if (!user) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await userApi.updateProfile(formData);
      await fetchCurrentUser();
      success('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile', err);
      error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('WARNING: Are you sure you want to delete your account? This action is permanent and cannot be undone.')) {
      setIsDeleting(true);
      try {
        await userApi.deleteProfile();
        window.location.href = '/login';
      } catch (err) {
        console.error('Failed to delete account', err);
        error('Failed to delete account. Please try again.');
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar />
      <div className="flex flex-1 flex-col md:ml-[240px]">
        <TopBar title="My Profile" />
        
        <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          <div className="w-full max-w-2xl mt-8">
            
            <div className="rounded-[16px] bg-[var(--color-surface)] shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden border border-[var(--color-border)]">
              <div className="h-40 bg-gradient-to-br from-[#0d57c8] via-[#3B82F6] to-[#60A5FA] relative">
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="absolute bottom-4 right-6 flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/30 transition-all hover:scale-105 z-10"
                  >
                    <Edit2 size={16} /> Edit Profile
                  </button>
                )}
              </div>
              
              <div className="px-10 pb-10">
                <div className="relative -mt-20 mb-6 flex items-end justify-between">
                  <div className="flex h-40 w-40 items-center justify-center rounded-2xl border-4 border-white bg-[var(--color-primary-light)] text-5xl font-bold text-[var(--color-primary-text)] shadow-xl shrink-0 overflow-hidden group">
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
                  <div className="mb-4">
                    <RoleBadge role={user.role} />
                  </div>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-6 animate-in slide-in-from-bottom-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="w-full px-4 py-3 border border-[var(--color-border)] rounded-[12px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Profile Picture URL</label>
                      <input 
                        type="url" 
                        value={formData.profilePicture}
                        onChange={(e) => setFormData({...formData, profilePicture: e.target.value})}
                        placeholder="https://example.com/photo.jpg"
                        className="w-full px-4 py-3 border border-[var(--color-border)] rounded-[12px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all"
                      />
                      <p className="text-[10px] text-[var(--color-text-muted)]">Use image hosted online for your avatar.</p>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 flex items-center justify-center gap-2 rounded-[12px] bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--color-primary-light)] hover:bg-[var(--color-primary-hover)] transition-all disabled:opacity-50"
                      >
                        {isSaving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div> : <><Save size={18} /> Save Changes</>}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({ name: user.name, profilePicture: user.profilePicture });
                        }}
                        className="flex items-center justify-center p-3 rounded-[12px] bg-gray-100 text-[var(--color-text-muted)] hover:bg-gray-200 transition-all"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h2 className="text-3xl font-black mt-2 text-[#1E293B]">{user.name}</h2>
                    <p className="text-[var(--color-text-muted)] flex items-center gap-3 mb-10 text-lg">
                      {user.email}
                      <span className="w-2 h-2 rounded-full bg-blue-400 opacity-20"></span>
                      <span className="font-medium">Joined {user.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'Recently'}</span>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                       <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">System Authorization</h4>
                          <p className="text-sm font-semibold text-slate-700">{user.role}</p>
                       </div>
                       <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
                          <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Authenticating Via</h4>
                          <p className="text-sm font-semibold text-blue-700">{user.provider || 'Local Account'}</p>
                       </div>
                    </div>
                  </>
                )}

                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8"></div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <button
                    onClick={logout}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-[12px] bg-white border border-[var(--color-border)] px-6 py-3 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 active:scale-95"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>

                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-[12px] bg-red-50 px-6 py-3 text-sm font-bold text-red-600 transition-all hover:bg-red-100 active:scale-95 disabled:opacity-50"
                  >
                    {isDeleting ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div> : <><Trash2 size={18} /> Delete Account</>}
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        </main>
      </div>

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default ProfilePage;
