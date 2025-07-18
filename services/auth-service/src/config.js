export const TOKEN_SECRET = process.env.TOKEN_SECRET || "fallback_secret_key";
export const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "fallback_refresh_secret_key";
export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/VETCARE";
export const PORT = process.env.PORT || 4000;
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
