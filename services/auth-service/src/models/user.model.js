import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    cedula: {
      type: String,
      trim: true,
    },
    telephone: {
      type: String,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "veterinarian", "client", "recepcionista"],
      default: "client",
      required: true,
    },
    state: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
