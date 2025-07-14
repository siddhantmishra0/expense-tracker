import express from "express"
import {register, login, logout, refreshAccessToken, getLogin, postBudget,getBudget, getExpenses, postExpenses, deleteExpenses} from "../controllers/authController.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(verifyJWT,logout)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/login").get(verifyJWT,getLogin)
router.route("/home/budget").post(verifyJWT,postBudget)
router.route("/home/budget").get(verifyJWT,getBudget)
router.route("/home/expense").post(postExpenses)
router.route("/home/expense").get(verifyJWT,getExpenses)
router.route("/home/expense/:id").delete(verifyJWT,deleteExpenses)


export default router