import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import {
  KPICard,
  HeatFlowDiagram,
  TemperatureHeatMap,
  AlertList,
  TemperatureTrendChart,
} from '../components';
import {
  generateMockKPIs,
  generateMockAlerts,
  regionStats,
} from '../data/mockData';
import { colors } from '../theme/theme';
import { StatusBadge } from '../components/StatusBadge';

export const Dashboard: React.FC = () => {
  const kpis = generateMockKPIs();
  const alerts = generateMockAlerts();

  return (
    <Box>
      <Typography variant="h2" sx={{ mb: 3 }}>
        首页 / 主仪表盘
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {kpis.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <KPICard data={kpi} />
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} lg={8}>
          {/* Heat Flow Diagram */}
          <Paper sx={{ mb: 3 }}>
            <HeatFlowDiagram />
          </Paper>

          {/* Multi-region Status */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              多区域电池库状态
            </Typography>
            <Grid container spacing={2}>
              {regionStats.map((region) => (
                <Grid item xs={6} sm={3} key={region.name}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      bgcolor: `${colors.surfaceElevated}`,
                      border: region.status === 'warning'
                        ? `2px solid ${colors.warning}`
                        : `2px solid ${colors.surface}`,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                      {region.name}
                    </Typography>
                    <Typography variant="h4" sx={{ my: 1, fontFamily: '"Roboto Mono", monospace' }}>
                      {region.avgTemp}°C
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                      达标率 {region.rate}%
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <StatusBadge
                        status={region.status as 'normal' | 'warning' | 'critical'}
                        label={region.status === 'warning' ? '偏低' : '正常'}
                      />
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Temperature Trend */}
          <Paper sx={{ p: 3 }}>
            <TemperatureTrendChart height={280} />
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={4}>
          {/* Heat Collection Ranking */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              热量回收排行
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { name: '压缩机 #1', amount: 850, unit: 'kWh' },
                { name: '风冷+压缩', amount: 580, unit: 'kWh' },
                { name: '发热片阵列', amount: 420, unit: 'kWh' },
              ].map((item, index) => (
                <Box
                  key={item.name}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    bgcolor: colors.surfaceElevated,
                    borderRadius: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: index === 0 ? colors.warning : index === 1 ? colors.primary : colors.secondary,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                      }}
                    >
                      {index + 1}
                    </Typography>
                    <Typography variant="body2">{item.name}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                    {item.amount} <span style={{ fontSize: 10, color: colors.textSecondary }}>{item.unit}</span>
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Curtailment Rate */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              弃风消纳率
            </Typography>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography
                variant="h1"
                sx={{
                  fontFamily: '"Roboto Mono", monospace',
                  fontWeight: 300,
                  color: colors.success,
                  fontSize: 64,
                }}
              >
                91.2%
              </Typography>
              <Typography variant="body2" sx={{ color: colors.success }}>
                ↑ 3.2% /1h
              </Typography>
            </Box>
          </Paper>

          {/* Today's Alerts */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              今日告警
            </Typography>
            <AlertList alerts={alerts} compact />
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="caption" sx={{ color: colors.error }}>
                紧急: 0
              </Typography>
              <Typography variant="caption" sx={{ color: colors.warning }}>
                严重: 2
              </Typography>
              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                一般: 1
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
