import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { sendError, sendSuccess } from "./common/response/formatter.js";

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
  return sendSuccess(res, {
    statusCode: 200,
    message: "Service healthy",
    data: { status: "ok" },
    meta: { module: "system", action: "health" },
  });
});

app.use("/api/v1", apiRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  return sendError(res, {
    statusCode: err.status || err.statusCode || 500,
    message: err.message || "Internal Server Error",
    errors: err.errors,
    meta: { module: "system", action: "error" },
  });
});
