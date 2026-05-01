import React from 'react';
import { Box, Typography, Grid, Paper, Chip } from '@mui/material';
import { KPICard, HeatFlowDiagram, TemperatureTrendChart, AlertList } from '../components';
import { generateMockKPIs, generateMockAlerts, regionStats } from '../data/mockData';
import { colors } from '../theme/theme';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const Display: React.FC = () => {
  const navigate = useNavigate();
  const kpis = generateMockKPIs();
  const alerts = generateMockAlerts().filter(a => a.status !== 'resolved');

  const mainKPIs = [
    kpis.find(k => k.label === '电池库平均温度')!,
    kpis.find(k => k.label === '温度达标率')!,
    kpis.find(k => k.label === '系统COP')!,
    kpis.find(k => k.label === '弃风消纳率')!,
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: colors.background,
        p: 3,
        position: 'relative',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 500,
              color: colors.primary,
              letterSpacing: 2,
            }}
          >
            垃圾电/热能回收管理平台
          </Typography>
          <Typography variant="body1" sx={{ color: colors.textSecondary, mt: 1 }}>
            系统运行时间: 72天15小时 | 最后更新: {new Date().toLocaleTimeString('zh-CN')}
          </Typography>
        </Box>
        <Chip
          icon={<ArrowBackIcon />}
          label="返回后台"
          onClick={() => navigate('/')}
          sx={{
            bgcolor: colors.surface,
            '&:hover': { bgcolor: colors.surfaceElevated },
          }}
        />
      </Box>

      {/* Main KPI Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {mainKPIs.map((kpi, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Paper
              sx={{
                p: 3,
                textAlign: 'center',
                bgcolor: colors.surface,
                border: `2px solid ${colors.primary}40`,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: colors.textSecondary,
                  fontSize: 16,
                }}
              >
                {kpi.label}
              </Typography>
              <Box sx={{ my: 1 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: '"Roboto Mono", monospace',
                    fontWeight: 300,
                    fontSize: 56,
                    color: colors.textPrimary,
                  }}
                >
                  {kpi.value.toFixed(1)}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: colors.textSecondary,
                    fontSize: 18,
                  }}
                >
                  {kpi.unit}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: kpi.trendDirection === 'up' ? colors.success : colors.error,
                  fontSize: 14,
                }}
              >
                {kpi.trendDirection === 'up' ? '↑' : '↓'} {kpi.trend} {kpi.unit || '%'} /1h
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left - Heat Flow */}
        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <HeatFlowDiagram compact />
          </Paper>
        </Grid>

        {/* Right - Stats */}
        <Grid item xs={12} lg={5}>
          <Grid container spacing={2}>
            {/* Curtailment Rate */}
            <Grid item xs={6}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: colors.surface,
                  border: `2px solid ${colors.success}40`,
                }}
              >
                <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 1 }}>
                  弃风消纳率
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: '"Roboto Mono", monospace',
                    fontWeight: 300,
                    fontSize: 48,
                    color: colors.success,
                  }}
                >
                  91.2%
                </Typography>
                <Typography variant="body2" sx={{ color: colors.success }}>
                  ↑ 3.2% /1h
                </Typography>
              </Paper>
            </Grid>

            {/* Alerts */}
            <Grid item xs={6}>
              <Paper sx={{ p: 3, bgcolor: colors.surface }}>
                <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 1 }}>
                  今日告警
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: '"Roboto Mono", monospace',
                    fontWeight: 300,
                    fontSize: 48,
                    color: colors.warning,
                  }}
                >
                  3条
                </Typography>
                <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                  0紧急 / 3一般
                </Typography>
              </Paper>
            </Grid>

            {/* Region Status */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: colors.surface }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  区域状态概览
                </Typography>
                <Grid container spacing={2}>
                  {regionStats.map((region) => (
                    <Grid item xs={3} key={region.name}>
                      <Box
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          bgcolor: colors.surfaceElevated,
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                          {region.name}
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{
                            fontFamily: '"Roboto Mono", monospace',
                            my: 1,
                          }}
                        >
                          {region.avgTemp}°C
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.success }}>
                          达标率 {region.rate}%
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>

            {/* Heat Ranking */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: colors.surface }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  热量回收排行
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {[
                    { name: '压缩机 #1', amount: 850, color: colors.warning },
                    { name: '风冷+压缩', amount: 580, color: colors.primary },
                    { name: '发热片阵列', amount: 420, color: colors.secondary },
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
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            bgcolor: item.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: 12,
                            fontWeight: 'bold',
                          }}
                        >
                          {index + 1}
                        </Box>
                        <Typography variant="body1">{item.name}</Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ fontFamily: '"Roboto Mono", monospace' }}
                      >
                        {item.amount} <span style={{ fontSize: 12, color: colors.textSecondary }}>kWh</span>
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Temperature Trend */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <TemperatureTrendChart height={300} />
          </Paper>
        </Grid>

        {/* System Status */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              bgcolor: colors.surface,
            }}
          >
            <Typography variant="body2" sx={{ color: colors.success }}>
              ● 服务器: 正常
            </Typography>
            <Typography variant="body2" sx={{ color: colors.success }}>
              ● 数据库: 正常
            </Typography>
            <Typography variant="body2" sx={{ color: colors.success }}>
              ● 通讯: 正常
            </Typography>
            <Typography variant="body2" sx={{ color: colors.success }}>
              ● 策略: 执行中
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
