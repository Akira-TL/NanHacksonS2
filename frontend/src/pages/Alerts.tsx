import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, ToggleButton, ToggleButtonGroup, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { AlertList } from '../components';
import { generateMockAlerts, Alert } from '../data/mockData';
import { colors } from '../theme/theme';

export const Alerts: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const alerts = generateMockAlerts();

  const filteredAlerts = alerts.filter(alert => {
    if (statusFilter !== 'all' && alert.status !== statusFilter) return false;
    if (levelFilter !== 'all' && alert.level !== levelFilter) return false;
    return true;
  });

  const stats = {
    total: alerts.length,
    new: alerts.filter(a => a.status === 'new').length,
    acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h2">
          告警中心 / 实时告警
        </Typography>
      </Box>

      {/* Stats */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {[
                { label: '全部', value: stats.total, color: colors.textSecondary },
                { label: '新告警', value: stats.new, color: colors.error },
                { label: '处理中', value: stats.acknowledged, color: colors.warning },
                { label: '已解决', value: stats.resolved, color: colors.success },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 1,
                    bgcolor: `${item.color}15`,
                    borderRadius: 1,
                    border: `1px solid ${item.color}40`,
                  }}
                >
                  <Typography variant="body2" sx={{ color: item.color }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h6" sx={{ color: item.color }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item sx={{ ml: 'auto' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <ToggleButtonGroup
                value={statusFilter}
                exclusive
                onChange={(_, v) => v && setStatusFilter(v)}
                size="small"
              >
                <ToggleButton value="all">全部</ToggleButton>
                <ToggleButton value="new">未处理</ToggleButton>
                <ToggleButton value="acknowledged">处理中</ToggleButton>
                <ToggleButton value="resolved">已解决</ToggleButton>
              </ToggleButtonGroup>

              <ToggleButtonGroup
                value={levelFilter}
                exclusive
                onChange={(_, v) => v && setLevelFilter(v)}
                size="small"
              >
                <ToggleButton value="all">全部等级</ToggleButton>
                <ToggleButton value="P0">P0</ToggleButton>
                <ToggleButton value="P1">P1</ToggleButton>
                <ToggleButton value="P2">P2</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2 }}>
            <AlertList
              alerts={filteredAlerts}
              onAlertClick={(alert) => setSelectedAlert(alert)}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          {/* Alert Detail */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              告警详情
            </Typography>
            {selectedAlert ? (
              <Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label={selectedAlert.level}
                    size="small"
                    sx={{
                      bgcolor: selectedAlert.level === 'P0' ? colors.error :
                              selectedAlert.level === 'P1' ? colors.warning :
                              selectedAlert.level === 'P2' ? '#FFA726' : colors.secondary,
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                  <Chip
                    label={selectedAlert.status === 'new' ? '新告警' :
                            selectedAlert.status === 'acknowledged' ? '处理中' : '已解决'}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                      告警ID
                    </Typography>
                    <Typography variant="body2">{selectedAlert.id}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                      设备
                    </Typography>
                    <Typography variant="body2">{selectedAlert.deviceName}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                      类型
                    </Typography>
                    <Typography variant="body2">{selectedAlert.type}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                      消息
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedAlert.message}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                      时间
                    </Typography>
                    <Typography variant="body2">
                      {new Date(selectedAlert.timestamp).toLocaleString('zh-CN')}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                  <Button variant="contained" color="primary" fullWidth>
                    处理告警
                  </Button>
                  <Button variant="outlined" fullWidth>
                    派发工单
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                点击左侧告警查看详情
              </Typography>
            )}
          </Paper>

          {/* Alert Rules */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              告警规则配置
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { rule: '温度超限', threshold: '>30°C或<5°C', level: 'P0' },
                { rule: '通讯中断', threshold: '5秒无心跳', level: 'P1' },
                { rule: '温差过大', threshold: '区域温差>5°C', level: 'P2' },
              ].map((item) => (
                <Box
                  key={item.rule}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1.5,
                    bgcolor: colors.surfaceElevated,
                    borderRadius: 1,
                  }}
                >
                  <Box>
                    <Typography variant="body2">{item.rule}</Typography>
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                      {item.threshold}
                    </Typography>
                  </Box>
                  <Chip
                    label={item.level}
                    size="small"
                    sx={{
                      bgcolor: item.level === 'P0' ? colors.error :
                              item.level === 'P1' ? colors.warning : colors.secondary,
                      color: 'white',
                      fontSize: 10,
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Alert Processing Dialog */}
      <Dialog open={!!selectedAlert} onClose={() => setSelectedAlert(null)} maxWidth="sm" fullWidth>
        <DialogTitle>处理告警</DialogTitle>
        <DialogContent>
          {selectedAlert && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                确定要处理此告警吗？
              </Typography>
              <Box sx={{ p: 2, bgcolor: colors.surfaceElevated, borderRadius: 1 }}>
                <Typography variant="body2">{selectedAlert.message}</Typography>
                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                  {selectedAlert.deviceName} - {selectedAlert.id}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedAlert(null)}>取消</Button>
          <Button variant="contained" onClick={() => setSelectedAlert(null)}>
            确认处理
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
