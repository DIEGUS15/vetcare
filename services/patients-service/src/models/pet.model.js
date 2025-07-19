import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    species: {
      type: String,
      required: true,
      trim: true,
    },
    breed: {
      type: String,
      trim: true,
    },
    age: {
      type: String,
    },
    weight: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["macho", "hembra", "desconocido"],
      default: "desconocido",
    },
    state: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    owner: {
      type: String,
      required: true,
    },
    // createdBy: {
    //   type: String,
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Pet", petSchema);
