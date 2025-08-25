import express from "express"
import cors from "cors"
import cookieParser  from "cookie-parser"
import UserRouter from "./routes/authRoutes.js"
import dotenv from "dotenv";
dotenv.config({
  path: "./env"
})
const app = express()
app.use(cors({
  origin: [process.env.CORS_ORIGIN, process.env.FRONTEND_URL], // allow both local & deployed frontend
  credentials: true, // allow cookies/auth headers
}));
app.use(cookieParser())

app.use(express.json()) // middleware function in Express that parses incoming JSON payloads (data sent in the body of a request) and makes it available under req.body.
app.use(express.urlencoded({extended:true}))

// app.get("/login",verifyJWT,getLogin)

app.use("/",UserRouter)


export {app}
// const port = 3000


// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })


// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import UserRouter from "./routes/authRoutes.js";

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
// app.use(express.json({ limit: "16kb" })); // Added size limit for security
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// // Health check endpoint for Render
// app.get("/health", (req, res) => {
//   res.status(200).json({
//     status: "OK",
//     message: "Server is running",
//     timestamp: new Date().toISOString(),
//   });
// });

// // Root endpoint
// app.get("/", (req, res) => {
//   res.json({
//     message: "ExpenseTracker API is running",
//     status: "success",
//   });
// });

// app.use("/", UserRouter);

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

// // Handle 404 routes
// // app.use("*", (req, res) => {
// //   res.status(404).json({
// //     message: "Route not found",
// //     path: req.originalUrl,
// //   });
// // });

// // Use PORT from environment variable (Render provides this automatically)
// const PORT = process.env.PORT || 3000;

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`ExpenseTracker API listening on port ${PORT}`);
//   console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
// });

// export { app };