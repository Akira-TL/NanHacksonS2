import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { generateInitialData } from "./src/server/db";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const db = generateInitialData();
  // Add server-side state for saltMeltTemp
  (db as any).saltMeltTemp = 201.5;
  (db as any).masterSynergyEnabled = true;

  // Master Synergy API
  app.get("/api/master-synergy", (req, res) => {
    res.json({ masterSynergyEnabled: (db as any).masterSynergyEnabled });
  });
  app.post("/api/master-synergy", (req, res) => {
    (db as any).masterSynergyEnabled = !(db as any).masterSynergyEnabled;
    res.json({ masterSynergyEnabled: (db as any).masterSynergyEnabled });
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Salt Melt Temp
  app.get("/api/salt-melt", (req, res) => {
    res.json({ temperatureC: (db as any).saltMeltTemp });
  });

  // Batteries
  app.get("/api/batteries", (req, res) => {
    res.json(db.batteries);
  });

  app.post("/api/batteries/:id/control", (req, res) => {
    const bat = db.batteries.find((b: any) => b.id === req.params.id);
    if (!bat) return res.status(404).json({ error: "Not found" });
    const { action } = req.body;

    if (action === "heat") {
      bat.temperatureC += 5;
    } else if (action === "cool") {
      bat.temperatureC -= 5;
    } else if (action === "decommission") {
      bat.status = "offline";
    } else if (action === "restart") {
      bat.status = "normal";
    }

    if (bat.status !== "offline") {
      bat.status =
        bat.temperatureC > 35 || bat.temperatureC < 15 ? "warning" : "normal";
    }
    res.json(bat);
  });

  // Collectors
  app.get("/api/collectors", (req, res) => {
    res.json(db.collectors);
  });

  app.post("/api/collectors/:id/control", (req, res) => {
    const collector = db.collectors.find((c: any) => c.id === req.params.id);
    if (!collector) return res.status(404).json({ error: "Not found" });
    const { action } = req.body;

    if (action === "toggle") {
      collector.state = collector.state === "COLLECTING" ? "STANDBY" : "COLLECTING";
      // Flag to prevent auto-logic from overriding for the next 60 seconds
      collector.manualOverrideTs = Date.now() + 60000; 
    } else if (action === "calibrate") {
      collector.efficiency = Math.min(100, collector.efficiency + (Math.random() * 5));
    }
    res.json(collector);
  });

  // KPIs / Energy Overview
  app.get("/api/overview", (req, res) => {
    res.json(db.kpis);
  });

  app.get("/api/energy-stats", (req, res) => {
    res.json((db as any).energyStats || {
      windPower: 96000,
      windTrend: 5.2,
      totalLoad: 70000,
      loadTrend: 2.1,
      excessPower: 26000,
      excessTrend: -1.5,
      batteryHeat: 2100,
      windCurtailment: 1200,
      compressorLoad: 700,
      hvacLoad: 1680,
      storageTransferred: 1850,
      systemLoss: 320
    });
  });

  // Alerts
  app.get("/api/alerts", (req, res) => {
    res.json(db.alerts);
  });

  app.post("/api/alerts/:id/acknowledge", (req, res) => {
    const alert = db.alerts.find((a: any) => a.id === req.params.id);
    if (!alert) return res.status(404).json({ error: "Not found" });

    alert.status = "Acknowledged";
    res.json(alert);
  });

  app.post("/api/alerts/acknowledge-all", (req, res) => {
    db.alerts.forEach((alert: any) => {
      alert.status = "Acknowledged";
    });
    res.json(db.alerts);
  });

  app.post("/api/tickets", (req, res) => {
    // mock create ticket
    res.json({
      success: true,
      ticketId: `INC-${Math.floor(Math.random() * 10000)}`,
    });
  });

  // Simulating real-time environmental drift and system response
  let lastAlertTime = Date.now();
  setInterval(() => {
    // 1. Update Batteries
    db.batteries.forEach((b: any) => {
      if (b.status === "offline") {
        // Drift towards ambient 20C instead of freezing completely
        if (b.temperatureC > 20.5) b.temperatureC -= 0.5;
        else if (b.temperatureC < 19.5) b.temperatureC += 0.5;
        return;
      }

      // Zone-based synergy effect
      const zoneComp = db.collectors.find((c: any) => c.type === "forced_air" && c.zone === b.zone && c.state === "COLLECTING");
      const synergyActive = !!zoneComp && b.temperatureC > 26;
      
      let diff = (Math.random() - 0.5) * 0.4;
      if (synergyActive) {
        diff -= (Math.random() * 0.8 + 0.5); // Stronger active cooling
        b.status = "cooling";
      } else {
        diff += (Math.random() * 0.4 + 0.1); // Natural heating
        b.status = b.temperatureC > 35 ? "warning" : "normal";
      }

      b.temperatureC = Math.max(14, Math.min(65, b.temperatureC + diff));
      b.soc = Math.max(0, Math.min(100, b.soc + (Math.random() - 0.5) * 0.1));

      // Random AI Detection Alerts
      if (Date.now() - lastAlertTime > 20000 && Math.random() < 0.05 && b.temperatureC > 30) {
        const alertId = `ALR-${Math.floor(Math.random() * 10000)}`;
        db.alerts.unshift({
          id: alertId,
          severity: "P0",
          title: `AI Sensor Detection: Abnormal thermal pattern in Unit ${b.id}`,
          source: "Zone " + b.zone,
          status: "Active",
          time: new Date().toLocaleTimeString(),
          unitId: b.id // Custom field for frontend to use
        } as any);
        lastAlertTime = Date.now();
        if (db.alerts.length > 50) db.alerts.pop();
      }
    });

    // 2. Update Collectors (Subsystem Status) - Auto-start based on load
    const activeBatteries = db.batteries.filter((b: any) => b.status !== "offline");
    
    db.collectors.forEach((c: any) => {
      // Only auto-update if manual override has expired
      const isOverridden = c.manualOverrideTs && Date.now() < c.manualOverrideTs;
      
      const zoneBats = activeBatteries.filter((b: any) => b.zone === c.zone || !c.zone);
      const zoneAvgTemp = zoneBats.length > 0 
        ? zoneBats.reduce((s: number, b: any) => s + b.temperatureC, 0) / zoneBats.length 
        : 20;

      if (c.type === "forced_air") {
        if (!isOverridden) {
          if (!(db as any).masterSynergyEnabled) {
            c.state = "STANDBY";
          } else {
            // Asynchronously controlled based on THEIR specific zone's battery temp
            if (zoneAvgTemp > 25) c.state = "COLLECTING";
            else if (zoneAvgTemp < 23) c.state = "STANDBY";
          }
        }
        
        if (c.state === "COLLECTING") {
          c.currentPowerKw = 150 + Math.random() * 60;
          c.temperatureC = 40 + (zoneAvgTemp - 20) * 1.2;
        } else {
          c.currentPowerKw = 0;
          c.temperatureC = Math.max(18, c.temperatureC - 0.5);
        }
      }
    });

    // 3. Update Salt Melt Temp
    const harvesting = db.collectors.filter((c: any) => c.state === "COLLECTING").length > 0;
    if (harvesting) {
      (db as any).saltMeltTemp = Math.min(260, (db as any).saltMeltTemp + 0.3 + Math.random() * 0.2);
    } else {
      (db as any).saltMeltTemp = Math.max(180, (db as any).saltMeltTemp - 0.1 - Math.random() * 0.1);
    }

    // 4. Update KPIs
    db.kpis.forEach((k: any) => {
      if (k.title === "Daily Heat Recycled") {
        let val = parseFloat(k.value.replace(/,/g, ""));
        let delta = (Math.random() * 1.5);
        if (harvesting) val += delta;
        k.value = Math.floor(val).toLocaleString();
        k.trend = Number(delta.toFixed(1));
      } else if (k.title === "Wind Curtailment Mgt") {
        let val = parseFloat(k.value);
        let delta = (Math.random() - 0.5) * 0.1;
        val += delta;
        k.value = Math.max(88, Math.min(98, val)).toFixed(1);
        k.trend = Number((delta * 10).toFixed(1)); // Arbitrary scale for UI
      } else if (k.title === "Carbon Emission Reduction") {
        if (harvesting) {
          let val = parseFloat(k.value);
          let delta = 0.0001 + Math.random() * 0.0001;
          val += delta;
          k.value = val.toFixed(4);
          k.trend = Number((delta * 1000).toFixed(1)); // Arbitrary scale for UI
        }
      }
    });

    // 5. Update energy stats
    if (!(db as any).energyStats) {
      (db as any).energyStats = {
        windPower: 96000, windTrend: 5.2, totalLoad: 70000, loadTrend: 2.1,
        excessPower: 26000, excessTrend: -1.5, batteryHeat: 2100, windCurtailment: 1200,
        compressorLoad: 700, hvacLoad: 1680, storageTransferred: 1850, systemLoss: 320
      };
    }
    const es = (db as any).energyStats;
    es.windPower += (Math.random() - 0.4) * 200;
    es.totalLoad += (Math.random() - 0.5) * 150;
    es.excessPower = Math.max(0, es.windPower - es.totalLoad);
    es.batteryHeat += (harvesting ? 5 : 1) + Math.random() * 2;
    es.storageTransferred += (harvesting ? 20 : -5);
    es.systemLoss += Math.random() * 2;
  }, 2000);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
