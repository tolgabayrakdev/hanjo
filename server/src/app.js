import express from "express";
import cors from "cors";
import userRouter from "./routes/user-routes";


const app = express();

app.use(express.json());
app.use(cors());


// Routes
app.use("/api/v1/users", userRouter);

app.listen(1234, () => {
    console.log("Server is running on port 5000");
});