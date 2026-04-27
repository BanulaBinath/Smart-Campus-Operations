import React, { useState } from 'react';
import { X } from 'lucide-react';
import RoleBadge from './RoleBadge';

/**
 * @param {Object} props
 * @param {Object} props.user
 * @param {Function} props.onClose
 * @param {Function} props.onSave
 */
const EditRoleModal = ({ user, onClose, onSave }) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || 'USER');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const roles = [
    {
      id: 'USER',
      label: 'Student',
      description: 'Can browse resources and submit bookings/tickets.'
    },
    {
      id: 'LECTURER',
      label: 'Lecturer',
      description: 'Can book resources, request facilities, and submit tickets.'
    },
    {
      id: 'TECHNICIAN',
      label: 'Technician',
      description: 'Can be assigned to tickets and update their status.'
    },
    {
      id: 'ADMIN',
      label: 'Administrator',
      description: 'Full access to approve bookings, manage users, view all data.'
    }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(user.id, selectedRole);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-[400px] rounded-[12px] bg-[var(--color-surface)] shadow-2xl animate-in zoom-in-95">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Change Role</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div className="mb-5 flex items-center gap-3 rounded-lg bg-[var(--color-bg)] p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary-text)] font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-semibold">{user.name}</div>
              <div className="text-xs text-[var(--color-text-muted)]">{user.email}</div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-[var(--color-text)]">Select new role:</label>

            <div className="space-y-2">
              {roles.map((r) => (
                <label
                  key={r.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${selectedRole === r.id
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]/20'
                      : 'border-[var(--color-border)] hover:bg-[var(--color-bg)]'
                    }`}
                >
                  <div className="flex h-5 items-center">
                    <input
                      type="radio"
                      name="role"
                      value={r.id}
                      checked={selectedRole === r.id}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="h-4 w-4 border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--color-text)]">{r.label}</span>
                      {user.role === r.id && <span className="text-[10px] text-[var(--color-text-muted)]">(Current)</span>}
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)]">{r.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border)] px-6 py-4 bg-[#F8FAFC] rounded-b-[12px]">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="rounded-[8px] border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || selectedRole === user.role}
            className="flex items-center justify-center min-w-[80px] rounded-[8px] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              'Save'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditRoleModal;
