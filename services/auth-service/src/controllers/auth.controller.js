import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const register = async (req, res) => {
  const { fullname, cedula, telephone, address, role, email, password } =
    req.body;

  try {
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json(["The email is already in use"]);

    //Entra un hash y se encripta
    const passwordHash = await bcrypt.hash(password, 10);

    //Se crea un nuevo usuario
    const newUser = new User({
      fullname,
      cedula,
      telephone,
      address,
      role,
      state: "active",
      email,
      password: passwordHash,
    });

    //Se guarda el usuario
    const userSaved = await newUser.save();

    //Devuelve el usuario registrado
    res.json({
      id: userSaved.id,
      fullname: userSaved.fullname,
      cedula: userSaved.cedula,
      telephone: userSaved.telephone,
      address: userSaved.address,
      role: userSaved.role,
      state: userSaved.state,
      email: userSaved.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = await createAccessToken({
      id: userFound._id,
      role: userFound.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Más estricto en producción
      maxAge: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
      path: "/",
      // httpOnly: true,
      // // secure: process.env.NODE_ENV === "production",
      // // sameSite: "lax",
      // secure: false, // Desactivado para desarrollo con HTTP
      // sameSite: "none", // Permite cookies en Postman
      // maxAge: 86400000,
      // path: "/", // Accesible en todas las rutas
      // domain: "localhost", // Especifica el dominio explícitamente
    });

    //Devuelve el usuario registrado
    res.json({
      id: userFound.id,
      fullname: userFound.fullname,
      email: userFound.email,
      role: userFound.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

//Ruta para verificar que el usuario siga autenticado en la página
export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "Unauthorized" });

    return res.json({
      id: userFound.id,
      fullname: userFound.fullname,
      email: userFound.email,
      role: userFound.role,
    });
  });
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

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    //Validar parametros
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Los parámetros de paginación deben ser números positivos",
      });
    }

    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    //Obtener los usuarios con paginacion
    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .select("-password")
      .lean();

    //Respuesta con información de paginacion
    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        totalItems: totalUsers,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", Error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener usuarios",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        fullname,
        cedula,
        telephone,
        address,
        role,
        state,
        email,
      },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
