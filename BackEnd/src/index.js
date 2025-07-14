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

// app.use(cors())
// app.use(express.json())

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.get("/login",(req,res)=>{
//     res.send("Logined")
// })

// app.post("/register",(req,res)=>{
//   UserModel.create(req.body)
//   .then(user=> res.json(user))
//   .catch(error=>res.json(error))
// })

// app.post("/login",(req,res)=>{
//   const {email,password} = req.body;
//   UserModel.findOne({email:email})
//   .then(user=>{
//     if(user){
//       if(user.password === password){
//         res.json("success")
//       }
//       else{
//         res.json("the password is incorrect")
//       }
//     }
//     else{
//       res.json("Incorrect Email")
//     }
//   })
// })
// app.use("/api/auth",router)
// app.post("/register",register)
// app.post("/login",login)

