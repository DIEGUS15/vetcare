import { verifyToken } from "../libs/jwt.js";

import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

// export const authRequired = (req, res, next) => {
//   // Primero intenta obtener el token del header
//   const authHeader = req.headers.authorization;

//   if (authHeader && authHeader.startsWith("Bearer ")) {
//     const token = authHeader.split(" ")[1];
//     jwt.verify(token, TOKEN_SECRET, (err, user) => {
//       if (err) return res.status(403).json({ message: "Invalid token" });
//       req.user = user;
//       next();
//     });
//   }
//   // Si no está en el header, busca en las cookies
//   else {
//     const { token } = req.cookies;
//     if (!token) return res.status(401).json({ message: "No token provided" });

//     jwt.verify(token, TOKEN_SECRET, (err, user) => {
//       if (err) return res.status(403).json({ message: "Invalid token" });
//       req.user = user;
//       next();
//     });
//   }
// };

export const authRequired = async (req, res, next) => {
  try {
    let token;

    // Verificar si el token viene en las cookies
    if (req.cookies.token) {
      token = req.cookies.token;
    }
    // Verificar si viene en el header Authorization
    else if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// export const authRequired = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader)
//       return res.status(401).json({ message: "No token provided" });

//     const token = authHeader.split(" ")[1]; // Bearer <token>
//     const user = await verifyToken(token);

//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(403).json({ message: "Invalid token" });
//   }
// };
