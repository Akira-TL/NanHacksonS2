import React from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { colors } from '../theme/theme';
import { Alert } from '../data/mockData';

interface AlertListProps {
  alerts: Alert[];
  onAlertClick?: (alert: Alert) => void;
  compact?: boolean;
}

export const AlertList: React.FC<AlertListProps> = ({ alerts, onAlertClick, compact = false }) => {
  const getLevelColor = (level: Alert['level']) => {
    switch (level) {
      case 'P0': return colors.error;
      case 'P1': return colors.warning;
      case 'P2': return '#FFA726';
      case 'P3': return colors.secondary;
      default: return colors.textSecondary;
    }
  };

  const getLevelBgColor = (level: Alert['level']) => {
    switch (level) {
      case 'P0': return `${colors.error}20`;
      case 'P1': return `${colors.warning}20`;
      case 'P2': return '#FFA72620';
      case 'P3': return `${colors.secondary}20`;
      default: return `${colors.textSecondary}20`;
    }
  };

  const getStatusChip = (status: Alert['status']) => {
    switch (status) {
      case 'new':
        return <Chip label="新告警" size="small" sx={{ bgcolor: colors.error, color: 'white', fontSize: 10 }} />;
      case 'acknowledged':
        return <Chip label="处理中" size="small" sx={{ bgcolor: colors.warning, color: 'white', fontSize: 10 }} />;
      case 'resolved':
        return <Chip label="已解决" size="small" sx={{ bgcolor: colors.success, color: 'white', fontSize: 10 }} />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  if (alerts.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ color: colors.textSecondary }}>
          暂无告警信息
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {alerts.map((alert) => (
        <Paper
          key={alert.id}
          onClick={() => onAlertClick?.(alert)}
          sx={{
            p: 2,
            bgcolor: getLevelBgColor(alert.level),
            borderLeft: `4px solid ${getLevelColor(alert.level)}`,
            cursor: onAlertClick ? 'pointer' : 'default',
            transition: 'all 0.2s',
            '&:hover': onAlertClick ? {
              bgcolor: `${getLevelColor(alert.level)}30`,
            } : {},
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={alert.level}
                size="small"
                sx={{
                  bgcolor: getLevelColor(alert.level),
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 10,
                  minWidth: 32,
                }}
              />
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                {formatTime(alert.timestamp)}
              </Typography>
            </Box>
            {getStatusChip(alert.status)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                {alert.deviceName}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {alert.message}
              </Typography>
            </Box>

            {onAlertClick && alert.status === 'new' && (
              <Button
                variant="outlined"
                size="small"
                sx={{
                  borderColor: getLevelColor(alert.level),
                  color: getLevelColor(alert.level),
                  '&:hover': {
                    borderColor: getLevelColor(alert.level),
                    bgcolor: `${getLevelColor(alert.level)}20`,
                  },
                }}
              >
                立即处理
              </Button>
            )}
          </Box>

          {!compact && (
            <Typography variant="caption" sx={{ color: colors.textSecondary, mt: 1, display: 'block' }}>
              告警ID: {alert.id}
            </Typography>
          )}
        </Paper>
      ))}
    </Box>
  );
};
