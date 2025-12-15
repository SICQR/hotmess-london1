import express from "express";
import { lHandler } from "./routes/l";
import { xHandler } from "./routes/x";

const app = express();
app.use(express.json());

// CORS for local dev
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

// Very simple auth stub: attaches a fake user
app.use((req, _res, next) => {
  // For now, pretend user_123 is logged in for all requests
  (req as any).user = { id: "user_123", membership_tier: "starter" };
  next();
});

// Beacon routes
app.get("/l/:code", lHandler);
app.get("/x/:slug", xHandler);

// Health check
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "HOTMESS Beacon Backend",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log("");
  console.log("🔥🖤💗 HOTMESS BEACON OS - DEMO BACKEND");
  console.log("=====================================");
  console.log(`Running on: http://localhost:${port}`);
  console.log("");
  console.log("Demo Beacons:");
  console.log(`  • Check-in:  http://localhost:${port}/l/DEMO_CHECKIN`);
  console.log(`  • Ticket:    http://localhost:${port}/l/DEMO_TICKET`);
  console.log(`  • Ticket (validate): http://localhost:${port}/l/DEMO_TICKET?mode=validate`);
  console.log(`  • Product:   http://localhost:${port}/l/DEMO_PRODUCT`);
  console.log(`  • Person:    http://localhost:${port}/l/DEMO_PERSON`);
  console.log(`  • Room:      http://localhost:${port}/l/DEMO_ROOM`);
  console.log(`  • Care/HNH:  http://localhost:${port}/l/DEMO_HNH`);
  console.log("");
  console.log("Health check: http://localhost:${port}/health");
  console.log("");
  console.log("Ready for scans! 🎯");
  console.log("");
});
