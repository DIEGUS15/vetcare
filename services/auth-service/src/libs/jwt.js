import jwt from "jsonwebtoken";
import { TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config.js";

export function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      TOKEN_SECRET,
      {
        expiresIn: "24h", // Token de corta duración
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
}

export function createRefreshToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      REFRESH_TOKEN_SECRET, // Diferente secret para refresh tokens
      {
        expiresIn: "7d", // Token de larga duración
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
}
