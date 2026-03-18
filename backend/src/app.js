import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";

export const app = express();

app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/v1/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/v1", apiRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    ...(err.errors ? { errors: err.errors } : {}),
  });
});
