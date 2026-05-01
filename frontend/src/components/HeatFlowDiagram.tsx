import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors } from '../theme/theme';

interface HeatFlowDiagramProps {
  compact?: boolean;
}

export const HeatFlowDiagram: React.FC<HeatFlowDiagramProps> = ({ compact = false }) => {
  const boxStyle = {
    border: `2px solid ${colors.primary}`,
    borderRadius: 2,
    p: compact ? 1 : 2,
    textAlign: 'center',
    bgcolor: `${colors.primary}15`,
    minWidth: compact ? 80 : 120,
  };

  const arrowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.warning,
    fontSize: 20,
    fontWeight: 'bold',
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        热量流向示意图
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        {/* 电池库 */}
        <Box {...boxStyle}>
          <Typography variant="body2" sx={{ color: colors.textSecondary }}>
            电池库单元
          </Typography>
          <Typography variant="h6" sx={{ color: colors.warning }}>
            45°C
          </Typography>
          <Typography variant="caption" sx={{ color: colors.textSecondary }}>
            充放电余热
          </Typography>
        </Box>

        <Box sx={arrowStyle}>↓ 56°C</Box>

        {/* 三种回收方式 */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Box {...boxStyle} sx={{ mb: 0.5 }}>
              <Typography variant="caption">发热片</Typography>
              <Typography variant="body2" sx={{ color: colors.success }}>效率78%</Typography>
              <Typography variant="caption">420 kWh</Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Box {...boxStyle} sx={{ mb: 0.5 }}>
              <Typography variant="caption">压缩机</Typography>
              <Typography variant="body2" sx={{ color: colors.success }}>COP 3.2</Typography>
              <Typography variant="caption">850 kWh</Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Box {...boxStyle} sx={{ mb: 0.5 }}>
              <Typography variant="caption">风冷+压缩</Typography>
              <Typography variant="body2" sx={{ color: colors.success }}>效率65%</Typography>
              <Typography variant="caption">580 kWh</Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={arrowStyle}>↓ 热量汇集</Box>

        {/* 盐融堆 */}
        <Box
          sx={{
            ...boxStyle,
            borderColor: colors.secondary,
            bgcolor: `${colors.secondary}15`,
          }}
        >
          <Typography variant="body2" sx={{ color: colors.secondary }}>
            盐融堆
          </Typography>
          <Typography variant="h5" sx={{ color: colors.secondary }}>620 kWh</Typography>
          <Typography variant="caption" sx={{ color: colors.textSecondary }}>
            存储 62%
          </Typography>
        </Box>

        <Box sx={arrowStyle}>↓ 夜间释放</Box>

        {/* 供暖输出 */}
        <Box
          sx={{
            ...boxStyle,
            borderColor: colors.success,
            bgcolor: `${colors.success}15`,
          }}
        >
          <Typography variant="body2" sx={{ color: colors.success }}>
            供暖输出
          </Typography>
          <Typography variant="h6" sx={{ color: colors.success }}>21°C</Typography>
          <Typography variant="caption" sx={{ color: colors.textSecondary }}>
            维持电池温度
          </Typography>
        </Box>

        {/* 弃风路径 */}
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box {...boxStyle} sx={{ borderColor: colors.warning }}>
            <Typography variant="caption">弃风</Typography>
          </Box>
          <Typography variant="caption">→</Typography>
          <Box {...boxStyle} sx={{ borderColor: colors.warning }}>
            <Typography variant="caption">压缩机</Typography>
          </Box>
          <Typography variant="caption">→</Typography>
          <Box {...boxStyle} sx={{ borderColor: colors.secondary }}>
            <Typography variant="caption">盐融堆</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
