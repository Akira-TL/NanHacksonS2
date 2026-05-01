export interface BatteryUnit {
  id: string;
  region: string;
  temperature: number;
  soc: number;
  status: 'normal' | 'warning' | 'critical';
  targetTemp: number;
  lastUpdate: string;
}

export interface HeatCollectionDevice {
  id: string;
  type: 'compressor' | 'heatSheet' | 'forcedAir';
  status: 'running' | 'standby' | 'offline';
  efficiency: number;
  heatCollected: number;
  powerConsumed: number;
  cop?: number;
  fanSpeed?: number;
  activeSheets?: number;
  totalSheets?: number;
}

export interface Alert {
  id: string;
  level: 'P0' | 'P1' | 'P2' | 'P3';
  deviceId: string;
  deviceName: string;
  type: string;
  message: string;
  timestamp: string;
  status: 'new' | 'acknowledged' | 'resolved';
}

export interface EnergyData {
  timestamp: string;
  windPower: number;
  totalConsumption: number;
  curtailment: number;
  storageLevel: number;
}

export interface KPIData {
  label: string;
  value: number;
  unit: string;
  trend: number;
  trendDirection: 'up' | 'down' | 'stable';
  status: 'normal' | 'warning' | 'critical';
  targetMin?: number;
  targetMax?: number;
}

export const generateMockBatteryUnits = (): BatteryUnit[] => {
  const units: BatteryUnit[] = [];
  const regions = ['A区', 'B区', 'C区', 'D区'];

  for (let i = 0; i < 72; i++) {
    const region = regions[Math.floor(i / 18)];
    const baseTemp = 20 + Math.random() * 10;
    const temp = i % 18 === 2 ? 45.2 : (i % 3 === 0 ? 18.3 : baseTemp);

    let status: 'normal' | 'warning' | 'critical' = 'normal';
    if (temp > 35) status = 'critical';
    else if (temp > 25 || temp < 15) status = 'warning';

    units.push({
      id: `BAT_${String(i + 1).padStart(3, '0')}`,
      region,
      temperature: parseFloat(temp.toFixed(1)),
      soc: parseFloat((60 + Math.random() * 35).toFixed(1)),
      status,
      targetTemp: 20,
      lastUpdate: new Date().toISOString(),
    });
  }
  return units;
};

export const generateMockHeatDevices = (): HeatCollectionDevice[] => [
  {
    id: 'compressor_001',
    type: 'compressor',
    status: 'running',
    efficiency: 78,
    heatCollected: 850,
    powerConsumed: 15.8,
    cop: 3.2,
  },
  {
    id: 'heat_sheet_001',
    type: 'heatSheet',
    status: 'running',
    efficiency: 78.5,
    heatCollected: 420,
    powerConsumed: 0,
    activeSheets: 12,
    totalSheets: 16,
  },
  {
    id: 'forced_air_001',
    type: 'forcedAir',
    status: 'standby',
    efficiency: 68.3,
    heatCollected: 580,
    powerConsumed: 8.5,
    fanSpeed: 80,
  },
  {
    id: 'silicon_unit_001',
    type: 'compressor',
    status: 'running',
    efficiency: 90,
    heatCollected: 1200,
    powerConsumed: 50,
  },
];

export const generateMockAlerts = (): Alert[] => [
  {
    id: 'ALM-20260501-103025-001',
    level: 'P0',
    deviceId: 'BAT_003',
    deviceName: 'C区-第3排',
    type: 'temperature_overlimit',
    message: '温度超限 55°C',
    timestamp: '2026-05-01T10:30:25Z',
    status: 'new',
  },
  {
    id: 'ALM-20260501-102812-002',
    level: 'P1',
    deviceId: 'compressor_001',
    deviceName: '压缩机 #1',
    type: 'communication_lost',
    message: '通讯中断',
    timestamp: '2026-05-01T10:28:12Z',
    status: 'acknowledged',
  },
  {
    id: 'ALM-20260501-102503-003',
    level: 'P1',
    deviceId: 'BAT_007',
    deviceName: 'A区-第7排',
    type: 'temperature_low',
    message: '温度偏低 8.3°C',
    timestamp: '2026-05-01T10:25:03Z',
    status: 'acknowledged',
  },
];

export const generateMockKPIs = (): KPIData[] => [
  {
    label: '电池库平均温度',
    value: 21.3,
    unit: '°C',
    trend: 0.5,
    trendDirection: 'up',
    status: 'normal',
    targetMin: 15,
    targetMax: 25,
  },
  {
    label: '温度达标率',
    value: 96.8,
    unit: '%',
    trend: 2.1,
    trendDirection: 'up',
    status: 'normal',
    targetMin: 95,
  },
  {
    label: '系统COP',
    value: 3.2,
    unit: '',
    trend: 0.1,
    trendDirection: 'down',
    status: 'normal',
    targetMin: 2.5,
    targetMax: 4.0,
  },
  {
    label: '弃风消纳率',
    value: 91.2,
    unit: '%',
    trend: 3.2,
    trendDirection: 'up',
    status: 'normal',
    targetMin: 90,
  },
  {
    label: '热量回收总量',
    value: 1850,
    unit: 'kWh',
    trend: 8.2,
    trendDirection: 'up',
    status: 'normal',
  },
  {
    label: '盐融堆存储',
    value: 62.3,
    unit: '%',
    trend: 2.1,
    trendDirection: 'up',
    status: 'normal',
    targetMin: 0,
    targetMax: 100,
  },
];

export const generateTemperatureTrend = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    const hour = i;
    const baseTemp = 20;
    const variation = Math.sin((hour - 6) * Math.PI / 12) * 5;
    const noise = (Math.random() - 0.5) * 2;
    data.push({
      hour: `${String(hour).padStart(2, '0')}:00`,
      today: parseFloat((baseTemp + variation + noise).toFixed(1)),
      yesterday: parseFloat((baseTemp + variation + noise + (Math.random() - 0.5) * 3).toFixed(1)),
    });
  }
  return data;
};

export const generateEnergyTrend = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    const hour = i;
    const windBase = 800 + Math.sin((hour - 6) * Math.PI / 12) * 600;
    const consumptionBase = 500 + Math.cos((hour - 8) * Math.PI / 12) * 300;

    data.push({
      hour: `${String(hour).padStart(2, '0')}:00`,
      generation: Math.round(windBase + Math.random() * 200),
      consumption: Math.round(consumptionBase + Math.random() * 150),
    });
  }
  return data;
};

export const regionStats = [
  { name: 'A区', avgTemp: 21.8, rate: 96, count: 18, status: 'normal' },
  { name: 'B区', avgTemp: 22.1, rate: 98, count: 18, status: 'normal' },
  { name: 'C区', avgTemp: 23.5, rate: 94, count: 18, status: 'warning' },
  { name: 'D区', avgTemp: 21.3, rate: 97, count: 18, status: 'normal' },
];
