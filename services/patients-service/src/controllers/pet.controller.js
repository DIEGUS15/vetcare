import Pet from "../models/pet.model.js";

//Obtener todas las mascotas
export const getPets = async (req, res) => {
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

    const totalPets = await Pet.countDocuments();
    const totalPages = Math.ceil(totalPets / limit);

    //Obtener las mascotas con paginación
    const pets = await Pet.find().skip(skip).limit(limit).lean();

    //Respuesta con informacion de paginacion
    res.status(200).json({
      success: true,
      data: pets,
      pagination: {
        totalItems: totalPets,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error al obtener los mascotas:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servicio al obtener mascotas",
    });
  }
};

//Obtener mascota por id
export const getPet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Obtener las mascotas del usuario logueado actual
export const getMyPets = async (req, res) => {
  try {
    const ownerId = req.user.id; // Del token decodificado
    const pets = await Pet.find({ owner: ownerId });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// export const getMyPets = async (req, res) => {
//   try {
//     const { ownerId } = req.params;

//     const pets = await Pet.find({ owner: ownerId });
//     res.json(pets);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

//Obtener mascotas de un propietario
export const getPetsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const pets = await Pet.find({ owner: userId });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Crear mascotas
export const createPet = async (req, res) => {
  try {
    const { photo, name, species, breed, age, weight, gender, state, owner } =
      req.body;

    const newPet = new Pet({
      photo,
      name,
      species,
      breed,
      age,
      weight,
      gender,
      state,
      owner,
      // createdBy: req.user.id,
    });

    await newPet.save();
    res.status(201).json(newPet);
  } catch (error) {
    console.error("Error in createPet:", error);
    res.status(500).json({
      message: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const updatePet = async (req, res) => {
  try {
    const { photo, name, species, breed, age, weight, gender, state, owner } =
      req.body;
    const pet = await Pet.findByIdAndUpdate(
      req.params.id,
      { photo, name, species, breed, age, weight, gender, state, owner },
      { new: true }
    );
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json(pet);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
