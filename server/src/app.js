import express from "express";
import cors from "cors";
import userRoutes from "./routes/user-routes.js";
import container from "./container.js";

const app = express();

app.use(express.json());
app.use(cors());

// User modülü
const userController = container.initializeUserModule();
const userRouter = userRoutes(userController);

// Routes
app.use("/api/v1/users", userRouter);

app.listen(1234, () => {
    console.log("Server is running on port 5000");
});