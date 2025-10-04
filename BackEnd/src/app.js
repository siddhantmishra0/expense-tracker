
// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// // import UserRouter from "./routes/authRoutes.js";

// const app = express();

// // Environment-specific CORS configuration
// const allowedOrigins = [
//   "http://localhost:5173", // Local development
//   "http://localhost:3000", // Alternative local port
//   process.env.FRONTEND_URL, // Production frontend URL (Vercel)
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (mobile apps, Postman, etc.)
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
//   })
// );

// app.use(cookieParser());
// app.use(express.json()); // Added size limit for security
// app.use(express.urlencoded({ extended: true }));

// // Health check endpoint for Render
// app.get("/", (req, res) => {
//   res.json({ message: "Server is working" });
// });

// app.get("/health", (req, res) => {
//   res.json({ status: "OK" });
// });

// console.log("About to import UserRouter...");
// try {
//   const { default: UserRouter } = await import("./routes/authRoutes.js");
//   console.log("UserRouter imported successfully");

//   // Try to use the router
//   console.log("About to use UserRouter...");
//   app.use("/", UserRouter);
//   console.log("UserRouter added successfully");
// } catch (error) {
//   console.error("Error with UserRouter:", error.message);
//   console.error("Stack:", error.stack);
// }
// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     message: "Something went wrong!",
//     error:
//       process.env.NODE_ENV === "production"
//         ? "Internal Server Error"
//         : err.message,
//   });
// });








import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserRouter from "./routes/authRoutes.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  // path: join(__dirname, "../.env"), // More reliable path resolution
});
const app = express();
app.use(
  cors({
    // origin: [process.env.FRONTEND_URL], // allow both local & deployed frontend
    origin: "http://localhost:5173",
    credentials: true, // allow cookies/auth headers
  })
);
app.use(cookieParser());

app.use(express.json()); // middleware function in Express that parses incoming JSON payloads (data sent in the body of a request) and makes it available under req.body.
app.use(express.urlencoded({ extended: true }));

// app.get("/login",verifyJWT,getLogin)

app.use("/", UserRouter);

export { app };



















// // Handle 404 routes
// app.use("*", (req, res) => {
//   res.status(404).json({
//     message: "Route not found",
//     path: req.originalUrl,
//   });
// });

// Use PORT from environment variable (Render provides this automatically)
// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

// export { app };