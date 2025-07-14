import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const verifyJWT =  async (req,res,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token) {
            // throw new Error(401,"Unauthorized request!")
            return res.status(400).json({error: "Unauthorized request!"})
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user  = await UserModel.findById(decodedToken?._id).select("-refreshToken -password")
        if(!user){
            // throw new ApiError(401,"Invalid access token")
            return res.status(401).json({error: "Invalid access token"})
        }
        req.user = user;
        next();
    } catch (error) {
        // throw new ApiError(401,error?.message || "Invalid access token")
        console.log("Verification failed ",error)
        return res.status(401).json({error: "Unsuccesssful verification"})
    }
}