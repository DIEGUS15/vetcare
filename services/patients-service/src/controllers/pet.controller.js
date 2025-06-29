import Pet from "../models/pet.model.js";

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
      createdBy: req.user.id,
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

// import Pet from "../models/pet.model.js";
// import axios from "axios";

// export const createPet = async (req, res) => {
//   try {
//     const {
//       photo,
//       name,
//       species,
//       breed,
//       age,
//       weight,
//       gender,
//       state,
//       clientId,
//     } = req.body;

//     // 1. Primero verificar que el cliente existe
//     try {
//       const clientResponse = await axios.get(
//         `http://localhost:3001/api/user/${clientId}`,
//         { headers: { Authorization: req.headers.authorization } }
//       );

//       if (!clientResponse.data || clientResponse.data.role !== "client") {
//         return res
//           .status(404)
//           .json({ message: "Client not found or invalid client role" });
//       }
//     } catch (error) {
//       if (error.response?.status === 404) {
//         return res.status(404).json({ message: "Client not found" });
//       }
//       console.error("Error verifying client:", error);
//       return res
//         .status(502)
//         .json({ message: "Error verifying client information" });
//     }

//     // 2. Si el cliente existe, crear la mascota
//     const newPet = new Pet({
//       photo,
//       name,
//       species,
//       breed,
//       age,
//       weight,
//       gender,
//       state,
//       owner: clientId,
//       createdBy: req.user.id, // Usamos el user del token
//     });

//     await newPet.save();
//     res.status(201).json(newPet);
//   } catch (error) {
//     console.error("Error in createPet:", error);
//     res.status(500).json({
//       message: "Internal server error",
//       details:
//         process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };
