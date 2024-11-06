import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';

import userRoutes from './routes/user-routes';

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Server...');
});
// Routes
app.use('/api/v1/users', userRoutes);

app.listen(1234, () => {
    console.log('Server is running on port 1234');
});
