import React from 'react';
import { StatusType } from '../../types';
import { getStatusColor } from '../../utils/calculations';

interface BadgeProps {
  status: StatusType;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${getStatusColor(status)} ${className}`}>
      {status}
    </span>
  );
};
