import React from 'react';
import { Box, Grid, Paper, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { KPICard, EnergyChart } from '../components';
import { generateMockKPIs } from '../data/mockData';
import { colors } from '../theme/theme';

export const Energy: React.FC = () => {
  const kpis = generateMockKPIs();

  const energyKPIs = [
    { label: '风电发电量', value: 15230, unit: 'kWh', trend: 8.2, trendDirection: 'up' as const, status: 'normal' as const },
    { label: '总用电量', value: 12450, unit: 'kWh', trend: 3.5, trendDirection: 'up' as const, status: 'normal' as const },
    { label: '弃风量', value: 780, unit: 'kWh', trend: 15.2, trendDirection: 'down' as const, status: 'normal' as const },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h2">
          能源管理 / 电力概览
        </Typography>
        <ToggleButtonGroup size="small">
          <ToggleButton value="today">今日</ToggleButton>
          <ToggleButton value="week">本周</ToggleButton>
          <ToggleButton value="month">本月</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Power Balance Diagram */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          电力平衡图
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 4, py: 2 }}>
          {/* Wind Power Source */}
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                bgcolor: `${colors.success}20`,
                border: `2px solid ${colors.success}`,
                borderRadius: 2,
                p: 2,
                minWidth: 100,
              }}
            >
              <Typography variant="caption" sx={{ color: colors.success }}>风电</Typography>
              <Typography variant="h5" sx={{ color: colors.success }}>15,230 kWh</Typography>
            </Box>
          </Box>

          {/* Arrow */}
          <Box sx={{ display: 'flex', alignItems: 'center', pt: 3 }}>
            <Typography variant="h4" sx={{ color: colors.textSecondary }}>→</Typography>
          </Box>

          {/* Distribution */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {[
              { name: '电池库温控', amount: 4200, color: colors.primary },
              { name: '储能充电', amount: 3500, color: colors.secondary },
              { name: '居民用电', amount: 2800, color: colors.warning },
              { name: '热量存储', amount: 1950, color: colors.heatHigh },
            ].map((item) => (
              <Box
                key={item.name}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: item.color,
                  }}
                />
                <Typography variant="body2" sx={{ minWidth: 80 }}>{item.name}</Typography>
                <Typography variant="body2" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                  {item.amount.toLocaleString()} kWh
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Arrow */}
          <Box sx={{ display: 'flex', alignItems: 'center', pt: 3 }}>
            <Typography variant="h4" sx={{ color: colors.textSecondary }}>→</Typography>
          </Box>

          {/* Salt Storage */}
          <Box
            sx={{
              textAlign: 'center',
              bgcolor: `${colors.secondary}20`,
              border: `2px solid ${colors.secondary}`,
              borderRadius: 2,
              p: 2,
              minWidth: 100,
            }}
          >
            <Typography variant="caption" sx={{ color: colors.secondary }}>盐融堆</Typography>
            <Typography variant="h5" sx={{ color: colors.secondary }}>热量存储</Typography>
          </Box>
        </Box>
      </Paper>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {energyKPIs.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <KPICard data={kpi} />
          </Grid>
        ))}
      </Grid>

      {/* Energy Chart */}
      <Paper sx={{ p: 3 }}>
        <EnergyChart height={320} />
      </Paper>
    </Box>
  );
};
