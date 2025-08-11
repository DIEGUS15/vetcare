import express from "express";
import morgan from "morgan";

import appointmentRoutes from "./routes/appointment.routes.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/api", appointmentRoutes);

export default app;
