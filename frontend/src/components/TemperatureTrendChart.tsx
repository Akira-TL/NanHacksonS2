import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Box, Typography } from '@mui/material';
import { colors } from '../theme/theme';
import { generateTemperatureTrend } from '../data/mockData';

interface TemperatureTrendChartProps {
  height?: number;
}

export const TemperatureTrendChart: React.FC<TemperatureTrendChartProps> = ({ height = 250 }) => {
  const data = generateTemperatureTrend();

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
      data: ['今日', '昨日'],
      textStyle: {
        color: colors.textSecondary,
      },
      top: 0,
    },
    grid: {
      left: 50,
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
      name: '温度 (°C)',
      nameTextStyle: {
        color: colors.textSecondary,
      },
      min: 10,
      max: 30,
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
        name: '今日',
        type: 'line',
        smooth: true,
        data: data.map(d => d.today),
        lineStyle: {
          color: colors.primary,
          width: 2,
        },
        itemStyle: {
          color: colors.primary,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${colors.primary}40` },
              { offset: 1, color: `${colors.primary}05` },
            ],
          },
        },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: {
            color: colors.success,
            type: 'dashed',
            width: 1,
          },
          data: [
            { yAxis: 25, label: { formatter: '上限 25°C', color: colors.success } },
            { yAxis: 15, label: { formatter: '下限 15°C', color: colors.success } },
          ],
        },
      },
      {
        name: '昨日',
        type: 'line',
        smooth: true,
        data: data.map(d => d.yesterday),
        lineStyle: {
          color: colors.textSecondary,
          width: 1,
          type: 'dashed',
        },
        itemStyle: {
          color: colors.textSecondary,
        },
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        24小时温度趋势
      </Typography>
      <ReactECharts option={option} style={{ height }} />
    </Box>
  );
};
