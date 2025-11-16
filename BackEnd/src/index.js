import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"
// import cors from "cors"
// import UserModel from "./models/user.model.js"
dotenv.config({
  path: "./env"
})
// const app = express()
connectDB()
.then(()=>{
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is listening on port ${process.env.PORT}`)
  })
})
.catch((err)=>{
  console.log("MongoDB connection failed! ",err)
})
