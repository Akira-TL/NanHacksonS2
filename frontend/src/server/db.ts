export function generateInitialData() {
  // Batteries
  const batteries = [];
  for (let i = 0; i < 60; i++) {
    let temp = 20;
    if (i === 12) temp = 45.2;
    else if (i === 4) temp = 18.3;
    else if (i === 5) temp = 23.1;
    else temp = 18 + Math.random() * 6;

    let soc = 40 + Math.random() * 50;

    batteries.push({
      id: `BAT_${(i + 1).toString().padStart(3, "0")}`,
      soc: soc,
      temperatureC: temp,
      status: temp > 35 ? "warning" : temp < 15 ? "warning" : "normal",
    });
  }

  // Collectors (only heat_sheet and forced_air)
  const collectors = [
    {
      id: "heat_sheet_01",
      type: "heat_sheet",
      state: "COLLECTING",
      efficiency: 9.5,
      currentPowerKw: 2.5,
      temperatureC: 52.8,
      heatCollectedKwh: 420,
    },
    {
      id: "forced_air_01",
      type: "forced_air",
      state: "STANDBY",
      efficiency: 68.3,
      currentPowerKw: 0,
      temperatureC: 28.5,
      heatCollectedKwh: 580,
    },
  ];

  // KPIs
  const kpis = [
    {
      title: "Daily Heat Recycled",
      value: "1,600",
      unit: "kWh",
      trend: 12.5,
      status: "normal",
      description: "All subsystems active (99.8% health)",
    },
    {
      title: "Wind Curtailment Mgt",
      value: "92.3",
      unit: "%",
      trend: 4.1,
      status: "normal",
      description: "Target: ≥90.0%",
    },
    {
      title: "Battery Temp Control",
      value: "20",
      unit: "h",
      status: "normal",
      description: "15-25°C optimal zone maintained",
    },
    {
      title: "Est. Lifespan Extension",
      value: "3.5",
      unit: "x",
      status: "normal",
      description: "vs. baseline 1500→5250 cycles",
    },
    {
      title: "Carbon Emission Reduction",
      value: "20.35",
      unit: "tons",
      status: "normal",
      description: "CO₂ avoided per day",
    },
  ];

  // Alerts
  const alerts = [
    {
      id: "ALM-001",
      severity: "P0",
      title: "Temp Exceeded 55°C Threshold",
      source: "BAT_003",
      time: "10:30:25",
      status: "Unresolved",
    },
    {
      id: "ALM-002",
      severity: "P1",
      title: "Comms Link Interrupted",
      source: "Compressor #1",
      time: "10:28:12",
      status: "In Progress",
    },
    {
      id: "ALM-003",
      severity: "P1",
      title: "Critically Low Temp 8.3°C",
      source: "BAT_007",
      time: "10:25:03",
      status: "Acknowledged",
    },
    {
      id: "ALM-004",
      severity: "P2",
      title: "Temp Elevation 26.8°C",
      source: "BAT_015",
      time: "10:20:45",
      status: "Unresolved",
    },
  ];

  return {
    batteries,
    collectors,
    kpis,
    alerts,
  };
}
