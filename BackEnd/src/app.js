import express from "express"
import cors from "cors"
import cookieParser  from "cookie-parser"
import UserRouter from "./routes/authRoutes.js"

const app = express()
import cors from "cors";

// Allow multiple origins (local + production)
const allowedOrigins = [
  "http://localhost:5173", // local dev frontend
  process.env.CLIENT_URL, // your deployed frontend (set in Render)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


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
