import React from 'react';
import { Chip } from '@mui/material';
import { colors } from '../theme/theme';

interface StatusBadgeProps {
  status: 'normal' | 'warning' | 'critical' | 'running' | 'standby' | 'offline';
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'normal':
      case 'running':
        return { color: colors.success, label: label || '正常' };
      case 'warning':
        return { color: colors.warning, label: label || '告警' };
      case 'critical':
        return { color: colors.error, label: label || '严重' };
      case 'standby':
        return { color: colors.secondary, label: label || '待机' };
      case 'offline':
        return { color: colors.textSecondary, label: label || '离线' };
      default:
        return { color: colors.textSecondary, label: label || '未知' };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        backgroundColor: `${config.color}20`,
        color: config.color,
        border: `1px solid ${config.color}`,
        fontWeight: 500,
        fontSize: 12,
      }}
    />
  );
};
