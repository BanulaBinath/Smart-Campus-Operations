import React from 'react';

/**
 * @param {Object} props
 * @param {string} props.role - USER, ADMIN, or TECHNICIAN
 */
const RoleBadge = ({ role }) => {
  let bgColor = '';
  let textColor = '';

  switch (role) {
    case 'ADMIN':
      bgColor = 'var(--color-danger-light)';
      textColor = 'var(--color-danger-text)';
      break;
    case 'TECHNICIAN':
      bgColor = 'var(--color-warning-light)';
      textColor = 'var(--color-warning-text)';
      break;
    case 'USER':
    default:
      bgColor = 'var(--color-primary-light)';
      textColor = 'var(--color-primary-text)';
      break;
  }

  return (
    <span
      style={{ backgroundColor: bgColor, color: textColor }}
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium"
    >
      {role || 'USER'}
    </span>
  );
};

export default RoleBadge;
