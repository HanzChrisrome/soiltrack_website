import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/userPage.route";
import readingsRoutes from "./routes/readings.route";
import userPageRoutes from "./routes/userPage.route";
import cors from "cors";
import { debuglog } from "util";
import { infoLog } from "./utils/logger";

dotenv.config();
const app = express();
const port = process.env.PORT;
const mode = process.env.MODE || "DEVELOPMENT";
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/readings", readingsRoutes);
app.use("/api/user-readings", userPageRoutes);

app.listen(port, () => {
  infoLog(`Server is running on port ${port} in ${mode} mode`);
});
