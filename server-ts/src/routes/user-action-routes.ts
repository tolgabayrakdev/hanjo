import express from "express";
import UserActionController from "../controller/user-action-controller";
import UserActionService from "../service/user-action-service";
import UserActionRepository from "../repository/user-action-repository";
import { verifyToken } from "../middleware/verify-token";


const userActionRepository = new UserActionRepository();
const userActionService = new UserActionService(userActionRepository);
const userActionController = new UserActionController(userActionService);

const router = express.Router();

router.put("/change-password", verifyToken, userActionController.changePassword.bind(userActionController));
router.put("/user-update", verifyToken, userActionController.userUpdate.bind(userActionController));
router.delete("/delete-account", userActionController.deleteAccount.bind(userActionController));

export default router;