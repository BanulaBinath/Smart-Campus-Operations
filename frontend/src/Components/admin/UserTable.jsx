import React from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import RoleBadge from './RoleBadge';

/**
 * @param {Object} props
 * @param {Array} props.users
 * @param {Function} props.onEditRole
 * @param {Function} props.onDelete
 */
const UserTable = ({ users, onEditRole, onDelete }) => {
  const { user: currentUser } = useAuth();

  const getAvatarColor = (name) => {
    const colors = [
      'var(--color-primary-light)',
      'var(--color-success-light)',
      'var(--color-warning-light)',
      'var(--color-info-light)'
    ];
    const textColors = [
      'var(--color-primary-text)',
      'var(--color-success-text)',
      'var(--color-warning-text)',
      'var(--color-info-text)'
    ];
    
    // Hash string to index
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    
    return { bg: colors[index], text: textColors[index] };
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-[var(--color-text)]">
        <thead className="bg-[#F8FAFC] text-xs uppercase text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
          <tr>
            <th className="px-6 py-4 font-semibold">User</th>
            <th className="px-6 py-4 font-semibold">Email</th>
            <th className="px-6 py-4 font-semibold">Role</th>
            <th className="px-6 py-4 font-semibold">Joined Date</th>
            <th className="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {users.map((user) => {
            const avatarStyle = getAvatarColor(user.name);
            const isSelf = currentUser?.id === user.id;

            return (
              <tr key={user.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {user.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt={user.name} 
                        className="h-10 w-10 rounded-full object-cover border border-[var(--color-border)]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div 
                        className="flex h-10 w-10 items-center justify-center rounded-full font-bold"
                        style={{ backgroundColor: avatarStyle.bg, color: avatarStyle.text }}
                      >
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <div className="font-medium text-[var(--color-text)]">{user.name || 'Unknown'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[var(--color-text-muted)]">{user.email}</td>
                <td className="px-6 py-4">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-6 py-4 text-[var(--color-text-muted)]">
                  {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}
                </td>
                <td className="px-6 py-4 text-right">
                  {isSelf ? (
                    <span 
                      className="inline-block px-3 py-1.5 text-xs text-[var(--color-text-placeholder)] cursor-not-allowed"
                      title="Cannot edit your own role"
                    >
                      Current User
                    </span>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEditRole(user)}
                        className="rounded-[8px] border border-[var(--color-border)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-light)]"
                      >
                        Edit Role
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
                            onDelete(user.id);
                          }
                        }}
                        className="rounded-[8px] border border-[var(--color-border)] bg-white p-1.5 text-[var(--color-danger)] transition-colors hover:bg-red-50 hover:border-red-200"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
          
          {users.length === 0 && (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-[var(--color-text-muted)]">
                No users found matching the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
