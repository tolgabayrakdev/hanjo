import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import userRoutes from "./routes/user-routes";
import authRoutes from "./routes/auth-routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);

app.listen(1234, () => {
    console.log('Server is running on port 1234');
});
