import React from 'react';
import { Box, Typography, Paper, Slider, Button, Chip } from '@mui/material';
import { colors } from '../theme/theme';
import { HeatCollectionDevice } from '../data/mockData';

interface DeviceCardProps {
  device: HeatCollectionDevice;
  onControl?: (device: HeatCollectionDevice, action: string, value?: number) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onControl }) => {
  const getStatusColor = () => {
    switch (device.status) {
      case 'running': return colors.success;
      case 'standby': return colors.warning;
      case 'offline': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getDeviceIcon = () => {
    switch (device.type) {
      case 'compressor':
        return '🔄';
      case 'heatSheet':
        return '📋';
      case 'forcedAir':
        return '💨';
      default:
        return '⚙️';
    }
  };

  const getDeviceName = () => {
    switch (device.type) {
      case 'compressor': return '压缩机';
      case 'heatSheet': return '发热片阵列';
      case 'forcedAir': return '风冷+压缩协同';
      default: return device.type;
    }
  };

  return (
    <Paper sx={{ p: 2, bgcolor: colors.surface }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6">{getDeviceIcon()}</Typography>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {getDeviceName()}
            </Typography>
            <Typography variant="caption" sx={{ color: colors.textSecondary }}>
              {device.id}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={device.status === 'running' ? '运行中' : device.status === 'standby' ? '待机' : '离线'}
          size="small"
          sx={{
            bgcolor: `${getStatusColor()}30`,
            color: getStatusColor(),
            border: `1px solid ${getStatusColor()}`,
          }}
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <Box>
          <Typography variant="caption" sx={{ color: colors.textSecondary }}>
            {device.type === 'compressor' ? 'COP' : '效率'}
          </Typography>
          <Typography variant="h5" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
            {device.type === 'compressor' ? device.cop : `${device.efficiency}%`}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ color: colors.textSecondary }}>
            今日收热量
          </Typography>
          <Typography variant="h5" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
            {device.heatCollected}
            <Typography component="span" variant="caption"> kWh</Typography>
          </Typography>
        </Box>
      </Box>

      {device.type === 'compressor' && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: colors.textSecondary }}>
            压缩机转速: {device.cop ? '75%' : 'N/A'}
          </Typography>
          <Slider
            value={75}
            disabled
            sx={{ color: colors.primary }}
          />
        </Box>
      )}

      {device.type === 'forcedAir' && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: colors.textSecondary }}>
            风机转速: {device.fanSpeed}%
          </Typography>
          <Slider
            value={device.fanSpeed || 0}
            disabled
            sx={{ color: colors.primary }}
          />
        </Box>
      )}

      {device.type === 'heatSheet' && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: colors.textSecondary }}>
            激活发热片: {device.activeSheets}/{device.totalSheets}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          sx={{ flex: 1 }}
        >
          调整参数
        </Button>
        <Button
          variant="outlined"
          size="small"
          color={device.status === 'running' ? 'error' : 'primary'}
          sx={{ flex: 1 }}
        >
          {device.status === 'running' ? '紧急停机' : '启动'}
        </Button>
      </Box>
    </Paper>
  );
};
