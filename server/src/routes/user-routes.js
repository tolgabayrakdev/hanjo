import express from "express";
import UserRepository from "../repository/user-repository";
import UserService from "../service/user-service";
import UserController from "../controller/user-controller";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);


const router = express.Router();

router.get("/", userController.getAllUsers.bind(userController));
router.get("/:id", userController.getUserById.bind(userController));
router.post("/", userController.createUser.bind(userController));
router.delete("/:id", userController.deleteUser.bind(userController));
router.put("/:id", userController.updateUser.bind(userController));

export default router;