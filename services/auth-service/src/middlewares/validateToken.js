import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {
  // Priorizar cookie, luego header Authorization
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

// import jwt from "jsonwebtoken";
// import { TOKEN_SECRET } from "../config.js";

// export const authRequired = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
//     if (err) return res.status(403).json({ message: "Invalid token" });
//     req.user = decoded;
//     next();
//   });
// };

// import jwt from "jsonwebtoken";
// import { TOKEN_SECRET } from "../config.js";

// export const authRequired = (req, res, next) => {
//   const { token } = req.cookies;

//   if (!token)
//     return res.status(401).json({ message: "No token, authorization denied" });

//   jwt.verify(token, TOKEN_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: "Invalid token" });
//     req.user = user;
//     next();
//   });
// };
