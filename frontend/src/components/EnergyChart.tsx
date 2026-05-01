import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Box, Typography } from '@mui/material';
import { colors } from '../theme/theme';
import { generateEnergyTrend } from '../data/mockData';

interface EnergyChartProps {
  height?: number;
}

export const EnergyChart: React.FC<EnergyChartProps> = ({ height = 280 }) => {
  const data = generateEnergyTrend();

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.primary,
      textStyle: {
        color: colors.textPrimary,
      },
    },
    legend: {
      data: ['发电量', '用电量', '弃风量'],
      textStyle: {
        color: colors.textSecondary,
      },
      top: 0,
    },
    grid: {
      left: 60,
      right: 20,
      top: 40,
      bottom: 30,
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.hour),
      axisLine: {
        lineStyle: {
          color: colors.textSecondary,
        },
      },
      axisLabel: {
        color: colors.textSecondary,
      },
    },
    yAxis: {
      type: 'value',
      name: 'kWh',
      nameTextStyle: {
        color: colors.textSecondary,
      },
      axisLine: {
        lineStyle: {
          color: colors.textSecondary,
        },
      },
      axisLabel: {
        color: colors.textSecondary,
      },
      splitLine: {
        lineStyle: {
          color: `${colors.textSecondary}30`,
        },
      },
    },
    series: [
      {
        name: '发电量',
        type: 'bar',
        stack: 'total',
        data: data.map(d => d.generation),
        itemStyle: {
          color: colors.success,
        },
        barWidth: '60%',
      },
      {
        name: '用电量',
        type: 'bar',
        stack: 'total',
        data: data.map(d => -d.consumption),
        itemStyle: {
          color: colors.warning,
        },
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        24小时电力曲线
      </Typography>
      <ReactECharts option={option} style={{ height }} />
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, bgcolor: colors.success, borderRadius: 1 }} />
          <Typography variant="caption">发电量</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, bgcolor: colors.warning, borderRadius: 1 }} />
          <Typography variant="caption">用电量</Typography>
        </Box>
      </Box>
    </Box>
  );
};
