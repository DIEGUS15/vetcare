import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
}
