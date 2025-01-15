import { log } from "console";

export const loggerMiddleware = (req, res, next) => {
  log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  res.on("finish", () => {
    log(`Response Status: ${res.statusCode}`);
  });
  next();
};