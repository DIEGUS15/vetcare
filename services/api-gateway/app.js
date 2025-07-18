import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsConfig } from "./config/cors.config.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Importar rutas
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import petRoutes from "./routes/pet.routes.js";

const app = express();

// Middlewares globales
app.use(cors(corsConfig));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", petRoutes);

// Manejo de errores global
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));

// import express from "express";
// import morgan from "morgan";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import axios from "axios";
// import jwt from "jsonwebtoken";

// const app = express();

// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// app.use(morgan("dev"));
// app.use(express.json());
// app.use(cookieParser());

// // Middleware de autenticación mejorado
// const authenticate = async (req, res, next) => {
//   const token =
//     req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     // Si el access token expiró, intentar renovar con refresh token
//     const refreshToken = req.cookies.refreshToken;
//     if (refreshToken) {
//       try {
//         const newTokens = await refreshAccessToken(refreshToken);

//         // Establecer nuevo access token en cookie
//         res.cookie("accessToken", newTokens.accessToken, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//           sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
//           maxAge: 24 * 60 * 60 * 1000, // 24 horas
//           path: "/",
//         });

//         const decoded = jwt.verify(
//           newTokens.accessToken,
//           process.env.TOKEN_SECRET
//         );
//         req.user = decoded;
//         next();
//       } catch (refreshError) {
//         return res.status(403).json({ message: "Invalid or expired tokens" });
//       }
//     } else {
//       return res.status(403).json({ message: "Invalid token" });
//     }
//   }
// };

// // Función helper para renovar access token
// const refreshAccessToken = async (refreshToken) => {
//   try {
//     const response = await axios.post(
//       "http://auth-service:3001/api/refresh-token",
//       { refreshToken }
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to refresh token");
//   }
// };

// // Middleware de autorización
// const authorize = (roles) => (req, res, next) => {
//   if (!roles.includes(req.user.role)) {
//     return res
//       .status(403)
//       .json({ message: "Forbidden: Insufficient permissions" });
//   }
//   next();
// };

// // RUTA DE LOGIN - MEJOR PRÁCTICA
// app.post("/api/login", async (req, res) => {
//   try {
//     const response = await axios.post(
//       "http://auth-service:3001/api/login",
//       req.body
//     );

//     const { user, tokens } = response.data;

//     // EL API GATEWAY maneja las cookies, no el microservicio
//     res.cookie("accessToken", tokens.accessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
//       maxAge: 24 * 60 * 60 * 1000, // 24 horas
//       path: "/",
//     });

//     res.cookie("refreshToken", tokens.refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
//       path: "/",
//     });

//     // Solo devolver datos del usuario al frontend
//     res.json({
//       user,
//       message: "Login successful",
//     });
//   } catch (error) {
//     console.error("Login error:", error.response?.data || error.message);
//     res
//       .status(error.response?.status || 500)
//       .json(error.response?.data || { message: "Internal server error" });
//   }
// });

// // Ruta de logout
// app.post("/api/logout", (req, res) => {
//   // Limpiar cookies en el API Gateway
//   res.clearCookie("accessToken");
//   res.clearCookie("refreshToken");

//   res.json({ message: "Logged out successfully" });
// });

// // Ruta de verificación de token
// app.get("/api/verify", authenticate, (req, res) => {
//   // Si llegó hasta aquí, el token es válido
//   res.json({
//     valid: true,
//     user: req.user,
//   });
// });

// // Ruta para renovar token manualmente
// app.post("/api/refresh-token", async (req, res) => {
//   const refreshToken = req.cookies.refreshToken;

//   if (!refreshToken) {
//     return res.status(401).json({ message: "Refresh token required" });
//   }

//   try {
//     const response = await axios.post(
//       "http://auth-service:3001/api/refresh-token",
//       { refreshToken }
//     );

//     const { accessToken } = response.data;

//     res.cookie("accessToken", accessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
//       maxAge: 24 * 60 * 60 * 1000,
//       path: "/",
//     });

//     res.json({ message: "Token refreshed successfully" });
//   } catch (error) {
//     res.clearCookie("accessToken");
//     res.clearCookie("refreshToken");
//     res.status(403).json({ message: "Invalid refresh token" });
//   }
// });

// // Rutas protegidas
// //Registrar usuarios
// app.post(
//   "/api/register",
//   authenticate,
//   authorize(["admin"]),
//   async (req, res) => {
//     try {
//       const token =
//         req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//       const response = await axios.post(
//         "http://auth-service:3001/api/register",
//         req.body,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       res.json({
//         ...response.data,
//         message: "User registered successfully",
//       });
//     } catch (error) {
//       console.error("Register error:", error.response?.data || error.message);
//       res
//         .status(error.response?.status || 500)
//         .json(error.response?.data || { message: "Internal server error" });
//     }
//   }
// );

// //Obtener todos los usuarios
// app.get("/api/users", authenticate, authorize(["admin"]), async (req, res) => {
//   try {
//     const token =
//       req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//     const response = await axios.get("http://auth-service:3001/api/users", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     res.json(response.data);
//   } catch (error) {
//     res
//       .status(error.response?.status || 500)
//       .json(error.response?.data || { message: "Internal server error" });
//   }
// });

// //Informacion de perfil
// app.get("/api/profile", authenticate, async (req, res) => {
//   try {
//     const token =
//       req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//     const response = await axios.get("http:/auth-service:3001/api/profile", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     res.json(response.data);
//   } catch (error) {
//     res
//       .status(error.response?.status || 500)
//       .json(error.response?.data || { message: "Internal server error" });
//   }
// });

// app.get(
//   "/api/pets",
//   authenticate,
//   authorize(["veterinarian", "recepcionista", "admin"]),
//   async (req, res) => {
//     try {
//       const token =
//         req.cookies.accessToken || req.headers.authorization.split(" ")[1];

//       const response = await axios.get(
//         "http://patients-service:3002/api/pets",

//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           params: req.query,
//         }
//       );
//       res.json(response.data);
//     } catch (error) {
//       console.error("Get pets error:", error.response?.data || error.message);
//       res
//         .status(error.response?.status || 500)
//         .json(error.response?.data || { message: "Internal server error" });
//     }
//   }
// );

// //Obtener las mascotas de un usuario específico
// app.get("/api/pets/user/:userId", authenticate, async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const token =
//       req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//     // try {
//     //   await axios.get(`http://auth-service:3001/api/users/${userId}`, {
//     //     headers: { Authorization: `Bearer ${token}` },
//     //   });
//     // } catch (error) {
//     //   return res.status(404).json({ message: "User not found" });
//     // }

//     const response = await axios.get(
//       `http://patients-service:3002/api/pets/user/${userId}`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     res.json(response.data);
//   } catch (error) {
//     console.error(
//       "Get user pets error:",
//       error.response?.data || error.message
//     );
//     res
//       .status(error.response?.status || 500)
//       .json(error.response?.data || { message: "Internal server error" });
//   }
// });

// app.post(
//   "/api/pet",
//   authenticate,
//   authorize(["veterinarian", "recepcionista", "admin"]),
//   async (req, res) => {
//     try {
//       const token =
//         req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//       const response = await axios.post(
//         "http://patients-service:3002/api/pet",
//         req.body,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       res.json(response.data);
//     } catch (error) {
//       console.error(
//         "Pet creation error:",
//         error.response?.data || error.message
//       );
//       res
//         .status(error.response?.status || 500)
//         .json(error.response?.data || { message: "Internal server error" });
//     }
//   }
// );

// // Manejo de errores global
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: "Something went wrong!" });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
