export interface KPI {
  title: string;
  value: string | number;
  unit: string;
  trend?: number; // percentage change
  status: 'normal' | 'warning' | 'critical';
  description: string;
}

export type HeatCollectorType = 'compressor' | 'heat_sheet' | 'forced_air';

export interface HeatCollectorState {
  id: string;
  type: HeatCollectorType;
  state: 'OFF' | 'STANDBY' | 'COLLECTING' | 'COMPLETE';
  efficiency: number; // Percentage
  currentPowerKw: number;
  temperatureC: number;
  heatCollectedKwh: number;
}

export interface BatteryUnit {
  id: string;
  soc: number; // State of Charge
  temperatureC: number;
  status: 'normal' | 'heating' | 'cooling' | 'warning';
}

export interface SystemOverview {
  batteryAvgTemp: number;
  tempComplianceRate: number; // e.g. 96.8%
  totalHeatRecycled: number; // kWh
  curtailmentUtilization: number; // e.g. 91.2%
  systemCop: number; // e.g. 3.85
  heatLossRate: number; // e.g. 14.7%
}
