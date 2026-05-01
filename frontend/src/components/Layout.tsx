import React, { useState } from 'react';
import { Box, Typography, IconButton, Badge, Avatar, Menu, MenuItem, AppBar, Toolbar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import { colors } from '../theme/theme';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/temperature', label: '温度监控', icon: '🌡️' },
  { path: '/energy', label: '能源管理', icon: '⚡' },
  { path: '/heat', label: '热量管理', icon: '🔥' },
  { path: '/alerts', label: '告警中心', icon: '⚠️' },
  { path: '/display', label: '大屏展示', icon: '📺' },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerWidth = 220;

  const DrawerContent = () => (
    <Box sx={{ width: drawerWidth, height: '100%', bgcolor: colors.surface }}>
      <Box sx={{ p: 2, borderBottom: `1px solid ${colors.surfaceElevated}` }}>
        <Typography variant="h6" sx={{ color: colors.primary, fontWeight: 500 }}>
          🌍 垃圾电/热能回收
        </Typography>
        <Typography variant="caption" sx={{ color: colors.textSecondary }}>
          管理平台 v1.0
        </Typography>
      </Box>

      <Box sx={{ py: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Box
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 1.5,
                cursor: 'pointer',
                bgcolor: isActive ? `${colors.primary}20` : 'transparent',
                borderLeft: isActive ? `3px solid ${colors.primary}` : '3px solid transparent',
                color: isActive ? colors.primary : colors.textSecondary,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: isActive ? `${colors.primary}20` : `${colors.textSecondary}10`,
                },
              }}
            >
              <Typography variant="body1" sx={{ mr: 1.5 }}>
                {item.icon}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: isActive ? 500 : 400 }}>
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: colors.background }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
      >
        <DrawerContent />
      </Box>

      {/* Main content */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/* Top App Bar */}
        <AppBar
          position="sticky"
          sx={{
            bgcolor: colors.surface,
            boxShadow: 'none',
            borderBottom: `1px solid ${colors.surfaceElevated}`,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                edge="start"
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="body1" sx={{ color: colors.textSecondary }}>
                {navItems.find(item => item.path === location.pathname)?.label || '首页'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton sx={{ color: colors.textSecondary }}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton sx={{ color: colors.textSecondary }}>
                <SettingsIcon />
              </IconButton>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: colors.primary,
                  fontSize: 14,
                  ml: 1,
                }}
              >
                操
              </Avatar>
              <Typography variant="body2" sx={{ color: colors.textSecondary, ml: 1 }}>
                操作员
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: colors.background,
          }}
        >
          {children}
        </Box>

        {/* Status bar */}
        <Box
          sx={{
            height: 32,
            bgcolor: colors.surface,
            borderTop: `1px solid ${colors.surfaceElevated}`,
            display: 'flex',
            alignItems: 'center',
            px: 2,
            gap: 3,
          }}
        >
          <Typography variant="caption" sx={{ color: colors.success }}>
            ● 系统状态: 运行中
          </Typography>
          <Typography variant="caption" sx={{ color: colors.textSecondary }}>
            服务器: 正常
          </Typography>
          <Typography variant="caption" sx={{ color: colors.textSecondary }}>
            最后更新: {new Date().toLocaleTimeString('zh-CN')}
          </Typography>
          <Typography variant="caption" sx={{ color: colors.textSecondary, ml: 'auto' }}>
            v1.0
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
