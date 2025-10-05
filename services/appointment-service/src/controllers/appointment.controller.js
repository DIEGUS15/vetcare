import Appointment from "../models/appointment.model.js";

//Obtener las citas pertenecientes a un veterinario en especifico
export const getVetAppointment = async (req, res) => {
  try {
    const { veterinarianId } = req.params;

    const appointments = await Appointment.find({
      veterinarian: veterinarianId,
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Obtener las citas del usuario logueado actual
export const getMyAppointments = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const appointments = await Appointment.find({ owner: ownerId });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

export const updateAppointment = async (req, res) => {
  try {
    const {
      veterinarianId,
      appointmentDate,
      appointmentTime,
      duration,
      reason,
      status,
    } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        veterinarianId,
        appointmentDate,
        appointmentTime,
        duration,
        reason,
        status,
      },
      { new: true }
    );
    if (!appointment)
      return res.status(404).json({ message: "Appointment nor found" });
    res.json(appointment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
