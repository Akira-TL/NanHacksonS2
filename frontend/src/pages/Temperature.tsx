import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, ToggleButton, ToggleButtonGroup, TextField, Button, Chip } from '@mui/material';
import { TemperatureHeatMap, TemperatureTrendChart, StatusBadge } from '../components';
import { generateMockBatteryUnits } from '../data/mockData';
import { colors } from '../theme/theme';

export const Temperature: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'heatmap'>('grid');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const batteryUnits = generateMockBatteryUnits();

  const regions = ['all', 'A区', 'B区', 'C区', 'D区'];

  const filteredUnits = selectedRegion === 'all'
    ? batteryUnits
    : batteryUnits.filter(u => u.region === selectedRegion);

  const stats = {
    normal: filteredUnits.filter(u => u.status === 'normal').length,
    warning: filteredUnits.filter(u => u.status === 'warning').length,
    critical: filteredUnits.filter(u => u.status === 'critical').length,
  };

  const selectedUnitData = batteryUnits.find(u => u.id === selectedUnit);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h2">
          温度监控
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, v) => v && setViewMode(v)}
            size="small"
          >
            <ToggleButton value="grid">网格视图</ToggleButton>
            <ToggleButton value="heatmap">云图视图</ToggleButton>
          </ToggleButtonGroup>
          <Button variant="outlined" size="small">刷新</Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="caption" sx={{ color: colors.textSecondary, mb: 0.5, display: 'block' }}>
              区域筛选
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {regions.map(region => (
                <Chip
                  key={region}
                  label={region === 'all' ? '全部' : region}
                  onClick={() => setSelectedRegion(region)}
                  variant={selectedRegion === region ? 'filled' : 'outlined'}
                  color={selectedRegion === region ? 'primary' : 'default'}
                  size="small"
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
            <TextField
              placeholder="搜索电池单元..."
              size="small"
              variant="outlined"
              sx={{ width: 200 }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, mt: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: colors.success }} />
            <Typography variant="body2">正常: {stats.normal}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: colors.warning }} />
            <Typography variant="body2">告警: {stats.warning}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: colors.error }} />
            <Typography variant="body2" sx={{ color: colors.error }}>严重: {stats.critical}</Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          {viewMode === 'grid' ? (
            <Paper sx={{ p: 2 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: 1.5,
                }}
              >
                {filteredUnits.map((unit) => {
                  const bgColor = unit.status === 'normal' ? colors.success
                    : unit.status === 'warning' ? colors.warning
                    : colors.error;

                  return (
                    <Paper
                      key={unit.id}
                      onClick={() => setSelectedUnit(unit.id)}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        bgcolor: `${bgColor}15`,
                        border: `2px solid ${selectedUnit === unit.id ? colors.primary : bgColor}`,
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: 2,
                        },
                      }}
                    >
                      <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                        {unit.id}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontFamily: '"Roboto Mono", monospace',
                          color: bgColor,
                          my: 0.5,
                        }}
                      >
                        {unit.temperature}°C
                      </Typography>
                      <StatusBadge
                        status={unit.status}
                        label={unit.status === 'normal' ? '正常' : unit.status === 'warning' ? '偏低' : '告警'}
                      />
                    </Paper>
                  );
                })}
              </Box>
            </Paper>
          ) : (
            <Paper sx={{ p: 2 }}>
              <TemperatureHeatMap />
            </Paper>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Selected Unit Details */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              电池详情
            </Typography>
            {selectedUnitData ? (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">
                    {selectedUnitData.id}
                  </Typography>
                  <StatusBadge status={selectedUnitData.status} />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                      当前温度
                    </Typography>
                    <Typography variant="h4" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                      {selectedUnitData.temperature}°C
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                      目标温度
                    </Typography>
                    <Typography variant="h4" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                      {selectedUnitData.targetTemp}°C
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                    SOC: {selectedUnitData.soc}%
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button variant="contained" size="small" color="success">
                    开启供暖
                  </Button>
                  <Button variant="outlined" size="small" color="error">
                    开启制冷
                  </Button>
                  <Button variant="outlined" size="small">
                    调整目标
                  </Button>
                  <Button variant="text" size="small">
                    查看历史
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                点击左侧电池单元查看详情
              </Typography>
            )}
          </Paper>

          {/* Temperature Trend for selected unit */}
          {selectedUnitData && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                温度曲线
              </Typography>
              <TemperatureTrendChart height={200} />
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
