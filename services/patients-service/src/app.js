import express from "express";
import morgan from "morgan";
// import cors from "cors";

import petRoutes from "./routes/pet.routes.js";

const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

app.use(morgan("dev"));
app.use(express.json());

app.use("/api", petRoutes);

export default app;
