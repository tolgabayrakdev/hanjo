import express from "express";
import AuthService from "../service/auth-service";
import AuthController from "../controller/auth-controller";
import UserRepository from "../repository/user-repository";

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

const router = express.Router();

router.post("/login", authController.login.bind(authController));
router.post("/register", authController.register.bind(authController));
router.get("/verify", authController.verifyUser.bind(authController));
router.post("/logout", authController.logout.bind(authController));

export default router;