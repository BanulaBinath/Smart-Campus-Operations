import React, { useState } from 'react';
import { X, User, Mail, Lock, UserCheck } from 'lucide-react';

/**
 * @param {Object} props
 * @param {Function} props.onClose
 * @param {Function} props.onSave
 */
const CreateUserModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    { id: 'USER', label: 'User' },
    { id: 'LECTURER', label: 'Lecturer' },
    { id: 'TECHNICIAN', label: 'Technician' },
    { id: 'ADMIN', label: 'Administrator' }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(formData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-[450px] rounded-[16px] bg-[var(--color-surface)] shadow-2xl animate-in zoom-in-95 border border-[var(--color-border)]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text)]">Create New User</h2>
            <p className="text-xs text-[var(--color-text-muted)]">Add a new member to the campus operations.</p>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Body */}
          <div className="px-6 py-6 space-y-4">
            
            {error && (
              <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-2">
                <User size={14} /> Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-[10px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-2">
                <Mail size={14} /> Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@campus.edu"
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-[10px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-2">
                <Lock size={14} /> Initial Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-[10px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-2">
                <UserCheck size={14} /> System Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => (
                  <label 
                    key={r.id} 
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-all ${
                      formData.role === r.id 
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]/20 text-[var(--color-primary-text)] font-medium' 
                        : 'border-[var(--color-border)] hover:bg-[var(--color-bg)] grayscale'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="role" 
                      value={r.id} 
                      checked={formData.role === r.id}
                      onChange={handleChange}
                      className="h-3 w-3 border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    />
                    <span className="text-xs">{r.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border)] px-6 py-4 bg-gray-50/50 rounded-b-[16px]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center justify-center min-w-[120px] rounded-[10px] bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[var(--color-primary-light)] hover:bg-[var(--color-primary-hover)] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateUserModal;
