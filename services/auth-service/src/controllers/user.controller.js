import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
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

    //Obtener los usuarios con paginación
    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .select("-password")
      .lean();

    //Respuesta con información de paginación
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
    console.error("Error al obtener los usuarios:", Error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener usuarios",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { fullname, cedula, telephone, address, role, state, email } =
      req.body;
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
