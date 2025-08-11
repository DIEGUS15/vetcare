import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken, createRefreshToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const accessToken = await createAccessToken({
      id: userFound._id,
      role: userFound.role,
    });

    const refreshToken = await createRefreshToken({
      id: userFound._id,
    });

    res.json({
      user: {
        id: userFound.id,
        fullname: userFound.fullname,
        email: userFound.email,
        role: userFound.role,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: "24h",
      },
    });

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
    //   sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Más estricto en producción
    //   maxAge: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
    //   path: "/",
    //   // httpOnly: true,
    //   // // secure: process.env.NODE_ENV === "production",
    //   // // sameSite: "lax",
    //   // secure: false, // Desactivado para desarrollo con HTTP
    //   // sameSite: "none", // Permite cookies en Postman
    //   // maxAge: 86400000,
    //   // path: "/", // Accesible en todas las rutas
    //   // domain: "localhost", // Especifica el dominio explícitamente
    // });

    // //Devuelve el usuario registrado
    // res.json({
    //   id: userFound.id,
    //   fullname: userFound.fullname,
    //   email: userFound.email,
    //   role: userFound.role,
    // });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  return res.status(200).json({ message: "Logged out successfully" });
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.state !== "active") {
      return res.status(403).json({ message: "User account is inactive" });
    }

    const newAccessToken = await createAccessToken({
      id: user._id,
      role: user.role,
    });

    res.json({
      accessToken: newAccessToken,
      expiresIn: "24h",
    });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

//Ruta para verificar que el usuario siga autenticado en la página
export const verifyToken = async (req, res) => {
  // Usar la misma lógica que tu middleware
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    const userFound = await User.findById(decoded.id);

    if (!userFound) {
      return res.status(401).json({ message: "User not found" });
    }

    if (userFound.state !== "active") {
      return res.status(401).json({ message: "User account is inactive" });
    }

    return res.json({
      id: userFound.id,
      fullname: userFound.fullname,
      email: userFound.email,
      role: userFound.role,
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);

  if (!userFound) return res.status(400).json({ message: "User not found" });

  return res.json({
    id: userFound._id,
    fullname: userFound.fullname,
    cedula: userFound.cedula,
    telephone: userFound.telephone,
    address: userFound.address,
    role: userFound.role,
    state: userFound.state,
    email: userFound.email,
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, cedula, telephone, address, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        fullname,
        telephone,
        address,
        email,
      },
      {
        new: true,
      }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
