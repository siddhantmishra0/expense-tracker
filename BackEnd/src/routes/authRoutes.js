import express from "express"
import {register, login, logout, refreshAccessToken, getLogin, budget, getExpenses, postExpenses, deleteExpenses} from "../controllers/authController.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(verifyJWT,logout)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/login").get(verifyJWT,getLogin)
router.route("/budget").post(verifyJWT,budget)
router.route("/home/expense").post(postExpenses)
router.route("/home/expense").get(verifyJWT,getExpenses)
router.route("/home/expense/:id").delete(verifyJWT,deleteExpenses)


export default router