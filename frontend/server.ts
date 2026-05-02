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

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
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
    } else if (action === "adjust_target") {
      // Mock adjustment
    }

    bat.status =
      bat.temperatureC > 35 || bat.temperatureC < 15 ? "warning" : "normal";
    res.json(bat);
  });

  // Collectors
  app.get("/api/collectors", (req, res) => {
    res.json(db.collectors);
  });

  // KPIs / Energy Overview
  app.get("/api/overview", (req, res) => {
    res.json(db.kpis);
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

  // Simulating real-time environmental drift (small backend loop)
  setInterval(() => {
    db.batteries.forEach((b: any) => {
      let diff = (Math.random() - 0.5) * 1.5;
      if (b.temperatureC > 30) diff -= 0.5;
      if (b.temperatureC < 15) diff += 0.5;
      b.temperatureC += diff;
      b.status =
        b.temperatureC > 35 || b.temperatureC < 15 ? "warning" : "normal";
    });
  }, 3000);

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
