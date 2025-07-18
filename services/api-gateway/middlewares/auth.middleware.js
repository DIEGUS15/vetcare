import jwt from "jsonwebtoken";
import { refreshAccessToken } from "../libs/tokenService.js";

export const authenticate = async (req, res, next) => {
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Si el access token expiró, intentar renovar con refresh token
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      try {
        const newTokens = await refreshAccessToken(refreshToken);

        // Establecer nuevo access token en cookie
        res.cookie("accessToken", newTokens.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
          maxAge: 24 * 60 * 60 * 1000, // 24 horas
          path: "/",
        });

        const decoded = jwt.verify(
          newTokens.accessToken,
          process.env.TOKEN_SECRET
        );
        req.user = decoded;
        next();
      } catch (refreshError) {
        return res.status(403).json({ message: "Invalid or expired tokens" });
      }
    } else {
      return res.status(403).json({ message: "Invalid token" });
    }
  }
};

export const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "Forbidden: Insufficient permissions" });
  }
  next();
};
