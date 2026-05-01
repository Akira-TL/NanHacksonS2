import React from 'react';
import { Box, Grid, Paper, Typography, Slider, Button, Chip, Divider } from '@mui/material';
import { KPICard, DeviceCard, HeatFlowDiagram } from '../components';
import { generateMockHeatDevices, generateMockKPIs } from '../data/mockData';
import { colors } from '../theme/theme';

export const Heat: React.FC = () => {
  const devices = generateMockHeatDevices();
  const kpis = generateMockKPIs();

  const heatKPIs = [
    kpis.find(k => k.label === '热量回收总量')!,
    {
      label: '热量利用率',
      value: 85.3,
      unit: '%',
      trend: 0.3,
      trendDirection: 'down' as const,
      status: 'normal' as const,
    },
    kpis.find(k => k.label === '盐融堆存储')!,
  ];

  return (
    <Box>
      <Typography variant="h2" sx={{ mb: 3 }}>
        热量管理 / 回收概览
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {heatKPIs.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <KPICard data={kpi} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} lg={7}>
          {/* Recovery Methods Proportion */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              三种方式回收占比
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, py: 3 }}>
              {[
                { name: '压缩机式', value: 46, amount: 850, color: colors.primary },
                { name: '风冷+压缩', value: 31, amount: 580, color: colors.secondary },
                { name: '发热片', value: 23, amount: 420, color: colors.warning },
              ].map((item) => (
                <Box key={item.name} sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      border: `8px solid ${item.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1,
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 500 }}>
                      {item.value}%
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                    {item.amount} kWh
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Device Cards */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            设备实时状态
          </Typography>
          <Grid container spacing={2}>
            {devices.map((device) => (
              <Grid item xs={12} sm={6} md={6} key={device.id}>
                <DeviceCard device={device} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={5}>
          {/* Heat Balance Table */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              热量平衡表
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: colors.success, fontWeight: 500, mb: 1 }}>
                热量收入
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { name: '电池充放电余热', amount: 2100 },
                  { name: '弃风电力转热量', amount: 1200 },
                  { name: '压缩机做功输入', amount: 700 },
                ].map((item) => (
                  <Box
                    key={item.name}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      p: 1,
                      bgcolor: colors.surfaceElevated,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">{item.name}</Typography>
                    <Typography variant="body2" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                      {item.amount} kWh
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: colors.warning, fontWeight: 500, mb: 1 }}>
                热量支出
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { name: '电池库供暖消耗', amount: 1680 },
                  { name: '存储至盐融堆', amount: 1850 },
                  { name: '系统损耗', amount: 320 },
                ].map((item) => (
                  <Box
                    key={item.name}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      p: 1,
                      bgcolor: colors.surfaceElevated,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">{item.name}</Typography>
                    <Typography variant="body2" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                      {item.amount} kWh
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 2,
                bgcolor: `${colors.success}20`,
                borderRadius: 1,
                border: `1px solid ${colors.success}`,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                热量利用率
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: colors.success }}>
                85.3%
              </Typography>
            </Box>
          </Paper>

          {/* Compressor Control Panel */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                压缩机 #1 控制面板
              </Typography>
              <Chip label="运行中" size="small" sx={{ bgcolor: colors.success, color: 'white' }} />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                当前状态: <strong>热量收集中 (COMPRESSING)</strong>
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                转速调节 (0-100%)
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Slider
                  value={75}
                  sx={{ color: colors.primary }}
                />
                <Typography variant="body2" sx={{ minWidth: 50 }}>
                  75%
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                1800 RPM
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                  COP
                </Typography>
                <Typography variant="h5" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                  3.2
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                  输入功率
                </Typography>
                <Typography variant="h5" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                  15.8 kW
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                  入口温度
                </Typography>
                <Typography variant="h5" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                  35.5°C
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                  出口温度
                </Typography>
                <Typography variant="h5" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                  185.2°C
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" size="small" sx={{ flex: 1 }}>
                调整转速
              </Button>
              <Button variant="outlined" size="small" sx={{ flex: 1 }}>
                切换模式
              </Button>
              <Button variant="contained" color="error" size="small" sx={{ flex: 1 }}>
                紧急停机
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
