import express from "express";

const userRoutes = (userController) => {
    const router = express.Router();

    router.get("/", userController.getAllUsers.bind(userController));
    router.get("/:id", userController.getUserById.bind(userController));
    router.post("/", userController.createUser.bind(userController));
    router.delete("/:id", userController.deleteUser.bind(userController));
    router.put("/:id", userController.updateUser.bind(userController));

    return router;
};

export default userRoutes;