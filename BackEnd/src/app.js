import express from "express"
import cors from "cors"
import cookieParser  from "cookie-parser"
import UserRouter from "./routes/authRoutes.js"

const app = express()
app.use(cors({   // blocks requests from different origins unless the server explicitly allows them.
  origin: "http://localhost:5173",
  credentials: true
}))
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
