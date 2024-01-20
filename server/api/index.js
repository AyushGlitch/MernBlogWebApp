import express from 'express';
import { dbConnect } from './db/dbConnect.js';
import authRoutes from './routes/auth.route.js';

dbConnect()

const app = express();
app.use(express.json())

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})

app.use('/api/auth', authRoutes)