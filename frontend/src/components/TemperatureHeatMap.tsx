import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { colors } from '../theme/theme';
import { generateMockBatteryUnits } from '../data/mockData';

interface TemperatureHeatMapProps {
  compact?: boolean;
}

export const TemperatureHeatMap: React.FC<TemperatureHeatMapProps> = ({ compact = false }) => {
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const batteryUnits = generateMockBatteryUnits();

  const getTemperatureColor = (temp: number) => {
    if (temp < 15) return colors.heatLow;
    if (temp >= 15 && temp <= 25) return colors.success;
    if (temp > 25 && temp <= 35) return colors.warning;
    return colors.error;
  };

  const getStatusText = (temp: number) => {
    if (temp < 15) return '偏低';
    if (temp >= 15 && temp <= 25) return '正常';
    if (temp > 25 && temp <= 35) return '偏高';
    return '告警';
  };

  const rows = 6;
  const cols = 12;
  const cellSize = compact ? 40 : 56;

  const gridData = batteryUnits.slice(0, rows * cols);

  const stats = {
    normal: gridData.filter(u => u.temperature >= 15 && u.temperature <= 25).length,
    low: gridData.filter(u => u.temperature < 15).length,
    high: gridData.filter(u => u.temperature > 25 && u.temperature <= 35).length,
    critical: gridData.filter(u => u.temperature > 35).length,
  };

  return (
    <Box>
      {!compact && (
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: colors.heatLow }} />
            <Typography variant="caption">&lt;15°C 偏低</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: colors.success }} />
            <Typography variant="caption">15-25°C 正常</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: colors.warning }} />
            <Typography variant="caption">25-35°C 偏高</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: colors.error }} />
            <Typography variant="caption">&gt;35°C 告警</Typography>
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gap: 0.5,
          p: 2,
          bgcolor: colors.surface,
          borderRadius: 2,
        }}
      >
        {gridData.map((unit, index) => {
          const isSelected = selectedUnit === unit.id;
          const bgColor = getTemperatureColor(unit.temperature);

          return (
            <Paper
              key={unit.id}
              onClick={() => setSelectedUnit(isSelected ? null : unit.id)}
              sx={{
                width: cellSize,
                height: cellSize,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: `${bgColor}30`,
                border: `2px solid ${isSelected ? colors.primary : bgColor}`,
                borderRadius: 1,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 2,
                },
              }}
            >
              <Typography
                variant={compact ? 'caption' : 'body2'}
                sx={{
                  fontFamily: '"Roboto Mono", monospace',
                  fontWeight: 500,
                  color: bgColor,
                  fontSize: compact ? 10 : 14,
                }}
              >
                {unit.temperature.toFixed(1)}
              </Typography>
              {!compact && (
                <Typography variant="caption" sx={{ fontSize: 8, color: colors.textSecondary }}>
                  °C
                </Typography>
              )}
            </Paper>
          );
        })}
      </Box>

      {!compact && (
        <Box sx={{ mt: 2, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Typography variant="body2">
            正常(15-25°C): <strong>{stats.normal}</strong>个 占比: <strong>{((stats.normal / gridData.length) * 100).toFixed(1)}%</strong>
          </Typography>
          <Typography variant="body2">
            偏低(&lt;15°C): <strong>{stats.low}</strong>个
          </Typography>
          <Typography variant="body2">
            偏高(25-35°C): <strong>{stats.high}</strong>个
          </Typography>
          <Typography variant="body2" sx={{ color: colors.error }}>
            告警(&gt;35°C): <strong>{stats.critical}</strong>个
          </Typography>
        </Box>
      )}

      {selectedUnit && !compact && (
        <Paper sx={{ mt: 2, p: 2, bgcolor: colors.surfaceElevated }}>
          <Typography variant="body2" sx={{ color: colors.textSecondary }}>
            选中电池: <strong>{selectedUnit}</strong>
          </Typography>
          <Typography variant="body2">
            温度: <strong>{batteryUnits.find(u => u.id === selectedUnit)?.temperature}°C</strong>
          </Typography>
          <Typography variant="body2">
            状态: <strong>{getStatusText(batteryUnits.find(u => u.id === selectedUnit)?.temperature || 0)}</strong>
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
