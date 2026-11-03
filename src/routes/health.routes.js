import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  const status = databaseConnected ? "ok" : "error";

  return res.status(databaseConnected ? 200 : 503).json({
    status,
    timestamp: new Date().toISOString(),
    services: {
      api: "ok",
      database: databaseConnected ? "connected" : "disconnected",
    },
  });
});

export default router;
