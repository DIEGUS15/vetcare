// import express from "express";
// import morgan from "morgan";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import axios from "axios";
// import jwt from "jsonwebtoken";

// const app = express();

// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//   })
// );
// app.use(morgan("dev"));
// app.use(express.json());
// app.use(cookieParser());

// // Middleware de autenticación
// const authenticate = async (req, res, next) => {
//   const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(403).json({ message: "Invalid token" });
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

// // Ruta de login (proxy al auth-service)
// app.post("/api/login", async (req, res) => {
//   try {
//     const response = await axios.post(
//       "http://auth-service:3001/api/login",
//       req.body,
//       { withCredentials: true }
//     );

//     res.json(
//       // response.data
//       {
//         id: response.data.id,
//         fullname: response.data.fullname,
//         email: response.data.email,
//         role: response.data.role,
//       }
//     );
//   } catch (error) {
//     res
//       .status(error.response?.status || 500)
//       .json(error.response?.data || { message: "Internal server error" });
//   }
// });

// // Ruta para crear mascotas (proxy al patients-service)
// app.post(
//   "/api/pet",
//   authenticate,
//   authorize(["veterinarian", "recepcionista"]),
//   async (req, res) => {
//     try {
//       const response = await axios.post(
//         "http://patients-service:3002/api/pet",
//         req.body,
//         {
//           headers: {
//             Authorization: `Bearer ${
//               req.cookies.token || req.headers.authorization?.split(" ")[1]
//             }`,
//           },
//         }
//       );
//       res.json(response.data);
//     } catch (error) {
//       res
//         .status(error.response?.status || 500)
//         .json(error.response?.data || { message: "Internal server error" });
//     }
//   }
// );

// // Otras rutas...

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));

import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import axios from "axios";
import jwt from "jsonwebtoken";

const app = express();

// Configuración CORS mejorada
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Middleware de autenticación mejorado
const authenticate = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Middleware de autorización
const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "Forbidden: Insufficient permissions" });
  }
  next();
};

// Ruta de login (proxy al auth-service) - CORREGIDA
app.post("/api/login", async (req, res) => {
  try {
    const response = await axios.post(
      "http://auth-service:3001/api/login",
      req.body,
      {
        withCredentials: true,
        // Importante: incluir headers para cookies
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Propagar las cookies del auth-service al cliente
    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      setCookieHeader.forEach((cookie) => {
        res.setHeader("Set-Cookie", cookie);
      });
    }

    res.json({
      id: response.data.id,
      fullname: response.data.fullname,
      email: response.data.email,
      role: response.data.role,
    });
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Internal server error" });
  }
});

// Ruta de logout (proxy al auth-service)
app.post("/api/logout", async (req, res) => {
  try {
    const response = await axios.post(
      "http://auth-service:3001/api/logout",
      {},
      {
        withCredentials: true,
        headers: {
          Cookie: req.headers.cookie || "",
        },
      }
    );

    // Propagar las cookies del auth-service al cliente
    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      setCookieHeader.forEach((cookie) => {
        res.setHeader("Set-Cookie", cookie);
      });
    }

    res.json(response.data);
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Internal server error" });
  }
});

// Ruta de verificación de token
app.get("/api/verify", async (req, res) => {
  try {
    const response = await axios.get("http://auth-service:3001/api/verify", {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie || "",
      },
    });

    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Internal server error" });
  }
});

// Ruta para obtener perfil
app.get("/api/profile", authenticate, async (req, res) => {
  try {
    const response = await axios.get("http://auth-service:3001/api/profile", {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie || "",
        Authorization: `Bearer ${
          req.cookies.token || req.headers.authorization?.split(" ")[1]
        }`,
      },
    });

    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Internal server error" });
  }
});

// Ruta para crear mascotas (proxy al patients-service)
app.post(
  "/api/pet",
  authenticate,
  authorize(["veterinarian", "recepcionista"]),
  async (req, res) => {
    try {
      const response = await axios.post(
        "http://patients-service:3002/api/pet",
        req.body,
        {
          headers: {
            Authorization: `Bearer ${
              req.cookies.token || req.headers.authorization?.split(" ")[1]
            }`,
            "Content-Type": "application/json",
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error(
        "Pet creation error:",
        error.response?.data || error.message
      );
      res
        .status(error.response?.status || 500)
        .json(error.response?.data || { message: "Internal server error" });
    }
  }
);

// Ruta para obtener usuarios (solo admin)
app.get("/api/users", authenticate, authorize(["admin"]), async (req, res) => {
  try {
    const response = await axios.get("http://auth-service:3001/api/users", {
      headers: {
        Authorization: `Bearer ${
          req.cookies.token || req.headers.authorization?.split(" ")[1]
        }`,
      },
    });
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Internal server error" });
  }
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
