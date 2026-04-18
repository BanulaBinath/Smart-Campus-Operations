import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, XCircle, MinusCircle, AlertCircle, MessageSquare, UserCheck, Trash2 } from 'lucide-react';
import { notificationApi } from '../../api/notificationApi';

/**
 * @param {Object} props
 * @param {Object} props.notification
 * @param {boolean} [props.inDropdown] - whether rendered inside the top bar dropdown
 * @param {Function} [props.onMarkRead]
 * @param {Function} [props.onDelete]
 */
const NotificationItem = ({ notification, inDropdown = false, onMarkRead, onDelete }) => {
  const { id, type, message, isRead, createdAt } = notification;

  const getIconConfig = () => {
    switch (type) {
      case 'BOOKING_APPROVED':
        return { Icon: CheckCircle, color: 'var(--color-success)' };
      case 'BOOKING_REJECTED':
        return { Icon: XCircle, color: 'var(--color-danger)' };
      case 'BOOKING_CANCELLED':
        return { Icon: MinusCircle, color: 'var(--color-warning)' };
      case 'TICKET_STATUS_CHANGED':
        return { Icon: AlertCircle, color: 'var(--color-info)' };
      case 'NEW_COMMENT':
        return { Icon: MessageSquare, color: 'var(--color-primary)' };
      case 'TICKET_ASSIGNED':
        return { Icon: UserCheck, color: 'var(--color-warning)' };
      default:
        return { Icon: AlertCircle, color: 'var(--color-text-muted)' };
    }
  };

  const { Icon, color } = getIconConfig();

  const handleContainerClick = async () => {
    if (!isRead) {
      try {
        await notificationApi.markAsRead(id);
        if (onMarkRead) onMarkRead(id);
      } catch (err) {
        console.error('Failed to mark read', err);
      }
    }
    // Navigate logic to reference goes here (omitted for strictly UI scope)
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await notificationApi.deleteNotification(id);
      if (onDelete) onDelete(id);
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const containerStyle = isRead
    ? 'bg-white border-b border-[var(--color-border)] last:border-0'
    : 'bg-[var(--color-primary-light)]/40 border-l-[3px] border-l-[var(--color-primary)] border-b border-[var(--color-border)] last:border-b-0';

  return (
    <div 
      className={`group relative flex cursor-pointer items-start gap-4 p-4 transition-colors hover:bg-[var(--color-bg)] ${containerStyle} ${inDropdown ? 'hover:bg-gray-50' : ''}`}
      onClick={handleContainerClick}
    >
      <div className="mt-1 shrink-0">
        <Icon size={20} color={color} />
      </div>
      
      <div className="flex-1 pr-6">
        <p className={`text-sm ${isRead ? 'text-[var(--color-text)]' : 'text-[var(--color-text)] font-semibold'}`}>
          {message}
        </p>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </div>

      {!inDropdown && (
        <button
          onClick={handleDelete}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded p-2 text-[var(--color-text-placeholder)] opacity-0 hover:bg-[var(--color-danger-light)] hover:text-[var(--color-danger)] group-hover:opacity-100 transition-all"
          title="Delete notification"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
