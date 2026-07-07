import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import cleanerRoutes from "./routes/cleaners.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import partnerRoutes from "./routes/partner.routes.js";
import deliveryRoutes from "./routes/delivery.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

// CLIENT_URL may contain a single origin or a comma-separated list of
// origins (e.g. the deployed frontend plus local dev servers). Trailing
// slashes are stripped since browsers never send a path in the Origin
// header, so a stored value with a trailing slash would never match.
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

// Always allow common local Vite dev ports so local development against a
// deployed API keeps working regardless of CLIENT_URL.
const defaultDevOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin(origin, callback) {
      // Requests with no Origin header (curl, server-to-server, same-origin)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        defaultDevOrigins.includes(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "CleanGo API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/cleaners", cleanerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/partner", partnerRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/admin", adminRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
