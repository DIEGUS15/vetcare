import Appointment from "../models/appointment.model.js";

export const createAppointment = async (req, res) => {
  try {
    const {
      petId,
      ownerId,
      veterinarianId,
      appointmentDate,
      appointmentTime,
      duration,
      reason,
      status,
    } = req.body;

    const newAppointment = new Appointment({
      petId,
      ownerId,
      veterinarianId,
      appointmentDate,
      appointmentTime,
      duration,
      reason,
      status,
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("Error in create appointment:", error);
    res.status(500).json({
      message: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
