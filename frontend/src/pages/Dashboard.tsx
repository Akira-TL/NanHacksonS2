import { usePolling } from "../hooks/usePolling";
import { KPIBox } from "../components/KPIBox";
import { ProcessFlow } from "../components/ProcessFlow";
import { CollectorsPanel } from "../components/CollectorsPanel";
import { BatteryGrid } from "../components/BatteryGrid";
import { EnergyChart } from "../components/EnergyChart";
import type { BatteryUnit, HeatCollectorState, KPI } from "../types";

export function Dashboard() {
  const { data: batteries } = usePolling<BatteryUnit[]>(
    "/api/batteries",
    3000,
    [],
  );
  const { data: collectors } = usePolling<HeatCollectorState[]>(
    "/api/collectors",
    5000,
    [],
  );
  const { data: kpis } = usePolling<KPI[]>("/api/overview", 5000, []);

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-6 lg:gap-8 mx-auto w-full max-w-[1440px]">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {kpis.map((kpi) => (
          <KPIBox key={kpi.title} kpi={kpi} />
        ))}
      </div>

      {/* Process Flow & Collector Stats */}
      <div className="dashboard-grid">
        <ProcessFlow />
        <CollectorsPanel collectors={collectors} />
      </div>

      {/* Battery Grid & Energy Chart */}
      <div className="dashboard-grid">
        <BatteryGrid units={batteries} />
        <EnergyChart />
      </div>
    </div>
  );
}
