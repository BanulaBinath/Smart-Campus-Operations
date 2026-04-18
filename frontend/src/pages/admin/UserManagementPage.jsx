import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, UserPlus } from 'lucide-react';
import TopBar from '../../components/layout/TopBar';
import Sidebar from '../../components/layout/Sidebar';
import UserTable from '../../components/admin/UserTable';
import EditRoleModal from '../../components/admin/EditRoleModal';
import CreateUserModal from '../../components/admin/CreateUserModal';
import Toast from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';
import { userApi } from '../../api/userApi';
import { useAuth } from '../../context/AuthContext';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // ALL, USER, ADMIN, TECHNICIAN
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { toasts, removeToast, success, error } = useToast();
  const { fetchCurrentUser } = useAuth(); // If they update their own role, might need to re-fetch, though they are admin so maybe not.

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users', err);
      error('Failed to load user list.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRole = async (userId, newRole) => {
    try {
      await userApi.updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      success('User role updated successfully');
      setEditingUser(null);
    } catch (err) {
      console.error('Failed to update role', err);
      error('Failed to update role. Please try again.');
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const newUser = await userApi.createUser(userData);
      setUsers([newUser, ...users]);
      success('New user created successfully');
      setShowCreateModal(false);
    } catch (err) {
      console.error('Failed to create user', err);
      error(err.response?.data?.message || 'Failed to create user. Please try again.');
      throw err; // Re-throw to be caught by the modal for internal error handling
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await userApi.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      success('User deleted successfully');
    } catch (err) {
      console.error('Failed to delete user', err);
      error('Failed to delete user. Please try again.');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar />
      <div className="flex flex-1 flex-col md:ml-[240px]">
        <TopBar title="User Management" />
        
        <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          <div className="w-full max-w-5xl">
            
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">Manage roles and access permissions globally.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-bold rounded-[8px] hover:bg-[var(--color-primary-hover)] transition-all shadow-sm shadow-[var(--color-primary-light)]"
                >
                  <UserPlus size={18} />
                  <span>New User</span>
                </button>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search size={18} className="text-[var(--color-text-muted)]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-[8px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-primary)] transition-all transition-colors"
                  />
                </div>
                
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 border border-[var(--color-border)] rounded-[8px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-primary)] cursor-pointer"
                >
                  <option value="ALL">All Roles</option>
                  <option value="USER">User (Default)</option>
                  <option value="LECTURER">Lecturer</option>
                  <option value="TECHNICIAN">Technician</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>

            <div className="rounded-[12px] bg-[var(--color-surface)] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
               {loading ? (
                  <div className="flex justify-center p-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
                  </div>
                ) : (
                  <UserTable 
                    users={filteredUsers} 
                    onEditRole={(user) => setEditingUser(user)} 
                    onDelete={handleDeleteUser}
                  />
                )}
            </div>
            
            <div className="mt-6 flex items-start gap-3 rounded-[8px] bg-[var(--color-warning-light)]/50 p-4 text-[var(--color-warning-text)] border border-[var(--color-warning-light)] max-w-md">
              <ShieldAlert size={20} className="shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Administrative Privileges</p>
                <p className="opacity-90 leading-relaxed">
                  Assigning a user the <span className="font-bold">ADMIN</span> role grants them full access to all system modules including User Management. This action is irreversible unless changed back by another Admin.
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>

      {editingUser && (
        <EditRoleModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveRole}
        />
      )}

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateUser}
        />
      )}

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default UserManagementPage;
