import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  refreshToken: {
    type: String,
  },
});

// checks whether the password is modified or not, hashes the password if modified
UserSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
});

// method to check if the password is correct or not
UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}

// method to generate access token
UserSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// method to generate refresh token
UserSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
