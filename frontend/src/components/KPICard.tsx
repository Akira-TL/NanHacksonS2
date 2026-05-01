import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { colors } from '../theme/theme';
import { KPIData } from '../data/mockData';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

interface KPICardProps {
  data: KPIData;
  size?: 'small' | 'large';
}

export const KPICard: React.FC<KPICardProps> = ({ data, size = 'small' }) => {
  const getStatusColor = () => {
    if (data.status === 'critical') return colors.error;
    if (data.status === 'warning') return colors.warning;
    return colors.success;
  };

  const getTrendIcon = () => {
    if (data.trendDirection === 'up') return <TrendingUpIcon sx={{ fontSize: 16 }} />;
    if (data.trendDirection === 'down') return <TrendingDownIcon sx={{ fontSize: 16 }} />;
    return <TrendingFlatIcon sx={{ fontSize: 16 }} />;
  };

  const progress = data.targetMin !== undefined && data.targetMax !== undefined
    ? ((data.value - data.targetMin) / (data.targetMax - data.targetMin)) * 100
    : data.value;

  return (
    <Card sx={{ height: '100%', minWidth: 180 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>
          {data.label}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
          <Typography
            variant={size === 'large' ? 'h1' : 'h2'}
            sx={{
              fontFamily: '"Roboto Mono", monospace',
              fontWeight: 300,
              color: colors.textPrimary,
              lineHeight: 1.2,
            }}
          >
            {typeof data.value === 'number' ? data.value.toFixed(1) : data.value}
          </Typography>
          <Typography variant="body1" sx={{ color: colors.textSecondary }}>
            {data.unit}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: data.trendDirection === 'up' ? colors.success :
                     data.trendDirection === 'down' ? colors.error : colors.warning,
            }}
          >
            {getTrendIcon()}
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {data.trend} {data.unit ? (data.unit === '°C' ? '°C' : '%') : ''} /1h
            </Typography>
          </Box>
        </Box>

        {(data.targetMin !== undefined || data.targetMax !== undefined) && (
          <Box sx={{ mt: 1.5 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(Math.max(progress, 0), 100)}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: colors.surface,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getStatusColor(),
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
