import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserRouter from "./routes/authRoutes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      "http:localhost:5173",
      "http:localhost:5174",
      "http:loclahost:3000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

app.use(express.json()); // ← This is CRITICAL
app.use(express.urlencoded({ extended: true }));

// Health check for Render
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/", UserRouter);

export { app };
